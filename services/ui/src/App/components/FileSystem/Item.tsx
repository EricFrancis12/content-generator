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
                        <a
                            download={item.name}
                            href={`${protocol}//${hostname}:3000/api/v1/content/${item.internalId}`}
                        >
                            <FontAwesomeIcon
                                icon={faDownload}
                                className='cursor-pointer'
                            />
                        </a>
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
