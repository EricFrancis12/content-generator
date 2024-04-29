import express from 'express';
import upload from '../../../middleware/upload';
import {
    getAllContent, getContent, getAllImages, uploadImage, getImage, deleteImage,
    getAllVideos, uploadVideo, getVideo, deleteVideo, deleteContent
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
    .route('/videos')
    .get(getAllVideos)
    .post(upload.single('video'), uploadVideo);

router
    .route('/videos/:internalId')
    .get(getVideo)
    .delete(deleteVideo);

router
    .route('/:internalId')
    .get(getContent)
    .delete(deleteContent);

export default router;
