import { basename } from 'path';
import { logger } from '../config/loggers';
import _shared, {
    ESourceType, EContentType, ISavedContent, EFilterName,
    IFilterOptions, IConcatVideosOptions, IOverlayVideoOntoVideoOptions, IOverlayImageOntoVideoOptions
} from '../../_shared';
const { generateInternalId } = _shared.utils;
import { getSavedContentDetails } from '../utils';

import ffmpeg from 'fluent-ffmpeg';
import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg';
import { path as ffprobePath } from '@ffprobe-installer/ffprobe';
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

type TOperationFunction = (
    baseVideo: ISavedContent,
    ingredientVideo: ISavedContent,
    isLastFilter: boolean,
    options?: IFilterOptions
) => Promise<ISavedContent>;

type TOperations = {
    [key in EFilterName]?: TOperationFunction
};

const concatVideos: TOperationFunction = async (
    baseVideo,
    ingredientVideo,
    isLastFilter,
    /* eslint-disable */ options: IConcatVideosOptions = {} /* eslint-ebable */
) => {
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
                logger.info(`Starting concat for ${baseVideoName} and ${ingredientVideoName}`);
            })
            .on('end', () => {
                logger.info(`Concat finished for ${baseVideoName} and ${ingredientVideoName}`);
                resolve({
                    sourceType: ESourceType.CREATED_BY_FILTER,
                    contentType: EContentType.VIDEO,
                    path: outputPath
                });
            })
            .mergeToFile(outputPath, tempDir)
    });
};

const overlayVideoOntoVideo: TOperationFunction = async (baseVideo, ingredientVideo, isLastFilter, {
    x = 0,
    y = 0,
    corner = 'upper-left',
    scaleIngredientRelativeToSelf,
    scaleIngredientRelativeToBase,
    trimTo
}: IOverlayVideoOntoVideoOptions = {}) => {
    let overlayX = `${x}`;
    let overlayY = `${y}`;

    // Adjust overlay position based on corner
    if (corner === 'upper-right') {
        overlayX = `main_w-overlay_w-${x}`;
    } else if (corner === 'lower-left') {
        overlayY = `main_h-overlay_h-${y}`;
    } else if (corner === 'lower-right') {
        overlayX = `main_w-overlay_w-${x}`;
        overlayY = `main_h-overlay_h-${y}`;
    }

    let scale = '';
    if (typeof scaleIngredientRelativeToSelf === 'number') {
        scale = `[1:v]scale=w=iw*${scaleIngredientRelativeToSelf}:-1[scaled]`;
    } else if (typeof scaleIngredientRelativeToBase === 'number') {
        const baseVideoWidth = (await getSavedContentDetails(baseVideo.path)).width;
        if (baseVideoWidth) {
            const w = baseVideoWidth * scaleIngredientRelativeToBase;
            scale = `[1:v]scale=w=${w}:-1[scaled]`;
        }
    }

    const complexFilter = [
        `[0:v]${scale ? '[scaled]' : '[1:v]'}overlay=${overlayX}:${overlayY}`
    ];
    if (scale) {
        complexFilter.unshift(scale);
    }

    return new Promise((resolve, reject) => {
        const baseVideoName = basename(baseVideo.path);
        const ingredientVideoName = basename(ingredientVideo.path);
        const internalId = generateInternalId();
        const outputPath = isLastFilter
            ? `./shared-file-system/output-content/videos/${internalId}.mp4`
            : `./shared-file-system/WIP-filters-content/videos/${internalId}.mp4`;

        const command = ffmpeg();
        command.input(baseVideo.path); // base video (audio will be included)
        command.input(ingredientVideo.path); // overlay video (audio will be removed)
        if (trimTo) {
            command.setStartTime(0);
            command.duration(trimTo);
        }
        command.complexFilter(complexFilter);
        command.output(outputPath);
        command.outputOptions(['-c:a copy']);
        command.on('error', reject);
        command.on('start', () => {
            logger.info(`Starting overlay for ${baseVideoName} and ${ingredientVideoName}`);
        });
        command.on('end', () => {
            logger.info(`Overlay finished for ${baseVideoName} and ${ingredientVideoName}`);
            resolve({
                sourceType: ESourceType.CREATED_BY_FILTER,
                contentType: EContentType.VIDEO,
                path: outputPath
            });
        });
        command.run();
    });
};

const overlayImageOntoVideo: TOperationFunction = async (baseVideo, ingredientImage, isLastFilter, {
    x = 0,
    y = 0,
    corner = 'upper-left',
    scaleIngredientRelativeToSelf,
    scaleIngredientRelativeToBase
}: IOverlayImageOntoVideoOptions = {}) => {
    let overlayX = `${x}`;
    let overlayY = `${y}`;

    // Adjust overlay position based on corner
    if (corner === 'upper-right') {
        overlayX = `main_w-overlay_w-${x}`;
    } else if (corner === 'lower-left') {
        overlayY = `main_h-overlay_h-${y}`;
    } else if (corner === 'lower-right') {
        overlayX = `main_w-overlay_w-${x}`;
        overlayY = `main_h-overlay_h-${y}`;
    }

    let scale = '[1:v]scale=w=1:1[scaled]';
    if (typeof scaleIngredientRelativeToSelf === 'number') {
        scale = `[1:v]scale=w=iw*${scaleIngredientRelativeToSelf}:-1[scaled]`;
    } else if (typeof scaleIngredientRelativeToBase === 'number') {
        const baseVideoWidth = (await getSavedContentDetails(baseVideo.path)).width;
        if (baseVideoWidth) {
            const w = baseVideoWidth * scaleIngredientRelativeToBase;
            scale = `[1:v]scale=w=${w}:-1[scaled]`;
        }
    }

    const complexFilter = [
        scale,
        `[0:v][scaled]overlay=${overlayX}:${overlayY}`
    ];

    return new Promise((resolve, reject) => {
        const baseVideoName = basename(baseVideo.path);
        const ingredientVideoName = basename(ingredientImage.path);
        const internalId = generateInternalId();
        const outputPath = isLastFilter
            ? `./shared-file-system/output-content/videos/${internalId}.mp4`
            : `./shared-file-system/WIP-filters-content/videos/${internalId}.mp4`;

        const command = ffmpeg();
        command.input(baseVideo.path);
        command.input(ingredientImage.path);
        command.complexFilter(complexFilter);
        command.output(outputPath);
        command.outputOptions(['-c:a copy']);
        command.on('error', reject);
        command.on('start', () => {
            logger.info(`Starting overlay for ${baseVideoName} and ${ingredientVideoName}`);
        });
        command.on('end', () => {
            logger.info(`Overlay finished for ${baseVideoName} and ${ingredientVideoName}`);
            resolve({
                sourceType: ESourceType.CREATED_BY_FILTER,
                contentType: EContentType.VIDEO,
                path: outputPath
            });
        });
        command.run();
    });
};

const operations: TOperations = {
    concatVideos,
    overlayVideoOntoVideo,
    overlayImageOntoVideo,
    // takeScreenshotOfVideo
};
export default operations;
