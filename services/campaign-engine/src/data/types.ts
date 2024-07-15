import { z } from 'zod';

export const ParsedDataSchema = z.object({
    feed: z.object({
        entry: z.array(z.object({
            ['yt:videoId']: z.array(z.string())
        }))
    })
});
export type TParsedData = z.infer<typeof ParsedDataSchema>;

export const RedditApiResultSchema = z.object({
    data: z.object({
        children: z.array(z.object({
            data: z.object({
                url: z.string()
            })
        }))
    })
});
export type TRedditApiResultSchema = z.infer<typeof RedditApiResultSchema>;

export const MemeAPIResultSchema = z.object({
    url: z.string(),
});
export type TMemeAPIResult = z.infer<typeof MemeAPIResultSchema>;
