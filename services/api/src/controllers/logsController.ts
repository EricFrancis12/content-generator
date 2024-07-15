import { unlink } from 'fs/promises';
import type { Request, Response } from 'express';
import _shared, { EServiceName, TLogData, TLog } from '../../_shared';
const { initLogger } = _shared.loggers;
const { readLogFile } = _shared.utils;

const serviceNames: string[] = Object.values(EServiceName);

export async function getAllLogs(req: Request, res: Response) {
    try {
        const logData = await makeLogData();
        res.status(200).json({
            success: true,
            data: {
                logData
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false
        });
    }
}

export async function getAllLogsByServiceName(req: Request, res: Response) {
    const { serviceName } = req.params;
    try {
        if (!serviceNames.includes(serviceName)) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        const logs = makeLog(serviceName as EServiceName);
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

        const { error, info } = initLogger(serviceName as EServiceName);

        if (logLevel === 'error') {
            error(message);
        } else if (logLevel === 'info') {
            info(message);
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

export async function deleteLog(req: Request, res: Response) {
    const { serviceName, logLevel } = req.params;
    try {
        const logFilePath = `./logs/${serviceName}/${logLevel}.log`;
        await unlink(logFilePath);
        res.status(200).json({
            success: true
        });
    } catch (err) {
        res.status(500).json({
            success: false
        });
    }
}

export async function downloadLog(req: Request, res: Response) {
    const { serviceName, logLevel } = req.params;
    try {
        const logFilePath = `./logs/${serviceName}/${logLevel}.log`;
        res.setHeader('Content-Disposition', `attachment; filename=${serviceName}_${logLevel}.log`);
        res.status(200).download(logFilePath);
    } catch (err) {
        res.status(500).json({
            success: false
        });
    }
}

async function makeLog(serviceName: EServiceName): Promise<TLog> {
    const log: TLog = {
        error: [],
        info: []
    };
    for (const logLevel in log) {
        const logFilePath = `./logs/${serviceName}/${logLevel}.log`;
        const logFile = await readLogFile(logFilePath);
        log[logLevel as keyof typeof log] = logFile;
    }
    return log;
}

async function makeLogData(): Promise<TLogData> {
    const logData: TLogData = {};
    for (const serviceName of Object.values(EServiceName)) {
        logData[serviceName] = await makeLog(serviceName);
    }
    return logData;
}
