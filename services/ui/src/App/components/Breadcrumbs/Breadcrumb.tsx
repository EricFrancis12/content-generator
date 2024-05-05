import React from 'react';
import { Link } from 'react-router-dom';

interface BreadcrumbProps {
    pageName: string,
    links?: {
        text: string,
        to: string
    }[]
}

export default function Breadcrumb({ pageName, links = [] }: BreadcrumbProps) {
    return (
        <div className='mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
            <h2 className='text-title-md2 font-semibold text-black dark:text-white'>
                {pageName}
            </h2>
            <nav>
                <ol className='flex items-center gap-2'>
                    <li>
                        <Link className='font-medium' to='/'>
                            Dashboard /
                        </Link>
                        {links.map((link, index) => (
                            <Link key={index} className='font-medium' to={link.to}>
                                {link.text}
                            </Link>
                        ))}
                    </li>
                    <li className='font-medium text-primary'>{pageName}</li>
                </ol>
            </nav>
        </div>
    )
}
