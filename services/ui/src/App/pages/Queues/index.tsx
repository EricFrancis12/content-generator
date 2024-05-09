import React from 'react';
import { useAppSelector } from '../../store/hooks';
import { selectQueues } from '../../store/reducers/queuesReducer';
import DefaultLayout from '../../layouts/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Queue from './Queue';
import { IQueue_ui } from './typings';
import _shared, { TRabbitMQQueue } from '../../../_shared';
const { RABBITMQ_QUEUES } = _shared.amqp;

export default function Queues() {
    const { value: queues } = useAppSelector(selectQueues);

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
                    />
                ))}
            </div>
        </DefaultLayout>
    )
}
