import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { useHistory } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    // const history = useHistory(); // React Router v5? Horizon UI uses v6 probably. Let's check package.json.

    useEffect(() => {
        const checkLoggedIn = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await api.get('/users/me');
                    setUser(response.data);
                } catch (error) {
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };
        checkLoggedIn();
    }, []);

    const login = async (email, password) => {
        const formData = new FormData();
        formData.append('username', email);
        formData.append('password', password);

        const response = await api.post('/login/access-token', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        localStorage.setItem('token', response.data.access_token);
        const userResponse = await api.get('/users/me');
        setUser(userResponse.data);
        return userResponse.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        window.location.href = '/auth/sign-in';
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
