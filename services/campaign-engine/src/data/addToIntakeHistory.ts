import axios from 'axios';
import { IIntakeHistoryItem } from '../../_shared';

export default async function addToIntakeHistory(intakeHistoryItem: IIntakeHistoryItem) {
    const { campaign_id } = intakeHistoryItem;
    try {
        const res = await axios.post(`http://node-app:3000/api/v1/campaigns/${campaign_id}/intake-history`, intakeHistoryItem);
        if (res.status >= 300 || res.data?.success !== true) {
            return false;
        }
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}
