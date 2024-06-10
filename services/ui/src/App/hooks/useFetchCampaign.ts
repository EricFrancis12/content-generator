import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { _storeSelector } from '../store/store';
import { ICampaign } from '../../_shared';
import { apiURL } from '../utils';

export default function useFetchCampaign(campaign_id?: string) {
    const authToken = _storeSelector(state => state.authToken).value;

    const [campaign, setCampaign] = useState<ICampaign | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(fetchCampaign, [campaign_id, authToken]);

    function fetchCampaign() {
        const controller = new AbortController();
        if (!campaign_id) {
            toast.error('No Campaign ID specified');
            return;
        }
        if (!authToken) {
            toast.error('Auth token missing or invalid');
            return;
        }

        setLoading(true);
        fetch(apiURL(`/api/v1/campaigns/${campaign_id}`), {
            headers: {
                Authorization: `Bearer ${authToken}`
            },
            signal: controller.signal
        })
            .then(res => res.json())
            .then(resJson => {
                if (resJson?.data?.campaign) {
                    setCampaign(resJson.data.campaign);
                } else {
                    toast.error('Error fetching Campaign');
                }
            })
            .catch(err => {
                if (typeof err === 'string' && err === 'AbortError') return;
                toast.error('Error fetching Campaign');
            })
            .finally(() => setLoading(false));

        return () => {
            setLoading(false);
            controller.abort('AbortError');
        };
    }

    return {
        campaign,
        setCampaign,
        fetchCampaign,
        loading,
        setLoading
    };
}
