import axios from 'axios';
import { TDownloadQueueItem } from '../../_shared';
import _shared from '../../_shared';
const { SERVICE_TOKEN } = _shared.constants;

export default async function addToDownloadQueue(downloadQueueItem: TDownloadQueueItem) {
    try {
        const res = await axios.post('http://node-app:3000/api/v1/amqp/queues/download', downloadQueueItem, {
            headers: {
                Authorization: `Bearer ${SERVICE_TOKEN}`
            }
        });
        if (res.status >= 300 || res.data?.success !== true) {
            return false;
        }
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}
