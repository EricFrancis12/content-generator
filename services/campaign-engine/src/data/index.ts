import fs from 'fs';
import axios from 'axios';
import xml2js from 'xml2js';
const parser = new xml2js.Parser();
import ytdl from 'ytdl-core';
import {
    ICampaign, ICampaignOptions, TDownloadQueueItem, ISourceImage, ISourceVideo,
    IHistoryItem, IIntakeHistoryItem, ESourceType, EContentType
} from '../../_shared';
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

export async function fetchIntakeHistory(campaign_id: string) {
    try {
        const res = await axios.get(`http://node-app:3000/api/v1/campaigns/${campaign_id}/intake-history`);
        const intakeHistory = res.data?.data?.intakeHistory as IIntakeHistoryItem[];
        if (!intakeHistory) {
            return [];
        }
        return intakeHistory;
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
        const res = await axios.get(`http://node-app:3000/api/v1/campaigns/${campaign_id}/intake-history`);
        if (res.status >= 300 || res.data?.success !== true) {
            return false;
        }
        const intakeHistory = res.data?.data?.intakeHistory as IIntakeHistoryItem[];
        if (!intakeHistory) {
            return false;
        }
        const historyItemAlreadyExists = intakeHistory.some(historyItem => historyItem.externalId === externalId);
        if (!historyItemAlreadyExists) {
            const res2 = await axios.post(`http://node-app:3000/api/v1/campaigns/${campaign_id}/intake-history`, { externalId });
            if (res2.status >= 300 || res.data?.success !== true) {
                return false;
            }
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

export interface IOptions extends ICampaignOptions {
    n?: number
};

interface IOptionsYouTube extends IOptions {
    // ...
};

export async function getRecentYouTubeVideos(channel_id: string, options?: IOptionsYouTube): Promise<ISourceVideo[]> {
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

    const minVideoLength = options?.minVideoLength || MIN_ALLOWED_VIDEO_LENGTH;
    videoData = videoData.filter(a => parseFloat(a?.lengthSeconds) >= minVideoLength);

    const maxVideoLength = options?.maxVideoLength || MAX_ALLOWED_VIDEO_LENGTH;
    videoData = videoData.filter(a => parseFloat(a?.lengthSeconds) <= maxVideoLength);

    if (!!options) {
        if (options?.shortVideosOnly === true) {
            videoData = videoData.filter(a => isShortVideo(parseFloat(a?.lengthSeconds)));
        } else if (options?.longVideosOnly === true) {
            videoData = videoData.filter(a => isLongVideo(parseFloat(a?.lengthSeconds)));
        }
    }

    if (typeof options?.n === 'number') {
        videoData = videoData.slice(0, options.n);
    }

    return videoData
        .map(item => {
            const sourceVideo: ISourceVideo = {
                sourceType: ESourceType.YOUTUBE,
                externalId: item.videoId
            };
            return sourceVideo;
        });
}

interface IOptionsReddit extends IOptions {
    selector?: 'new' | 'hot' | 'controversial';
};

export async function getRecentRedditImages(subreddit: string, options?: IOptionsReddit): Promise<ISourceImage[]> {
    const selector = options?.selector ?? 'hot';
    const url = `https://api.reddit.com/r/${subreddit}/${selector}`;
    const res = await axios.get(url);
    const children: unknown[] = res.data?.data?.children;
    if (children) {
        const imageUrls: string[] = children
            .map((child) => {
                if (typeof child === 'object' && child !== null && 'data' in child) {
                    if (typeof child.data === 'object' && child.data !== null && 'url' in child.data) {
                        if (typeof child.data.url === 'string') {
                            return child.data.url;
                        }
                    }
                }
                return '';
            })
            .filter(item => !!item);

        return imageUrls.map(imageUrl => {
            const splitOnSlash = imageUrl.split('/');
            const externalId = splitOnSlash[splitOnSlash.length - 1] || '';
            return {
                sourceType: ESourceType.REDDIT,
                externalId
            };
        });
    }
    return [];
}
