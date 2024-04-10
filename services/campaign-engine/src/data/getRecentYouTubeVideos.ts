import axios from 'axios';
import xml2js from 'xml2js';
const parser = new xml2js.Parser();
import ytdl from 'ytdl-core';
import { z } from 'zod';
import { ISourceVideo, ESourceType } from '../../_shared';
import { isShortVideo, isLongVideo } from '../utils';
import config from '../config/config';
const { MIN_ALLOWED_VIDEO_LENGTH, MAX_ALLOWED_VIDEO_LENGTH } = config;
import { IOptions } from '.';

interface IOptionsYouTube extends IOptions {
    // ...
};

const ParsedDataSchema = z.object({
    feed: z.object({
        entry: z.array(z.object({
            ['yt:videoId']: z.array(z.string())
        }))
    })
});
type TParsedData = z.infer<typeof ParsedDataSchema>;

export default async function getRecentYouTubeVideos(channel_id: string, options?: IOptionsYouTube): Promise<ISourceVideo[]> {
    try {
        const rssFeedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channel_id}`;
        const res = await axios.get(rssFeedUrl);
        const data: unknown = res.data;
        if (typeof data !== 'string') {
            return [];
        }

        const parsedData: TParsedData | Error = await new Promise((resolve, reject) => {
            parser.parseString(data, (parseErr, parsedData) => {
                if (parseErr) {
                    console.error(new Error(parseErr.message));
                    reject(parseErr);
                } else {
                    resolve(parsedData);
                }
            });
        });

        if (parsedData instanceof Error) {
            return [];
        }

        const { success } = ParsedDataSchema.safeParse(parsedData);
        if (!success) {
            return [];
        }

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
    } catch (err) {
        console.error(err);
        return [];
    }
}