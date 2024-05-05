import React, { ReactElement, ReactNode, MouseEvent, LinkHTMLAttributes } from 'react';

interface MenuItemProps extends LinkHTMLAttributes<HTMLElement> {
    children: ReactNode,
    onClick?: () => void
}

export default function MenuItem({ children, onClick, ...props }: MenuItemProps): ReactElement {
    function handleOnClick(event: MouseEvent<HTMLLIElement>): void {
        event.preventDefault();
        event.stopPropagation();
        if (onClick) {
            onClick();
        }
    }

    return (
        <li {...props} onClick={handleOnClick}>
            {children}
        </li>
    )
}
