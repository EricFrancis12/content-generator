import React from 'react';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Button from '../Button';

export default function AddButton({ text, onClick }: {
    text: string,
    onClick: React.MouseEventHandler<HTMLButtonElement>
}) {
    return (
        <Button
            text={text}
            icon={faPlus}
            onClick={onClick}
        />
    )
}
