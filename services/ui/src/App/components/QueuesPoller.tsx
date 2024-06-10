import React from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectQueues, update } from '../store/reducers/queuesReducer';
import { tick } from '../store/reducers/queuesHistoryReducer';
import usePollEndpoint from '../hooks/usePollEndpoint';
import { IQueue } from '../../_shared';
import { apiURL } from '../utils';

export default function QueuesPoller() {
    const { value: queues } = useAppSelector(selectQueues);
    const dispatch = useAppDispatch();

    usePollEndpoint(apiURL('/api/v1/amqp/queues'), 2000, ({ data }) => {
        const newQueues = data.data?.queues as IQueue[];
        if (data?.success && newQueues) {
            dispatch(update(newQueues));
            dispatch(tick(newQueues));
        } else {
            dispatch(tick(queues));
        }
    });

    return (
        <></>
    )
}
