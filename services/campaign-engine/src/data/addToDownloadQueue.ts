import axios from 'axios';
import { TDownloadQueueItem } from '../../_shared';

export default async function addToDownloadQueue(downloadQueueItem: TDownloadQueueItem) {
    try {
        const res = await axios.post('http://node-app:3000/api/v1/amqp/queues/download', downloadQueueItem);
        if (res.status >= 300 || res.data?.success !== true) {
            return false;
        }
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}
