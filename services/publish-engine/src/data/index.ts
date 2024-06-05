import { basename } from 'path';
import axios from 'axios';
import ffmpeg from 'fluent-ffmpeg';
import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg';
import { path as ffprobePath } from '@ffprobe-installer/ffprobe';
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);
import _shared, { EContentType, ESourceType, ISavedImage, IOutputHistoryItem } from '../../_shared';
const { SERVICE_TOKEN } = _shared.constants;
import { logger, formatErr } from '../config/loggers';

export * from './Instagram';
export * from './Telegram';

export async function addToOutputHistory(outputHistoryItem: IOutputHistoryItem) {
    const { campaign_id } = outputHistoryItem;
    try {
        const res = await axios.post(`http://api:3000/api/v1/campaigns/${campaign_id}/output-history`, outputHistoryItem, {
            headers: {
                Authorization: `Bearer ${SERVICE_TOKEN}`
            }
        });
        if (res.status >= 300 || res.data?.success !== true) {
            return false;
        }
        return true;
    } catch (err) {
        logger.error(formatErr(err));
        return false;
    }
}

export async function takeScreenshotOfVideo(videoPath: string, outputPath: string): Promise<ISavedImage | null> {
    const filename = basename(outputPath);
    const folder = outputPath.split('/').slice(0, -1).join('/');
    return new Promise(resolve => {
        ffmpeg(videoPath)
            .screenshots({
                timestamps: [0],
                folder,
                filename
            })
            .on('error', (err) => {
                console.error(err);
                resolve(null);
            })
            .on('end', () => resolve({
                contentType: EContentType.IMAGE,
                sourceType: ESourceType.CREATED_BY_FILTER,
                path: outputPath
            }));
    });
}
