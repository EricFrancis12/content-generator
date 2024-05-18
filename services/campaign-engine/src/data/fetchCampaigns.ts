import axios from 'axios';
import { logger, formatErr } from '../config/loggers';
import _shared, { ICampaign } from '../../_shared';
const { SERVICE_TOKEN } = _shared.constants;

export default async function fetchCampaigns() {
    try {
        const res = await axios.get('http://api:3000/api/v1/campaigns', {
            headers: {
                Authorization: `Bearer ${SERVICE_TOKEN}`
            }
        });
        const campaigns = res.data?.data?.campaigns as ICampaign[];
        if (!campaigns) {
            return [];
        }
        return campaigns;
    } catch (err) {
        logger.error(formatErr(err));
        return [];
    }
}
