import fs from 'fs';
import axios from 'axios';
import ytdl from 'ytdl-core';
import { ISavedImage, ISavedVideo, EContentType, ESourceType } from '../../_shared';

export async function downloadYouTubeVideo(v: string, outputPath: string, {
    quality = '22'
}: {
    quality?: string | number
} = {}): Promise<ISavedVideo> {
    const url = `https://youtube.com/watch?v=${v}`;

    if (!fs.existsSync(outputPath)) {
        await new Promise((resolve, reject) => {
            try {
                ytdl(url, { quality })
                    .pipe(fs.createWriteStream(outputPath))
                    .on('error', (err) => reject(err))
                    .on('finish', () => resolve(true));
            } catch (err) {
                reject(err);
            }
        });
    }
    return {
        sourceType: ESourceType.YOUTUBE,
        contentType: EContentType.VIDEO,
        path: outputPath
    };
}

export async function downloadRedditImage(externalId: string, outputPath: string): Promise<ISavedImage> {
    const url = `https://i.redd.it/${externalId}`;

    if (!fs.existsSync(outputPath)) {
        await new Promise(async (resolve, reject) => {
            try {
                const response = await axios({
                    url: url,
                    method: 'GET',
                    responseType: 'stream'
                });

                const writer = fs.createWriteStream(outputPath);
                response.data.pipe(writer);

                writer.on('finish', resolve);
                writer.on('error', reject);
            } catch (err) {
                reject(err);
            }
        });
    }
    return {
        sourceType: ESourceType.REDDIT,
        contentType: EContentType.IMAGE,
        path: outputPath
    };
}
