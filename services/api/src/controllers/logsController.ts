import type { Request, Response } from 'express';
import winston from 'winston';
import _shared, { EServiceName } from '../../_shared';
const { fileTransportsIfEnabled } = _shared.loggers;
const { readLogFile } = _shared.utils;

const serviceNames: string[] = Object.values(EServiceName);

export async function getAllLogs(req: Request, res: Response) {
    const { serviceName } = req.params;
    try {
        if (!serviceNames.includes(serviceName)) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        const logs: { [key: string]: { [key: string]: string; }[] } = {
            error: [],
            info: []
        };
        for (const logLevel in logs) {
            const logFilePath = `./logs/${serviceName}/${logLevel}.log`;
            const log = await readLogFile(logFilePath);
            logs[logLevel as keyof typeof logs] = log;
        }
        res.status(200).json({
            success: true,
            data: {
                logs
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false
        });
    }
}

export async function getLog(req: Request, res: Response) {
    const { serviceName, logLevel } = req.params;
    try {
        const logFilePath = `./logs/${serviceName}/${logLevel}.log`;
        const log = await readLogFile(logFilePath);
        res.status(200).json({
            success: true,
            data: {
                log
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false
        });
    }
}

export async function createLog(req: Request, res: Response) {
    const { serviceName, logLevel } = req.params;
    const message = req.body.message || '';
    try {
        if (!serviceNames.includes(serviceName)) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        if (!message) {
            return res.status(400).json({
                success: false,
                message: 'Message is required'
            });
        }

        const logger = winston.createLogger({
            level: logLevel,
            format: winston.format.json(),
            transports: [
                new winston.transports.Console(),
                ...fileTransportsIfEnabled({ filename: `${logLevel}.log`, dirname: `./logs/${serviceName}` })
            ]
        });

        if (logLevel === 'error') {
            logger.error(message);
        } else if (logLevel === 'info') {
            logger.info(message);
        } else {
            return res.status(404).json({
                success: false,
                message: 'Log not found'
            });
        }

        res.status(200).json({
            success: true
        });
    } catch (err) {
        res.status(500).json({
            success: false
        });
    }
}
