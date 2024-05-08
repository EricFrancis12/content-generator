import React from 'react';

export default function SearchQuery({ value, onChange }: {
    value: string,
    onChange: React.ChangeEventHandler<HTMLInputElement>
}) {
    return (
        <input
            placeholder='Search External ID'
            className='p-1 rounded-lg'
            value={value}
            onChange={onChange}
        />
    )
}
