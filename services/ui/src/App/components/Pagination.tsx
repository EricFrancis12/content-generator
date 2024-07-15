import React from 'react';
import type { TPagination } from '../utils';

export default function Pagination({ pagination, currentPage, onClick = () => { } }: {
    pagination: TPagination[],
    currentPage?: number,
    onClick?: (p: TPagination) => any
}) {
    return (
        <div className='flex justify-around w-full mt-2'>
            {pagination.map((p, _index) => (
                <span
                    key={_index}
                    className={(p !== '...' ? 'cursor-pointer hover:underline ' : ' ')
                        + (p === currentPage ? ' text-blue-500 font-bold' : ' ')}
                    onClick={() => onClick(p)}
                >
                    {p}
                </span>
            ))}
        </div>
    )
}

export function handlePaginationClick({ pagination, totalPages, currentPage, setCurrentPage }: {
    pagination: TPagination;
    totalPages: number;
    currentPage: number;
    setCurrentPage: (n: number) => void;
}): void {
    if (typeof pagination === 'number') {
        setCurrentPage(pagination);
    } else if (pagination === '<<') {
        setCurrentPage(1);
    } else if (pagination === '<') {
        const newCurrentPage = currentPage - 1 > 0 ? currentPage - 1 : 1;
        setCurrentPage(newCurrentPage);
    } else if (pagination === '>') {
        const newCurrentPage = currentPage + 1 <= totalPages ? currentPage + 1 : totalPages;
        setCurrentPage(newCurrentPage);
    } else if (pagination === '>>') {
        setCurrentPage(totalPages);
    }
}
