import axios from 'axios';
import { IIntakeHistoryItem } from '../../_shared';
import _shared from '../../_shared';
const { SERVICE_TOKEN } = _shared.constants;

export default async function fetchIntakeHistory(campaign_id: string) {
    try {
        const res = await axios.get(`http://node-app:3000/api/v1/campaigns/${campaign_id}/intake-history`, {
            headers: {
                Authorization: `Bearer ${SERVICE_TOKEN}`
            }
        });
        const intakeHistory = res.data?.data?.intakeHistory as IIntakeHistoryItem[];
        if (!intakeHistory) {
            return [];
        }
        return intakeHistory;
    } catch (err) {
        console.error(err);
        return [];
    }
}
