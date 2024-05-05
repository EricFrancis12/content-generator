import _shared, {
    ICampaign, IOutput, ESourceType, EContentType, EFilterName, EFilterComponentType, EOutputType,
    EImageFileExtension, EVideoFileExtension, IIntakeHistoryItem, IOutputHistoryItem,
    TCorner, IFilterOptions, IConcatVideosOptions, IOverlayVideoOntoVideoOptions, IOverlayImageOntoVideoOptions,
    IFileSystemItem, EFileSystemItemType, IDiskSpace
} from '../../../_shared';

const shared = {
    ..._shared
};

export default shared;
export {
    ICampaign,
    IOutput,
    ESourceType,
    EContentType,
    EFilterName,
    EFilterComponentType,
    EOutputType,
    EImageFileExtension,
    EVideoFileExtension,
    IIntakeHistoryItem,
    IOutputHistoryItem,
    TCorner,
    IFilterOptions,
    IConcatVideosOptions,
    IOverlayVideoOntoVideoOptions,
    IOverlayImageOntoVideoOptions,
    IFileSystemItem,
    EFileSystemItemType,
    IDiskSpace
};
