import axios from 'axios';
import { IOptions } from '.';
import { logger, formatErr } from '../config/loggers';
import { ISourceImage, ESourceType } from '../../_shared';
import { RedditApiResultSchema, TRedditApiResultSchema } from './types';

interface IOptionsReddit extends IOptions {
    selector?: 'new' | 'hot' | 'controversial';
}

export default async function getRecentRedditImages(subreddit: string, options?: IOptionsReddit): Promise<ISourceImage[]> {
    try {
        const selector = options?.selector ?? 'hot';
        const redditApiResultSchema = await fetchRedditImages(subreddit, selector)
        if (redditApiResultSchema instanceof Error) {
            logger.error(redditApiResultSchema.message);
            return [];
        }

        const imageUrls: string[] = redditApiResultSchema.data.children.map(child => child.data.url)
        return imageUrls.map(imageUrl => {
            const externalId = extractExternalIdFromRedditURL(imageUrl);
            return {
                sourceType: ESourceType.REDDIT,
                externalId
            };
        });
    } catch (err) {
        logger.error('Error getting recent Reddit images: ' + formatErr(err));
        return [];
    }
}

export async function fetchRedditImages(subreddit: string, selector: string): Promise<TRedditApiResultSchema | Error> {
    try {
        const url = `https://api.reddit.com/r/${subreddit}/${selector}`;
        const res = await axios.get(url);
        const redditApiResultSchema: TRedditApiResultSchema = res.data;
        const { success } = RedditApiResultSchema.safeParse(redditApiResultSchema);
        if (!success) {
            return new Error('Received Reddit data in an unknown format');
        }
        return redditApiResultSchema;
    } catch (err) {
        return new Error('Error fetching Reddit images');
    }
}

export function extractExternalIdFromRedditURL(url: string): string {
    const splitOnSlash = url.split('/');
    return splitOnSlash[splitOnSlash.length - 1] || '';
}
