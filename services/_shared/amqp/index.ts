import amqplib from 'amqplib';
import { consoleLogger } from '../loggers';
import type { TRabbitMQQueue } from '../typings';

export const RABBITMQ_EXCHANGE = 'my-exchange';
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
                consoleLogger.info('Connected to Rabbitmq');
                channel = await connection.createChannel();
                consoleLogger.info('Created amqp channel');
                await channel.assertExchange(RABBITMQ_EXCHANGE, 'direct', { durable: true });
                consoleLogger.info(`Asserted exchange: "${RABBITMQ_EXCHANGE}"`);
                const numQueues = RABBITMQ_QUEUES.length;
                for (let i = 0; i < numQueues; i++) {
                    await channel.assertQueue(RABBITMQ_QUEUES[i], {
                        durable: true
                    });
                    await channel.bindQueue(RABBITMQ_QUEUES[i], RABBITMQ_EXCHANGE, RABBITMQ_QUEUES[i]);
                }
                consoleLogger.info(`Asserted ${numQueues} queue${numQueues > 1 ? 's' : ''}: ${RABBITMQ_QUEUES.map(queue => `"${queue}"`).join(', ')}`);
                success = true;
            } catch (err) {
                consoleLogger.error(`Error connecting to RabbitMQ. Trying again in ${(timeout / 1000).toFixed(0)} seconds.`);
                await new Promise((resolve) => setTimeout(resolve, timeout));
            }
        }
        return channel;
    }
}
