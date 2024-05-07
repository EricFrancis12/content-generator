import React from 'react';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { localeSourceType } from '../../../../utils';
import { timestampToLocaleDate, formatOutputType } from '../utils';
import { EOutputType, IHistoryItem } from '../../../../../_shared';
import { THistoryType } from '../../../../hooks/useCampaignHistory';
import NoHistory from './NoHistory';

interface IData extends IHistoryItem {
    date: string,
    amt: number,
    outputType?: EOutputType
}

const lineColors = ['blue', 'green', 'purple', 'orange'];

export default function Graph({ type, history }: {
    type: THistoryType,
    history: IHistoryItem[]
}) {
    const dataArray: IData[] = sortAlphebetically(history.reduce((acc, curr) => {
        const newAcc = [...acc];
        const date = timestampToLocaleDate(curr.timestamp);
        const index = newAcc.findIndex(a => a.date === date);
        if (index >= 0) {
            newAcc[index] = { ...newAcc[index], amt: newAcc[index].amt + 1 };
        } else {
            newAcc.push({ ...curr, date, amt: 1 })
        }
        return newAcc;
    }, [] as IData[]));

    function sortAlphebetically(data: IData[]) {
        return data.sort((a, b) => {
            const typeA = a.date.toLowerCase();
            const typeB = b.date.toLowerCase();
            if (typeA < typeB) return -1;
            if (typeA > typeB) return 1;
            return 0;
        });
    }

    function makeLineName(type: THistoryType, data: IData) {
        const { sourceType, outputType, externalId } = data;
        switch (type) {
            case 'intake':
                return `${localeSourceType(sourceType)}: ${externalId}`;
            case 'output':
                return outputType ? `${formatOutputType(outputType)}${outputType === EOutputType.KEEP_SAVED ? '' : `: ${externalId}`}` : '';
            default:
                return '';
        }
    }

    return (
        <div className='w-full p-2'>
            {history.length <= 0
                ? <NoHistory />
                : <ResponsiveContainer
                    minHeight='500px'
                    width='100%'
                >
                    <LineChart
                        data={dataArray}
                        height={300}
                        width={300}
                    >
                        <XAxis dataKey='date' />
                        <YAxis />
                        <CartesianGrid />
                        <Tooltip />
                        <Legend />
                        {dataArray.map((data, index) => (
                            <Line
                                key={data.externalId}
                                dataKey='amt'
                                type='monotone'
                                stroke={lineColors[index % lineColors.length]}
                                name={makeLineName(type, data)}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            }
        </div>
    )
}
