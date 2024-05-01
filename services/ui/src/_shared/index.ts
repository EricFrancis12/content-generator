import _shared, {
    ICampaign, IOutput, ESourceType, EContentType, EFilterName, EFilterComponentType, EOutputType,
    EImageFileExtension, EVideoFileExtension, IIntakeHistoryItem, IOutputHistoryItem,
    IFilterOptions, IConcatVideosOptions, IOverlayVideoOntoVideoOptions, IOverlayImageOntoVideoOptions
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
    IFilterOptions,
    IConcatVideosOptions,
    IOverlayVideoOntoVideoOptions,
    IOverlayImageOntoVideoOptions
};
