import { Request, Response, NextFunction } from 'express';
import { channel } from '../controllers/amqpController';
import _shared, { TRabbitMQQueue } from '../../_shared';
const { RABBITMQ_QUEUES,  } = _shared.amqp;

export default function amqpMiddleware(req: Request, res: Response, next: NextFunction) {
    if (!channel) {
        console.error('Channel does not exist');
        return res.json({
            success: false
        });
    }
    if (!!req.params.queue_name && !RABBITMQ_QUEUES.includes(req.params.queue_name as TRabbitMQQueue)) {
        console.error('Queue does not exist');
        return res.json({
            success: false
        });
    }

    next();
}
