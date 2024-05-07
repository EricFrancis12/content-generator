import React from 'react';

export default function Loader({ style }: {
    style?: React.CSSProperties
}) {
    return (
        <div
            className='h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent'
            style={style}
        />
    )
}
