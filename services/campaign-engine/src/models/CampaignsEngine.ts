import cron from 'node-cron';
import {
    fetchCampaigns, checkForNewYouTubeVideos, addToDownloadQueue,
    addToIntakeHistory, checkForNewRedditImages, fetchIntakeHistory
} from '../data';
import { ESourceType, EContentType, TDownloadQueueItem, ISourceImage, ISourceVideo } from '../../_shared';
import config from '../config/config';
const { CRON_EXPRESSION } = config;

type TOptions = {
    runTaskImmediately?: boolean
};

export default class CampaignsEngine {
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
    console.log('Starting scheduled task');
    const campaigns = await fetchCampaigns();
    for (let i = 0; i < campaigns.length; i++) {
        const campaign = campaigns[i];
        const intakeHistory = await fetchIntakeHistory(campaign._id);
        const { filters, publishTo, disabled } = campaign;
        const { type: sourceType, contentType, externalId } = campaign.source;
        if (disabled === true) {
            continue;
        }

        let newContent: (ISourceImage | ISourceVideo)[] = [];
        if (sourceType === ESourceType.YOUTUBE) {
            if (contentType === EContentType.VIDEO) {
                newContent = await checkForNewYouTubeVideos(externalId, intakeHistory, campaign?.options);
            } else {
                console.error('YouTube content types other than VIDEO not yet implimented');
            }
        } else if (sourceType === ESourceType.REDDIT) {
            if (contentType === EContentType.IMAGE) {
                newContent = await checkForNewRedditImages(externalId, intakeHistory, campaign?.options);
            } else {
                console.error('Reddit content types other than IMAGE not yet implimented');
            }
        } else {
            console.error('Source types other than YOUTUBE not yet implimented');
        }

        for (let j = 0; j < newContent.length; j++) {
            const content = newContent[j];
            const downloadQueueItem: TDownloadQueueItem = {
                campaign_id: campaign._id,
                sourceType,
                contentType,
                externalId: content.externalId,
                filters,
                publishTo
            };
            const success = await addToDownloadQueue(downloadQueueItem);
            if (success) {
                await addToIntakeHistory({
                    sourceType,
                    contentType,
                    campaign_id: campaign._id,
                    externalId: content.externalId
                });
            }
        }
    }
    console.log('Scheduled task finished');
};
