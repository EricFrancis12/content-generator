import crypto from 'crypto';
import fs, { promises as fsPromises } from 'fs';
import { basename } from 'path';
import {
    EContentType, ESourceType, EOutputType, ICampaign, IOutput, ISavedContent,
    IFilter, EFilterComponentType, EFilterName, IFileSystemItem,
    EFileSystemItemType, EImageFileExtension, EVideoFileExtension
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
        outputType: EOutputType.KEEP_SAVED,
        contentType: EContentType.VIDEO,
        externalId: '',
        disabled: false,
        options: {}
    };
}

export function bytesToGB(bytes: number) {
    return bytes / 1000 / 1000 / 1000;
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

export function getContentTypeFromFileExt(fileExt: string | EImageFileExtension | EVideoFileExtension) {
    const _fileExt = fileExt as string;
    const imageFileExtensions = Object.values(EImageFileExtension) as string[];
    const videoFileExtensions = Object.values(EVideoFileExtension) as string[];
    if (imageFileExtensions.includes(_fileExt)) {
        return EContentType.IMAGE;
    } else if (videoFileExtensions.includes(_fileExt)) {
        return EContentType.VIDEO;
    }
    return EContentType.UNKNOWN;
}

export function getSourceTypeFromFilePath(filePath: string) {
    const dirNames = filePath.split('/');
    const sourceTypeImpliedByDir = dirNames.at(-3);
    const sourceTypesLowercase: string[] = Object.keys(ESourceType).map(key => key.toLowerCase());
    if (sourceTypeImpliedByDir && sourceTypesLowercase.includes(sourceTypeImpliedByDir.toLowerCase())) {
        return ESourceType[sourceTypeImpliedByDir.toUpperCase() as ESourceType];
    }
    return ESourceType.READ_FROM_SAVED;
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
    const filePaths = await getAllNestedFilePaths('./shared-file-system');
    return filePaths.map(filePath => {
        const fileExt = getFileExt(filePath);
        const contentType = getContentTypeFromFileExt(fileExt);
        const sourceType = getSourceTypeFromFilePath(filePath);
        return {
            sourceType,
            contentType,
            path: filePath
        };
    });
}

export async function getSavedContentViaInternalId(internalId: string): Promise<ISavedContent | null> {
    const savedContent = await getSavedContent();
    const result = savedContent.find(item => {
        const _internalId = getInternalIdFromSavedContentPath(item.path);
        return _internalId === internalId;
    });
    return result ?? null;
}

export async function readLogFile(filePath: string): Promise<{ [key: string]: string }[]> {
    if (fs.existsSync(filePath)) {
        const logFileContent = await fsPromises.readFile(filePath, { encoding: 'utf8' });
        return logFileContent
            .split('\n')
            .filter(line => !!line)
            .map(line => {
                try {
                    return JSON.parse(line);
                } catch (err) {
                    return {};
                }
            });
    }
    return [];
}

export function formatErr(err: unknown) {
    if (err instanceof Error) {
        return err.message;
    } else if (typeof err === 'string') {
        return err;
    }
    return 'Unknown Error';
}
