import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectQueues, update } from '../../store/reducers/queuesReducer';
import DefaultLayout from '../../layouts/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import usePollEndpoint from '../../hooks/usePollEndpoint';
import Queue from './Queue';
import { IQueue_ui, TQueuesHistory } from './typings';
import _shared, { TRabbitMQQueue, IQueue } from '../../../_shared';
const { RABBITMQ_QUEUES } = _shared.amqp;

export const MAX_QUEUE_HISTORY_LENGTH = 50;

export default function Queues() {
    const { value: queues } = useAppSelector(selectQueues);
    const dispatch = useAppDispatch();

    const [queuesHistory, setQueuesHistory] = useState<TQueuesHistory>([]);

    const { protocol, hostname } = window.location;
    const endpoint = `${protocol}//${hostname}:3000/api/v1/amqp/queues`;
    usePollEndpoint(endpoint, 2000, ({ data }) => {
        const newQueues = data.data?.queues as IQueue[];
        let value: IQueue[] = newQueues;

        if (data?.success && newQueues) {
            dispatch(update(newQueues));
        } else {
            value = structuredClone(queues);
        }

        setQueuesHistory(prevQueuesHistory => [
            { value, timestamp: Date.now() },
            ...prevQueuesHistory
        ].slice(0, MAX_QUEUE_HISTORY_LENGTH));
    });

    const uiQueues: IQueue_ui[] = [
        ...RABBITMQ_QUEUES.map(queueName => {
            const queue = queues.find(queue => queue.name === queueName);
            return ({
                name: queueName as string,
                messageCount: queue?.messageCount || 0,
                consumerCount: queue?.consumerCount || 0,
                disabled: !queue
            });
        }),
        ...queues.filter(queue => !RABBITMQ_QUEUES.includes(queue.name as TRabbitMQQueue))
    ];

    return (
        <DefaultLayout>
            <Breadcrumb pageName='Queues' />
            <div className='flex flex-col items-center gap-4 h-full w-full'>
                {uiQueues.map(queue => (
                    <Queue
                        key={queue.name}
                        queue={queue}
                        queuesHistory={queuesHistory}
                    />
                ))}
            </div>
        </DefaultLayout>
    )
}
