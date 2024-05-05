import React, { ReactElement, ReactNode } from 'react';

export default function MenuList({ children }: {
    children: ReactNode[]
}): ReactElement | null {
    if (children?.length < 1) return null;

    return (
        <ul>
            {children.map((item) => item)}
        </ul>
    )
}
