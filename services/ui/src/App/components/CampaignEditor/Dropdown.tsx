import React from 'react';
import { ComponentWrapper } from './baseComponents';

export default function Dropdown({ title, value, items, onChange }: {
    title: string,
    value: string,
    items: string[],
    onChange: React.ChangeEventHandler<HTMLSelectElement>
}) {
    return (
        <ComponentWrapper>
            <span>{title}</span>
            <select
                className='text-center w-full sm:w-[50%] px-4 py-1 rounded-full'
                value={value}
                onChange={onChange}
            >
                {items.map((item, index) => (
                    <option key={index} value={item}>{item}</option>
                ))}
            </select>
        </ComponentWrapper>
    )
}
