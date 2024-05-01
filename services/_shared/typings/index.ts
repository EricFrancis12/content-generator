

export enum EImageFileExtension {
    jpg = 'jpg',
    jpeg = 'jpeg',
    png = 'png',
    gif = 'gif'
}

export enum EVideoFileExtension {
    mp4 = 'mp4',
    avi = 'avi',
    mkv = 'mkv',
    mov = 'mov'
}

export interface ICampaign {
    _id: string,
    name: string,
    disabled?: boolean,
    options?: ICampaignOptions,
    source: {
        type: ESourceType,
        contentType: EContentType,
        externalId: string
    },
    filters: IFilter[],
    publishTo: IOutput[],
    _v?: string // DO NOT use this value for anything. This is defined here simply because mongo db adds the _v automatically.
}

export interface ICampaignOptions {
    minVideoLength?: number,
    maxVideoLength?: number,
    shortVideosOnly?: boolean,
    longVideosOnly?: boolean
}

export interface IFilter {
    name: EFilterName,
    base: IFIlterComponent,
    ingredient: IFIlterComponent,
    options: IFilterOptions
}

export enum EFilterName {
    concatVideos = 'concatVideos',
    overlayVideoOntoVideo = 'overlayVideoOntoVideo',
    overlayImageOntoVideo = 'overlayImageOntoVideo'
}

export interface IFIlterComponent {
    type: EFilterComponentType,
    contentType: EContentType,
    internalId: string,
    filterIndex: number
}

export interface IFilterOptions {
    // ...
}

export interface IConcatVideosOptions extends IFilterOptions {
    // ...
}

export type TCorner = 'upper-left' | 'upper-right' | 'lower-left' | 'lower-right';

export interface IOverlayVideoOntoVideoOptions extends IFilterOptions {
    x?: number,
    y?: number,
    corner?: TCorner,
    scaleIngredientRelativeToSelf?: number,
    scaleIngredientRelativeToBase?: number,
    trimTo?: number
}

export interface IOverlayImageOntoVideoOptions extends IFilterOptions {
    x?: number,
    y?: number,
    corner?: TCorner,
    scaleIngredientRelativeToSelf?: number,
    scaleIngredientRelativeToBase?: number
}

export interface IOutput {
    _id: string,
    outputType: EOutputType,
    contentType: EContentType,
    externalId: string,
    disabled?: boolean,
    options?: IOutputOptions
}

export enum EOutputType {
    KEEP_SAVED = 'KEEP_SAVED',
    SEND_CONTENT_TO_TELEGRAM_CHANNEL = 'SEND_CONTENT_TO_TELEGRAM_CHANNEL',
    SEND_MESSAGE_TO_TELEGRAM_CHANNEL = 'SEND_MESSAGE_TO_TELEGRAM_CHANNEL'
}

export interface IOutputOptions {
    message?: string
}

export interface IHistoryItem {
    sourceType: ESourceType,
    contentType: EContentType,
    campaign_id: string,
    externalId: string
}
export interface IIntakeHistoryItem extends IHistoryItem {
    // ...
}
export interface IOutputHistoryItem extends IHistoryItem {
    outputType: EOutputType,
    timestamp: number
}

export enum ESourceType {
    INSTAGRAM = 'INSTAGRAM',
    TIKTOK = 'TIKTOK',
    YOUTUBE = 'YOUTUBE',
    REDDIT = 'REDDIT',
    CREATED_BY_FILTER = 'CREATED_BY_FILTER',
    READ_FROM_SAVED = 'READ_FROM_SAVED'
}

export enum EContentType {
    IMAGE = 'IMAGE',
    VIDEO = 'VIDEO',
    UNKNOWN = 'UNKNOWN'
}

export enum EFilterComponentType {
    SOURCE = 'SOURCE',
    SAVED = 'SAVED',
    TEMP = 'TEMP'
}

export interface ISourceContent {
    sourceType: ESourceType,
    externalId: string
}
export interface ISourceImage extends ISourceContent {
    // ...
}
export interface ISourceVideo extends ISourceContent {
    // ...
}

export interface ISavedContent {
    sourceType: ESourceType,
    contentType: EContentType,
    path: string
}
export interface ISavedImage extends ISavedContent {
    // ...
}
export interface ISavedVideo extends ISavedContent {
    // ...
}

export type TDownloadQueueItem = {
    campaign_id: string,
    sourceType: ESourceType,
    contentType: EContentType,
    externalId: string,
    filters: IFilter[],
    publishTo: IOutput[]
};

export type TFilterQueueItem = {
    campaign_id: string,
    sourceType: ESourceType,
    contentType: EContentType,
    externalId: string,
    filters: IFilter[],
    publishTo: IOutput[],
    contentPath: string
};

export type TPublishQueueItem = {
    campaign_id: string,
    sourceType: ESourceType,
    contentType: EContentType,
    externalId: string,
    filters: IFilter[],
    publishTo: IOutput[],
    contentPath: string
};

export type TRabbitMQQueue = 'download' | 'apply-filters' | 'publish';

export enum ECronExpression {
    EVERY_MINUTE = '* * * * *',
    EVERY_TWO_MINUTES = '*/2 * * * *',
    EVERY_HOUR = '0 * * * *', // At the beginning of every hour
    EVERY_DAY = '0 0 * * *' // At midnight every day
}
