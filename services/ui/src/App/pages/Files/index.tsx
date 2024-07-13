import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { selectauthToken } from '../../store/reducers/authTokenReducer';
import { selectFileSystem, getFileSystem } from '../../store/reducers/fileSystemReducer';
import DefaultLayout from '../../layouts/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import FileSystem from '../../components/FileSystem';
import RefreshButton from '../../components/RefreshButton';
import Loader from '../../components/Loader';
import _shared, { IDiskSpace } from '../../../_shared';
import { apiURL } from '../../utils';
const { bytesToGB } = _shared.utils;

export default function Files() {
    const { value: authToken } = useAppSelector(selectauthToken);
    const { value: fileSystem, status } = useAppSelector(selectFileSystem);
    const dispatch = useAppDispatch();

    const [diskSpace, setDiskSpace] = useState<IDiskSpace | null>(null);
    const [loadingDiskSpace, setLoadingDiskSpace] = useState(false);

    useEffect(() => {
        dispatch(getFileSystem());
    }, [dispatch]);

    useEffect(fetchDiskSpace, []);

    function fetchDiskSpace() {
        const controller = new AbortController();
        if (loadingDiskSpace) return;
        if (!authToken) {
            toast.error('Auth token missing or invalid');
            return;
        }

        setLoadingDiskSpace(true);
        fetch(apiURL(`/api/v1/system/diskspace`), {
            headers: {
                Authorization: `Bearer ${authToken}`
            },
            signal: controller.signal
        })
            .then(res => res.json())
            .then(resJson => {
                if (resJson?.data?.diskSpace) {
                    setDiskSpace(resJson.data.diskSpace);
                } else {
                    toast.error('Error fetching Disk Space');
                }
            })
            .catch(err => {
                if (typeof err === 'string' && err === 'AbortError') return;
                toast.error('Error fetching Disk Space');
            })
            .finally(() => setLoadingDiskSpace(false));

        return () => {
            setLoadingDiskSpace(false);
            controller.abort('AbortError');
        };
    }

    function handleRefreshButtonClick() {
        dispatch(getFileSystem());
        fetchDiskSpace();
    }

    const freeGB = bytesToGB(diskSpace?.free || 0);
    const totalGB = bytesToGB(diskSpace?.size || 0);

    return (
        <DefaultLayout>
            <Breadcrumb pageName='Files' />
            <div className='flex flex-col items-center gap-4 h-full w-full'>
                <div className='flex justify-between gap-4 w-full'>
                    <RefreshButton
                        disabled={status === 'loading'}
                        onClick={handleRefreshButtonClick}
                    />
                    <div className='flex flex-col gap-2'>
                        <span>{loadingDiskSpace ? '...' : `Free Disk Space: ${freeGB ? `${freeGB.toFixed(2)} GB` : 'Unknown'}`}</span>
                        <span>{loadingDiskSpace ? '...' : `Total Disk Space: ${totalGB ? `${totalGB.toFixed(2)} GB` : 'Unknown'}`}</span>
                        <span>{loadingDiskSpace ? '...' : `Available: ${freeGB && totalGB ? `${(freeGB / totalGB * 100).toFixed()}%` : 'Unknown'}`}</span>
                    </div>
                </div>
                {status === 'loading'
                    ? <Loader />
                    : <div className='flex flex-wrap justify-center gap-4 w-full'>
                        {status === 'failed'
                            ? 'Failed to fetch File System...'
                            : <FileSystem data={[fileSystem]} />
                        }
                    </div>
                }
            </div>
        </DefaultLayout >
    )
}
