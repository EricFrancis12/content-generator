import React from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { selectauthToken } from '../../store/reducers/authTokenReducer';
import { getCampaigns } from '../../store/reducers/campaignsReducer';
import useFetchCampaign from '../../hooks/useFetchCampaign';
import DefaultLayout from '../../layouts/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import CampaignEditor from '../../components/CampaignEditor';
import Button from '../../components/Button';
import { apiURL } from '../../utils';

export default function EditCampaign() {
    const { value: authToken } = useAppSelector(selectauthToken);
    const dispatch = useAppDispatch();

    const { campaign_id } = useParams();
    const { campaign, setCampaign, loading, setLoading } = useFetchCampaign(campaign_id);

    function saveCampaign() {
        if (loading) return;
        if (!authToken) {
            toast.error('Auth token missing or invalid');
            return;
        }
        if (!campaign) {
            toast.error('Campaign missing or invalid');
            return;
        }

        const endpoint = apiURL(`/api/v1/campaigns/${campaign._id}`);

        setLoading(true);
        axios.patch(endpoint, campaign, {
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
                    throw new Error('Server was unable to update campaign');
                }
            })
            .catch(() => toast.error('Error updating Campaign'))
            .finally(() => setLoading(false));
    }

    return (
        <DefaultLayout>
            <Breadcrumb
                pageName='Edit Campaign'
                links={[
                    { text: ' Campaigns /', to: '/campaigns' },
                    { text: ` ${campaign?.name || 'Campaign'} /`, to: `/campaigns/${campaign?._id || ''}` }
                ]}
            />
            <CampaignEditor campaign={campaign} setCampaign={setCampaign} />
            <div className='flex flex-col items-center gap-4 h-full w-full mt-2'>
                {campaign &&
                    <Button
                        text='Save'
                        icon={faSave}
                        disabled={!campaign || loading}
                        onClick={saveCampaign}
                    />
                }
            </div>
        </DefaultLayout>
    )
}
