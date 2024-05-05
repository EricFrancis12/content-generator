import { Request, Response } from 'express';
import os from 'os';
import checkDiskSpace, { DiskSpace } from 'check-disk-space';

export async function getDiskSpace(req: Request, res: Response) {
    try {
        let diskSpace: DiskSpace;
        const platform = os.platform();
        if (platform === 'win32') {
            diskSpace = await checkDiskSpace('C:\\');
        } else {
            diskSpace = await checkDiskSpace('/');
        }
        res.status(200).json({
            success: true,
            data: {
                diskSpace,
                platform
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false
        });
    }
}
