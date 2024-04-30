import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { getValueFromLocalStorage } from '../../hooks/useLocalStorage';
import { saveToLocalStorage } from '../../hooks/useLocalStorage';

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

export const selectauthToken = (state: RootState) => state.authToken.value;

export default authTokenSlice.reducer;
