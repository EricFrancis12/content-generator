import React, { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faTrashAlt, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectauthToken } from '../../store/reducers/authTokenReducer';
import { getLogData } from '../../store/reducers/logDataReducer';
import { EServiceName, TLog } from '../../../_shared';
import Pagination, { handlePaginationClick } from '../../components/Pagination';
import { apiURL, generatePagination } from '../../utils';

const ITEMS_PER_PAGE = 10;

export default function Log({ serviceName, log }: {
    serviceName: EServiceName;
    log: TLog;
}) {
    const { value: authToken } = useAppSelector(selectauthToken);
    const dispatch = useAppDispatch();

    const logLevels = Object.keys(log);
    const [logLevel, setLogLevel] = useState<string>(logLevels[0]);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const totalPages = Math.floor(log[logLevel].length / ITEMS_PER_PAGE);
    const pagination = generatePagination({ currentPage, totalPages });

    const itemsOnCurrentPage = log[logLevel].filter(
        (_, index) => index >= (currentPage - 1) * ITEMS_PER_PAGE && index < currentPage * ITEMS_PER_PAGE
    );

    function handleDeleteButtonClick() {
        axios.delete(apiURL(`/api/v1/services/${serviceName}/logs/${logLevel}`), {
            headers: {
                Authorization: `Bearer ${authToken}`,
            }
        })
            .then(res => {
                if (res.status >= 300) {
                    throw new Error();
                }
                toast.success('successfully deleted log file');
                dispatch(getLogData());
            })
            .catch(() => toast.error('Error deleting log file'));
    }

    function handleDownloadButtonClick() {
        axios.get(apiURL(`/api/v1/services/${serviceName}/logs/${logLevel}/download`), {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
            responseType: 'blob'
        })
            .then(res => {
                if (res.status >= 300) {
                    throw new Error();
                }

                const href = URL.createObjectURL(res.data);
                const link = document.createElement('a');
                link.href = href;
                link.setAttribute('download', `${logLevel}.log`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(href);
            })
            .catch(() => toast.error('Error downloading log file'));
    }

    return (
        <TabsToggler
            value={logLevel}
            tabs={logLevels}
            onChange={setLogLevel}
            className='flex flex-col items-center w-full'
        >
            <div className='flex flex-col items-center w-full bg-slate-300 text-black'>
                {itemsOnCurrentPage.length > 0
                    ? <>
                        {itemsOnCurrentPage.map((item, index) => (
                            <div key={index} className='flex items-center gap-2 w-full px-4 py-1 border'>
                                <div className='h-full w-[40%]'>
                                    {'timestamp' in item
                                        ? new Date(item.timestamp).toLocaleString()
                                        : <span className='italic'>no timestamp</span>
                                    }
                                </div>
                                <div className='h-full w-[60%]'>
                                    {'message' in item ? item.message : ''}
                                </div>
                            </div>
                        ))
                        }
                        <div className='flex flex-col items-center gap-2 w-full p-3'>
                            <Pagination
                                pagination={pagination}
                                currentPage={currentPage}
                                onClick={pagination => handlePaginationClick({
                                    pagination,
                                    totalPages,
                                    currentPage,
                                    setCurrentPage,
                                })}
                            />
                            <Button
                                text='Delete Log File'
                                icon={faTrashAlt}
                                onClick={handleDeleteButtonClick}
                            />
                            <Button
                                text='Download Log File'
                                icon={faDownload}
                                onClick={handleDownloadButtonClick}
                            />
                        </div>
                    </>
                    : <span className='italic py-4'>no logs...</span>
                }
            </div>
        </TabsToggler>
    )
}

function Button({ text, icon, onClick }: {
    text: string;
    icon: IconDefinition;
    onClick: () => void;
}) {
    return (
        <div
            className='flex justify-center items-center gap-2 w-full py-1 border rounded-full cursor-pointer hover:opacity-70'
            onClick={onClick}
        >
            <FontAwesomeIcon icon={icon} />
            {text}
        </div>
    )
}

function TabsToggler({ value, tabs, onChange, children, className, style }: {
    value: string;
    tabs: string[];
    onChange: (val: string) => void;
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}) {
    return (
        <div className={className} style={style}>
            <div className='flex justify-between w-full'>
                {tabs.map((tab, index) => (
                    <div
                        key={index}
                        onClick={() => onChange(tab)}
                        className={(value === tab ? 'bg-slate-300 text-black' : 'bg-slate-200 text-slate-500 hover:opacity-70')
                            + ' flex justify-center items-center gap-2 h-full py-3 font-bold border cursor-pointer'}
                        style={{
                            width: `${1 / tabs.length * 100}%`,
                            borderTopLeftRadius: '10px',
                            borderTopRightRadius: '10px',
                        }}
                    >
                        {tab}
                    </div>
                ))}
            </div>
            {children}
        </div>
    )
}
