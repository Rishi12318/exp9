import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getCurrentRole } from './auth';

function ProtectedRoute({ allowedRoles, children }) {
  const role = getCurrentRole();
  const location = useLocation();

  if (!role) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace state={{ unauthorized: true }} />;
  }

  return children;
}

export default ProtectedRoute;
