import axios from 'axios';
import xml2js from 'xml2js';
import { ParsedDataSchema, TParsedData, RedditApiResultSchema, MemeAPIResultSchema } from '../services/campaign-engine/src/data/types';

const parser = new xml2js.Parser();

(async function () {
    const result = {
        youtubeRSSFeed: false,
        redditAPI: false,
        memesAPI: false,
    };

    try {
        const rssFeedUrl = 'https://www.youtube.com/feeds/videos.xml?channel_id=UCaM7yYDOlnQlRvkyh5vtyPQ';
        const data: unknown = (await axios.get(rssFeedUrl)).data;

        console.log('\n[START] YouTube RSS data');
        console.log(data);
        console.log('[END] YouTube RSS data');

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

        const { success } = ParsedDataSchema.safeParse(parsedData);
        result.youtubeRSSFeed = success;
    } catch (err) {
        console.error(err);
    }

    try {
        const url = 'https://api.reddit.com/r/memes/hot';
        const data: unknown = (await axios.get(url)).data;

        console.log('\n[START] Reddit data');
        console.log(data);
        console.log('[END] Reddit data');

        const { success } = RedditApiResultSchema.safeParse(data);
        result.redditAPI = success;
    } catch (err) {
        console.error(err);
    }

    try {
        const url = 'https://meme-api.com/gimme/memes';
        const data: unknown = (await axios.get(url)).data;

        console.log('\n[START] Memes API data');
        console.log(data);
        console.log('[END] Memes API data');

        const { success } = MemeAPIResultSchema.safeParse(data);
        result.memesAPI = success;
    } catch (err) {
        console.error(err);
    }

    console.log('\n[RESULTS]:');
    Object.entries(result).forEach(([key, value]) => {
        console.log(`${key}:\x1b[${value ? 32 : 31}m ${value ? 'Pass' : 'Fail'} \x1b[0m`);
    });
})();
