import { Request, Response, NextFunction } from 'express';
import _shared from '../../_shared';
const { SERVICE_TOKEN } = _shared.constants;
import config from '../config/config';
const { AUTH_TOKEN } = config;

export function auth(req: Request, res: Response, next: NextFunction) {
    const authToken = req.headers.authorization?.split(' ').pop() || req.query.authToken;
    if (authToken !== AUTH_TOKEN && authToken !== SERVICE_TOKEN) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized'
        });
    }

    next();
}
