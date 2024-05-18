import _shared, {
    EServiceName, TRabbitMQQueue, TDownloadQueueItem, TFilterQueueItem, TPublishQueueItem, ISavedImage, ISavedVideo,
    EContentType, ESourceType
} from '../../_shared';

const shared = {
    ..._shared
};

export default shared;
export {
    EServiceName,
    TRabbitMQQueue,
    TDownloadQueueItem,
    TFilterQueueItem,
    TPublishQueueItem,
    ISavedImage,
    ISavedVideo,
    EContentType,
    ESourceType
};
