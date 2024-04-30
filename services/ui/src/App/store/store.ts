import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import authTokenReducer from './reducers/authTokenReducer';
import colorModeReducer from './reducers/colorModeReducer';

export const store = configureStore({
    reducer: {
        colorMode: colorModeReducer,
        authToken: authTokenReducer
    }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
