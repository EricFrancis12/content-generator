import React from 'react';
import './FileSystem.css';
import FileTree from './FileTree';
import { IFileSystemItem_ui } from '../../typings';

export default function FileSystem({ data }: {
    data: IFileSystemItem_ui[],
}) {
    return (
        <div className='container'>
            <FileTree
                data={data}
                nestingLevel={0}
            />
        </div>
    )
}
