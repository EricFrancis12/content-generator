import express from 'express';
import { auth } from '../../../middleware/auth';
import { getAllLogs, getLog, createLog } from '../../../controllers/logsController';

const router = express.Router();

router
    .route('/:serviceName/logs')
    .get(auth, getAllLogs);

router
    .route('/:serviceName/logs/:logName')
    .get(auth, getLog)
    .post(createLog);

export default router;
