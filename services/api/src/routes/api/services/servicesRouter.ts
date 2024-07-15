import express from 'express';
import { auth } from '../../../middleware/auth';
import { getAllLogs, getAllLogsByServiceName, getLog, createLog, deleteLog, downloadLog } from '../../../controllers/logsController';

const router = express.Router();

router
    .route('/logs')
    .get(auth, getAllLogs);

router
    .route('/:serviceName/logs')
    .get(auth, getAllLogsByServiceName);

router
    .route('/:serviceName/logs/:logLevel')
    .post(createLog)
    .get(auth, getLog)
    .delete(auth, deleteLog);

router
    .route('/:serviceName/logs/:logLevel/download')
    .get(auth, downloadLog);

export default router;
