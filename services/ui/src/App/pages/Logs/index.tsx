import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { selectLogData, getLogData } from '../../store/reducers/logDataReducer';
import DefaultLayout from '../../layouts/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import RefreshButton from '../../components/RefreshButton';
import Loader from '../../components/Loader';
import LogData from './LogData';

export default function Logs() {
    const { value: logData, status } = useAppSelector(selectLogData);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getLogData());
    }, [dispatch]);

    function handleRefreshButtonClick() {
        console.log('refresh button clicked');
    }

    console.log(logData);

    return (
        <DefaultLayout>
            <Breadcrumb pageName='Logs' />
            <div className='flex flex-col items-center gap-4 h-full w-full'>
                <div className='flex justify-between gap-4 w-full'>
                    <RefreshButton
                        disabled={status === 'loading'}
                        onClick={handleRefreshButtonClick}
                    />
                </div>
                {status === 'loading'
                    ? <Loader />
                    : <div className='flex flex-wrap justify-center gap-4 w-full'>
                        {status === 'failed'
                            ? 'Failed to fetch Log Data...'
                            : <LogData logData={logData} />
                        }
                    </div>
                }
            </div>
        </DefaultLayout >
    )
}
