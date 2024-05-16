import { promises as fsPromises } from 'fs';
import cron from 'node-cron';
import _shared from '../../_shared';
const { getAllNestedFilePaths } = _shared.utils;
import { logger, formatErr } from '../config/loggers';
import config from '../config/config';
import { getFileDate } from '../utils';
const { CRON_EXPRESSION, MAX_FILE_AGE } = config;

type TOptions = {
    runTaskImmediately?: boolean
};

export default class FileAgeCleanupEngine {
    task: cron.ScheduledTask;
    runTaskImmediately: boolean;

    constructor(cronExpression = CRON_EXPRESSION, { runTaskImmediately = true }: TOptions = {}) {
        this.runTaskImmediately = runTaskImmediately;
        this.task = cron.schedule(cronExpression, main);
    }

    start() {
        if (this.runTaskImmediately) {
            main();
        }
        this.task.start();
    }

    stop() {
        this.task.stop();
    }
}

const main = async () => {
    logger.info('FileAgeCleanupEngine: Starting scheduled task');

    const outputContentProm = getAllNestedFilePaths('./shared-file-system/output-content');
    const sourceContentProm = getAllNestedFilePaths('./shared-file-system/source-content');
    const WIPFiltersContentProm = getAllNestedFilePaths('./shared-file-system/WIP-filters-content');

    const sourceContent = await sourceContentProm.catch((): string[] => []);
    const outputContent = await outputContentProm.catch((): string[] => []);
    const WIPFiltersContent = await WIPFiltersContentProm.catch((): string[] => []);
    const filePaths = [...outputContent, ...sourceContent, ...WIPFiltersContent];

    for (let i = 0; i < filePaths.length; i++) {
        const filePath = filePaths[i];
        try {
            const unixTimestamp = await getFileDate(filePath);
            if (unixTimestamp) {
                const birthtime = unixTimestamp * 1000;
                const minAcceptableTime = Date.now() - MAX_FILE_AGE;
                if (birthtime < minAcceptableTime) {
                    logger.info(`Attempting to delete: ${filePath}`);
                    await fsPromises.unlink(filePath);
                    logger.info(`Successfully deleted: ${filePath}`);
                }
            }
        } catch (err) {
            logger.error(formatErr(err));
        }
    }
    logger.info('FileAgeCleanupEngine: Scheduled task finished');
}
