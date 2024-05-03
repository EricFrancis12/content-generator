import React from 'react';
import './FileSystem.css';
import FileTree from './FileTree/FileTree';
import { updateItem, addChildren, runDataCleanUp } from './utils';
import { IFileSystemItem_ui } from '../../typings';

const nestingLevel = 0;

const FileSystem = ({ data, setData }: {
    data: IFileSystemItem_ui[],
    setData: React.Dispatch<React.SetStateAction<IFileSystemItem_ui[]>>
}) => {
    const handleRename = ({ item, newItem }: {
        item: IFileSystemItem_ui,
        newItem: IFileSystemItem_ui
    }): void => {
        let updatedData: IFileSystemItem_ui[];
        // trim to remove all empty spaces from the value
        if (newItem.name.trim().length > 0) {
            updatedData = updateItem({ data, item, newItem })
        } else {
            // remove all empty values from state
            updatedData = runDataCleanUp(data);
        }
        setData(updatedData);
    }

    const handleAddFileFolder = ({ parentItem, newItem }: {
        parentItem: IFileSystemItem_ui,
        newItem: IFileSystemItem_ui
    }): void => {
        const updatedData: IFileSystemItem_ui[] = addChildren({ data, parentItem, newItem })
        setData(updatedData);
    }

    return (
        <div className='flex flex-col max-w-[360px] m-2 p-2 bg-black text-white rounded-sm'>
            <FileTree
                options={data}
                nestingLevel={nestingLevel}
                handleRename={handleRename}
                handleAddFileFolder={handleAddFileFolder} />
        </div>
    )
}

export default FileSystem;
