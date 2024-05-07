import React, { useState } from 'react';
import { IHistoryItem } from '../../../../../_shared';
import { THistoryType } from '../../../../hooks/useCampaignHistory';
import Mode from './Mode';
import Graph from './Graph';
import List from './List';
import type { TMode } from '../typings';

export default function History({ type, history }: {
    type: THistoryType,
    history: IHistoryItem[]
}) {
    const [mode, setMode] = useState<TMode>('graph');

    function typeToTitle(type: THistoryType) {
        switch (type) {
            case 'intake':
                return 'Intake History';
            case 'output':
                return 'Output History';
            default:
                return '';
        }
    }

    return (
        <div className='flex flex-col items-center sm:w-[400px] md:w-[600px] lg:w-[700px] xl:w-[800px] p-2 pt-4 border rounded-lg'>
            <div className='flex justify-between items-center gap-2 w-full px-3'>
                <h3 className='text-lg'>{typeToTitle(type)}</h3>
                <div className='flex justify-between gap-1 border rounded-lg overflow-hidden'>
                    <Mode
                        mode='graph'
                        active={mode === 'graph'}
                        onClick={() => setMode('graph')}
                    />
                    <Mode
                        mode='list'
                        active={mode === 'list'}
                        onClick={() => setMode('list')}
                    />
                </div>
            </div>
            {mode === 'list' && <List history={history} />}
            {mode === 'graph' && <Graph history={history} type={type} />}
        </div>
    )
}
