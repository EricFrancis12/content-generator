import { promises as fsPromises } from 'fs';
import { basename } from 'path';
import { ESourceType, EContentType, ISavedContent, ISavedImage, ISavedVideo, TFilterName, TFilterOptions } from '../../_shared';

import ffmpeg from 'fluent-ffmpeg';
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require('@ffprobe-installer/ffprobe').path;
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

type TOperationFunction = (
    baseVideo: ISavedContent,
    ingredientVideo: ISavedContent,
    options?: TFilterOptions
) => Promise<ISavedContent>;

type TOperations = {
    [key in TFilterName]?: TOperationFunction
};

const concatVideos: TOperationFunction = async (baseVideo, ingredientVideo, options = {}) => {
    return new Promise((resolve, reject) => {
        const baseVideoName = basename(baseVideo.path);
        const ingredientVideoName = basename(ingredientVideo.path);
        const outputPath = './shared-file-system/filters-test/test-video-1.mp4';
        const tempDir = './shared-file-system/filters-test/temp';
        ffmpeg(baseVideo.path)
            .input(ingredientVideo.path)
            .on('error', reject)
            .on('start', () => {
                console.log(`Starting concat for ${baseVideoName} and ${ingredientVideoName}`);
            })
            .on('end', () => {
                console.log(`Concat finished for ${baseVideoName} and ${ingredientVideoName}`);
                resolve({
                    sourceType: ESourceType.CREATED_BY_FILTER,
                    contentType: EContentType.VIDEO,
                    path: outputPath
                });
            })
            .mergeToFile(outputPath, tempDir)
    });
};

// const overlayVideoOntoVideo: TOperationFunction = async (baseVideo, ingredientVideo, options = {}) => {
//     // ...
// };

const operations: TOperations = {
    concatVideos,
    // overlayVideoOntoVideo
};
export default operations;
