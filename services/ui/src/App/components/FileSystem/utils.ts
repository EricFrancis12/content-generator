import crypto from 'crypto';
import { IFileSystemItem_ui } from '../../typings';

const defaultMarginLeft = 4;

export function getMarginLeft(nestingLevel: number): string {
    return `${defaultMarginLeft + (defaultMarginLeft * (nestingLevel + 1))}px`;
}

export function randomUUID() {
    return crypto.randomBytes(64).join('');
}

/**
 * Update the item (value update in this case)
 * Works for n-level nesting
 * @param data
 * @param item
 * @param newItem
 */
export function updateItem({ data, item, newItem }: {
    data: IFileSystemItem_ui[],
    item: IFileSystemItem_ui,
    newItem: IFileSystemItem_ui
}): IFileSystemItem_ui[] {
    return data.map((element: IFileSystemItem_ui): IFileSystemItem_ui => {
        if (element.id === item.id) {
            element = newItem;
        } else if (element.children) {
            element.children = updateItem({ data: element.children, item, newItem });
        }
        return element;
    });
}

/**
 * Add child element to the parent based on id matching
 * Works for n-level nesting
 * @param data
 * @param parentItem
 * @param newItem
 */
export function addChildren({ data, parentItem, newItem }: {
    data: IFileSystemItem_ui[],
    parentItem: IFileSystemItem_ui,
    newItem: IFileSystemItem_ui
}): IFileSystemItem_ui[] {
    return data.map((element: IFileSystemItem_ui): IFileSystemItem_ui => {
        if (element.id === parentItem.id) {
            if (element.children) {
                element.children = [...element.children, newItem];
            } else {
                element.children = [newItem];
            }
        } else if (element.children) {
            element.children = addChildren({ data: element.children, parentItem, newItem });
        }
        return element;
    });
}

/**
 * Function to remove all empty values from the array
 * @param data
 */
export function runDataCleanUp(data: IFileSystemItem_ui[]): IFileSystemItem_ui[] {
    return data.filter((element: IFileSystemItem_ui): boolean => {
        // bottom-up approach
        // check all leaf nodes and then reach to the parent element
        if (element.children) {
            element.children = runDataCleanUp(element.children);
        }
        return element.name.trim().length > 0;
    });
}
