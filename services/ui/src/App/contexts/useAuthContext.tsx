import React, { useState, useEffect, useContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const AuthContext = React.createContext({
    authToken: '',
    setAuthToken: (/* eslint-disable */ newAuthToken: string /* eslint-enable */): void => { }
});

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('Component must be used within an AuthContext provider');
    }
    return context;
}

export function AuthProvider({ children }: {
    children: React.ReactNode
}) {
    const [storedAuthToken, setStoredAuthToken] = useLocalStorage('auth-token', '');
    const [authToken, setAuthToken] = useState(storedAuthToken);

    useEffect(() => {
        setStoredAuthToken(authToken);
    }, [authToken, setStoredAuthToken]);

    const value = {
        authToken,
        setAuthToken
    };

    return (
        <AuthContext.Provider value={value} >
            {children}
        </AuthContext.Provider>
    )
}
