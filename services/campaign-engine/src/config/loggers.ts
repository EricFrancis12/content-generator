import _shared, { EServiceName } from '../../_shared';
const { initLogger } = _shared.loggers;

export const logger = initLogger(EServiceName.CAMPAIGN_ENGINE);
