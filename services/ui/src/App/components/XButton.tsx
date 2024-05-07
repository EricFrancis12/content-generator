import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';

export default function XButton({ onClick, size = 20 }: {
    onClick: React.MouseEventHandler<HTMLDivElement>,
    size?: number
}) {
    return (
        <div
            className='flex justify-center items-center bg-white rounded-full cursor-pointer'
            style={{
                height: `${size}px`,
                width: `${size}px`
            }}
            onClick={onClick}
        >
            <FontAwesomeIcon
                icon={faX}
                fontSize={`${size * 0.64}px`}
                style={{ margin: '10px' }}
            />
        </div>
    )
}
