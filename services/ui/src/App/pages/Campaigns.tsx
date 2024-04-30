import React from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { selectCampaigns, getCampaigns } from '../store/reducers/campaignsReducer';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../layouts/DefaultLayout';
import Loader from '../components/Loader';

export default function Campaigns() {
    const { value: campaigns, status } = useAppSelector(selectCampaigns);
    const dispatch = useAppDispatch();

    return (
        <DefaultLayout>
            <Breadcrumb pageName='Campaigns' />
            <div className='flex h-full w-full'>
                <div className='flex flex-col items-center gap-4 w-full'>
                    <button onClick={() => dispatch(getCampaigns())}>Fetch Campaigns</button>
                    {status === 'loading'
                        ? <Loader />
                        : <p>{JSON.stringify(campaigns)}</p>
                    }
                </div>
            </div>
        </DefaultLayout>
    )
}

