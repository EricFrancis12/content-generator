import React from 'react';
import { useParams } from 'react-router-dom';
import DefaultLayout from '../../layouts/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import useFetchCampaign from '../../hooks/useFetchCampaign';
import useCampaignHistory from '../../hooks/useCampaignHistory';

export default function ViewCampaign() {
    const { campaign_id } = useParams();
    const { campaign } = useFetchCampaign(campaign_id);

    const { history: intakeHistory } = useCampaignHistory(campaign?._id, 'intake');
    const { history: outputHistory } = useCampaignHistory(campaign?._id, 'output');

    console.log(campaign);
    console.log(intakeHistory);
    console.log(outputHistory);

    return (
        <DefaultLayout>
            <Breadcrumb pageName='Campaign' links={[{ text: ' Campaigns /', to: '/campaigns' }]} />
            <div>ViewCampaign</div>
        </DefaultLayout>
    )
}
