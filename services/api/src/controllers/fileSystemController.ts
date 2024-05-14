import { Request, Response } from 'express';
import _shared from '../../_shared';
const { getSharedFileSystemModel } = _shared.utils;

export async function getFileSystemData(req: Request, res: Response) {
    try {
        const fileSystem = await getSharedFileSystemModel();
        res.status(200).json({
            success: true,
            data: {
                fileSystem
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false
        });
    }
}
