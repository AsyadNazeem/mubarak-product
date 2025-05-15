import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ADMIN_PATH } from '../context/constants';

const ProtectedRoute = ({ children }) => {
    const { admin, loading, initialCheckDone, checkAuthStatus } = useAuth();
    useNavigate();
    useEffect(() => {
        const verifyAuth = async () => {
            if (localStorage.getItem('adminToken') && !admin) {
                console.log('Token exists but no user data, re-checking auth status');
                await checkAuthStatus();
            }
        };
        verifyAuth();
    }, [checkAuthStatus, admin]);

    if (loading && !initialCheckDone) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-xl">Loading...</p>
            </div>
        );
    }

    if (!admin) {
        console.log('No authenticated user, redirecting to login');
        return <Navigate to={`${ADMIN_PATH}/login`} replace />;
    }

    return children;
};

export default ProtectedRoute;
