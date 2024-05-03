import { randomUUID } from './utils';
import { EFileSystemItemType } from '../../../_shared';
import { IFileSystemItem_ui } from '../../typings';

export const fileSystemItems: IFileSystemItem_ui[] = [{
    name: 'src',
    internalId: '',
    id: randomUUID(),
    type: EFileSystemItemType.FOLDER,
    children: [
        {
            name: 'App.ts',
            internalId: '',
            id: randomUUID(),
            type: EFileSystemItemType.FILE
        },
        {
            name: 'App.css',
            internalId: '',
            id: randomUUID(),
            type: EFileSystemItemType.FILE,
        },
        {
            name: 'Components',
            internalId: '',
            id: randomUUID(),
            type: EFileSystemItemType.FOLDER,
            children: [
                {
                    name: 'Menu',
                    internalId: '',
                    id: randomUUID(),
                    type: EFileSystemItemType.FOLDER,
                    children: [
                        {
                            name: 'Menu.ts',
                            internalId: '',
                            id: randomUUID(),
                            type: EFileSystemItemType.FILE
                        }
                    ]
                }
            ]
        }]
}]
