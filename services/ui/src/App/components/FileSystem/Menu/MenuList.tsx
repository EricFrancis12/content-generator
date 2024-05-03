import React, { ReactElement, ReactNode } from 'react';

interface MenuListProps {
    children: ReactNode[]
}

export const MenuList = ({ children }: MenuListProps): ReactElement | null => {
    if (children?.length < 1) return null;

    return (
        <ul
            className='m-0 pt-1 cursor-pointer'
            style={{
                listStyle: 'none'
            }}
        >
            {children.map((item) => item)}
        </ul>
    )
}