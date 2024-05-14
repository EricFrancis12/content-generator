import buildConfigJson from '../build.config.json';

type TBuildConfig = {
    SERVICE_TOKEN?: string,
    DISABLE_LOG_FILES?: boolean
};

const buildConfig: TBuildConfig = buildConfigJson;

export const SERVICE_TOKEN: string | null = buildConfig.SERVICE_TOKEN || null;
export const DISABLE_LOG_FILES: boolean | undefined = buildConfig.DISABLE_LOG_FILES;
