import { ECronExpression } from '../../_shared';

const oneDayMs = 1000 * 60 * 60 * 24;

type TConfig = {
    CRON_EXPRESSION: ECronExpression | string,
    MAX_FILE_AGE: number
};

const config: TConfig = {
    CRON_EXPRESSION: process.env.CRON_EXPRESSION || ECronExpression.EVERY_MINUTE,
    MAX_FILE_AGE: Number(process.env.MAX_FILE_AGE || oneDayMs) // default is one day in ms
};

export default config;
