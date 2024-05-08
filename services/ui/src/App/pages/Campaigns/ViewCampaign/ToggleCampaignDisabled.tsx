import React, { useState, useEffect } from 'react';
import useToggleCampaignDisabled from '../../../hooks/useToggleCampaignDisabled';
import ToggleButtonWithLoader from '../../../components/ToggleButtonWithLoader';
import { ICampaign } from '../../../../_shared';

export default function ToggleCampaignDisabled({ campaign }: {
    campaign: ICampaign
}) {
    const { toggleCampaignDisabled, loading } = useToggleCampaignDisabled(campaign);

    const [active, setActive] = useState(campaign?.disabled !== true);

    useEffect(() => setActive(campaign?.disabled !== true), [campaign]);

    return (
        <div className='flex items-center gap-4 w-full p-2'>
            <ToggleButtonWithLoader
                active={active}
                setActive={toggleCampaignDisabled}
                loading={loading}
                disabled={loading}
            />
            <span>{campaign.disabled === true ? 'Not Running' : 'Running'}</span>
        </div>
    )
}
