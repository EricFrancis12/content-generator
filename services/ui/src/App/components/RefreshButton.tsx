import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRefresh } from '@fortawesome/free-solid-svg-icons';

export default function RefreshButton({ disabled, onClick }: {
    disabled?: boolean,
    onClick: React.MouseEventHandler<HTMLButtonElement>
}) {
    return (
        <button
            disabled={disabled}
            className='flex gap-2 justify-center items-center h-[fit-content] p-2 border rounded-lg'
            onClick={onClick}
        >
            <FontAwesomeIcon icon={faRefresh} />
            <span>Refresh</span>
        </button>
    )
}
