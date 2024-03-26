

export interface ICampaign {
    _id: string,
    name: string,
    disabled?: boolean,
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

export interface IFilter {
    name: string,
    base: {
        type: EFilterComponentType,
        content_id: string,
        filterIndex: number
    },
    ingredient: {
        type: EFilterComponentType,
        content_id: string,
        filterIndex: number
    },
    options: TFilterOptions
};

export type TFilterOptions = {
    [key: string]: any
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
    YOUTUBE = 'YOUTUBE'
};

export enum EContentType {
    IMAGE = 'IMAGE',
    VIDEO = 'VIDEO'
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

export type TSourceContent = {
    sourceType: ESourceType,
    externalId: string
};
export type TSourceImage = TSourceContent;
export type TSourceVideo = TSourceContent;

export type TDownloadQueueItem = {
    campaign_id: string,
    sourceType: ESourceType,
    contentType: EContentType,
    externalId: string,
    filters: IFilter[],
    publishTo: IOutput[]
};

