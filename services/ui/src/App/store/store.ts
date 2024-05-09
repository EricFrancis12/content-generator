import { configureStore, ThunkAction, Action, createSelector } from '@reduxjs/toolkit';
import authTokenReducer from './reducers/authTokenReducer';
import campaignsReducer from './reducers/campaignsReducer';
import colorModeReducer from './reducers/colorModeReducer';
import fileSystemReducer from './reducers/fileSystemReducer';
import queuesReducer from './reducers/queuesReducer';
import queuesHistoryReducer from './reducers/queuesHistoryReducer';

const store = configureStore({
    reducer: {
        authToken: authTokenReducer,
        campaigns: campaignsReducer,
        colorMode: colorModeReducer,
        fileSystem: fileSystemReducer,
        queues: queuesReducer,
        queuesHistory: queuesHistoryReducer
    }
});
export default store;

export function _storeSelector<T>(selector: (state: RootState) => T): T {
    const selectSelf = (state: RootState) => state;
    const createdSelector = createSelector(selectSelf, selector);
    return createdSelector(store.getState());
}

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
