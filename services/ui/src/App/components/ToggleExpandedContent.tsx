import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';

export default function ToggleExpandedContent({ title, icon, children, initialExpanded = false, className = '', style = {} }: {
    title?: React.ReactNode,
    icon?: IconDefinition,
    children: React.ReactNode,
    initialExpanded?: boolean,
    className?: string,
    style?: React.CSSProperties
}) {
    const [expanded, setExpanded] = useState(initialExpanded);

    return (
        <div className={className} style={style}>
            <div
                className='flex justify-between items-center gap-4 w-full cursor-pointer'
                onClick={() => setExpanded(prevExpanded => !prevExpanded)}
            >
                <div className='flex items-center'>
                    {icon && <FontAwesomeIcon icon={icon} className='pr-2' />}
                    {title}
                </div>
                <FontAwesomeIcon icon={expanded ? faChevronUp : faChevronDown} />
            </div>
            {expanded && children}
        </div>
    )
}
