import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import useColorMode from './hooks/useColorMode';
import Loader from './components/Loader';
import PageTitle from './components/PageTitle';
import Campaigns from './pages/Campaigns';
import Home from './pages/Home';
import Content from './pages/Content';
import Files from './pages/Files';
import Queues from './pages/Queues';

export default function App() {
    useColorMode();

    const [loading] = useState<boolean>(false);
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return loading ? (
        <Loader />
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
