import React, { ComponentProps, ReactElement, useMemo, useState } from 'react';
import { Menu, MenuItem, MenuList } from '../Menu';
import { getMarginLeft, randomUUID } from '../utils';
import Item from '../Item';
import './FileTree.css';
import { EFileSystemItemType } from '../../../../_shared';
import { IFileSystemItem_ui } from '../../../typings';

interface InnerComponentProps extends ComponentProps<'div'> {
    options: IFileSystemItem_ui[]
    nestingLevel: number
    handleRename: ({ item, newItem }: { item: IFileSystemItem_ui, newItem: IFileSystemItem_ui }) => void;
    handleAddFileFolder: ({ parentItem, newItem }: { parentItem: IFileSystemItem_ui, newItem: IFileSystemItem_ui }) => void;
}

const FileTree = ({
    options,
    nestingLevel,
    handleRename,
    handleAddFileFolder,
    ...props
}: InnerComponentProps): ReactElement => {

    const [showNestedMenu, setShowNestedMenu] = useState(true);

    const onClickRenameIcon = (
        item: IFileSystemItem_ui,
        newItem: IFileSystemItem_ui
    ) => {
        handleRename({ item, newItem });
    }

    const onClickFileIcon = (parentItem: IFileSystemItem_ui) => {
        setShowNestedMenu(true);

        // Check if empty file already exists
        if (parentItem.children) {
            if (parentItem.children?.find(el => el.name === '' && el.type === EFileSystemItemType.FILE)) return;
        }

        if (parentItem?.id) {
            const newFile: IFileSystemItem_ui = {
                name: '',
                internalId: '',
                id: randomUUID(),
                type: EFileSystemItemType.FILE,
            }
            handleAddFileFolder({ parentItem, newItem: newFile });
        }
    }


    const onClickFolderIcon = (parentItem: IFileSystemItem_ui) => {
        setShowNestedMenu(true);

        // Check if empty folder already exists
        if (parentItem.children) {
            if (parentItem?.children?.find(el => el.name === '' && el.type === EFileSystemItemType.FOLDER)) return;
        }

        if (parentItem?.id) {
            const newFolder: IFileSystemItem_ui = {
                internalId: '',
                name: '',
                id: randomUUID(),
                type: EFileSystemItemType.FOLDER,
            }
            handleAddFileFolder({ parentItem, newItem: newFolder });
        }
    }

    const onClickMenuItem = () => {
        setShowNestedMenu(prev => !prev);
    }

    const marginLeft = useMemo(() => getMarginLeft(nestingLevel), [nestingLevel]);

    return (
        <Menu {...props}>
            <MenuList>
                {options.map((item) => {
                    const children: IFileSystemItem_ui[] | undefined = item.children;
                    if (children) {
                        nestingLevel = nestingLevel + 1;
                        return (
                            <MenuItem key={item.id}
                                onClick={onClickMenuItem}
                                style={{ marginLeft }}>
                                <Item item={item}
                                    handleFile={() => onClickFileIcon(item)}
                                    handleFolder={() => onClickFolderIcon(item)}
                                    handleRename={(newItem) => onClickRenameIcon(item, newItem)} />
                                <FileTree
                                    // handle show/hide via className vs unmount/mount component
                                    // to avoid re-render and resetting of showNestedMenu state
                                    // for n-level nesting
                                    className={showNestedMenu ? 'show' : 'hide'}
                                    options={children}
                                    nestingLevel={nestingLevel}
                                    handleRename={handleRename}
                                    handleAddFileFolder={handleAddFileFolder} />
                            </MenuItem>
                        )
                    } else {
                        return (
                            <MenuItem key={item.id}
                                style={{ marginLeft }}>
                                <Item item={item}
                                    handleFile={() => onClickFileIcon(item)}
                                    handleFolder={() => onClickFolderIcon(item)}
                                    handleRename={(newItem) => onClickRenameIcon(item, newItem)} />
                            </MenuItem>
                        )
                    }
                })
                }
            </MenuList>
        </Menu>
    )
}


export default FileTree;