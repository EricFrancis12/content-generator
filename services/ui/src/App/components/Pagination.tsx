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
