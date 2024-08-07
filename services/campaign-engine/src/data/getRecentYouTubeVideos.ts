import axios from 'axios';
import xml2js from 'xml2js';
const parser = new xml2js.Parser();
import ytdl from 'ytdl-core';
import { ISourceVideo, ESourceType } from '../../_shared';
import { isShortVideo, isLongVideo } from '../utils';
import { logger, formatErr } from '../config/loggers';
import config from '../config/config';
const { MIN_ALLOWED_VIDEO_LENGTH, MAX_ALLOWED_VIDEO_LENGTH } = config;
import { IOptions } from '.';
import { ParsedDataSchema, TParsedData } from './types';

interface IOptionsYouTube extends IOptions {
    // ...
}

export default async function getRecentYouTubeVideos(channel_id: string, options?: IOptionsYouTube): Promise<ISourceVideo[]> {
    try {
        const rssFeedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channel_id}`;
        const parsedData = await fetchYouTubeRSSFeed(rssFeedUrl);
        if (parsedData instanceof Error) {
            logger.error(parsedData.message);
            return [];
        }

        const { success } = ParsedDataSchema.safeParse(parsedData);
        if (!success) return [];

        const proms = [];
        for (let j = 0; j < parsedData.feed.entry.length; j++) {
            const v = parsedData.feed.entry[j]['yt:videoId'][0];
            const prom = ytdl.getBasicInfo(`https://youtube.com?v=${v}`);
            proms.push(prom);
        }
        const settledProms = await Promise.allSettled(proms);

        let videoData: ytdl.videoInfo[] = [];
        for (const p of settledProms) {
            if (p.status === 'fulfilled') {
                videoData.push(p.value);
            }
        }

        const minVideoLength = options?.minVideoLength || MIN_ALLOWED_VIDEO_LENGTH;
        videoData = videoData.filter(a => parseFloat(a.videoDetails.lengthSeconds) >= minVideoLength);

        const maxVideoLength = options?.maxVideoLength || MAX_ALLOWED_VIDEO_LENGTH;
        videoData = videoData.filter(a => parseFloat(a.videoDetails.lengthSeconds) <= maxVideoLength);

        if (options) {
            if (options?.shortVideosOnly === true) {
                videoData = videoData.filter(a => isShortVideo(parseFloat(a.videoDetails.lengthSeconds)));
            } else if (options?.longVideosOnly === true) {
                videoData = videoData.filter(a => isLongVideo(parseFloat(a.videoDetails.lengthSeconds)));
            }
        }

        if (typeof options?.n === 'number') {
            videoData = videoData.slice(0, options.n);
        }

        return videoData.map(item => ({
            sourceType: ESourceType.YOUTUBE,
            externalId: item.videoDetails.videoId
        }));
    } catch (err) {
        logger.error('Error getting recent YouTube videos: ' + formatErr(err));
        return [];
    }
}

export async function fetchYouTubeRSSFeed(rssFeedUrl: string): Promise<TParsedData | Error> {
    try {
        const res = await axios.get(rssFeedUrl);
        const data: unknown = res.data;

        if (typeof data !== 'string') return new Error('data is not a string');

        const parsedData: TParsedData | Error = await new Promise((resolve) => {
            parser.parseString(data, (parseErr, parsedData) => {
                if (parseErr) {
                    resolve(parseErr);
                } else {
                    resolve(parsedData);
                }
            });
        });
        return parsedData;
    } catch (err) {
        return new Error('Error fetching YouTube RSS feed');
    }
}
