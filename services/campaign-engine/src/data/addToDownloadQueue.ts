import axios from 'axios';
import { logger, formatErr } from '../config/loggers';
import _shared, { TDownloadQueueItem } from '../../_shared';
const { SERVICE_TOKEN } = _shared.constants;

export default async function addToDownloadQueue(downloadQueueItem: TDownloadQueueItem) {
    try {
        const res = await axios.post('http://api:3000/api/v1/amqp/queues/download', downloadQueueItem, {
            headers: {
                Authorization: `Bearer ${SERVICE_TOKEN}`
            }
        });
        if (res.status >= 300 || res.data?.success !== true) {
            return false;
        }
        return true;
    } catch (err) {
        logger.error('Error adding item to download queue: ' + formatErr(err));
        return false;
    }
}
