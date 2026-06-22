import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../../resources/providers/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Component to protect routes - redirects to login if not authenticated
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const authContext = useContext(AuthContext);
  const isAuthenticated = authContext?.isAuthenticated;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
