import Campaign from '../models/Campaign';
import type { Request, Response } from 'express';

export async function getAllCampaigns(req: Request, res: Response) {
    try {
        const campaigns = await Campaign.find();
        res.status(200).json({
            success: true,
            data: {
                campaigns
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false
        });
    }
}

export async function getCampaign(req: Request, res: Response) {
    try {
        const campaign = await Campaign.findById(req.params.campaign_id);
        res.status(200).json({
            success: true,
            data: {
                campaign
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false
        });
    }
}

export async function createCampaign(req: Request, res: Response) {
    try {
        const bodyClone = { ...req.body };
        delete bodyClone._id;
        const campaign = await Campaign.create(bodyClone);
        res.status(201).json({
            success: true,
            data: {
                campaign
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false
        });
    }
}

export async function updateCampaign(req: Request, res: Response) {
    try {
        const campaign = await Campaign.findByIdAndUpdate(req.params.campaign_id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({
            success: true,
            data: {
                campaign
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false
        });
    }
}

export async function deleteCampaign(req: Request, res: Response) {
    try {
        await Campaign.findByIdAndDelete(req.params.campaign_id);
        res.status(200).json({
            success: true
        });
    } catch (err) {
        res.status(500).json({
            success: false
        });
    }
}
