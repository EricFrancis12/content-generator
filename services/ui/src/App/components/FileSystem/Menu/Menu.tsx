import React, { ReactElement, ReactNode } from 'react';

interface MenuProps {
    children: ReactNode
}

export const Menu = ({ children, ...props }: MenuProps): ReactElement => {
    return (
        <div
            className='w-full text-white [&_svg]:mr-2'
            {...props}
        >
            {children}
        </div>
    )
}
