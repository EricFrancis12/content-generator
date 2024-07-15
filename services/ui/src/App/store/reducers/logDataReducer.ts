import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState, _storeSelector } from '../store';
import { apiURL } from '../../utils';
import { TLogData } from '../../../_shared';

export function fetchLogData() {
    const authToken = _storeSelector(state => state.authToken).value;
    const endpoint = apiURL('/api/v1/services/logs');
    return axios.get(endpoint, {
        headers: {
            Authorization: `Bearer ${authToken}`
        }
    });
}

export interface LogDataState {
    value: TLogData;
    status: 'idle' | 'loading' | 'failed';
}

const initialState: LogDataState = {
    value: {},
    status: 'idle',
};

export const getLogData = createAsyncThunk(
    'logData/fetchLogData',
    async (): Promise<TLogData> => {
        const response = await fetchLogData();
        const logData: TLogData = response.data?.data?.logData || {};
        return logData;
    }
);

export const logDataSlice = createSlice({
    name: 'logData',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getLogData.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getLogData.fulfilled, (state, action) => {
                state.status = 'idle';
                state.value = action.payload;
            })
            .addCase(getLogData.rejected, (state) => {
                state.status = 'failed';
            });
    },
});

export const selectLogData = (state: RootState) => state.logData;

export default logDataSlice.reducer;
