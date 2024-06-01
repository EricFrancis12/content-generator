import crypto from 'crypto';
import { promises as fsPromises } from 'fs';
import { IgApiClient } from 'instagram-private-api';
import { takeScreenshotOfVideo } from '.';
import _shared from '../../_shared';
const { getSavedContentViaInternalId } = _shared.utils;

type TInstagramInput = {
    username: string,
    password: string,
    description?: string,
    path: string
};

type TInstagramVideoInput = TInstagramInput & {
    coverImageInternalId?: string
};

export async function postImageToInstagramAccount({
    username,
    password,
    description = '',
    path
}: TInstagramInput) {
    try {
        const ig = new IgApiClient();
        ig.state.generateDevice(username);
        await ig.account.login(username, password);

        const imageBuffer = await fsPromises.readFile(path);

        await ig.publish.photo({
            file: imageBuffer,
            caption: description
        });
    } catch (err) {
        console.error(err);
        return false;
    }
    return true;
}

export async function postVideoToInstagramAccount({
    username,
    password,
    description = '',
    path,
    coverImageInternalId
}: TInstagramVideoInput) {
    try {
        const ig = new IgApiClient();
        ig.state.generateDevice(username);
        await ig.account.login(username, password);

        let coverImagePath = coverImageInternalId
            ? (await getSavedContentViaInternalId(coverImageInternalId))?.path || null
            : null;

        if (!coverImagePath) {
            const outputPath = `../../shared-file-system/WIP-filters-content/temp/screenshot-${crypto.randomUUID()}.jpg`;
            const screenshotImage = await takeScreenshotOfVideo(path, outputPath);
            if (screenshotImage) {
                coverImagePath = screenshotImage.path;
            } else {
                return false;
            }
        }

        const videoBufferProm = fsPromises.readFile(path);
        const imageBufferProm = fsPromises.readFile(coverImagePath);

        const videoBuffer = await videoBufferProm;
        const imageBuffer = await imageBufferProm;

        await ig.publish.video({
            video: videoBuffer,
            coverImage: imageBuffer,
            caption: description
        });
    } catch (err) {
        console.error(err);
        return false;
    }
    return true;
}
