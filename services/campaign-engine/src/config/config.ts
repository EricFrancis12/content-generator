import { ECronExpression } from '../typings';

type TConfig = {
    CRON_EXPRESSION: ECronExpression,
    MIN_ALLOWED_VIDEO_LENGTH: number,
    MAX_ALLOWED_VIDEO_LENGTH: number
};

const config: TConfig = {
    CRON_EXPRESSION: ECronExpression.EVERY_MINUTE,
    MIN_ALLOWED_VIDEO_LENGTH: Number(process.env.MIN_ALLOWED_VIDEO_LENGTH) || 0,
    MAX_ALLOWED_VIDEO_LENGTH: Number(process.env.MAX_ALLOWED_VIDEO_LENGTH) || 60 * 60 * 4 // 4 hours in seconds
};

export default config;
