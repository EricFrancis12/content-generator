import { fetchYouTubeRSSFeed } from './getRecentYouTubeVideos';

test('Fetching data from YouTube RSS feed', async () => {
    const rssFeedUrl = 'https://www.youtube.com/feeds/videos.xml?channel_id=UCaM7yYDOlnQlRvkyh5vtyPQ';
    const result = await fetchYouTubeRSSFeed(rssFeedUrl);
    expect(result instanceof Error).toEqual(false);
});
