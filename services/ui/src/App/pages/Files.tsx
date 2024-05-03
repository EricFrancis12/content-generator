import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRefresh } from '@fortawesome/free-solid-svg-icons';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { selectFileSystem, getFileSystem } from '../store/reducers/fileSystemReducer';
import DefaultLayout from '../layouts/DefaultLayout';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import FileSystem from '../components/FileSystem';
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
                    <button
                        disabled={status === 'loading'}
                        className='flex gap-2 justify-center items-center p-2 border rounded-lg'
                        onClick={() => dispatch(getFileSystem())}
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
                            : <FileSystem
                                data={[fileSystem]}
                                setData={() => dispatch(getFileSystem())}
                            />
                        }
                    </div>
                }
            </div>
        </DefaultLayout>
    )
}
