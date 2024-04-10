import { ICampaignOptions, ISourceImage, ISourceVideo, IHistoryItem, ESourceType, EContentType } from '../../_shared';
import fetchCampaigns from './fetchCampaigns';
import fetchIntakeHistory from './fetchIntakeHistory';
import addToDownloadQueue from './addToDownloadQueue';
import addToIntakeHistory from './addToIntakeHistory';
import getRecentYouTubeVideos from './getRecentYouTubeVideos';
import getRecentRedditImages from './getRecentRedditImages';

export {
    fetchCampaigns,
    fetchIntakeHistory,
    addToDownloadQueue,
    addToIntakeHistory,
    getRecentYouTubeVideos,
    getRecentRedditImages
};

export interface IOptions extends ICampaignOptions {
    n?: number
};

export async function checkForNewInstagramImages(id: string, history: string[]): Promise<ISourceImage[]> {
    // ...
    return [];
}

export async function checkForNewInstagramVideos(id: string, history: string[]): Promise<ISourceVideo[]> {
    // ...
    return [];
}

export async function checkForNewTikTokImages(id: string, history: string[]): Promise<ISourceImage[]> {
    // ...
    return [];
}

export async function checkForNewTikTokVideos(id: string, history: string[]): Promise<ISourceVideo[]> {
    // ...
    return [];
}

export async function checkForNewYouTubeImages(channel_id: string, history: string[]): Promise<ISourceImage[]> {
    // ...
    return [];
}

export async function checkForNewYouTubeVideos(channel_id: string, history: IHistoryItem[], options?: IOptions): Promise<ISourceVideo[]> {
    try {
        const recentVideos = await getRecentYouTubeVideos(channel_id, options);
        const newVideos = recentVideos.filter(recentVideo => !history.some(historyItem => {
            const sameSourceType = historyItem.sourceType === ESourceType.YOUTUBE;
            const sameContentType = historyItem.contentType === EContentType.VIDEO;
            const sameExternalId = historyItem.externalId === recentVideo.externalId;
            return sameSourceType && sameContentType && sameExternalId;
        }));
        return newVideos;
    } catch (err) {
        console.error(err);
        return [];
    }
}

export async function checkForNewRedditImages(subreddit: string, history: IHistoryItem[], options?: IOptions): Promise<ISourceImage[]> {
    try {
        const recentImages = await getRecentRedditImages(subreddit, options);
        const newImages = recentImages.filter(recentImage => !history.some(historyItem => {
            const sameSourceType = historyItem.sourceType === ESourceType.REDDIT;
            const sameContentType = historyItem.contentType === EContentType.IMAGE;
            const sameExternalId = historyItem.externalId === recentImage.externalId;
            return sameSourceType && sameContentType && sameExternalId;
        }));
        return newImages;
    } catch (err) {
        console.error(err);
        return [];
    }
}

export async function checkForNewRedditVideos(subreddit: string, history: IHistoryItem[], options?: IOptions): Promise<ISourceVideo[]> {
    // ...
    return [];
}
