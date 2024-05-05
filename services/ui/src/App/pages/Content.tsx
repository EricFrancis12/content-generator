import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAppSelector } from '../store/hooks';
import { selectauthToken } from '../store/reducers/authTokenReducer';
import DefaultLayout from '../layouts/DefaultLayout';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import Loader from '../components/Loader';
import _shared, { EImageFileExtension, EVideoFileExtension } from '../../_shared';
const { getFileExt } = _shared.utils;

export default function Content() {
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

        const { protocol, hostname } = window.location;
        let endpoint = `${protocol}//${hostname}:3000/api/v1/content`;
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
                console.log(res);
                const { success } = res.data;
                if (success) {
                    toast.success('File uploaded successfully');
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
            <div className='flex h-full w-full'>
                <div className='flex flex-col items-center gap-4 w-full'>
                    <input
                        type='file'
                        onChange={e => setFile(e.target?.files?.[0] || null)}
                    />
                    {loading
                        ? <Loader />
                        : <button onClick={handleSubmit}>Submit</button>
                    }
                </div>
            </div>
        </DefaultLayout>
    )
}