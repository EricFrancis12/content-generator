import axios from 'axios';
import { IIntakeHistoryItem } from '../../_shared';
import _shared from '../../_shared';
const { SERVICE_TOKEN } = _shared.constants;

export default async function addToIntakeHistory(intakeHistoryItem: IIntakeHistoryItem) {
    const { campaign_id } = intakeHistoryItem;
    try {
        const res = await axios.post(`http://api:3000/api/v1/campaigns/${campaign_id}/intake-history`, intakeHistoryItem, {
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
