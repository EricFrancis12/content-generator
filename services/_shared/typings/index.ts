

export enum EImageFileExtension {
    jpg = 'jpg',
    jpeg = 'jpeg',
    png = 'png',
    gif = 'gif'
};

export enum EVideoFileExtension {
    mp4 = 'mp4',
    avi = 'avi',
    mkv = 'mkv',
    mov = 'mov'
};

export interface ICampaign {
    _id: string,
    name: string,
    disabled?: boolean,
    options?: ICampaignOptions,
    intakeHistory: IIntakeHistoryItem[],
    outputHistory: IOutputHistoryItem[],
    source: {
        type: ESourceType,
        contentType: EContentType,
        externalId: string
    },
    filters: IFilter[],
    publishTo: IOutput[],
    _v?: string // DO NOT use this value for anything. This is defined here simply because mongo db adds the _v automatically.
};

export interface ICampaignOptions {
    minVideoLength?: number,
    maxVideoLength?: number,
    shortVideosOnly?: boolean,
    longVideosOnly?: boolean
};

export interface IFilter {
    name: TFilterName,
    base: IFIlterComponent,
    ingredient: IFIlterComponent,
    options: IFilterOptions
};

export type TFilterName = 'concatVideos' | 'overlayVideoOntoVideo' | 'overlayImageOntoVideo';

export interface IFIlterComponent {
    type: EFilterComponentType,
    contentType: EContentType,
    internalId: string,
    filterIndex: number
};

export interface IFilterOptions {
    // ...
};

export interface IOutput {

};

export interface IHistoryItem {
    externalId: string,
    _id?: string // Defining this as optional because in testing, mongo db adds the _id to all history items after pushing them to the array
};
export interface IIntakeHistoryItem extends IHistoryItem {
    // ...
};
export interface IOutputHistoryItem extends IHistoryItem {
    // ...
};

export enum ESourceType {
    INSTAGRAM = 'INSTAGRAM',
    TIKTOK = 'TIKTOK',
    YOUTUBE = 'YOUTUBE',
    REDDIT = 'REDDIT',
    CREATED_BY_FILTER = 'CREATED_BY_FILTER',
    READ_FROM_SAVED = 'READ_FROM_SAVED'
};

export enum EContentType {
    IMAGE = 'IMAGE',
    VIDEO = 'VIDEO',
    UNKNOWN = 'UNKNOWN'
};

export enum EFilterComponentType {
    SOURCE = 'SOURCE',
    SAVED = 'SAVED',
    TEMP = 'TEMP'
};

export enum EPublisherType {
    TIKTOK_ACCOUNT = 'TIKTOK_ACCOUNT',
    INSTAGRAM_ACCOUNT = 'INSTAGRAM_ACCOUNT',
    TELEGRAM_CHANNEL = 'TELEGRAM_CHANNEL',
    DOWNLOAD_TO_MACHINE = 'DOWNLOAD_TO_MACHINE'
};

export interface ISourceContent {
    sourceType: ESourceType,
    externalId: string
};
export interface ISourceImage extends ISourceContent {
    // ...
};
export interface ISourceVideo extends ISourceContent {
    // ...
};

export interface ISavedContent {
    sourceType: ESourceType,
    contentType: EContentType,
    path: string
};
export interface ISavedImage extends ISavedContent {
    // ...
};
export interface ISavedVideo extends ISavedContent {
    // ...
};

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
    contentPath: string,
    internalId: string
};

export type TRabbitMQQueue = 'download' | 'apply-filters' | 'publish';
