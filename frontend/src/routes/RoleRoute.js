import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const RoleRoute = ({ 
  children, 
  allowedRoles = [], 
  requiredPermissions = [],
  fallbackPath = '/login',
  showLoading = true 
}) => {
  const { isAuthenticated, userRole, hasAllPermissions, isLoading } = useAuthContext();
  const location = useLocation();

  // Show loading if auth is still loading
  if (isLoading && showLoading) {
    return <LoadingSpinner size="medium" text="Đang kiểm tra quyền truy cập..." />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Check if user has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check if user has required permissions
  if (requiredPermissions.length > 0 && !hasAllPermissions(requiredPermissions)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default RoleRoute; 