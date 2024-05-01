import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import useColorMode from './hooks/useColorMode';
import Loader from './components/Loader';
import PageTitle from './components/PageTitle';
import Campaigns from './pages/campaigns/Campaigns';
import Home from './pages/Home';
import Content from './pages/Content';
import Files from './pages/Files';
import Queues from './pages/Queues';
import EditCampaign from './pages/campaigns/EditCampaign';
import NewCampaign from './pages/campaigns/NewCampaign';
import ViewCampaign from './pages/campaigns/ViewCampaign';

export default function App() {
    useColorMode();

    const [loading] = useState<boolean>(false);
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return loading ? (
        <div className='flex h-screen items-center justify-center bg-white'>
            <Loader />
        </div>
    ) : (
        <>
            <Routes>
                <Route
                    index
                    element={
                        <>
                            <PageTitle title='Home' />
                            <Home />
                        </>
                    }
                />
                <Route
                    path='/campaigns'
                    element={
                        <>
                            <PageTitle title='Campaigns' />
                            <Campaigns />
                        </>
                    }
                />
                <Route
                    path='/campaigns/new'
                    element={
                        <>
                            <PageTitle title='New Campaign' />
                            <NewCampaign />
                        </>
                    }
                />
                <Route
                    path='/campaigns/:campaign_id'
                    element={
                        <>
                            <PageTitle title='View Campaign' />
                            <ViewCampaign />
                        </>
                    }
                />
                <Route
                    path='/campaigns/:campaign_id/edit'
                    element={
                        <>
                            <PageTitle title='Edit Campaign' />
                            <EditCampaign />
                        </>
                    }
                />
                <Route
                    path='/queues'
                    element={
                        <>
                            <PageTitle title='Queues' />
                            <Queues />
                        </>
                    }
                />
                <Route
                    path='/content'
                    element={
                        <>
                            <PageTitle title='Content' />
                            <Content />
                        </>
                    }
                />
                <Route
                    path='/files'
                    element={
                        <>
                            <PageTitle title='Files & Storage' />
                            <Files />
                        </>
                    }
                />
            </Routes>
        </>
    )
}
