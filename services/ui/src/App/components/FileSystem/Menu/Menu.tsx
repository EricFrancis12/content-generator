import React, { ReactElement, ReactNode } from 'react';
import './Menu.css';

interface MenuProps {
    children: ReactNode
}

export default function Menu({ children, ...props }: MenuProps): ReactElement {
    return (
        <div className='w-full text-white' {...props}>
            {children}
        </div>
    )
}
