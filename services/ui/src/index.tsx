import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App/App';
import './App/assets/css/style.css';
import './App/assets/css/satoshi.css';
import { AuthProvider } from './App/contexts/useAuthContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <AuthProvider>
            <Router>
                <App />
            </Router>
        </AuthProvider>
    </React.StrictMode>
);
