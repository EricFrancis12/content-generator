import type { Request, Response } from 'express';
import { errorLogger, infoLogger } from '../config/loggers';
import _shared, { EServiceName } from '../../_shared';
const { readLogFile } = _shared.utils;

export async function getAllLogs(req: Request, res: Response) {
    const { serviceName } = req.params;
    try {
        const serviceNames: string[] = Object.values(EServiceName);
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
        for (const logName in logs) {
            const logFilePath = `./logs/${serviceName}/${logName}.log`;
            const log = await readLogFile(logFilePath);
            logs[logName as keyof typeof logs] = log;
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
    const { serviceName, logName } = req.params;
    try {
        const logFilePath = `./logs/${serviceName}/${logName}.log`;
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
    const { logName } = req.params;
    const message = req.body.message || '';
    try {
        if (!message) {
            return res.status(400).json({
                success: false,
                message: 'Message is required'
            });
        }

        if (logName === 'error') {
            errorLogger.error(message);
        } else if (logName === 'info') {
            infoLogger.info(message);
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
