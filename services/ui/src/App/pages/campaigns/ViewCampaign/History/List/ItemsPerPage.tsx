import React from 'react';

const itemsPerPageOptions = [5, 10, 20, 50, 100];

export default function ItemsPerPage({ value, onChange }: {
    value: number,
    onChange: React.ChangeEventHandler<HTMLSelectElement>
}) {
    return (
        <div className='flex items-center gap-2'>
            <span>Items per page: </span>
            <select
                className='pl-4 py-1 rounded-lg'
                value={value}
                onChange={onChange}
            >
                {itemsPerPageOptions.map(num => (
                    <option key={num} value={num}>
                        {num}
                    </option>
                ))}
            </select>
        </div>
    )
}
