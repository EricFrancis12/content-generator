import { Request, Response, NextFunction } from 'express';
import { channel } from '../controllers/amqpController';
import { logger } from '../config/loggers';
import _shared, { TRabbitMQQueue } from '../../_shared';
const { RABBITMQ_QUEUES } = _shared.amqp;

export default function amqpMiddleware(req: Request, res: Response, next: NextFunction) {
    if (!channel) {
        logger.error('No active channel');
        return res.json({
            success: false
        });
    }

    const { queue_name } = req.params;
    if (!!queue_name && !RABBITMQ_QUEUES.includes(queue_name as TRabbitMQQueue)) {
        logger.error(`Queue "${queue_name}" does not exist`);
        return res.json({
            success: false
        });
    }

    next();
}
