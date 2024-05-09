import fs from 'fs';
import axios from 'axios';
import ytdl, { ChooseFormatQuality } from 'ytdl-core';
import { ISavedImage, ISavedVideo, EContentType, ESourceType } from '../../_shared';

type ExtendString<T extends string> = T | Omit<string, T>;

export async function downloadYouTubeVideo(v: string, outputPath: string, {
    quality = ['22', 'highest']
}: {
    quality?: ExtendString<ChooseFormatQuality> | number | ExtendString<ChooseFormatQuality>[] | number[];
} = {}): Promise<ISavedVideo> {
    if (!fs.existsSync(outputPath)) {
        const url = `https://youtube.com/watch?v=${v}`;
        await new Promise((resolve, reject) => {
            const stream = ytdl(url, { quality });
            stream.on('error', (err) => reject(err));
            
            stream.pipe(fs.createWriteStream(outputPath))
                .on('finish', () => resolve(true))
                .on('error', (err) => reject(err));
        });
    }
    return {
        sourceType: ESourceType.YOUTUBE,
        contentType: EContentType.VIDEO,
        path: outputPath
    };
}

export async function downloadRedditImage(externalId: string, outputPath: string): Promise<ISavedImage> {
    if (!fs.existsSync(outputPath)) {
        const url = `https://i.redd.it/${externalId}`;
        try {
            const response = await axios({
                url: url,
                method: 'GET',
                responseType: 'stream'
            });

            await new Promise((resolve, reject) => {
                const writer = fs.createWriteStream(outputPath);
                response.data.pipe(writer);

                writer.on('finish', resolve);
                writer.on('error', reject);
            });
        } catch (err) {
            throw new Error('Error downloading Reddit Image');
        }
    }
    return {
        sourceType: ESourceType.REDDIT,
        contentType: EContentType.IMAGE,
        path: outputPath
    };
}
