import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App/App';
import './App/assets/css/style.css';
import './App/assets/css/satoshi.css';

import { Provider } from 'react-redux';
import { store } from './App/store/store';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <Provider store={store}>
            <Router>
                <App />
            </Router>
        </Provider >
    </React.StrictMode>
);
