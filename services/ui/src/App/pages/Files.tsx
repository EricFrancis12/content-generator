import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { selectFileSystem, getFileSystem } from '../store/reducers/fileSystemReducer';
import DefaultLayout from '../layouts/DefaultLayout';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import FileSystem from '../components/FileSystem';
import RefreshButton from '../components/RefreshButton';
import Loader from '../components/Loader';

export default function Files() {
    const { value: fileSystem, status } = useAppSelector(selectFileSystem);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getFileSystem());
    }, [dispatch]);

    return (
        <DefaultLayout>
            <Breadcrumb pageName='Files' />
            <div className='flex flex-col items-center gap-4 h-full w-full'>
                <div className='flex gap-4 w-full'>
                    <RefreshButton
                        disabled={status === 'loading'}
                        onClick={() => dispatch(getFileSystem())}
                    />
                </div>
                {status === 'loading'
                    ? <Loader />
                    : <div className='flex flex-wrap justify-center gap-4 w-full'>
                        {status === 'failed'
                            ? 'Failed to fetch Campaigns...'
                            : <FileSystem data={[fileSystem]} />
                        }
                    </div>
                }
            </div>
        </DefaultLayout>
    )
}
