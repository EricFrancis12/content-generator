import React from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../layouts/DefaultLayout';
import usePollEndpoint from '../hooks/usePollEndpoint';

export default function Queues() {
    const { protocol, hostname } = window.location;
    usePollEndpoint(`${protocol}//${hostname}:3000/api/v1/amqp/queues`, 2000, res => console.log(res));

    return (
        <DefaultLayout>
            <Breadcrumb pageName='Queues' />
            Queues Page
        </DefaultLayout>
    )
}
