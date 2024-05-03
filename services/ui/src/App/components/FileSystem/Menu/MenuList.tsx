import React, { ReactElement, ReactNode } from 'react';

interface MenuListProps {
    children: ReactNode[]
}

export default function MenuList({ children }: MenuListProps): ReactElement | null {
    if (children?.length < 1) return null;

    return (
        <ul>
            {children.map((item) => item)}
        </ul>
    )
}
