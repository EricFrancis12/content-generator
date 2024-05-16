import winston, { LogCallback } from 'winston';
import { DISABLE_LOG_FILES } from '../constants';
import { EServiceName } from '../typings';

const { Console, File } = winston.transports;
const { combine, colorize, label, timestamp, printf, json } = winston.format;

const fileTransportsIfEnabled = (options?: winston.transports.FileTransportOptions) => DISABLE_LOG_FILES === true ? [] : [new File(options)];

export default function initLogger(serviceName: EServiceName) {
    const consoleTransportFormat = combine(
        colorize({ all: true }),
        label({ label: `[${serviceName}]` }),
        timestamp({ format: 'YY-MM-DD HH:mm:ss' }),
        printf(({ label, timestamp, level, message }) => `${level} ${timestamp} ${label}: ${message}`)
    );

    const fileTransportFormat = combine(timestamp(), json());

    const errorLogger = winston.createLogger({
        level: 'error',
        transports: [
            new Console({ format: consoleTransportFormat }),
            ...fileTransportsIfEnabled({ filename: 'error.log', dirname: `./logs/${serviceName}`, format: fileTransportFormat })
        ]
    });

    const infoLogger = winston.createLogger({
        level: 'info',
        transports: [
            new Console({ format: consoleTransportFormat }),
            ...fileTransportsIfEnabled({ filename: 'info.log', dirname: `./logs/${serviceName}`, format: fileTransportFormat })
        ]
    });

    return {
        error: (message: string, callback?: LogCallback) => errorLogger.error(message, callback),
        info: (message: string, callback?: LogCallback) => infoLogger.info(message, callback)
    };
}
