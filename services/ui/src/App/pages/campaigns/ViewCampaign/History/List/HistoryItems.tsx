import React from 'react';
import ToggleExpandedContent from '../../../../../components/ToggleExpandedContent';
import { localeSourceType } from '../../../../../utils';
import { IHistoryItem } from '../../../../../../_shared';

export default function HistoryItems({ history }: {
    history: IHistoryItem[]
}) {
    return (
        <>
            {history.map((historyItem, index) => {
                const { sourceType, externalId } = historyItem;
                const entries = Object.entries(historyItem);
                return (
                    <ToggleExpandedContent
                        key={index}
                        title={`${localeSourceType(sourceType)}: ${externalId}`}
                        className='flex flex-col items-center w-full px-4 py-1 border'
                    >
                        {entries.map((entry, _index) => {
                            const [key, value] = entry;
                            return (
                                <div key={key} className='flex justify-between gap-2 w-full'>
                                    <span>{key}: </span>
                                    <span>{value}</span>
                                </div>
                            )
                        })}
                    </ToggleExpandedContent>
                )
            })}
        </>
    )
}
