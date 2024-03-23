import { Request, Response, NextFunction } from 'express';
import { channel } from '../controllers/amqpController';
import config from '../config/config';

export default function amqpMiddleware(req: Request, res: Response, next: NextFunction) {
    if (!channel) {
        console.error('Channel does not exist');
        return res.json({
            success: false
        });
    }
    if (!!req.params.queue_name && !config.RABBITMQ_QUEUES.includes(req.params.queue_name)) {
        console.error('Queue does not exist');
        return res.json({
            success: false
        });
    }

    next();
}
