
import winston from 'winston';
import initLogger from './initLogger';

export { initLogger };
export { formatErr } from '../utils';

export const consoleLogger = winston.createLogger({
    level: 'error',
    transports: [
        new winston.transports.Console(),
    ]
});
