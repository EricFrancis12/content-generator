import React, { useState, ReactNode } from 'react';
import Header from '../components/Header/index';
import Sidebar from '../components/Sidebar/index';

const DefaultLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const sidebarLinks = [
        {
            name: "Home",
            href: "/"
        },
        {
            name: "Campaigns",
            href: "/campaigns"
        },
        {
            name: "Queues",
            href: "/queues"
        },
        {
            name: "Content",
            href: "/content"
        },
        {
            name: "Files & Storage",
            href: "/files"
        }
    ];

    return (
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
            <div className="flex h-screen overflow-hidden">
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} links={sidebarLinks} />
                <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                    <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                    <main>
                        <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}

export default DefaultLayout;
