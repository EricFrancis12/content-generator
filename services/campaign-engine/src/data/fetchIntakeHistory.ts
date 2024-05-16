import axios from 'axios';
import { logger, formatErr } from '../config/loggers';
import _shared, { IIntakeHistoryItem } from '../../_shared';
const { SERVICE_TOKEN } = _shared.constants;

export default async function fetchIntakeHistory(campaign_id: string) {
    try {
        const res = await axios.get(`http://api:3000/api/v1/campaigns/${campaign_id}/intake-history`, {
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
        logger.error(formatErr(err));
        return [];
    }
}
