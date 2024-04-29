import express from 'express';
import { consumeMessageFromQueue, sendMessageToQueue } from '../../../controllers/amqpController';
import amqpMiddleware from '../../../middleware/amqpMiddleware';

const router = express.Router();

router
    .route('/queues/:queue_name')
    .get(amqpMiddleware, consumeMessageFromQueue)
    .post(amqpMiddleware, sendMessageToQueue);

export default router;
