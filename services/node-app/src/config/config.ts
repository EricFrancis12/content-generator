

const config = {
    MONGO_IP: process.env.MONGO_IP || 'mongo',
    MONGO_PORT: process.env.MONGO_PORT || 27017,
    MONGO_USER: process.env.MONGO_USER || 'admin',
    MONGO_PASSWORD: process.env.MONGO_PASSWORD || 'mypassword',
    RABBITMQ_IP: process.env.RABBITMQ_IP || 'rabbitmq',
    RABBITMQ_PORT: process.env.RABBITMQ_PORT || 5672,
    RABBITMQ_QUEUES: ['download', 'apply-filters', 'publish']
};

export default config;
