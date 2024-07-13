import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { selectauthToken } from '../../store/reducers/authTokenReducer';
import { getCampaigns } from '../../store/reducers/campaignsReducer';
import useToggleCampaignDisabled from '../../hooks/useToggleCampaignDisabled';
import { ICampaign } from '../../../_shared';
import { apiURL } from '../../utils';

export default function Campaign({ campaign }: {
    campaign: ICampaign
}) {
    const { value: authToken } = useAppSelector(selectauthToken);
    const dispatch = useAppDispatch();

    const [loading, setLoading] = useState(false);

    const { toggleCampaignDisabled, loading: toggleCampaignDisabledLoading } = useToggleCampaignDisabled(campaign);

    function deleteCampaign(campaign: ICampaign) {
        if (loading) return;
        if (!authToken) {
            toast.error('Auth token missing or invalid');
            return;
        }

        const endpoint = apiURL(`/api/v1/campaigns/${campaign._id}`);

        setLoading(true);
        axios.delete(endpoint, {
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

    return (
        <div className='flex flex-col items-center gap-2 w-[260px] pb-2 bg-slate-800 rounded-lg'>
            <div className='flex justify-between items-center w-full px-2 py-1 bg-slate-900 rounded-lg'>
                <div className='flex items-center gap-2 w-full'>
                    <div
                        className={(campaign.disabled ? 'bg-red-400' : 'bg-green-400') + ' h-[10px] w-[10px] rounded-full cursor-pointer hover:opacity-70'}
                        onClick={toggleCampaignDisabled}
                    />
                    <Link className='max-w-[180px]' to={`/campaigns/${campaign._id}`}>
                        <h3
                            className='cursor-pointer hover:text-white'
                            style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                transition: 'color 0.3s ease'
                            }}
                        >
                            {campaign.name}
                        </h3>
                    </Link>
                </div>
                <div className='flex items-center gap-2'>
                    {(loading || toggleCampaignDisabledLoading)
                        ? 'Loading...'
                        : <>
                            <Link to={`/campaigns/${campaign._id}/edit`}>
                                <FontAwesomeIcon
                                    icon={faPencil}
                                    className='cursor-pointer hover:text-white'
                                    style={{
                                        transition: 'color 0.3s ease'
                                    }}
                                />
                            </Link>
                            <FontAwesomeIcon
                                icon={faTrashAlt}
                                className='cursor-pointer hover:text-white'
                                style={{
                                    transition: 'color 0.3s ease'
                                }}
                                onClick={() => deleteCampaign(campaign)}
                            />
                        </>
                    }
                </div>
            </div>
            <ul className='px-4'>
                <li>{`Source Type: ${campaign.source.type}`}</li>
                <li>{`Content Type: ${campaign.source.contentType}`}</li>
                <li>{`External ID: ${campaign.source.externalId}`}</li>
                <li>{`Filters: ${campaign.filters.length}`}</li>
                <li>{`Outputs: ${campaign.publishTo.length}`}</li>
            </ul>
        </div>
    )
}
