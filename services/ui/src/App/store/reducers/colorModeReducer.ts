import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { getValueFromLocalStorage } from '../../hooks/useLocalStorage';

export interface ColorModeState {
    value: 'dark' | 'light';
}

const initialState: ColorModeState = {
    value: getValueFromLocalStorage('color-mode') || 'light'
};

export const colorModeSlice = createSlice({
    name: 'colorMode',
    initialState,
    reducers: {
        toggle: (state: typeof initialState) => {
            state.value = state.value === 'light' ? 'dark' : 'light';
        }
    }
});

export const { toggle } = colorModeSlice.actions;

export const selectColorMode = (state: RootState) => state.colorMode.value;

export default colorModeSlice.reducer;
