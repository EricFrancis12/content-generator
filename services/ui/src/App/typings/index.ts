import { IFileSystemItem } from '../../_shared';

export type TPagination = '<<' | '<' | number | '...' | '>' | '>>';

export interface IFileSystemItem_ui extends IFileSystemItem {
    id: string,
    children?: IFileSystemItem_ui[]
}
