import React from 'react';
import { useAppSelector } from '../../../store/hooks';
import { selectQueuesHistory, MAX_QUEUES_HISTORY_LENGTH } from '../../../store/reducers/queuesHistoryReducer';
import ToggleExpandedContent from '../../../components/ToggleExpandedContent';
import Graph, { IData } from './Graph';
import Rows from './Rows';
import { IQueue_ui } from '../typings';
import { frontFillRestOfArrayUpTo } from '../utils';

export default function Queue({ queue }: {
    queue: IQueue_ui
}) {
    const { value: queuesHistory } = useAppSelector(selectQueuesHistory);

    const data: IData[] = frontFillRestOfArrayUpTo(
        queuesHistory.map(({ value }, index) => {
            const _queue: IQueue_ui = value.filter(_queue => _queue.name === queue.name)[0];
            return {
                messageCount: _queue?.messageCount || 0,
                consumerCount: _queue?.consumerCount || 0,
                reverseIndex: queuesHistory.length - index - 1
            };
        }) as IData[],
        { messageCount: 0, consumerCount: 0, reverseIndex: '' },
        MAX_QUEUES_HISTORY_LENGTH
    );

    return (
        <div className='w-full p-2 border rounded-lg'>
            <ToggleExpandedContent
                title={<span className={queue.disabled === true ? 'opacity-50' : ''}>{queue.name}</span>}
                initialExpanded={true}
                className='flex flex-col gap-8 sm:gap-4 w-full px-2 py-2'
            >
                <div
                    className={(queue.disabled === true ? 'opacity-50' : '')
                        + ' flex flex-col items-cetner gap-2 w-full px-2 py-1 border rounded-md'}
                >
                    <Graph data={data} />
                    <Rows queue={queue} />
                </div>
            </ToggleExpandedContent>
        </div>
    )
}
