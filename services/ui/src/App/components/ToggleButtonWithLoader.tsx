import React from 'react';

export default function ToggleButtonWithLoader({ active, setActive, loading, disabled, height = '50px', width = '100px' }: {
    active: boolean,
    setActive: (newActive: boolean) => any,
    loading?: boolean,
    disabled?: boolean,
    height?: string | number,
    width?: string | number
}) {
    function handleClick() {
        if (disabled) return;
        setActive(!active);
    }

    return (
        <div
            className={(active ? 'bg-blue-400' : 'bg-white') + ' relative border rounded-full'}
            style={{
                height,
                width,
                transition: 'background-color 0.3s ease'
            }}
        >
            <div
                className='absolute h-full w-[50%] bg-black border rounded-full cursor-pointer'
                style={{
                    left: active ? '50%' : '0%',
                    transition: 'left 0.3s ease'
                }}
                onClick={handleClick}
            />
            {loading &&
                <div
                    className='absolute h-full w-full bg-black opacity-70 rounded-full'
                    style={{
                        zIndex: 100,
                        pointerEvents: 'none'
                    }}
                />
            }
        </div>
    )
}
