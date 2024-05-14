import _shared, { EServiceName } from '../../_shared';
const { initErrorLogger } = _shared.loggers;

export const errorLogger = initErrorLogger(EServiceName.CAMPAIGN_ENGINE);
