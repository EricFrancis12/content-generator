import axios from 'axios';
import { ICampaignOptions, ISourceImage, ISourceVideo, IHistoryItem, ESourceType, EContentType } from '../../_shared';
import fetchCampaigns from './fetchCampaigns';
import fetchIntakeHistory from './fetchIntakeHistory';
import addToDownloadQueue from './addToDownloadQueue';
import addToIntakeHistory from './addToIntakeHistory';
import getRecentYouTubeVideos from './getRecentYouTubeVideos';
import getRecentRedditImages, { extractExternalIdFromRedditURL } from './getRecentRedditImages';
import { logger, formatErr } from '../config/loggers';
import { MemeAPIResultSchema, TMemeAPIResult } from './types';

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
}

function filterContent(
    content: (ISourceImage | ISourceVideo)[],
    history: IHistoryItem[],
    sourceType: ESourceType,
    contentType: EContentType
): (ISourceImage | ISourceVideo)[] {
    return content.filter(recentVideo => !history.some(historyItem => {
        const sameSourceType = historyItem.sourceType === sourceType;
        const sameContentType = historyItem.contentType === contentType;
        const sameExternalId = historyItem.externalId === recentVideo.externalId;
        return sameSourceType && sameContentType && sameExternalId;
    }));
}

/* eslint-disable */
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
/* eslint-enable */

export async function checkForNewYouTubeVideos(channel_id: string, history: IHistoryItem[], options?: IOptions): Promise<ISourceVideo[]> {
    try {
        const recentVideos = await getRecentYouTubeVideos(channel_id, options);
        const newVideos = filterContent(recentVideos, history, ESourceType.YOUTUBE, EContentType.VIDEO);
        return newVideos;
    } catch (err) {
        logger.error('Error checking for new YouTube videos: ' + formatErr(err));
        return [];
    }
}

export async function checkForNewRedditImages(subreddit: string, history: IHistoryItem[], options?: IOptions): Promise<ISourceImage[]> {
    try {
        const recentImages = await getRecentRedditImages(subreddit, options);
        const newImages = filterContent(recentImages, history, ESourceType.REDDIT, EContentType.IMAGE);
        return newImages;
    } catch (err) {
        logger.error('Error checking for new Reddit images: ' + formatErr(err));
        return [];
    }
}

/* eslint-disable */
export async function checkForNewRedditVideos(subreddit: string, history: IHistoryItem[], options?: IOptions): Promise<ISourceVideo[]> {
    // ...
    return [];
}
/* eslint-enable */

export async function getImageFromMemeAPI(subreddit: string, /* eslint-disable */history: IHistoryItem[], options?: IOptions/* eslint-enable */): Promise<ISourceImage | null> {
    try {
        const res = await axios.get(`https://meme-api.com/gimme/${subreddit}`);
        const memeAPIResult: TMemeAPIResult = res.data;
        const { success } = MemeAPIResultSchema.safeParse(memeAPIResult)
        if (!success) throw new Error('Received unknown data from Meme API');

        const externalId = extractExternalIdFromRedditURL(memeAPIResult.url);
        return {
            sourceType: ESourceType.MEME_API,
            externalId,
        };
    } catch (err) {
        logger.error('Error fetching from Meme API: ' + formatErr(err));
        return null;
    }
}


