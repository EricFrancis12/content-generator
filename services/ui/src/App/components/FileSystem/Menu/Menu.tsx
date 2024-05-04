import React, { ReactElement, ReactNode } from 'react';
import './Menu.css';

export default function Menu({ children, ...props }: {
    children: ReactNode
}): ReactElement {
    return (
        <div className='w-full text-white' {...props}>
            {children}
        </div>
    )
}
