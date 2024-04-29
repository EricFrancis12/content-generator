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
        res.status(500).json({
            success: false
        });
    }
}

export async function createOutputHistoryItem(req: Request, res: Response) {
    const { sourceType, contentType, externalId } = req.body;
    try {
        const outputHistory = await OutputHistoryItem.find({ campaign_id: req.params.campaign_id });
        const historyItemAlreadyExists = outputHistory.some(historyItem => {
            const sameSourceType = historyItem.sourceType === sourceType;
            const sameContentType = historyItem.contentType === contentType;
            const sameExternalId = historyItem.externalId === externalId;
            return sameSourceType && sameContentType && sameExternalId;
        });
        if (!historyItemAlreadyExists) {
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
        } else {
            res.status(200).json({
                success: true
            });
        }
    } catch (err) {
        res.status(500).json({
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
        res.status(500).json({
            success: false
        });
    }
}
