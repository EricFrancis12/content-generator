import express from 'express';
import { getFileSystemData } from '../../../controllers/fileSystemController';

const router = express.Router();

router
    .route('/')
    .get(getFileSystemData);

export default router;
