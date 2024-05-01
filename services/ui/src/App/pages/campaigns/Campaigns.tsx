import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faRefresh } from '@fortawesome/free-solid-svg-icons';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { selectCampaigns, getCampaigns } from '../../store/reducers/campaignsReducer';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layouts/DefaultLayout';
import Loader from '../../components/Loader';
import Campaign from './Campaign';

export default function Campaigns() {
    const { value: campaigns, status } = useAppSelector(selectCampaigns);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getCampaigns());
    }, [dispatch]);

    return (
        <DefaultLayout>
            <Breadcrumb pageName='Campaigns' />
            <div className='flex flex-col items-center gap-4 h-full w-full'>
                <div className='flex gap-4 w-full'>
                    <Link to='/campaigns/new'>
                        <button className='flex gap-2 justify-center items-center p-2 border rounded-lg'>
                            <FontAwesomeIcon icon={faPlus} />
                            <span>Create New Campaign</span>
                        </button>
                    </Link>
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
                        {status === 'failed'
                            ? 'Failed to fetch Campaigns...'
                            : campaigns.length <= 0
                                ? 'No Campaigns...'
                                : <>
                                    {campaigns.map(campaign => (
                                        <Campaign key={campaign._id} campaign={campaign} />
                                    ))}
                                </>
                        }
                    </div>
                }
            </div>
        </DefaultLayout>
    )
}
