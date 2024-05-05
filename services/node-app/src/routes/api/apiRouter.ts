import express, { Request, Response } from 'express';
import { auth } from '../../middleware/auth';
import amqpRouter from './amqp/amqpRouter';
import campaignsRouter from './campaigns/campaignsRouter';
import contentRouter from './content/contentRouter';
import fileSystemRouter from './file-system/fileSystemRouter';

const router = express.Router();

router.use('/v1/amqp', auth, amqpRouter);
router.use('/v1/campaigns', auth, campaignsRouter);
router.use('/v1/content', auth, contentRouter);
router.use('/v1/file-system', auth, fileSystemRouter);

router.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: 'Not found'
    })
});

export default router;
