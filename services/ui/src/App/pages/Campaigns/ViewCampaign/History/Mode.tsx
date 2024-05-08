import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faChartLine } from '@fortawesome/free-solid-svg-icons';
import type { TMode } from '../typings';

export default function Mode({ mode, active, onClick }: {
    mode: TMode,
    active: boolean,
    onClick?: React.MouseEventHandler<HTMLDivElement>
}) {
    return (
        <div
            className={(active ? 'bg-white' : 'bg-black')
                + ' flex justify-center items-center h-full w-full p-3 cursor-pointer'}
            onClick={onClick}
        >
            <FontAwesomeIcon icon={mode === 'graph' ? faChartLine : faList} />
        </div>
    )
}
