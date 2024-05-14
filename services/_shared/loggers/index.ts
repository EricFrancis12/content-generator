import winston from 'winston';
import { DISABLE_LOG_FILES } from '../constants'
import { EServiceName } from '../typings';

const fileTransportsIfEnabled = (options?: winston.transports.FileTransportOptions) => DISABLE_LOG_FILES === true ? [] : [new winston.transports.File(options)];

export function initErrorLogger(serviceName: EServiceName) {
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

export function initInfoLogger(serviceName: EServiceName) {
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
