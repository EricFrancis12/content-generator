import type { Request, Response } from 'express';
import amqplib from 'amqplib';
import _shared from '../../_shared';
const { initRabbitMQ, RABBITMQ_EXCHANGE } = _shared.amqp;
import config from '../config/config';
const { RABBITMQ_IP, RABBITMQ_PORT } = config;

export let channel: amqplib.Channel | null = null;
const ampqUrl = `amqp://${RABBITMQ_IP}:${RABBITMQ_PORT}`;
const connectWithRetry = initRabbitMQ(ampqUrl);

connectWithRetry().then(_channel => channel = _channel);

export async function sendMessageToQueue(req: Request, res: Response) {
    try {
        if (!channel) {
            throw new Error('Channel does not exist');
        }

        const queueName = req.params.queue_name;
        if (!queueName) {
            throw new Error('Queue name is missing from request parameters');
        }

        if (!req.body) {
            throw new Error('Invalid request body');
        }

        // Send message to exchange
        channel.publish(RABBITMQ_EXCHANGE, queueName, Buffer.from(JSON.stringify(req.body)), { persistent: true });

        res.status(201).json({
            success: true
        });
    } catch (err) {
        console.error('Error sending message to queue:', err);
        res.status(500).json({
            success: false,
        });
    }
}


export async function consumeMessageFromQueue(req: Request, res: Response) {
    try {
        if (!channel) {
            throw new Error('Channel does not exist');
        }
        const message = await channel.get(req.params.queue_name);
        if (message) {
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
        res.status(500).json({
            success: false
        });
    }
}
