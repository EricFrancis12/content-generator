import axios from 'axios';
import xml2js from 'xml2js';
import {
    ParsedDataSchema, TParsedData,
    RedditApiResultSchema, TRedditApiResultSchema
} from '../services/campaign-engine/src/data/types';

const parser = new xml2js.Parser();

describe('smoke test', () => {
    test('Fetching data from YouTube RSS feed', async () => {
        const rssFeedUrl = 'https://www.youtube.com/feeds/videos.xml?channel_id=UCaM7yYDOlnQlRvkyh5vtyPQ';
        const res = await axios.get(rssFeedUrl);
        const data: unknown = res.data;

        expect(typeof data).toEqual('string');
        if (typeof data !== 'string') throw new Error('data must be a string');

        const parsedData: TParsedData | Error = await new Promise((resolve) => {
            parser.parseString(data, (parseErr, parsedData) => {
                if (parseErr) {
                    resolve(parseErr);
                } else {
                    resolve(parsedData);
                }
            });
        });

        expect(parsedData instanceof Error).toEqual(false);

        const { success } = ParsedDataSchema.safeParse(parsedData);
        expect(success).toEqual(true);
    });

    test('Fetching data from Reddit', async () => {
        const url = 'https://api.reddit.com/r/memes/hot';
        const res = await axios.get(url);
        const redditApiResultSchema: TRedditApiResultSchema = res.data;
        const { success } = RedditApiResultSchema.safeParse(redditApiResultSchema);
        expect(success).toEqual(true);
    });
});
