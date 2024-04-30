import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrashAlt, faPlus, faRefresh } from '@fortawesome/free-solid-svg-icons';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { selectauthToken } from '../store/reducers/authTokenReducer';
import { selectCampaigns, getCampaigns } from '../store/reducers/campaignsReducer';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../layouts/DefaultLayout';
import Loader from '../components/Loader';
import { ICampaign } from '../../_shared';

export default function Campaigns() {
    const { value: campaigns, status } = useAppSelector(selectCampaigns);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getCampaigns());
    }, [dispatch]);

    return (
        <DefaultLayout>
            <Breadcrumb pageName='Campaigns' />
            <div className='flex h-full w-full'>
                <div className='flex flex-col items-center gap-4 w-full'>
                    <div className='flex gap-4 w-full'>
                        <button
                            className='flex gap-2 justify-center items-center p-2 border rounded-lg'
                            onClick={() => console.log('Create new campaign not yet implimented')}
                        >
                            <FontAwesomeIcon icon={faPlus} />
                            <span>Create New Campaign</span>
                        </button>
                        <button
                            disabled={status === 'loading'}
                            className='flex gap-2 justify-center items-center p-2 border rounded-lg'
                            onClick={() => dispatch(getCampaigns())}
                        >
                            <FontAwesomeIcon icon={faRefresh} />
                            <span>Refresh</span>
                        </button>
                    </div>
                    {status === 'loading'
                        ? <Loader />
                        : <div className='flex flex-wrap justify-center gap-4 w-full'>
                            {campaigns.length <= 0
                                ? 'No campaigns...'
                                : <>
                                    {campaigns.map(campaign => (
                                        <Campaign key={campaign._id} campaign={campaign} />
                                    ))}
                                </>
                            }
                        </div>
                    }
                </div>
            </div>
        </DefaultLayout>
    )
}

export function Campaign({ campaign }: {
    campaign: ICampaign
}) {
    const authToken = useAppSelector(selectauthToken);
    const dispatch = useAppDispatch();

    const [loading, setLoading] = useState(false);

    function toggleCampaignDisabled(campaign: ICampaign) {
        if (!authToken || loading) return;

        const { protocol, hostname } = window.location;
        const endpoint = `${protocol}//${hostname}:3000/api/v1/campaigns/${campaign._id}`;
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
                console.log(res);
                dispatch(getCampaigns())
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }

    function deleteCampaign(campaign: ICampaign) {
        if (!authToken || loading) return;

        const { protocol, hostname } = window.location;
        const endpoint = `${protocol}//${hostname}:3000/api/v1/campaigns/${campaign._id}`;

        setLoading(true);
        axios.delete(endpoint, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        })
            .then(res => {
                console.log(res);
                dispatch(getCampaigns())
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }

    return (
        <div className='flex flex-col items-center gap-2 w-[200px] pb-2 bg-slate-800 rounded-lg'>
            <div className='flex justify-between items-center w-full px-2 py-1 bg-slate-900 rounded-lg'>
                <div className='flex items-center gap-2'>
                    <div
                        className={(campaign.disabled ? 'bg-red-400' : 'bg-green-400') + ' h-[10px] w-[10px] rounded-full cursor-pointer hover:opacity-70'}
                        onClick={() => toggleCampaignDisabled(campaign)}
                    />
                    <h3
                        className='cursor-pointer hover:text-white'
                        style={{
                            transition: 'color 0.3s ease'
                        }}
                        onClick={() => console.log('View campaign not yet implimented')}
                    >
                        {campaign.name}
                    </h3>
                </div>
                <div className='flex items-center gap-2'>
                    {loading
                        ? 'Loading...'
                        : <>
                            <FontAwesomeIcon
                                icon={faPencil}
                                className='cursor-pointer hover:text-white'
                                style={{
                                    transition: 'color 0.3s ease'
                                }}
                                onClick={() => console.log('Edit campaign not yet implimented')}
                            />
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