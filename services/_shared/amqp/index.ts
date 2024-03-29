import amqplib from 'amqplib';
import type { TRabbitMQQueue } from '../typings';

export const RABBITMQ_QUEUES: TRabbitMQQueue[] = ['download', 'apply-filters', 'publish'];

export function initRabbitMQ(ampqUrl: string, {
    timeout = 5000
}: {
    timeout?: number
} = {}) {
    let channel: amqplib.Channel | null = null;

    return async function connectWithRetry() {
        let success = false;
        while (!success) {
            try {
                const connection = await amqplib.connect(ampqUrl);
                console.log('Connected to Rabbitmq');
                channel = await connection.createChannel();
                console.log('Created amqp channel');
                const numQueues = RABBITMQ_QUEUES.length;
                for (let i = 0; i < numQueues; i++) {
                    await channel.assertQueue(RABBITMQ_QUEUES[i], {
                        durable: true
                    });
                }
                console.log(`Asserted ${numQueues} queue${numQueues > 1 ? 's' : ''}: ${RABBITMQ_QUEUES.map(queue => `"${queue}"`).join(', ')}`);
                success = true;
            } catch (err) {
                console.error(err);
                await new Promise((resolve) => setTimeout(resolve, timeout));
            }
        }
        return channel;
    }
}
