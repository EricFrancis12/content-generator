import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { selectauthToken } from '../../store/reducers/authTokenReducer';
import { getCampaigns } from '../../store/reducers/campaignsReducer';
import DefaultLayout from '../../layouts/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import CampaignEditor from '../../components/CampaignEditor';
import Button from '../../components/Button';
import _shared, { ICampaign } from '../../../_shared';
import { apiURL } from '../../utils';
const { boilerplateCampaign } = _shared.utils;

export default function NewCampaign() {
    const { value: authToken } = useAppSelector(selectauthToken);
    const dispatch = useAppDispatch();

    const [campaign, setCampaign] = useState<ICampaign | null>(boilerplateCampaign());
    const [loading, setLoading] = useState(false);

    function submitCampaign() {
        if (loading) return;
        if (!authToken) {
            toast.error('Auth token missing or invalid');
            return;
        }
        if (!campaign) {
            toast.error('Campaign missing or invalid');
            return;
        }

        const endpoint = apiURL(`/api/v1/campaigns`);

        setLoading(true);
        axios.post(endpoint, campaign, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        })
            .then(res => {
                const { success } = res.data;
                if (success) {
                    toast.success('Campaign created successfully');
                    dispatch(getCampaigns());
                    window.location.href = '/campaigns';
                } else {
                    throw new Error('Server was unable to create campaign');
                }
            })
            .catch(() => toast.error('Error creating Campaign'))
            .finally(() => setLoading(false));
    }

    return (
        <DefaultLayout>
            <Breadcrumb pageName='New Campaign' links={[{ text: ' Campaigns /', to: '/campaigns' }]} />
            <CampaignEditor campaign={campaign} setCampaign={setCampaign} />
            <div className='flex flex-col items-center gap-4 h-full w-full mt-2'>
                <Button
                    text='Submit'
                    icon={faCheck}
                    disabled={!campaign || loading}
                    onClick={submitCampaign}
                />
            </div>
        </DefaultLayout>
    )
}
