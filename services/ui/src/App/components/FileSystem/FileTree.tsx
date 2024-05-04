import React, { ComponentProps, ReactElement, useMemo, useState } from 'react';
import { Menu, MenuItem, MenuList } from './Menu';
import Item from './Item';
import { getMarginLeft } from './utils';
import { IFileSystemItem_ui } from '../../typings';

interface InnerComponentProps extends ComponentProps<'div'> {
    data: IFileSystemItem_ui[],
    nestingLevel: number
}

export default function FileTree({ data, nestingLevel, ...props }: InnerComponentProps): ReactElement {
    const [showNestedMenu, setShowNestedMenu] = useState(true);

    function onClickMenuItem() {
        setShowNestedMenu(prev => !prev);
    }

    const marginLeft = useMemo(() => getMarginLeft(nestingLevel), [nestingLevel]);

    return (
        <Menu {...props}>
            <MenuList>
                {data.map((item) => {
                    const children: IFileSystemItem_ui[] | undefined = item.children;
                    if (children) {
                        nestingLevel = nestingLevel + 1;
                        return (
                            <MenuItem
                                key={item.id}
                                style={{ marginLeft }}
                                onClick={onClickMenuItem}
                            >
                                <Item item={item} />
                                <FileTree
                                    // handle show/hide via className vs unmount/mount component
                                    // to avoid re-render and resetting of showNestedMenu state
                                    // for n-level nesting
                                    className={showNestedMenu ? 'block' : 'hidden'}
                                    data={children}
                                    nestingLevel={nestingLevel}
                                />
                            </MenuItem>
                        )
                    } else {
                        return (
                            <MenuItem
                                key={item.id}
                                style={{ marginLeft }}
                            >
                                <Item item={item} />
                            </MenuItem>
                        )
                    }
                })
                }
            </MenuList>
        </Menu>
    )
}
