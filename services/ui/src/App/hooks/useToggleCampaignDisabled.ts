import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { selectauthToken } from '../store/reducers/authTokenReducer';
import { getCampaigns } from '../store/reducers/campaignsReducer';
import { ICampaign } from '../../_shared';
import { apiURL } from '../utils';

export default function useToggleCampaignDisabled(campaign: ICampaign) {
    const { value: authToken } = useAppSelector(selectauthToken);
    const dispatch = useAppDispatch();

    const [loading, setLoading] = useState(false);

    function toggleCampaignDisabled() {
        if (loading) return;
        if (!authToken) {
            toast.error('Auth token missing or invalid');
            return;
        }

        const endpoint = apiURL(`/api/v1/campaigns/${campaign._id}`);
        const body: ICampaign = {
            ...structuredClone(campaign),
            disabled: !campaign.disabled
        };

        setLoading(true);
        axios.patch(endpoint, body, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        })
            .then(res => {
                const { success } = res.data;
                if (success) {
                    toast.success('Campaign updated successfully');
                    dispatch(getCampaigns());
                } else {
                    throw new Error('Server was unable to update Campaign');
                }
            })
            .catch(() => toast.error('Error updating Campaign'))
            .finally(() => setLoading(false));
    }

    return {
        toggleCampaignDisabled,
        loading
    };
}
