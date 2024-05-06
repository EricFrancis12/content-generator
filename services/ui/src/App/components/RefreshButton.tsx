import React from 'react';
import { faRefresh } from '@fortawesome/free-solid-svg-icons';
import Button from './Button';

export default function RefreshButton({ disabled, onClick }: {
    disabled?: boolean,
    onClick: React.MouseEventHandler<HTMLButtonElement>
}) {
    return (
        <Button
            text='Refresh'
            icon={faRefresh}
            disabled={disabled}
            onClick={onClick}
        />
    )
}
