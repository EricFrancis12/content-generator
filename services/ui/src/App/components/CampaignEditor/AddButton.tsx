import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export default function AddButton({ text, onClick }: {
    text: string,
    onClick: React.MouseEventHandler<HTMLButtonElement>
}) {
    return (
        <button
            className='flex gap-2 justify-center items-center p-2 border rounded-lg'
            onClick={onClick}
        >
            <FontAwesomeIcon icon={faPlus} />
            <span>{text}</span>
        </button>
    )
}
