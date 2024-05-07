import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { IQueue } from '../../../_shared';

export interface QueuesState {
    value: IQueue[]
}

const initialState: QueuesState = {
    value: []
};

export const queuesSlice = createSlice({
    name: 'queues',
    initialState,
    reducers: {
        update: (state: typeof initialState, action: PayloadAction<IQueue[]>) => {
            state.value = action.payload;
        }
    }
});

export const { update } = queuesSlice.actions;

export const selectQueues = (state: RootState) => state.queues;

export default queuesSlice.reducer;
