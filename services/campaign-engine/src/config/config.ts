import { ECronExpression } from '../../_shared';

type TConfig = {
    CRON_EXPRESSION: ECronExpression | string,
    MIN_ALLOWED_VIDEO_LENGTH: number,
    MAX_ALLOWED_VIDEO_LENGTH: number
};

const config: TConfig = {
    CRON_EXPRESSION: process.env.CRON_EXPRESSION || ECronExpression.EVERY_HOUR,
    MIN_ALLOWED_VIDEO_LENGTH: Number(process.env.MIN_ALLOWED_VIDEO_LENGTH) || 0,
    MAX_ALLOWED_VIDEO_LENGTH: Number(process.env.MAX_ALLOWED_VIDEO_LENGTH) || 60 * 60 * 4 // 4 hours in seconds
};

export default config;
