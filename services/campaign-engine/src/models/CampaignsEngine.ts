import cron from 'node-cron';
import { fetchCampaigns, checkForNewYouTubeVideos, addToDownloadQueue, addToIntakeHistory, checkForNewRedditImages } from '../data';
import { ESourceType, EContentType, TDownloadQueueItem, ISourceImage, ISourceVideo } from '../../_shared';
import config from '../config/config';
const { CRON_EXPRESSION } = config;

export default class CampaignsEngine {
    task: cron.ScheduledTask;

    constructor(cronExpression = CRON_EXPRESSION) {
        this.task = cron.schedule(cronExpression, async () => {
            console.log('Starting scheduled task');
            const campaigns = await fetchCampaigns();
            for (let i = 0; i < campaigns.length; i++) {
                const campaign = campaigns[i];
                const { intakeHistory, filters, publishTo, disabled } = campaign;
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
                        await addToIntakeHistory(campaign._id, content.externalId);
                    }
                }
            }
            console.log('Scheduled task finished');
        });
    }

    async start() {
        this.task.start();
    }

    stop() {
        this.task.stop();
    }
}
