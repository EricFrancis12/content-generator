import { Request, Response, NextFunction } from 'express';
import config from '../config/config';
const { AUTH_TOKEN } = config;

export function auth(req: Request, res: Response, next: NextFunction) {
    if (AUTH_TOKEN != null) {
        const authToken = req.headers.authorization?.split(' ').pop();
        if (authToken !== AUTH_TOKEN) {
            return res.json({
                success: false,
                message: 'Unauthorized'
            });
        }
    }

    next();
}
