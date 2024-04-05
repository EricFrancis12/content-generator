import { promises as fsPromises } from 'fs';
import cron from 'node-cron';
import _shared from '../../_shared';
const { getAllNestedFilePaths } = _shared.utils;
import config from '../config/config';
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
    console.log('FileAgeCleanupEngine: Starting scheduled task');

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
            const stats = await fsPromises.stat(filePath);
            const minAcceptableDate = new Date(Date.now() - MAX_FILE_AGE);
            if (stats.birthtime < minAcceptableDate) {
                console.log(`Attempting to delete: ${filePath}`);
                await fsPromises.unlink(filePath);
                console.log(`Successfully deleted: ${filePath}`);
            }
        } catch (err) {
            console.error(err);
        }
    }
    console.log('FileAgeCleanupEngine: Scheduled task finished');
}
