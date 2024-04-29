import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/useAuthContext';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../layouts/DefaultLayout';
import Loader from '../components/Loader';
import _shared, { EImageFileExtension, EVideoFileExtension } from '../../_shared';
const { getFileExt } = _shared.utils;

export default function Files() {
    const { authToken } = useAuth();

    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    function handleSubmit() {
        if (!file || !authToken) return;

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
            console.error('Unsupported file type');
            return;
        }

        setLoading(true);
        axios.post(endpoint, formData, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        })
            .then(res => console.log(res))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }

    return (
        <DefaultLayout>
            <Breadcrumb pageName='Files' />
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