import winston from 'winston';
import { DISABLE_LOG_FILES } from '../constants'

type TServiceName = '_shared' | 'api' | 'apply-filters-engine' | 'campaign-engine' | 'cleanup-engine' | 'download-engine' | 'publish-engine' | 'ui';

const fileTransportsIfEnabled = (options?: winston.transports.FileTransportOptions) => DISABLE_LOG_FILES === true ? [] : [new winston.transports.File(options)];

export function initErrorLogger(serviceName: TServiceName) {
    const errorLogger = winston.createLogger({
        level: 'error',
        format: winston.format.json(),
        transports: [
            new winston.transports.Console(),
            ...fileTransportsIfEnabled({ filename: 'error.log', dirname: `./logs/${serviceName}` })
        ]
    });
    return errorLogger;
}

export function initInfoLogger(serviceName: TServiceName) {
    const infoLogger = winston.createLogger({
        level: 'info',
        format: winston.format.json(),
        transports: [
            new winston.transports.Console(),
            ...fileTransportsIfEnabled({ filename: 'info.log', dirname: `./logs/${serviceName}` })
        ]
    });
    return infoLogger;
}
