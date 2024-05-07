import React from 'react';
import { IQueue_ui } from '../typings';

export default function Rows({ queue }: {
    queue: IQueue_ui
}) {
    const rows = [
        { name: 'Messages', value: queue.messageCount },
        { name: 'Consumers', value: queue.consumerCount }
    ];

    return (
        <>
            {rows.map(({ name, value }) => (
                <div key={name} className='flex justify-between gap-2 w-full'>
                    <span>{`${name}: `}</span>
                    <span>{value}</span>
                </div>
            ))}
        </>
    )
}
