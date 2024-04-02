import type { Request, Response } from 'express';
import IntakeHistoryItem from '../models/IntakeHistoryItem';

export async function getIntakeHistory(req: Request, res: Response) {
    try {
        const intakeHistory = await IntakeHistoryItem.find({ campaign_id: req.params.campaign_id });
        res.status(200).json({
            success: true,
            data: {
                intakeHistory
            }
        });
    } catch (err) {
        res.json({
            success: false
        });
    }
}

export async function createIntakeHistoryItem(req: Request, res: Response) {
    try {
        const intakeHistoryItem = await IntakeHistoryItem.create({
            ...req.body,
            campaign_id: req.params.campaign_id
        });
        res.status(200).json({
            success: true,
            data: {
                intakeHistoryItem
            }
        });
    } catch (err) {
        res.json({
            success: false
        });
    }
}

export async function deleteIntakeHistory(req: Request, res: Response) {
    try {
        await IntakeHistoryItem.deleteMany({ campaign_id: req.params.campaign_id });
        res.status(200).json({
            success: true
        });
    } catch (err) {
        res.json({
            success: false
        });
    }
}