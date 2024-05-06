import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faChartLine } from '@fortawesome/free-solid-svg-icons';
import ToggleExpandedContent from '../../../components/ToggleExpandedContent';
import { EContentType, ESourceType, IHistoryItem } from '../../../../_shared';

type TMode = 'list' | 'graph';

const _history: IHistoryItem[] = [
    ...Array(30).fill({
        campaign_id: '111',
        contentType: EContentType.VIDEO,
        sourceType: ESourceType.YOUTUBE,
        externalId: '111',
        timestamp: 111
    }),
    ...Array(30).fill({
        campaign_id: '222',
        contentType: EContentType.VIDEO,
        sourceType: ESourceType.YOUTUBE,
        externalId: '222',
        timestamp: 222
    }),
    ...Array(30).fill({
        campaign_id: '333',
        contentType: EContentType.VIDEO,
        sourceType: ESourceType.YOUTUBE,
        externalId: '333',
        timestamp: 333
    }),
    ...Array(30).fill({
        campaign_id: '444',
        contentType: EContentType.VIDEO,
        sourceType: ESourceType.YOUTUBE,
        externalId: '444',
        timestamp: 444
    })
];

export default function History({ title, history }: {
    title: string,
    history: IHistoryItem[]
}) {
    const [mode, setMode] = useState<TMode>('list');

    return (
        <div className='flex flex-col items-center sm:w-[400px] p-2 pt-4 border rounded-lg'>
            <div className='flex justify-between items-center gap-2 w-full px-3'>
                <h3 className='text-lg'>{title}</h3>
                <div className='flex justify-between gap-1 border rounded-lg overflow-hidden'>
                    <Mode
                        mode='list'
                        active={mode === 'list'}
                        onClick={() => setMode('list')}
                    />
                    <Mode
                        mode='graph'
                        active={mode === 'graph'}
                        onClick={() => setMode('graph')}
                    />
                </div>
            </div>
            {mode === 'list' && <List history={_history} />}
            {mode === 'graph' && <Graph history={history} />}
        </div>
    )
}

function Mode({ mode, active, onClick }: {
    mode: TMode,
    active: boolean,
    onClick?: React.MouseEventHandler<HTMLDivElement>
}) {
    return (
        <div
            className={(active ? 'bg-white' : 'bg-black')
                + ' flex justify-center items-center h-full w-full p-3 cursor-pointer'}
            onClick={onClick}
        >
            <FontAwesomeIcon icon={mode === 'graph' ? faChartLine : faList} />
        </div>
    )
}

type TPagination = '<<' | '<' | number | '...' | '>' | '>>';

function generatePagination({ currentPage, totalPages }: {
    currentPage: number,
    totalPages: number
}): TPagination[] {
    let result: TPagination[] = [
        1,
        '...',
        currentPage - 1,
        currentPage,
        currentPage + 1,
        '...',
        totalPages
    ];

    if (totalPages <= 7) {
        result = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else if (currentPage <= 3) {
        result = [1, 2, 3, '...', totalPages - 1, totalPages];
    } else if (currentPage >= totalPages - 2) {
        result = [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
    }

    return [
        '<<',
        '<',
        ...result,
        '>',
        '>>'
    ];
}

function List({ history }: {
    history: IHistoryItem[]
}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(history.length / itemsPerPage);
    const filteredHistory = history
        .filter(historyItem => !searchQuery ? true : historyItem.externalId.toLowerCase().includes(searchQuery.toLowerCase()))
        .filter((_, index) => index > (itemsPerPage * (currentPage - 1) - 1) && index <= (itemsPerPage * (currentPage) - 1));

    const pagination = generatePagination({ currentPage, totalPages });

    function handlePaginationClick(p: TPagination) {
        if (typeof p === 'number') {
            setCurrentPage(p);
        } else if (p === '<<') {
            setCurrentPage(1);
        } else if (p === '<') {
            const newCurrentPage = currentPage - 1 > 0 ? currentPage - 1 : 1;
            setCurrentPage(newCurrentPage);
        } else if (p === '>') {
            const newCurrentPage = currentPage + 1 <= totalPages ? currentPage + 1 : totalPages;
            setCurrentPage(newCurrentPage);
        } else if (p === '>>') {
            setCurrentPage(totalPages);
        }
    }

    function localeSourceType(sourceType: ESourceType) {
        switch (sourceType) {
            case ESourceType.READ_FROM_SAVED:
                return 'Read From Saved';
            case ESourceType.INSTAGRAM:
                return 'Instagram Account';
            case ESourceType.REDDIT:
                return 'Subreddit';
            case ESourceType.TIKTOK:
                return 'TikTok Account';
            case ESourceType.YOUTUBE:
                return 'YouTube Channel';
            default:
                return '';
        }
    }

    const ItemsPerPageOptions = [5, 10, 20, 50, 100];

    return (
        <div className='w-full p-2'>
            <div className='flex flex-col sm:flex-row justify-between items-center gap-2 w-full mt-2 mb-4'>
                <input
                    placeholder='Search External ID'
                    className='p-1 rounded-lg'
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
                <div className='flex items-center gap-2'>
                    <span>Items per page: </span>
                    <select
                        className='pl-4 py-1 rounded-lg'
                        value={itemsPerPage}
                        onChange={e => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                    >
                        {ItemsPerPageOptions.map(num => (
                            <option key={num} value={num}>
                                {num}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            {history.length <= 0
                ? <div className='text-center w-full'>No history...</div>
                : <>
                    {filteredHistory.map((historyItem, index) => {
                        const entries = Object.entries(historyItem);
                        return (
                            <ToggleExpandedContent
                                key={index}
                                title={`${localeSourceType(historyItem.sourceType)}: ${historyItem.externalId}`}
                                className='flex flex-col items-center w-full px-4 py-1 border'
                            >
                                {entries.map((entry, _index) => {
                                    const [key, value] = entry;
                                    return (
                                        <div className='flex justify-between gap-2 w-full'>
                                            <span>{key}: </span>
                                            <span>{value}</span>
                                        </div>
                                    )
                                })}
                            </ToggleExpandedContent>
                        )
                    })}
                    <div className='flex justify-around w-full mt-2'>
                        {pagination.map((p, _index) => (
                            <span
                                key={_index}
                                className={(p !== '...' ? 'cursor-pointer hover:underline ' : ' ')
                                    + (p === currentPage ? ' text-blue-500 font-bold' : ' ')}
                                onClick={() => handlePaginationClick(p)}
                            >
                                {p}
                            </span>
                        ))}
                    </div>
                </>
            }
        </div>
    )
}

function Graph({ history }: {
    history: IHistoryItem[]
}) {
    return (
        <div className='text-center w-full'>
            Graph
        </div>
    )
}
