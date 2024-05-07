import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { selectCampaigns, getCampaigns } from '../../store/reducers/campaignsReducer';
import DefaultLayout from '../../layouts/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Campaign from './Campaign';
import Button from '../../components/Button';
import RefreshButton from '../../components/RefreshButton';
import Loader from '../../components/Loader';

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
                    <RefreshButton
                        disabled={status === 'loading'}
                        onClick={() => dispatch(getCampaigns())}
                    />
                    <Link to='/campaigns/new'>
                        <Button
                            text='Create New Campaign'
                            icon={faPlus}
                        />
                    </Link>
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
