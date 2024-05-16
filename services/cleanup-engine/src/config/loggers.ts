import _shared, { EServiceName } from '../../_shared';
const { initLogger, formatErr } = _shared.loggers;

export const logger = initLogger(EServiceName.CLEANUP_ENGINE);

export { formatErr };
