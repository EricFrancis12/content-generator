import axios from 'axios';
import { z } from 'zod';
import { IOptions } from '.';
import { logger, formatErr } from '../config/loggers';
import { ISourceImage, ESourceType } from '../../_shared';

interface IOptionsReddit extends IOptions {
    selector?: 'new' | 'hot' | 'controversial';
}

const RedditApiResultSchema = z.object({
    data: z.object({
        children: z.array(z.object({
            data: z.object({
                url: z.string()
            })
        }))
    })
});
type TRedditApiResultSchema = z.infer<typeof RedditApiResultSchema>;

export default async function getRecentRedditImages(subreddit: string, options?: IOptionsReddit): Promise<ISourceImage[]> {
    try {
        const selector = options?.selector ?? 'hot';
        const url = `https://api.reddit.com/r/${subreddit}/${selector}`;
        const res = await axios.get(url);
        const redditApiResultSchema: TRedditApiResultSchema = res.data;
        const { success } = RedditApiResultSchema.safeParse(redditApiResultSchema);
        if (!success) {
            return [];
        }

        const imageUrls: string[] = redditApiResultSchema.data.children.map(child => child.data.url)
        return imageUrls.map(imageUrl => {
            const splitOnSlash = imageUrl.split('/');
            const externalId = splitOnSlash[splitOnSlash.length - 1] || '';
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
