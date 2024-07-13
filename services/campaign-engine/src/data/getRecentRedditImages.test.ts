import { fetchRedditImages } from './getRecentRedditImages';

test('Fetching data from YouTube RSS feed', async () => {
    const result = await fetchRedditImages('memes', 'hot');
    expect(result instanceof Error).toEqual(false);
});
