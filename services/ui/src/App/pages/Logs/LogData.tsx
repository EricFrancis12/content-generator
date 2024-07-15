import React from 'react';
import { EServiceName, TLogData } from '../../../_shared';
import Log from './Log';
import ToggleExpandedContent from '../../components/ToggleExpandedContent';

export default function LogData({ logData }: {
    logData: TLogData;
}) {
    return (
        <div className='flex flex-col items-center gap-3 w-full p-2'>
            {Object.entries(logData).map(([serviceName, log], index) => (
                <ToggleExpandedContent
                    key={index}
                    title={serviceName}
                    className='flex flex-col gap-8 sm:gap-4 w-full px-4 py-3 border rounded-md'
                >
                    <Log serviceName={serviceName as EServiceName} log={log} />
                </ToggleExpandedContent>

            ))}
        </div>
    )
}
