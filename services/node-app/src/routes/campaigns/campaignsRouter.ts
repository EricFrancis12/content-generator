import express from 'express';
import {
    getAllCampaigns, getCampaign, createCampaign,
    updateCampaign, deleteCampaign
} from '../../controllers/campaignsController';
import { createOutputHistoryItem, deleteOutputHistory, getOutputHistory } from '../../controllers/outputHistoryController';
import { createIntakeHistoryItem, deleteIntakeHistory, getIntakeHistory } from '../../controllers/intakeHistoryController';

const router = express.Router();

router
    .route('/')
    .get(getAllCampaigns)
    .post(createCampaign);

router
    .route('/:campaign_id')
    .get(getCampaign)
    .patch(updateCampaign)
    .delete(deleteCampaign);

router
    .route('/:campaign_id/intake-history')
    .get(getIntakeHistory)
    .post(createIntakeHistoryItem)
    .delete(deleteIntakeHistory);

router
    .route('/:campaign_id/output-history')
    .get(getOutputHistory)
    .post(createOutputHistoryItem)
    .delete(deleteOutputHistory);

export default router;
