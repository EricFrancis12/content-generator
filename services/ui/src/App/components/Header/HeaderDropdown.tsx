import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { selectauthToken, change } from '../../store/reducers/authTokenReducer';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

export default function HeaderDropdown() {
    const authToken = useAppSelector(selectauthToken);
    const dispatch = useAppDispatch();

    const [dropdownOpen, setDropdownOpen] = useState(false);

    const trigger = useRef<HTMLAnchorElement | null>(null);
    const dropdown = useRef<HTMLDivElement | null>(null);

    // close on click outside
    useEffect(() => {
        const clickHandler = ({ target }: MouseEvent) => {
            if (!dropdown.current) return;
            if (
                !dropdownOpen ||
                dropdown.current.contains(target as HTMLElement) ||
                trigger.current?.contains(target as HTMLElement)
            )
                return;
            setDropdownOpen(false);
        };
        document.addEventListener('click', clickHandler);
        return () => document.removeEventListener('click', clickHandler);
    });

    // close if the esc key is pressed
    useEffect(() => {
        const keyHandler = ({ keyCode }: KeyboardEvent) => {
            if (!dropdownOpen || keyCode !== 27) return;
            setDropdownOpen(false);
        };
        document.addEventListener('keydown', keyHandler);
        return () => document.removeEventListener('keydown', keyHandler);
    });

    return (
        <div className='relative'>
            <Link
                ref={trigger}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className='flex items-center gap-4'
                to='#'
            >
                <svg
                    className='block fill-current'
                    width='12'
                    height='8'
                    viewBox='0 0 12 8'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                >
                    <path
                        fillRule='evenodd'
                        clipRule='evenodd'
                        d='M0.410765 0.910734C0.736202 0.585297 1.26384 0.585297 1.58928 0.910734L6.00002 5.32148L10.4108 0.910734C10.7362 0.585297 11.2638 0.585297 11.5893 0.910734C11.9147 1.23617 11.9147 1.76381 11.5893 2.08924L6.58928 7.08924C6.26384 7.41468 5.7362 7.41468 5.41077 7.08924L0.410765 2.08924C0.0853277 1.76381 0.0853277 1.23617 0.410765 0.910734Z'
                        fill=''
                    />
                </svg>
            </Link>
            <div
                ref={dropdown}
                onFocus={() => setDropdownOpen(true)}
                onBlur={() => setDropdownOpen(false)}
                className={`absolute right-0 mt-4 flex flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ${dropdownOpen === true ? 'block' : 'hidden'
                    }`}
            >
                <ul className='flex flex-col gap-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark'>
                    <li>
                        <input
                            className='px-6 py-4 text-sm font-medium lg:text-base border border-black rounded-lg'
                            placeholder='Auth Token'
                            value={authToken}
                            onChange={e => dispatch(change(e.target.value))}
                        />
                    </li>
                </ul>
            </div>
        </div>
    )
}
