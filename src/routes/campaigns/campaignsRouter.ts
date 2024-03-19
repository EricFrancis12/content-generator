import express from 'express';
import {
    getAllCampaigns, getCampaign, createCampaign,
    updateCampaign, deleteCampaign
} from '../../controllers/campaignsController';

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

export default router;
