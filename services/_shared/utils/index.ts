import { basename } from 'path';
import crypto from 'crypto';
import { promises as fsPromises } from 'fs';
import { EContentType, ESourceType, ISavedContent } from '../../_shared';

export function generateInternalId() {
    return crypto.randomUUID();
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
        const fileName = basename(item.path);
        const splitOnDot = fileName.split('.');
        splitOnDot.pop();
        return splitOnDot.join('.') === internalId;
    });
    return result ?? null;
}
