import express from 'express';
import upload from '../../../middleware/upload';
import {
    getAllContent, getContent, downloadContentToBrowser, getAllImages, uploadImage, getImage, downloadImageToBrowser, deleteImage,
    getAllVideos, uploadVideo, getVideo, downloadVideoToBrowser, deleteVideo, deleteContent
} from '../../../controllers/contentController';

const router = express.Router();

router
    .route('/')
    .get(getAllContent);

router
    .route('/images')
    .get(getAllImages)
    .post(upload.single('image'), uploadImage);

router
    .route('/images/:internalId')
    .get(getImage)
    .delete(deleteImage);

router
    .route('/images/:internalId/dl')
    .get(downloadImageToBrowser);

router
    .route('/videos')
    .get(getAllVideos)
    .post(upload.single('video'), uploadVideo);

router
    .route('/videos/:internalId')
    .get(getVideo)
    .delete(deleteVideo);

router
    .route('/videos/:internalId/dl')
    .get(downloadVideoToBrowser);

router
    .route('/:internalId')
    .get(getContent)
    .delete(deleteContent);

router
    .route('/:internalId/dl')
    .get(downloadContentToBrowser);

export default router;
