import express from 'express';
import { getAllQueues, consumeMessageFromQueue, sendMessageToQueue } from '../../../controllers/amqpController';
import amqpMiddleware from '../../../middleware/amqpMiddleware';

const router = express.Router();

router
    .route('/queues')
    .get(amqpMiddleware, getAllQueues);

router
    .route('/queues/:queue_name')
    .get(amqpMiddleware, consumeMessageFromQueue)
    .post(amqpMiddleware, sendMessageToQueue);

export default router;
