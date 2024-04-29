import { Request, Response } from 'express';
import checkDiskSpace from 'check-disk-space'

export async function getDiskSpace(req: Request, res: Response) {
    try {
        const result = await checkDiskSpace('/');
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (err) {
        res.status(500).json({
            success: false
        });
    }
}
