import React, { ReactElement, ReactNode, MouseEvent, LinkHTMLAttributes } from 'react';

interface MenuItemProps extends LinkHTMLAttributes<any> {
    children: ReactNode;
    onClick?: () => void;
}

export const MenuItem = ({ children, onClick, ...props }: MenuItemProps): ReactElement => {
    const handleOnClick = (event: MouseEvent<HTMLLIElement>): void => {
        event.preventDefault();
        event.stopPropagation();
        if (onClick) {
            onClick();
        }
    }

    return (
        <li
            {...props}
            className='m-0 pt-1 cursor-pointer'
            style={{
                listStyle: 'none'
            }}
            onClick={handleOnClick}
        >
            {children}
        </li>
    )
}
