import crypto from 'crypto';
import { promises as fsPromises } from 'fs';
import { basename } from 'path';
import {
    EContentType, ESourceType, EOutputType, ICampaign, IOutput, ISavedContent,
    IFilter, EFilterComponentType, EFilterName, IFileSystemItem,
    EFileSystemItemType
} from '../../_shared';

export function boilerplateCampaign(): ICampaign {
    return {
        _id: '',
        name: '',
        disabled: false,
        source: {
            type: ESourceType.READ_FROM_SAVED,
            contentType: EContentType.VIDEO,
            externalId: ''
        },
        filters: [],
        publishTo: [],
        options: {}
    };
}

export function boilerplateFilter(): IFilter {
    return {
        name: EFilterName.overlayImageOntoVideo,
        base: {
            contentType: EContentType.VIDEO,
            filterIndex: 0,
            internalId: '',
            type: EFilterComponentType.SAVED
        },
        ingredient: {
            contentType: EContentType.VIDEO,
            filterIndex: 0,
            internalId: '',
            type: EFilterComponentType.SAVED
        },
        options: {}
    };
}

export function boilerplateOutput(): IOutput {
    return {
        _id: '',
        outputType: EOutputType.KEEP_SAVED,
        contentType: EContentType.VIDEO,
        externalId: '',
        disabled: false,
        options: {}
    };
}

export function generateInternalId(): string {
    return crypto.randomUUID();
}

export function getInternalIdFromSavedContentPath(filePath: string) {
    const fileName = basename(filePath);
    const splitOnDot = fileName.split('.');
    splitOnDot.pop();
    const internalId = splitOnDot.join('.');
    return internalId;
}

export function getFileExt(filename: string) {
    const splitOnDot = filename.split('.');
    const fileExt = splitOnDot[splitOnDot.length - 1];
    return fileExt.toLowerCase();
}

export async function copyFileToNewLocation(baseFilePath: string, newFilePath: string) {
    try {
        const fileContent = await fsPromises.readFile(baseFilePath);
        await fsPromises.writeFile(newFilePath, fileContent);
        return true;
    } catch (err) {
        return false;
    }
}

export async function getAllNestedFilePaths(dirPath: string) {
    const result: string[] = [];
    const dirContents = await fsPromises.readdir(dirPath);
    for (const item of dirContents) {
        const filePath = `${dirPath}/${item}`;
        const stats = await fsPromises.stat(filePath);
        if (stats.isDirectory()) {
            const items = await getAllNestedFilePaths(filePath);
            result.push(...items);
        } else {
            result.push(filePath);
        }
    }
    return result;
}

export async function nestedTraverseDir(dirPath: string, pointer?: IFileSystemItem[]): Promise<IFileSystemItem> {
    const dirName = basename(dirPath);
    const result: IFileSystemItem = {
        name: dirName,
        type: EFileSystemItemType.FOLDER,
        children: []
    };

    const dirContents = await fsPromises.readdir(dirPath);
    for (const item of dirContents) {
        const filePath = `${dirPath}/${item}`;
        const stats = await fsPromises.stat(filePath);
        let fileSystemItem: IFileSystemItem;
        if (stats.isDirectory()) {
            fileSystemItem = {
                name: item,
                type: EFileSystemItemType.FOLDER,
                children: []
            };
            await nestedTraverseDir(filePath, fileSystemItem.children);
        } else {
            const internalId = getInternalIdFromSavedContentPath(filePath);
            fileSystemItem = {
                name: item,
                type: EFileSystemItemType.FILE,
                internalId
            };
        }

        if (pointer) {
            pointer.push(fileSystemItem);
        } else {
            result.children?.push(fileSystemItem);
        }
    }
    return result;
}

export async function getSharedFileSystemModel(): Promise<IFileSystemItem> {
    return nestedTraverseDir('./shared-file-system');
}

export async function getSavedContent(): Promise<ISavedContent[]> {
    const sourceContentProm = getAllNestedFilePaths('./shared-file-system/source-content');
    const uploadedContentProm = getAllNestedFilePaths('./shared-file-system/uploaded-content');
    const WIPFiltersContentProm = getAllNestedFilePaths('./shared-file-system/WIP-filters-content');

    const sourceContent = await sourceContentProm;
    const uploadedContent = await uploadedContentProm;
    const WIPFiltersContent = await WIPFiltersContentProm;
    const filePaths = [...sourceContent, ...uploadedContent, ...WIPFiltersContent];

    return filePaths
        .map(filePath => {
            const dirNames = filePath.split('/');
            const contentType = dirNames.at(-2) === 'videos' ? EContentType.VIDEO : dirNames.at(-2) === 'images' ? EContentType.IMAGE : EContentType.UNKNOWN;
            const sourceType = dirNames.at(-3) === 'Instagram' ? ESourceType.INSTAGRAM : dirNames.at(-3) === 'TikTok' ? ESourceType.TIKTOK : dirNames.at(-3) === 'YouTube' ? ESourceType.YOUTUBE : ESourceType.READ_FROM_SAVED;
            return {
                sourceType: sourceType as ESourceType,
                contentType: contentType as EContentType,
                path: filePath
            };
        })
        .filter(item => !!item.sourceType && !!item.contentType);
}

export async function getSavedContentViaInternalId(internalId: string): Promise<ISavedContent | null> {
    const savedContent = await getSavedContent();
    const result = savedContent.find(item => {
        const _internalId = getInternalIdFromSavedContentPath(item.path);
        return _internalId === internalId;
    });
    return result ?? null;
}
