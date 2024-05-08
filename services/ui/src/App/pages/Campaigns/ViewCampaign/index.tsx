import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { useAppSelector } from '../../../store/hooks';
import { selectCampaigns } from '../../../store/reducers/campaignsReducer';
import DefaultLayout from '../../../layouts/DefaultLayout';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import useFetchCampaign from '../../../hooks/useFetchCampaign';
import useCampaignHistory from '../../../hooks/useCampaignHistory';
import Button from '../../../components/Button';
import RefreshButton from '../../../components/RefreshButton';
import Loader from '../../../components/Loader';
import ToggleCampaignDisabled from './ToggleCampaignDisabled';
import History from './History';

export default function ViewCampaign() {
    const { campaign_id } = useParams();

    const { value: campaigns } = useAppSelector(selectCampaigns);
    const { campaign, fetchCampaign, loading } = useFetchCampaign(campaign_id);

    const { history: intakeHistory } = useCampaignHistory(campaign?._id, 'intake');
    const { history: outputHistory } = useCampaignHistory(campaign?._id, 'output');

    useEffect(() => fetchCampaign(), [campaigns]);

    return (
        <DefaultLayout>
            <Breadcrumb pageName={campaign?.name || 'Campaign'} links={[{ text: ' Campaigns /', to: '/campaigns' }]} />
            <div className='flex flex-col items-center gap-4 h-full w-full'>
                <div className='flex gap-4 w-full'>
                    <RefreshButton
                        disabled={loading}
                        onClick={() => fetchCampaign()}
                    />
                    {(campaign && !loading) &&
                        <Link to={`/campaigns/${campaign._id}/edit`}>
                            <Button
                                text='Edit Campaign'
                                icon={faEdit}
                            />
                        </Link>
                    }
                </div>
                {loading
                    ? <Loader />
                    : !campaign
                        ? 'Failed to fetch Campaign...'
                        : <>
                            <ToggleCampaignDisabled campaign={campaign} />
                            <div className='flex flex-wrap justify-center gap-4'>
                                <History history={intakeHistory} type='intake' />
                                <History history={outputHistory} type='output' />
                            </div>
                        </>
                }
            </div>
        </DefaultLayout>
    )
}
