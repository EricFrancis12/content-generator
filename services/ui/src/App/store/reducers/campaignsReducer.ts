import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState, _storeSelector } from '../store';
import { ICampaign } from '../../../_shared';

export function fetchCampaigns() {
    const authToken = _storeSelector(state => state.authToken).value;
    const { protocol, hostname } = window.location;
    const endpoint = `${protocol}//${hostname}:3000/api/v1/campaigns`;
    return axios.get(endpoint, {
        headers: {
            Authorization: `Bearer ${authToken}`
        }
    });
}

export interface CampaignsState {
    value: ICampaign[];
    status: 'idle' | 'loading' | 'failed';
}

const initialState: CampaignsState = {
    value: [],
    status: 'idle',
};

export const getCampaigns = createAsyncThunk(
    'campaigns/fetchCampaigns',
    async (): Promise<ICampaign[]> => {
        const response = await fetchCampaigns();
        const campaigns: ICampaign[] = response.data?.data?.campaigns || [];
        return campaigns;
    }
);

export const campaignsSlice = createSlice({
    name: 'campaigns',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getCampaigns.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getCampaigns.fulfilled, (state, action) => {
                state.status = 'idle';
                state.value = action.payload;
            })
            .addCase(getCampaigns.rejected, (state) => {
                state.status = 'failed';
            });
    },
});

export const selectCampaigns = (state: RootState) => state.campaigns;

export default campaignsSlice.reducer;
