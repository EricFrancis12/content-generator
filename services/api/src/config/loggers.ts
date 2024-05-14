import _shared, { EServiceName } from '../../_shared';
const { initErrorLogger, initInfoLogger } = _shared.loggers;

export const errorLogger = initErrorLogger(EServiceName.API);

export const infoLogger = initInfoLogger(EServiceName.API);
