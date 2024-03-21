import express from 'express';
import { consumeMessageFromQueue, sendMessageToQueue } from '../../controllers/amqpController';

const router = express.Router();

router
    .route('/queues/:queue_name')
    .get(consumeMessageFromQueue)
    .post(sendMessageToQueue);

export default router;
