import * as amqp from './amqp';
import * as constants from './constants';
import * as loggers from './loggers';
import * as typings from './typings';
import * as utils from './utils';
import {
    EServiceName, EImageFileExtension, EVideoFileExtension, ICampaign, ICampaignOptions, IOutput, TDownloadQueueItem,
    TFilterQueueItem, TPublishQueueItem, EFilterName, IFilter, IFIlterComponent, EFilterComponentType,
    TCorner, IFilterOptions, IConcatVideosOptions, IOverlayVideoOntoVideoOptions, IOverlayImageOntoVideoOptions,
    ISourceContent, ISourceImage, ISourceVideo, ISavedContent, ISavedImage, ISavedVideo,
    IHistoryItem, IIntakeHistoryItem, IOutputHistoryItem, TRabbitMQQueue, IQueue, TQueueHistory, TQueuesHistory,
    EContentType, ESourceType, EOutputType, ECronExpression, IFileSystemItem, EFileSystemItemType, IDiskSpace
} from './typings';

const _shared = {
    amqp,
    constants,
    loggers,
    utils,
    typings
};

export default _shared;
export {
    EServiceName,
    EImageFileExtension,
    EVideoFileExtension,
    EFilterName,
    EFilterComponentType,
    EContentType,
    ESourceType,
    EOutputType,
    ECronExpression,
    EFileSystemItemType
};
export type {
    ICampaign,
    ICampaignOptions,
    IOutput,
    TDownloadQueueItem,
    TFilterQueueItem,
    TPublishQueueItem,
    ISourceContent,
    ISourceImage,
    ISourceVideo,
    ISavedContent,
    ISavedImage,
    ISavedVideo,
    IHistoryItem,
    IIntakeHistoryItem,
    IOutputHistoryItem,
    IFilter,
    IFIlterComponent,
    TCorner,
    IFilterOptions,
    IConcatVideosOptions,
    IOverlayVideoOntoVideoOptions,
    IOverlayImageOntoVideoOptions,
    TRabbitMQQueue,
    IQueue,
    TQueueHistory,
    TQueuesHistory,
    IFileSystemItem,
    IDiskSpace
};
