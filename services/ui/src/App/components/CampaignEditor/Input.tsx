import React from 'react';
import { ComponentWrapper } from './baseComponents';

export default function Input({ title, value, onChange }: {
    title: string,
    value: string,
    onChange: React.ChangeEventHandler<HTMLInputElement>
}) {
    return (
        <ComponentWrapper>
            <span>{title}</span>
            <input
                className='text-center w-full sm:w-[50%] px-4 py-1 rounded-full'
                value={value}
                onChange={onChange}
            />
        </ComponentWrapper>
    )
}
