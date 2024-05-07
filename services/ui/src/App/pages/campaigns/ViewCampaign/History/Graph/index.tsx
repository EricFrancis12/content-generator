import React from 'react';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { localeSourceType } from '../../../../../utils';
import { formatOutputType } from '../../utils';
import { EOutputType, IHistoryItem } from '../../../../../../_shared';
import { IData } from '../../typings';
import { THistoryType } from '../../../../../hooks/useCampaignHistory';
import useDataArray from './useDataArray';
import NoHistory from '../NoHistory';

const lineColors = ['blue', 'green', 'purple', 'orange'];

export default function Graph({ type, history }: {
    type: THistoryType,
    history: IHistoryItem[]
}) {
    const dataArray: IData[] = useDataArray(history);

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
