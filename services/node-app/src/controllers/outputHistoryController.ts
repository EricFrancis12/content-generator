import type { Request, Response } from 'express';
import OutputHistoryItem from '../models/OutputHistoryItem';

export async function getOutputHistory(req: Request, res: Response) {
    try {
        const outputHistory = await OutputHistoryItem.find({ campaign_id: req.params.campaign_id });
        res.status(200).json({
            success: true,
            data: {
                outputHistory
            }
        });
    } catch (err) {
        res.json({
            success: false
        });
    }
}

export async function createOutputHistoryItem(req: Request, res: Response) {
    try {
        const outputHistoryItem = await OutputHistoryItem.create({
            ...req.body,
            campaign_id: req.params.campaign_id
        });
        res.status(200).json({
            success: true,
            data: {
                outputHistoryItem
            }
        });
    } catch (err) {
        res.json({
            success: false
        });
    }
}

export async function deleteOutputHistory(req: Request, res: Response) {
    try {
        await OutputHistoryItem.deleteMany({ campaign_id: req.params.campaign_id });
        res.status(200).json({
            success: true
        });
    } catch (err) {
        res.json({
            success: false
        });
    }
}
