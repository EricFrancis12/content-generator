import React, { ChangeEvent, FocusEvent, FormEvent, MouseEvent, useState } from 'react';
import { FcFile, FcOpenedFolder } from 'react-icons/fc';
import { MdModeEditOutline, MdOutlineFolder, MdOutlineTextSnippet } from 'react-icons/md';
import './FileSystem.css';
import { EFileSystemItemType } from '../../../_shared';
import { IFileSystemItem_ui } from '../../typings';

interface ItemProps {
    item: IFileSystemItem_ui;
    handleRename?: (item: IFileSystemItem_ui) => void;
    handleFile?: () => void;
    handleFolder?: () => void;
}

export default function Item({
    item,
    handleRename,
    handleFile,
    handleFolder
}: ItemProps) {
    const [inputVal, setInputVal] = useState(item.name);
    const [isEditMode, setIsEditMode] = useState(false);

    const handleInputOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputVal(e.target.value);
    }

    const handleRenameOnClick = (e: MouseEvent<SVGElement>) => {
        e.stopPropagation();
        setIsEditMode(prevState => !prevState);
    }

    const handleAddFolderOnClick = (e: MouseEvent<SVGElement>) => {
        e.stopPropagation();
        if (handleFolder) handleFolder();
    }

    const handleAddFileOnClick = (e: MouseEvent<SVGElement>) => {
        e.stopPropagation();
        if (handleFile) handleFile();
    }

    const handleOnBlur = (e: FocusEvent<HTMLInputElement>) => {
        e.stopPropagation();
        setIsEditMode(false);
        item.name = inputVal;
        if (handleRename) handleRename(item);
    }

    const handleOnSubmit = (e: FormEvent) => {
        e.preventDefault();
        setIsEditMode(false);
        item.name = inputVal;
        if (handleRename) handleRename(item);
    }

    return (
        <div className='item'>
            <div>
                {item.type === EFileSystemItemType.FILE ? <FcFile /> : <FcOpenedFolder />}
                {item.name === '' || isEditMode
                    ? <form onSubmit={handleOnSubmit}>
                        <input value={inputVal}
                            onChange={handleInputOnChange}
                            onBlur={handleOnBlur}
                            autoFocus />
                    </form>
                    : item.name
                }
            </div>
            <div className='actions'>
                {handleRename &&
                    <MdModeEditOutline onClick={handleRenameOnClick} />
                }
                {handleFile && item.type === EFileSystemItemType.FOLDER &&
                    <MdOutlineTextSnippet onClick={handleAddFileOnClick} />
                }
                {handleFolder && item.type === EFileSystemItemType.FOLDER &&
                    <MdOutlineFolder onClick={handleAddFolderOnClick} />
                }
            </div>
        </div>
    )
}
