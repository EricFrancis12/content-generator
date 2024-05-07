import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export interface IData {
    messageCount: number,
    consumerCount: number,
    reverseIndex: number | ''
}

export default function Graph({ data }: {
    data: IData[]
}) {
    return (
        <ResponsiveContainer minHeight='150px' width='100%'>
            <LineChart
                data={data}
                height={300}
                width={300}
            >
                <XAxis dataKey='reverseIndex' />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                    dataKey='consumerCount'
                    type='monotone'
                    stroke='blue'
                    name='Consumer Count'
                />
                <Line
                    dataKey='messageCount'
                    type='monotone'
                    stroke='orange'
                    name='Message Count'
                />
            </LineChart>
        </ResponsiveContainer>
    )
}
