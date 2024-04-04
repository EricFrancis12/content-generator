import { promises as fsPromises } from 'fs';
import cron from 'node-cron';
import _shared from '../../_shared';
const { getAllNestedFilePaths } = _shared.utils;
import config from '../config/config';
const { CRON_EXPRESSION, MAX_FILE_AGE } = config;

export default class FileAgeCleanupEngine {
    task: cron.ScheduledTask;

    constructor(cronExpression = CRON_EXPRESSION) {
        this.task = cron.schedule(cronExpression, async () => {
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
                    const file = await fsPromises.readFile(filePath);
                    const stats = await fsPromises.stat(file);
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
        });
    }

    start() {
        this.task.start();
    }

    stop() {
        this.task.stop();
    }
}
