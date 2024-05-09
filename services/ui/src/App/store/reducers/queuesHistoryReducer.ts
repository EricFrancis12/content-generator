import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { IQueue, TQueuesHistory } from '../../../_shared';

export const MAX_QUEUES_HISTORY_LENGTH = 50;

export interface QueuesHistoryState {
    value: TQueuesHistory
}

const initialState: QueuesHistoryState = {
    value: []
};

export const queuesHistorySlice = createSlice({
    name: 'queuesHistory',
    initialState,
    reducers: {
        tick: (state: typeof initialState, action: PayloadAction<IQueue[]>) => {
            state.value = [
                { value: structuredClone(action.payload), timestamp: Date.now() },
                ...state.value
            ].slice(0, MAX_QUEUES_HISTORY_LENGTH);
        }
    }
});

export const { tick } = queuesHistorySlice.actions;

export const selectQueuesHistory = (state: RootState) => state.queuesHistory;

export default queuesHistorySlice.reducer;
