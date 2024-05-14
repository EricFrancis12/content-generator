import { promises as fsPromises } from 'fs';
import { Request, Response } from 'express';
import _shared, { EContentType } from '../../_shared';
const { getSavedContent, getSavedContentViaInternalId } = _shared.utils;

export async function getAllContent(req: Request, res: Response) {
    try {
        const allContent = await getSavedContent();
        const result = allContent
            .map(content => {
                const contentType = content.contentType === EContentType.VIDEO ? 'videos' : content.contentType === EContentType.IMAGE ? 'images' : null;
                const internalId = content.path.split('/').at(-1)?.split('.').at(0);
                return {
                    ...content,
                    internalId,
                    url: contentType && internalId ? `/api/v1/content/${contentType}/${internalId}` : null
                };
            })
            .filter(a => !!a.url);
        res.status(200).json({
            success: true,
            data: {
                content: result
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false
        });
    }
}

export async function getContent(req: Request, res: Response) {
    const { internalId } = req.params;
    const { dl } = req.query;
    try {
        const savedContent = await getSavedContentViaInternalId(internalId);
        if (!savedContent) {
            return res.status(404).json({
                success: false,
                message: 'Content not found'
            });
        }
        if (dl === '1') {
            res.setHeader('Content-Disposition', 'attachment');
        }
        res.status(200).sendFile(savedContent.path, { root: './' });
    } catch (err) {
        res.status(500).json({
            success: false
        });
    }
}

export async function downloadContentToBrowser(req: Request, res: Response) {
    const { internalId } = req.params;
    try {
        const savedContent = await getSavedContentViaInternalId(internalId);
        if (!savedContent) {
            return res.status(404).json({
                success: false,
                message: 'Content not found'
            });
        }
        res.status(200).setHeader('Content-Disposition', 'attachment').sendFile(savedContent.path, { root: './' });
    } catch (err) {
        res.status(500).json({
            success: false
        });
    }
}

export async function getAllImages(req: Request, res: Response) {
    try {
        const allContent = await getSavedContent();
        const images = allContent
            .filter(content => content.contentType === EContentType.IMAGE)
            .map(image => {
                const internalId = image.path.split('/').at(-1)?.split('.').at(0);
                return {
                    ...image,
                    internalId,
                    url: internalId ? `/api/v1/content/images/${internalId}` : null
                };
            })
            .filter(a => !!a.url);
        res.status(200).json({
            success: true,
            data: {
                images
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false
        });
    }
}

export async function uploadImage(req: Request, res: Response) {
    try {
        const splitOnDot = req.file?.filename?.split('.');
        splitOnDot?.pop();
        const internalId = splitOnDot?.join('.');
        if (!internalId) {
            return res.status(400).json({
                success: false,
                message: 'Internal ID missing'
            });
        }
        const image = await getSavedContentViaInternalId(internalId);
        if (!image || image.contentType !== EContentType.IMAGE) {
            return res.status(404).json({
                success: false,
                message: 'Image not found'
            });
        }
        res.status(200).json({
            success: true,
            data: {
                image: {
                    ...image,
                    internalId,
                    url: `/api/v1/content/images/${internalId}`
                }
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false
        });
    }
}

export async function getImage(req: Request, res: Response) {
    const { internalId } = req.params;
    const { dl } = req.query;
    try {
        const image = await getSavedContentViaInternalId(internalId);
        if (!image || image.contentType !== EContentType.IMAGE) {
            return res.status(404).json({
                success: false,
                message: 'Image not found'
            });
        }
        if (dl === '1') {
            res.setHeader('Content-Disposition', 'attachment');
        }
        res.status(200).sendFile(image.path, { root: './' });
    } catch (err) {
        res.status(500).json({
            success: false
        });
    }
}

export async function downloadImageToBrowser(req: Request, res: Response) {
    const { internalId } = req.params;
    try {
        const image = await getSavedContentViaInternalId(internalId);
        if (!image || image.contentType !== EContentType.IMAGE) {
            return res.status(404).json({
                success: false,
                message: 'Image not found'
            });
        }
        res.status(200).setHeader('Content-Disposition', 'attachment').sendFile(image.path, { root: './' });
    } catch (err) {
        res.status(500).json({
            success: false
        });
    }
}

export async function deleteImage(req: Request, res: Response) {
    const { internalId } = req.params;
    try {
        const image = await getSavedContentViaInternalId(internalId);
        if (!image || image.contentType !== EContentType.IMAGE) {
            return res.status(404).json({
                success: false,
                message: 'Image not found'
            });
        }
        await fsPromises.unlink(image.path);
        res.status(200).json({
            success: true
        });
    } catch (err) {
        res.status(500).json({
            success: false
        });
    }
}

export async function getAllVideos(req: Request, res: Response) {
    try {
        const allContent = await getSavedContent();
        const videos = allContent
            .filter(content => content.contentType === EContentType.VIDEO)
            .map(video => {
                const internalId = video.path.split('/').at(-1)?.split('.').at(0);
                return {
                    ...video,
                    internalId,
                    url: internalId ? `/api/v1/content/videos/${internalId}` : null
                };
            })
            .filter(a => !!a.url);
        res.status(200).json({
            success: true,
            data: {
                videos
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false
        });
    }

}

export async function uploadVideo(req: Request, res: Response) {
    try {
        const splitOnDot = req.file?.filename?.split('.');
        splitOnDot?.pop();
        const internalId = splitOnDot?.join('.');
        if (!internalId) {
            return res.status(400).json({
                success: false,
                message: 'Internal ID missing'
            });
        }
        const video = await getSavedContentViaInternalId(internalId);
        if (!video || video.contentType !== EContentType.VIDEO) {
            return res.status(404).json({
                success: false,
                message: 'Video not found'
            });
        }
        res.status(200).json({
            success: true,
            data: {
                video: {
                    ...video,
                    internalId,
                    url: `/api/v1/content/videos/${internalId}`
                }
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false
        });
    }
}

export async function getVideo(req: Request, res: Response) {
    const { internalId } = req.params;
    const { dl } = req.query;
    try {
        const video = await getSavedContentViaInternalId(internalId);
        if (!video || video.contentType !== EContentType.VIDEO) {
            return res.status(404).json({
                success: false,
                message: 'Video not found'
            });
        }
        if (dl === '1') {
            res.setHeader('Content-Disposition', 'attachment');
        }
        res.status(200).sendFile(video.path, { root: './' });
    } catch (err) {
        res.status(500).json({
            success: false
        });
    }
}

export async function downloadVideoToBrowser(req: Request, res: Response) {
    const { internalId } = req.params;
    try {
        const video = await getSavedContentViaInternalId(internalId);
        if (!video || video.contentType !== EContentType.VIDEO) {
            return res.status(404).json({
                success: false,
                message: 'Video not found'
            });
        }
        res.status(200).setHeader('Content-Disposition', 'attachment').sendFile(video.path, { root: './' });
    } catch (err) {
        res.status(500).json({
            success: false
        });
    }
}

export async function deleteVideo(req: Request, res: Response) {
    const { internalId } = req.params;
    try {
        const video = await getSavedContentViaInternalId(internalId);
        if (!video || video.contentType !== EContentType.VIDEO) {
            return res.status(404).json({
                success: false,
                message: 'Video not found'
            });
        }
        await fsPromises.unlink(video.path);
        res.status(200).json({
            success: true
        });
    } catch (err) {
        res.status(500).json({
            success: false
        });
    }
}

export async function deleteContent(req: Request, res: Response) {
    const { internalId } = req.params;
    try {
        const content = await getSavedContentViaInternalId(internalId);
        if (!content) {
            return res.status(404).json({
                success: false,
                message: 'Content not found'
            });
        }
        await fsPromises.unlink(content.path);
        res.status(200).json({
            success: true
        });
    } catch (err) {
        res.status(500).json({
            success: false
        });
    }
}
