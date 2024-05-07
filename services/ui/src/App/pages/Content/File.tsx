import React from 'react';
import XButton from '../../components/XButton';

export default function File({ file, setFile }: {
    file: File,
    setFile: React.Dispatch<React.SetStateAction<File | null>>
}) {
    return (
        <div className='relative flex gap-2 sm:justify-center sm:items-center h-[fit-content] p-2 border rounded-lg'>
            <div
                className='absolute flex justify-center items-center h-[0px] w-[0px]'
                style={{
                    top: 0,
                    left: 0
                }}
            >
                <XButton onClick={() => setFile(null)} />
            </div>
            <div className='overflow-hidden'>
                {file.name}
            </div>
        </div>
    )
}
