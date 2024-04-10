import axios from 'axios';
import { ICampaign } from '../../_shared';

export default async function fetchCampaigns() {
    try {
        const res = await axios.get('http://node-app:3000/api/v1/campaigns');
        const campaigns = res.data?.data?.campaigns as ICampaign[];
        if (!campaigns) {
            return [];
        }
        return campaigns;
    } catch (err) {
        console.error(err);
        return [];
    }
}
