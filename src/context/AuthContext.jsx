import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Create context
const AuthContext = createContext();

// Import base paths from constants
import { BASE_PATH, ADMIN_PATH } from './constants';

// Authentication provider component
export const AuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [initialCheckDone, setInitialCheckDone] = useState(false);

    // Configure axios defaults
    useEffect(() => {
        axios.defaults.baseURL = 'http://localhost:8000';
        axios.defaults.withCredentials = true;
        axios.defaults.headers.common['Accept'] = 'application/json';
        axios.defaults.headers.common['Content-Type'] = 'application/json';

        // Setup axios interceptor for handling 401 responses
        const interceptor = axios.interceptors.response.use(
            response => response,
            error => {
                if (error.response && error.response.status === 401) {
                    console.log('Unauthorized request detected. Logging out.');
                    // Token expired or invalid, clear auth state
                    handleLogout(false); // Don't make API call for logout
                }
                return Promise.reject(error);
            }
        );

        return () => {
            // Clean up interceptor when component unmounts
            axios.interceptors.response.eject(interceptor);
        };
    }, []);

    // Set up authentication on mount and handle token
    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('adminToken');
            if (token) {
                console.log('Found token in storage, setting Authorization header');
                setAuthHeader(token);
            }
            await checkAuthStatus();
            setInitialCheckDone(true);
        };

        initAuth();
    }, []);

    // Helper to set auth header consistently
    const setAuthHeader = (token) => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    };

    // Helper function to extract JSON from potentially mixed content
    const extractJsonFromResponse = (data) => {
        if (typeof data === 'string') {
            // If the response contains comments or other text before the JSON
            const jsonStartIndex = data.indexOf('{');
            if (jsonStartIndex !== -1) {
                try {
                    return JSON.parse(data.substring(jsonStartIndex));
                } catch (e) {
                    console.error('Failed to parse JSON from string response:', e);
                    return null;
                }
            }
            return null;
        }
        return data; // Already parsed JSON object
    };

    // Check if user is authenticated
    const checkAuthStatus = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');

            if (!token) {
                console.log('No token found, user is not authenticated');
                setAdmin(null);
                setLoading(false);
                return false;
            }

            console.log('Checking auth status with token');

            // Get CSRF cookie first (important for Sanctum)
            try {
                await axios.get('/sanctum/csrf-cookie');
            } catch (csrfError) {
                console.warn('Failed to get CSRF cookie:', csrfError);
                // Continue anyway as it might not be required for token auth
            }

            // Use full API path
            const response = await axios.get('/api/admin/user');
            console.log('Auth check response:', response.data);

            // Process the response data that might contain comments
            const responseData = extractJsonFromResponse(response.data) || response.data;

            if (responseData && (responseData.user || responseData.id)) {
                const userData = responseData.user || responseData;
                console.log('User authenticated:', userData);
                setAdmin(userData);
                return true;
            } else {
                console.warn('Auth check failed: Invalid response format');
                await handleLogout(false);
                return false;
            }
        } catch (error) {
            console.error('Auth check error:', error);
            if (error.response) {
                console.error('Status:', error.response.status);
                console.error('Data:', error.response.data);
            }
            await handleLogout(false);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Login function
    const login = async (email, password) => {
        try {
            console.log('Attempting login with:', { email, password: '***' });

            // Get CSRF cookie first
            try {
                await axios.get('/sanctum/csrf-cookie');
            } catch (csrfError) {
                console.warn('Failed to get CSRF cookie:', csrfError);
                // Continue anyway as it might not be required for token auth
            }

            // Use full API path
            const response = await axios.post('/api/admin/login', {
                email,
                password
            });

            console.log('Login response received:', response.status);

            // Process the response data that might contain comments
            const responseData = extractJsonFromResponse(response.data) || response.data;
            console.log('Processed login data:', responseData);

            if (responseData && responseData.token && (responseData.user || responseData.id)) {
                const userData = responseData.user || responseData;
                const token = responseData.token;

                console.log('Login successful, saving token and user data');
                localStorage.setItem('adminToken', token);
                setAuthHeader(token);
                setAdmin(userData);
                return { success: true };
            } else {
                console.warn('Unexpected login response format:', responseData);
                return {
                    success: false,
                    message: 'Login failed. Unexpected server response format.'
                };
            }
        } catch (error) {
            console.error('Login error:', error);
            if (error.response) {
                console.error('Error response:', error.response.status, error.response.data);
            } else if (error.request) {
                console.error('No response received:', error.request);
            }
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed. Please check your credentials.'
            };
        }
    };

    // Improved logout function with option to skip API call
    const handleLogout = async (callApi = true) => {
        try {
            if (callApi) {
                console.log('Calling logout API');
                await axios.post('/api/admin/logout');
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            console.log('Clearing authentication state');
            localStorage.removeItem('adminToken');
            setAuthHeader(null);
            setAdmin(null);

            // Instead of redirecting here, we'll let the ProtectedRoute handle redirection
        }
    };

    // Get the proper login URL with base path
    const getLoginUrl = () => `${ADMIN_PATH}/login`;

    // Get the proper dashboard URL with base path
    const getDashboardUrl = () => `${ADMIN_PATH}/dashboard`;

    // Get base admin path
    const getBasePath = () => BASE_PATH;

    // Get admin path
    const getAdminPath = () => ADMIN_PATH;

    return (
        <AuthContext.Provider value={{
            admin,
            loading,
            initialCheckDone,
            login,
            logout: () => handleLogout(true),
            checkAuthStatus,
            getLoginUrl,
            getDashboardUrl,
            getBasePath,
            getAdminPath,
            basePath: BASE_PATH,
            adminPath: ADMIN_PATH
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the auth context
export const useAuth = () => {
    return useContext(AuthContext);
};

export class categoryService {
}
