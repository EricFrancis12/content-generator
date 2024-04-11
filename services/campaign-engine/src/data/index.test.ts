import axios from 'axios';
jest.mock('axios');
import {
    fetchCampaigns, fetchIntakeHistory, getRecentYouTubeVideos, getRecentRedditImages,
    checkForNewInstagramImages, checkForNewInstagramVideos, checkForNewTikTokImages, checkForNewTikTokVideos,
    checkForNewYouTubeImages, checkForNewYouTubeVideos, checkForNewRedditImages, checkForNewRedditVideos
} from '.';

describe('Mock api calls', () => {
    const sampleId = '1234';
    const invalidAxiosResponse = {};
    (axios.get as jest.Mock).mockResolvedValue(invalidAxiosResponse);

    test(`Checking ${fetchCampaigns.name} with invalid axios response`, async () => {
        const result = await fetchCampaigns();
        expect(Array.isArray(result)).toEqual(true);
        expect(result?.length).toEqual(0);
    });

    test(`Checking ${fetchIntakeHistory.name} with invalid axios response`, async () => {
        const result = await fetchIntakeHistory(sampleId);
        expect(Array.isArray(result)).toEqual(true);
        expect(result?.length).toEqual(0);
    });

    test(`Checking ${getRecentYouTubeVideos.name} with invalid axios response`, async () => {
        const result = await getRecentYouTubeVideos(sampleId);
        expect(Array.isArray(result)).toEqual(true);
        expect(result?.length).toEqual(0);
    });

    test(`Checking ${getRecentRedditImages.name} with invalid axios response`, async () => {
        const result = await getRecentRedditImages(sampleId);
        expect(Array.isArray(result)).toEqual(true);
        expect(result?.length).toEqual(0);
    });

    test(`Checking ${checkForNewInstagramImages.name} with invalid axios response`, async () => {
        const result = await checkForNewInstagramImages(sampleId, []);
        expect(Array.isArray(result)).toEqual(true);
        expect(result?.length).toEqual(0);
    });

    test(`Checking ${checkForNewInstagramVideos.name} with invalid axios response`, async () => {
        const result = await checkForNewInstagramVideos(sampleId, []);
        expect(Array.isArray(result)).toEqual(true);
        expect(result?.length).toEqual(0);
    });

    test(`Checking ${checkForNewTikTokImages.name} with invalid axios response`, async () => {
        const result = await checkForNewTikTokImages(sampleId, []);
        expect(Array.isArray(result)).toEqual(true);
        expect(result?.length).toEqual(0);
    });

    test(`Checking ${checkForNewTikTokVideos.name} with invalid axios response`, async () => {
        const result = await checkForNewTikTokVideos(sampleId, []);
        expect(Array.isArray(result)).toEqual(true);
        expect(result?.length).toEqual(0);
    });

    test(`Checking ${checkForNewYouTubeImages.name} with invalid axios response`, async () => {
        const result = await checkForNewYouTubeImages(sampleId, []);
        expect(Array.isArray(result)).toEqual(true);
        expect(result?.length).toEqual(0);
    });

    test(`Checking ${checkForNewYouTubeVideos.name} with invalid axios response`, async () => {
        const result = await checkForNewYouTubeVideos(sampleId, []);
        expect(Array.isArray(result)).toEqual(true);
        expect(result?.length).toEqual(0);
    });

    test(`Checking ${checkForNewRedditImages.name} with invalid axios response`, async () => {
        const result = await checkForNewRedditImages(sampleId, []);
        expect(Array.isArray(result)).toEqual(true);
        expect(result?.length).toEqual(0);
    });

    test(`Checking ${checkForNewRedditVideos.name} with invalid axios response`, async () => {
        const result = await checkForNewRedditVideos(sampleId, []);
        expect(Array.isArray(result)).toEqual(true);
        expect(result?.length).toEqual(0);
    });
});
