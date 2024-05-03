

export function ComponentGroup({ children }: {
    children?: React.ReactNode
}) {
    return (
        <div className='flex flex-col gap-8 sm:gap-4 w-full md:w-[unset] md:min-w-[600px] px-2 py-4 bg-slate-800 rounded-lg'>
            {children}
        </div>
    )
}

export function ComponentWrapper({ children }: {
    children?: React.ReactNode
}) {
    return (
        <div className='flex flex-col items-center sm:flex-row sm:justify-between sm:items-center gap-4 w-full px-1'>
            {children}
        </div>
    )
}

export function ComponentTitle({ title }: {
    title: string
}) {
    return (
        <div className='w-full px-1'>
            <span className='px-1'>{title}</span>
        </div>
    )
}
