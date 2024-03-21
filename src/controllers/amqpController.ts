import type { Request, Response } from 'express';
import amqplib from 'amqplib';
import config from '../config/config';
const { RABBITMQ_IP, RABBITMQ_PORT, RABBITMQ_QUEUES } = config;

const ampqUrl = `amqp://${RABBITMQ_IP}:${RABBITMQ_PORT}`;

export let channel: amqplib.Channel | null = null;
const connectWithRetry = () => {
    amqplib
        .connect(ampqUrl)
        .then(async (conn) => {
            console.log('Connected to Rabbitmq');
            channel = await conn.createChannel();
            console.log('Created amqp channel');
            const numQueues = RABBITMQ_QUEUES.length;
            for (let i = 0; i < numQueues; i++) {
                await channel.assertQueue(RABBITMQ_QUEUES[i], {
                    durable: true
                });
            }
            console.log(`Asserted ${numQueues} queue${numQueues > 1 ? 's' : ''}: ${RABBITMQ_QUEUES.map(queue => `"${queue}"`).join(', ')}`);
        })
        .catch(err => {
            console.error(err);
            setTimeout(connectWithRetry, 5000);
        });
}
connectWithRetry();

export async function sendMessageToQueue(req: Request, res: Response) {
    try {
        if (!channel) {
            throw new Error('Channel does not exist');
        }
        channel.sendToQueue(req.params.queue_name, Buffer.from(JSON.stringify(req.body)), {
            persistent: true
        });
        res.status(201).json({
            success: true
        });
    } catch (err) {
        res.json({
            success: false
        });
    }
}

export async function consumeMessageFromQueue(req: Request, res: Response) {
    try {
        if (!channel) {
            throw new Error('Channel does not exist');
        }
        const message = await channel.get(req.params.queue_name);
        if (!!message) {
            const result = JSON.parse(message?.content?.toString() || 'null');
            res.status(200).json({
                success: true,
                data: {
                    message: result
                }
            });
            channel.ack(message);
        } else {
            throw new Error('Error getting message from queue');
        }
    } catch (err) {
        res.json({
            success: false
        });
    }
}
