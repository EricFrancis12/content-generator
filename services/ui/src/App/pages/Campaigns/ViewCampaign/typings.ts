import { IHistoryItem, EOutputType } from '../../../../_shared';

export type TMode = 'list' | 'graph';

export interface IData extends IHistoryItem {
    date: string,
    amt: number,
    outputType?: EOutputType
}
