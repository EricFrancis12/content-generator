import fs from 'fs';
import ytdl from 'ytdl-core';
import { ISavedVideo, EContentType, ESourceType } from '../../_shared';

export async function downloadYouTubeVideo(v: string, outputPath: string, {
    quality
}: {
    quality?: number
} = {}): Promise<ISavedVideo> {
    const url = `https://youtube.com/watch?v=${v}`;

    if (!fs.existsSync(outputPath)) {
        await new Promise((resolve, reject) => {
            ytdl(url, { quality })
                .pipe(fs.createWriteStream(outputPath))
                .on('error', () => reject(false))
                .on('finish', () => resolve(true));
        });
    }
    return {
        sourceType: ESourceType.YOUTUBE,
        contentType: EContentType.VIDEO,
        path: outputPath
    };
}