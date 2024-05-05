import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState, _storeSelector } from '../store';
import { EFileSystemItemType, IFileSystemItem } from '../../../_shared';
import { IFileSystemItem_ui } from '../../typings';
import { randomUUID } from '../../components/FileSystem/utils';

export function fetchFileSystem() {
    const authToken = _storeSelector(state => state.authToken).value;
    const { protocol, hostname } = window.location;
    const endpoint = `${protocol}//${hostname}:3000/api/v1/file-system`;
    return axios.get(endpoint, {
        headers: {
            Authorization: `Bearer ${authToken}`
        }
    });
}

export interface FileSystemState {
    value: IFileSystemItem_ui,
    originalValue: IFileSystemItem,
    status: 'idle' | 'loading' | 'failed'
}

const initialFileSystem: IFileSystemItem = {
    name: '',
    type: EFileSystemItemType.FOLDER,
    children: []
};

const initialState: FileSystemState = {
    value: { ...initialFileSystem, id: '', children: [] },
    originalValue: initialFileSystem,
    status: 'idle'
};

export const getFileSystem = createAsyncThunk(
    'fileSystem/fetchFileSystem',
    async (): Promise<IFileSystemItem> => {
        const response = await fetchFileSystem();
        const fileSystem: IFileSystemItem = response.data?.data?.fileSystem || initialFileSystem;
        return fileSystem;
    }
);

export const fileSystemSlice = createSlice({
    name: 'fileSystem',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getFileSystem.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getFileSystem.fulfilled, (state, action) => {
                state.status = 'idle';
                state.originalValue = action.payload;
                state.value = fileSystemToFileSystem_ui(action.payload)
            })
            .addCase(getFileSystem.rejected, (state) => {
                state.status = 'failed';
            });
    },
});

export function fileSystemToFileSystem_ui(fileSystem: IFileSystemItem): IFileSystemItem_ui {
    const result: IFileSystemItem_ui = {
        ...fileSystem,
        id: randomUUID(),
        children: fileSystem.children?.map(fileSystemItem => fileSystemToFileSystem_ui(fileSystemItem))
    };
    return result;
}

export const selectFileSystem = (state: RootState) => state.fileSystem;

export default fileSystemSlice.reducer;
