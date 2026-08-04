import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    // const { currentUser, userRole, loading } = useAuth();
    // const location = useLocation();

    // Protection disabled as per user request
    return children;
};

export default ProtectedRoute;
