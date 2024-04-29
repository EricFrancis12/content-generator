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
            if (state.value === 'light') {
                state.value = 'dark';
            } else {
                state.value = 'light';
            }
        }
    }
});

export const { toggle } = colorModeSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectColorMode = (state: RootState) => state.colorMode.value;

export default colorModeSlice.reducer;
