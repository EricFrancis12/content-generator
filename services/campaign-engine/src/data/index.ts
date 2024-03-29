import axios from 'axios';
import xml2js from 'xml2js';
const parser = new xml2js.Parser();
import ytdl from 'ytdl-core';
import { ICampaign } from '../../_shared';
import type { TDownloadQueueItem, ISourceImage, ISourceVideo, IHistoryItem, IIntakeHistoryItem } from '../../_shared';
import { isShortVideo, isLongVideo } from '../utils';
import config from '../config/config';
const { MIN_ALLOWED_VIDEO_LENGTH, MAX_ALLOWED_VIDEO_LENGTH } = config;

export async function fetchCampaigns() {
    try {
        const res = await axios.get('http://node-app:3000/api/v1/campaigns');
        const campaigns = res.data?.data?.campaigns as ICampaign[];
        if (!campaigns) {
            return [];
        }
        return campaigns;
    } catch (err) {
        console.error(err);
        return [];
    }
}

export async function addToDownloadQueue(downloadQueueItem: TDownloadQueueItem) {
    try {
        const res = await axios.post('http://node-app:3000/api/v1/amqp/queues/download', downloadQueueItem);
        if (res.status >= 300 || res.data?.success !== true) {
            return false;
        }
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

export async function addToIntakeHistory(campaign_id: string, externalId: string) {
    try {
        const res = await axios.get(`http://node-app:3000/api/v1/campaigns/${campaign_id}`);
        if (res.status >= 300 || res.data?.success !== true) {
            return false;
        }
        const intakeHistory = res.data?.data?.campaign?.intakeHistory as IIntakeHistoryItem[];
        if (!intakeHistory) {
            return false;
        }
        const newIntakeHistory = intakeHistory.some(historyItem => historyItem.externalId === externalId)
            ? intakeHistory
            : [...intakeHistory, { externalId }];
        const res2 = await axios.patch(`http://node-app:3000/api/v1/campaigns/${campaign_id}`, { intakeHistory: newIntakeHistory });
        if (res2.status >= 300 || res.data?.success !== true) {
            return false;
        }
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

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

export async function checkForNewYouTubeVideos(channel_id: string, history: IHistoryItem[], options?: TOptions): Promise<ISourceVideo[]> {
    try {
        const recentVideos = await getRecentYouTubeVideos(channel_id, options);
        const newVideos = recentVideos.filter(recentVideo => !history.some(historyItem => historyItem.externalId === recentVideo.externalId));
        return newVideos;
    } catch (err) {
        console.error(err);
        return [];
    }
}

export type TOptions = {
    n?: number,
    minVideoLength?: number,
    maxVideoLength?: number,
    shortVideosOnly?: boolean,
    longVideosOnly?: boolean
};

export async function getRecentYouTubeVideos(channel_id: string, options?: TOptions): Promise<ISourceVideo[]> {
    const rssFeedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channel_id}`;
    const res = await axios.get(rssFeedUrl);
    const data = res.data;
    const parsedData = await new Promise((resolve, reject) => {
        parser.parseString(data, (parseErr, parsedData) => {
            if (parseErr) {
                console.error(parseErr);
                reject(parseErr);
            } else {
                resolve(parsedData);
            }
        });
    }) as any;

    const proms = [];
    for (let j = 0; j < parsedData.feed.entry.length; j++) {
        const v = parsedData.feed.entry[j]['yt:videoId'][0];
        const prom = ytdl.getBasicInfo(`https://youtube.com?v=${v}`)
            .catch(err => console.error(err));
        proms.push(prom);
    }
    const settledProms = await Promise.allSettled(proms);
    let videoData = settledProms.map((a: any) => a?.value?.videoDetails);

    if (!!options) {
        if ('minVideoLength' in options) {
            const minVideoLength = options?.minVideoLength || MIN_ALLOWED_VIDEO_LENGTH;
            videoData = videoData.filter(a => parseFloat(a?.lengthSeconds) >= minVideoLength);
        } else if ('maxVideoLength' in options) {
            const maxVideoLength = options?.maxVideoLength || MAX_ALLOWED_VIDEO_LENGTH;
            videoData = videoData.filter(a => parseFloat(a?.lengthSeconds) <= maxVideoLength);
        } else if (options?.shortVideosOnly === true) {
            videoData = videoData.filter(a => isShortVideo(parseFloat(a?.lengthSeconds)));
        } else if (options?.longVideosOnly === true) {
            videoData = videoData.filter(a => isLongVideo(parseFloat(a?.lengthSeconds)));
        }
    }

    if (typeof options?.n === 'number') {
        videoData = videoData.slice(0, options.n);
    }

    return videoData
        .map(item => ({
            sourceType: 'YOUTUBE',
            externalId: item.videoId as string
        })) as ISourceVideo[];
}
