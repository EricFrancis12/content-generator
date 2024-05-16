
import winston from 'winston';
import { EServiceName } from '../typings';
import initLogger, { consoleTransportFormat } from './initLogger';

export { initLogger };
export { formatErr } from '../utils';

export const consoleLogger = winston.createLogger({
    level: 'error',
    transports: [
        new winston.transports.Console({ format: consoleTransportFormat(EServiceName._SHARED) }),
    ]
});
