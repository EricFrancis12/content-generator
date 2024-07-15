import axios from 'axios';
import xml2js from 'xml2js';
import { ParsedDataSchema, TParsedData, RedditApiResultSchema } from '../services/campaign-engine/src/data/types';

const parser = new xml2js.Parser();

describe('smoke test', () => {
    test('Fetching data from YouTube RSS feed', async () => {
        const rssFeedUrl = 'https://www.youtube.com/feeds/videos.xml?channel_id=UCaM7yYDOlnQlRvkyh5vtyPQ';
        const data: unknown = (await axios.get(rssFeedUrl)).data;

        console.log('~ [START] YouTube RSS data');
        console.log(data);
        console.log('~ [END] YouTube RSS data');

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
        const data: unknown = (await axios.get(url)).data;

        console.log('~ [START] Reddit data');
        console.log(data);
        console.log('~ [END] Reddit data');

        const { success } = RedditApiResultSchema.safeParse(data);
        expect(success).toEqual(true);
    });
});
