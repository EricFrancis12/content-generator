import { IQueue } from '../../../_shared';

export interface IQueue_ui extends IQueue {
    disabled?: boolean
}

export type TQueueHistory = {
    timestamp: number,
    value: IQueue[]
};

export type TQueuesHistory = TQueueHistory[];
