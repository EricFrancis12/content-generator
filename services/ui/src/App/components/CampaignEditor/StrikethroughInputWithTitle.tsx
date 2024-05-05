import React from 'react';
import { ComponentWrapper } from './baseComponents';
import StrikethroughInput, { TStrikethroughInputOnChange } from '../StrikethroughInput';

export default function StrikethroughInputWithTitle({ title, initialValue, onChange, allowNumbersOnly = false }: {
    title: string,
    initialValue?: string,
    onChange: TStrikethroughInputOnChange,
    allowNumbersOnly?: boolean
}) {
    return (
        <ComponentWrapper>
            <span className='text-center sm:text-left sm:max-w-[40%]'>{title}</span>
            <StrikethroughInput
                allowNumbersOnly={allowNumbersOnly}
                initialValue={initialValue}
                onChange={onChange}
            />
        </ComponentWrapper>
    )
}
