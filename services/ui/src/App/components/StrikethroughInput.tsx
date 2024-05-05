import React, { useState } from 'react';
import ToggleButton from './ToggleButton';

export type TStrikethroughInputOnChange = ({ value }: { value: string | undefined }) => any;

export default function StrikethroughInput({ initialValue, onChange, allowNumbersOnly = false }: {
    initialValue?: string,
    onChange?: TStrikethroughInputOnChange,
    allowNumbersOnly?: boolean
}) {
    const [/* eslint-disable */ value /* eslint-ebable */, setValue] = useState<string | undefined>(initialValue);
    const [strikethrough, setStrikethrough] = useState(initialValue === undefined ? true : false);
    const [text, setText] = useState(initialValue || '');

    function handleToggleChange({ active }: {
        active: boolean
    }) {
        const newActive = !active;
        setStrikethrough(newActive);

        const newValue = (newActive === false && text !== '') ? text : undefined;
        setValue(newValue);
        if (onChange) onChange({ value: newValue });
    }

    function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
        const newText = e.target.value;
        if (allowNumbersOnly === true && Number.isNaN(Number(newText))) return;

        setText(newText);
        if (!strikethrough) {
            const newValue = newText !== '' ? newText : undefined;
            setValue(newValue);
            if (onChange) onChange({ value: newValue });
        }
    }

    return (
        <div className='flex flex-col sm:flex-row justify-center items-center gap-4'>
            <ToggleButton
                height='30px'
                width='60px'
                initialActive={!strikethrough}
                onChange={handleToggleChange}
            />
            <div className='relative text-center max-w-[90%] sm:max-w-[unset]'>
                {strikethrough &&
                    <div
                        className='absolute top-[44%] h-[12%] w-full bg-black border border-gray-500'
                        style={{
                            zIndex: 100
                        }}
                    />
                }
                <input
                    disabled={strikethrough}
                    className={(strikethrough ? 'bg-gray-800 opacity-70' : 'bg-white')
                        + ' text-center w-[90%] px-4 py-1 rounded-full'}
                    value={text}
                    onChange={handleInput}
                />
            </div>
        </div>
    )
}
