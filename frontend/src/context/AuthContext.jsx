import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on mount
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        try {
            const response = await authAPI.login(credentials);
            const { token, body } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(body.user));
            setUser(body.user);

            return { success: true, user: body.user };
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed';
            return { success: false, error: message };
        }
    };

    const signupUser = async (userData) => {
        try {
            const response = await authAPI.signupUser(userData);
            const { token, body } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(body.user));
            setUser(body.user);

            return { success: true, user: body.user };
        } catch (error) {
            const message = error.response?.data?.message || 'Signup failed';
            return { success: false, error: message };
        }
    };

    const signupAdmin = async (adminData) => {
        try {
            const response = await authAPI.signupAdmin(adminData);
            const { token, body } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(body.user));
            setUser(body.user);

            return { success: true, user: body.user };
        } catch (error) {
            const message = error.response?.data?.message || 'Admin signup failed';
            return { success: false, error: message };
        }
    };

    const logout = async () => {
        try {
            await authAPI.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
        }
    };

    const updateUserData = (updatedUser) => {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    const value = {
        user,
        loading,
        login,
        signupUser,
        signupAdmin,
        logout,
        updateUserData,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
