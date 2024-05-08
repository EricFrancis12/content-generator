import React, { useState } from 'react';
import { FcFile, FcOpenedFolder } from 'react-icons/fc';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { selectauthToken } from '../../store/reducers/authTokenReducer';
import { getFileSystem } from '../../store/reducers/fileSystemReducer';
import './FileSystem.css';
import { EFileSystemItemType } from '../../../_shared';
import { IFileSystemItem_ui } from '../../typings';

export default function Item({ item }: {
    item: IFileSystemItem_ui
}) {
    const { protocol, hostname } = window.location;

    const { value: authToken } = useAppSelector(selectauthToken);
    const dispatch = useAppDispatch();

    const [loading, setLoading] = useState(false);

    async function handleDownloadButtonClick(e: React.MouseEvent<SVGElement>) {
        e.stopPropagation();
        if (!authToken) {
            toast.error('Auth token missing or invalid');
            return;
        }

        const endpoint = `${protocol}//${hostname}:3000/api/v1/content/${item.internalId}?dl=1`;
        try {
            const res = await fetch(endpoint, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            if (!res.ok) {
                toast.error('Failed to download file');
                return;
            }

            const blob = await res.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = blobUrl;
            a.download = item.internalId || 'file';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(blobUrl);
        } catch (err) {
            toast.error('Error downloading file');
        }
    }

    function handleDeleteButtonClick(e: React.MouseEvent<SVGElement>) {
        e.stopPropagation();
        if (loading) return;
        if (!authToken) {
            toast.error('Auth token missing or invalid');
            return;
        }

        setLoading(true);
        axios.delete(`${protocol}//${hostname}:3000/api/v1/content/${item.internalId}`, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        })
            .then(res => {
                if (res.data?.success === true) {
                    toast.success('File successfully deleted');
                    dispatch(getFileSystem());
                } else {
                    toast.error('Error deleting file');
                }
            })
            .catch(() => toast.error('Error deleting file'))
            .finally(() => setLoading(false));
    }

    return (
        <div className='item'>
            <div>
                {item.type === EFileSystemItemType.FILE ? <FcFile /> : <FcOpenedFolder />}
                {item.name}
            </div>
            <div className='actions justify-center items-center gap-2'>
                {item.type === EFileSystemItemType.FILE &&
                    <>
                        <FontAwesomeIcon
                            icon={faDownload}
                            className='cursor-pointer'
                            onClick={handleDownloadButtonClick}
                        />
                        <FontAwesomeIcon
                            icon={faTrashAlt}
                            className='cursor-pointer'
                            onClick={handleDeleteButtonClick}
                        />
                    </>
                }
            </div>
        </div>
    )
}
