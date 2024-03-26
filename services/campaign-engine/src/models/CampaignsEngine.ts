import cron from 'node-cron';
import { fetchCampaigns, checkForNewYouTubeVideos, addToDownloadQueue, addToIntakeHistory } from '../data';
import type { TDownloadQueueItem, TSourceImage, TSourceVideo } from '../../_shared';
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
                const { intakeHistory, filters, publishTo } = campaign;
                const { type: sourceType, contentType, externalId } = campaign.source;

                let newContent: (TSourceImage | TSourceVideo)[] = [];

                if (sourceType === 'YOUTUBE') {
                    if (contentType === 'VIDEO') {
                        newContent = await checkForNewYouTubeVideos(externalId, intakeHistory);
                    } else {
                        console.error('Source content types other than VIDEO not yet implimented');
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
