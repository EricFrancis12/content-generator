import React, { useState, useContext } from 'react';

const AuthContext = React.createContext({
    authToken: '',
    setAuthToken: (/* eslint-disable */ newAuthToken: string /* eslint-enable */) => null
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
    const [authToken, setAuthToken] = useState('');

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
