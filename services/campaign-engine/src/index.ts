import _shared from '../_shared';
const { initRabbitMQ, RABBITMQ_QUEUES } = _shared.amqp;
import config from './config/config';
const { INTERVAL_MS } = config;

console.log('Campaign engine running');
console.log(RABBITMQ_QUEUES);
