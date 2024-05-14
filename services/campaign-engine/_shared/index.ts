import _shared, {
    EServiceName, ESourceType, EContentType, ICampaign, ICampaignOptions, TDownloadQueueItem,
    ISourceContent, ISourceImage, ISourceVideo, IHistoryItem, IIntakeHistoryItem, ECronExpression
} from '../../_shared';

const shared = {
    ..._shared
};

export default shared;
export {
    EServiceName,
    ESourceType,
    EContentType,
    ICampaign,
    ICampaignOptions,
    TDownloadQueueItem,
    ISourceContent,
    ISourceImage,
    ISourceVideo,
    IHistoryItem,
    IIntakeHistoryItem,
    ECronExpression
};
