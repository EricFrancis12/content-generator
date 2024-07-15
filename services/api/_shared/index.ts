import _shared, {
    EServiceName, ESourceType, EContentType, EOutputType, TRabbitMQQueue, IQueue,
    EImageFileExtension, EVideoFileExtension, IDiskSpace, TLogData, TLog
} from '../../_shared';

const shared = {
    ..._shared
};

export default shared;
export {
    EServiceName,
    ESourceType,
    EContentType,
    EOutputType,
    TRabbitMQQueue,
    IQueue,
    EImageFileExtension,
    EVideoFileExtension,
    IDiskSpace,
    TLogData,
    TLog
};
