import { basename } from 'path';
import { ESourceType, EContentType, ISavedContent, TFilterName, TFilterOptions } from '../../_shared';
import _shared from '../../_shared';
const { generateInternalId } = _shared.utils;

import ffmpeg from 'fluent-ffmpeg';
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require('@ffprobe-installer/ffprobe').path;
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

type TOperationFunction = (
    baseVideo: ISavedContent,
    ingredientVideo: ISavedContent,
    isLastFilter: boolean,
    options?: TFilterOptions
) => Promise<ISavedContent>;

type TOperations = {
    [key in TFilterName]?: TOperationFunction
};

const concatVideos: TOperationFunction = async (baseVideo, ingredientVideo, isLastFilter, options = {}) => {
    return new Promise((resolve, reject) => {
        const baseVideoName = basename(baseVideo.path);
        const ingredientVideoName = basename(ingredientVideo.path);
        const internalId = generateInternalId();
        const outputPath = isLastFilter
            ? `./shared-file-system/output-content/videos/${internalId}.mp4`
            : `./shared-file-system/WIP-filters-content/videos/${internalId}.mp4`;
        const tempDir = './shared-file-system/WIP-filters-content/temp';

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

const overlayVideoOntoVideo: TOperationFunction = async (baseVideo, ingredientVideo, isLastFilter, options = {
    x: 0,
    y: 0
}) => {
    const { x, y } = options;
    return new Promise((resolve, reject) => {
        const baseVideoName = basename(baseVideo.path);
        const ingredientVideoName = basename(ingredientVideo.path);
        const internalId = generateInternalId();
        const outputPath = isLastFilter
            ? `./shared-file-system/output-content/videos/${internalId}.mp4`
            : `./shared-file-system/WIP-filters-content/videos/${internalId}.mp4`;

        ffmpeg()
            .input(baseVideo.path) // base video (audio will be included)
            .input(ingredientVideo.path) // overlay video (audio will be removed)
            .complexFilter([
                `overlay=shortest=1:x=${x}:y=${y}`
            ])
            .output(outputPath)
            .outputOptions(['-c:a copy'])
            .on('error', reject)
            .on('start', () => {
                console.log(`Starting overlay for ${baseVideoName} and ${ingredientVideoName}`);
            })
            .on('end', () => {
                console.log(`Overlay finished for ${baseVideoName} and ${ingredientVideoName}`);
                resolve({
                    sourceType: ESourceType.CREATED_BY_FILTER,
                    contentType: EContentType.VIDEO,
                    path: outputPath
                });
            })
            .run()
    });
};

const operations: TOperations = {
    concatVideos,
    overlayVideoOntoVideo,
    // overlayImageOntoVideo,
    // takeScreenshotOfVideo
};
export default operations;
