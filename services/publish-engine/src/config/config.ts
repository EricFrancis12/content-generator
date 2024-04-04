import { TRabbitMQQueue } from '../../_shared';

type TConfig = {
    RABBITMQ_IP: string,
    RABBITMQ_PORT: number,
    RABBITMQ_DOWNLOAD_QUEUE: TRabbitMQQueue,
    RABBITMQ_FILTER_QUEUE: TRabbitMQQueue,
    RABBITMQ_PUBLISH_QUEUE: TRabbitMQQueue,
    TELEGRAM_BOT_TOKEN?: string | null
};

const config: TConfig = {
    RABBITMQ_IP: process.env.RABBITMQ_IP || 'rabbitmq',
    RABBITMQ_PORT: Number(process.env.RABBITMQ_PORT) || 5672,
    RABBITMQ_DOWNLOAD_QUEUE: 'download',
    RABBITMQ_FILTER_QUEUE: 'apply-filters',
    RABBITMQ_PUBLISH_QUEUE: 'publish',
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN
};

export default config;
