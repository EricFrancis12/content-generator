import React, { useState } from 'react';

export default function ToggleButton({ initialActive = false, onChange, height = '50px', width = '100px' }: {
    initialActive?: boolean,
    onChange: ({ active }: { active: boolean }) => any,
    height?: string | number,
    width?: string | number
}) {
    const [active, setActive] = useState(initialActive);

    function handleClick() {
        const newActive = !active;
        setActive(newActive);
        onChange({ active: newActive });
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
        </div>
    )
}
