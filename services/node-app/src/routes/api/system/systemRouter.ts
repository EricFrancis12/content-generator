import express from 'express';
import { getDiskSpace } from '../../../controllers/systemController';

const router = express.Router();

router
    .route('/diskspace')
    .get(getDiskSpace);

export default router;
