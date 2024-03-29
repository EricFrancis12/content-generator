import { basename } from 'path';
import { promises as fsPromises } from 'fs';
import { EContentType, ESourceType, ISavedContent } from '../../_shared';

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
    const filePaths = await getAllNestedFilePaths('./shared-file-system/source-content');
    return filePaths
        .map(filePath => {
            const dirNames = filePath.split('/');
            const contentType = dirNames.at(-2) === 'videos' ? EContentType.VIDEO : dirNames.at(-2) === 'images' ? EContentType.IMAGE : null;
            const sourceType = dirNames.at(-3) === 'Instagram' ? ESourceType.INSTAGRAM : dirNames.at(-3) === 'TikTok' ? ESourceType.TIKTOK : dirNames.at(-3) === 'YouTube' ? ESourceType.YOUTUBE : null;
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
    const result = savedContent.find(item => basename(item.path) === internalId);
    return result ?? null;
}
