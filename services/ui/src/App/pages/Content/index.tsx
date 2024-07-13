import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { useAppSelector } from '../../store/hooks';
import { selectauthToken } from '../../store/reducers/authTokenReducer';
import DefaultLayout from '../../layouts/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Button from '../../components/Button';
import Loader from '../../components/Loader';
import File from './File';
import _shared, { EImageFileExtension, EVideoFileExtension } from '../../../_shared';
import { apiURL } from '../../utils';
const { getFileExt } = _shared.utils;

export default function UploadContent() {
    const { value: authToken } = useAppSelector(selectauthToken);

    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    function handleSubmit() {
        if (!file) {
            toast.error('Please upload a file');
            return;
        }

        if (!authToken) {
            toast.error('Auth token missing or invalid');
            return;
        }

        let endpoint = apiURL(`/api/v1/content`);
        const formData = new FormData();
        const fileExt = getFileExt(file.name);
        if (fileExt in EImageFileExtension) {
            endpoint += '/images';
            formData.append('image', file);
        } else if (fileExt in EVideoFileExtension) {
            endpoint += '/videos';
            formData.append('video', file);
        } else {
            toast.error('Unsupported file type');
            return;
        }

        setLoading(true);
        axios.post(endpoint, formData, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        })
            .then(res => {
                const { success } = res.data;
                if (success) {
                    toast.success('File uploaded successfully');
                    setFile(null);
                } else {
                    throw new Error('Error uploading file');
                }
            })
            .catch(() => toast.error('Error uploading file'))
            .finally(() => setLoading(false));
    }

    return (
        <DefaultLayout>
            <Breadcrumb pageName='Content' />
            <div className='flex flex-col items-center gap-4 h-full w-full'>
                <div className='flex flex-col sm:flex-row sm:items-center gap-4 w-full'>
                    <div className='sm:m-2'>
                        <Button
                            text='Submit'
                            icon={faCheck}
                            disabled={!file || loading}
                            onClick={handleSubmit}
                        />
                    </div>
                    {file
                        ? <File
                            file={file}
                            setFile={setFile}
                        />
                        : <input
                            type='file'
                            aria-label='yes'
                            className='h-[fit-content] p-2 border rounded-lg'
                            onChange={e => setFile(e.target?.files?.[0] || null)}
                        />
                    }
                    {loading &&
                        <Loader
                            style={{
                                height: '20px',
                                width: '20px'
                            }}
                        />
                    }
                </div>
            </div>
        </DefaultLayout>
    )
}
