import fs, { promises as fsPromises } from 'fs';
import { EImageFileExtension, EVideoFileExtension, EContentType, ESourceType, ISavedContent } from '../../_shared';

import ffmpeg from 'fluent-ffmpeg';
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require('@ffprobe-installer/ffprobe').path;
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

interface ISavedContentDetailed extends ISavedContent {
    creationDate: Date | null,
    height: number | null,
    width: number | null
};
interface ISavedImageDetailed extends ISavedContentDetailed {
    // ...
};
interface ISavedVideoDetailed extends ISavedContentDetailed {
    videoLength: number | null
};

export async function getSavedContentDetails(contentPath: string): Promise<ISavedContentDetailed> {
    return new Promise(async (resolve, reject) => {
        if (!fs.existsSync(contentPath)) {
            reject(`Invalid content path: "${contentPath}"`);
        }

        ffmpeg.ffprobe(contentPath, (err, metadata) => {
            if (err) {
                reject(`Error probing file: ${err}`);
            }
            const fileExtension = contentPath.split('.').at(-1);
            const creationDate = fs.statSync(contentPath)?.birthtime ?? null;

            let videoLength = null, height = null, width = null;
            if (fileExtension && fileExtension in EVideoFileExtension) {
                videoLength = metadata?.format?.duration ?? null;

                if (metadata?.streams) {
                    const videoStream = metadata.streams.find((stream) => stream.codec_type === 'video');
                    height = videoStream?.height ?? null;
                    width = videoStream?.width ?? null;
                }
                const detailedVideo: ISavedVideoDetailed = {
                    sourceType: ESourceType.READ_FROM_SAVED,
                    contentType: EContentType.VIDEO,
                    path: contentPath,
                    creationDate,
                    height,
                    width,
                    videoLength
                };
                resolve(detailedVideo);
            } else if (fileExtension && fileExtension in EImageFileExtension) {
                const detailedImage: ISavedImageDetailed = {
                    sourceType: ESourceType.READ_FROM_SAVED,
                    contentType: EContentType.IMAGE,
                    path: contentPath,
                    creationDate,
                    height,
                    width
                };
                resolve(detailedImage);
            } else {
                reject(`Unknown file extension: "${fileExtension}"`);
            }
        });
    });
}
