import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { getValueFromLocalStorage, saveToLocalStorage } from '../../hooks/useLocalStorage';

export interface AuthTokenState {
    value: string
}

const initialState: AuthTokenState = {
    value: getValueFromLocalStorage('auth-token') || ''
};

export const authTokenSlice = createSlice({
    name: 'authToken',
    initialState,
    reducers: {
        change: (state: typeof initialState, action: PayloadAction<string>) => {
            state.value = action.payload;
            saveToLocalStorage('auth-token', action.payload);
        }
    }
});

export const { change } = authTokenSlice.actions;

export const selectauthToken = (state: RootState) => state.authToken;

export default authTokenSlice.reducer;
