import crypto from 'crypto';
import { IFileSystemItem_ui } from '../../typings';

const defaultMarginLeft = 4;

export const getMarginLeft = (nestingLevel: number): string => {
    return `${defaultMarginLeft + (defaultMarginLeft * (nestingLevel + 1))}px`;
}

export const randomUUID = () => crypto.randomBytes(64).join('');

/**
 * Update the item (value update in this case)
 * Works for n-level nesting
 * @param data
 * @param item
 * @param newItem
 */
export const updateItem = ({ data, item, newItem }: {
    data: IFileSystemItem_ui[],
    item: IFileSystemItem_ui,
    newItem: IFileSystemItem_ui
}): IFileSystemItem_ui[] => {
    return data.map((element: IFileSystemItem_ui): IFileSystemItem_ui => {
        if (element.id === item.id) {
            element = newItem;
        } else if (element.children) {
            element.children = updateItem({ data: element.children, item, newItem })
        }
        return element;
    })
}

/**
 * Add child element to the parent based on id matching
 * Works for n-level nesting
 * @param data
 * @param parentItem
 * @param newItem
 */
export const addChildren = ({ data, parentItem, newItem }: {
    data: IFileSystemItem_ui[],
    parentItem: IFileSystemItem_ui,
    newItem: IFileSystemItem_ui
}): IFileSystemItem_ui[] => {
    return data.map((el: IFileSystemItem_ui): IFileSystemItem_ui => {
        if (el.id === parentItem.id) {
            if (el.children) {
                el.children = [...el.children, newItem];
            } else {
                el.children = [newItem];
            }
        } else if (el.children) {
            el.children = addChildren({ data: el.children, parentItem, newItem })
        }
        return el;
    })
}

/**
 * Function to remove all empty values from the array
 * @param data
 */
export const runDataCleanUp = (data: IFileSystemItem_ui[]): IFileSystemItem_ui[] => {
    return data.filter((element: IFileSystemItem_ui): boolean => {
        // bottom-up approach
        // check all leaf nodes and then reach to the parent element
        if (element.children) {
            element.children = runDataCleanUp(element.children)
        }
        return element.name.trim().length > 0;
    })
}
