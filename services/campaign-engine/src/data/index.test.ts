import axios from 'axios';
jest.mock('axios');
import {
    fetchCampaigns, fetchIntakeHistory, checkForNewInstagramImages, checkForNewInstagramVideos,
    checkForNewTikTokImages, checkForNewTikTokVideos, checkForNewYouTubeImages, checkForNewYouTubeVideos,
    checkForNewRedditImages, checkForNewRedditVideos, getRecentYouTubeVideos, getRecentRedditImages
} from '.';

type TTestItem = {
    _function: Function,
    args: any
};

const sampleId = '1234';

const itemsToTest: TTestItem[] = [
    {
        _function: fetchCampaigns,
        args: []
    },
    {
        _function: fetchIntakeHistory,
        args: [sampleId]
    },
    {
        _function: checkForNewInstagramImages,
        args: [sampleId, []]
    },
    {
        _function: checkForNewInstagramVideos,
        args: [sampleId, []]
    },
    {
        _function: checkForNewTikTokImages,
        args: [sampleId, []]
    },
    {
        _function: checkForNewTikTokVideos,
        args: [sampleId, []]
    },
    {
        _function: checkForNewYouTubeImages,
        args: [sampleId, []]
    },
    {
        _function: checkForNewYouTubeVideos,
        args: [sampleId, []]
    },
    {
        _function: checkForNewRedditImages,
        args: [sampleId, []]
    },
    {
        _function: checkForNewRedditVideos,
        args: [sampleId, []]
    },
    {
        _function: getRecentYouTubeVideos,
        args: [sampleId]
    },
    {
        _function: getRecentRedditImages,
        args: [sampleId]
    }
];

describe('Mock api calls', () => {
    for (const { _function, args } of itemsToTest) {
        test(`Checking ${_function.name} with invalid axios response`, async () => {
            const invalidAxiosResponse = {};
            (axios.get as jest.Mock).mockResolvedValue(invalidAxiosResponse);
            const result = await _function(...args);
            expect(Array.isArray(result)).toEqual(true);
            expect(result?.length).toEqual(0);
        });
    }
});
