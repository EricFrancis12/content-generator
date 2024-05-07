import { useMemo } from 'react';
import { timestampToLocaleDate } from '../../utils';
import { IHistoryItem } from '../../../../../../_shared';
import { IData } from '../../typings';

export default function useDataArray(history: IHistoryItem[]): IData[] {
    return useMemo(() => {
        return sortAlphebetically(history.reduce((acc, curr) => {
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
    }, [history, history.length]);

    function sortAlphebetically(data: IData[]): IData[] {
        return data.sort((a, b) => {
            const typeA = a.date.toLowerCase();
            const typeB = b.date.toLowerCase();
            if (typeA < typeB) return -1;
            if (typeA > typeB) return 1;
            return 0;
        });
    }
}