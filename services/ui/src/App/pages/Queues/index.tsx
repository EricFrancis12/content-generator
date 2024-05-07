import React from 'react';
import { useAppSelector } from '../../store/hooks';
import { selectQueues, update } from '../../store/reducers/queuesReducer';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layouts/DefaultLayout';
import usePollEndpoint from '../../hooks/usePollEndpoint';

export default function Queues() {
    const { value: queues } = useAppSelector(selectQueues);

    const { protocol, hostname } = window.location;
    const endpoint = `${protocol}//${hostname}:3000/api/v1/amqp/queues`;
    usePollEndpoint(endpoint, 2000, ({ data }) => {
        if (data?.success && data.data?.queues) {
            update(queues);
        }
    });

    return (
        <DefaultLayout>
            <Breadcrumb pageName='Queues' />
            Queues Page
        </DefaultLayout>
    )
}
