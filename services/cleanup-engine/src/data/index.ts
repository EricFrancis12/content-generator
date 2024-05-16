import axios from 'axios';
import { logger, formatErr } from '../config/loggers';
import _shared, { ICampaign, IIntakeHistoryItem, IOutputHistoryItem } from '../../_shared';
const { SERVICE_TOKEN } = _shared.constants;

export async function fetchCampaigns() {
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

export async function fetchIntakeHistory(campaign_id: string) {
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

export async function fetchOutputHistory(campaign_id: string) {
    try {
        const res = await axios.get(`http://api:3000/api/v1/campaigns/${campaign_id}/output-history`, {
            headers: {
                Authorization: `Bearer ${SERVICE_TOKEN}`
            }
        });
        const outputHistory = res.data?.data?.outputHistory as IOutputHistoryItem[];
        if (!outputHistory) {
            return [];
        }
        return outputHistory;
    } catch (err) {
        logger.error(formatErr(err));
        return [];
    }
}
