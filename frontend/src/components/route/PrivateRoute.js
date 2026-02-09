import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';

const PrivateRoute = ({ children, roles = [] }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>; // Replace with proper loading spinner
    }

    if (!user) {
        return <Navigate to="/auth/sign-in" replace />;
    }

    if (roles.length > 0 && !roles.includes(user.role?.name)) {
        // If user doesn't have required role, redirect to dashboard or 403
        return <Navigate to="/admin/default" replace />;
    }

    return children ? children : <Outlet />;
};

export default PrivateRoute;
