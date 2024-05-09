import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './App/store/store';
import App from './App/App';
import './App/assets/css/style.css';
import './App/assets/css/satoshi.css';
import { FileDownloadProvider } from './App/contexts/FileDownloadContext';
import { Toaster } from 'react-hot-toast';
import QueuesPoller from './App/components/QueuesPoller';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <Provider store={store}>
            <Toaster position='top-center' />
            <QueuesPoller />
            <FileDownloadProvider>
                <Router>
                    <App />
                </Router>
            </FileDownloadProvider>
        </Provider >
    </React.StrictMode>
);
