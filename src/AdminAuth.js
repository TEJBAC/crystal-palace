// src/AdminAuth.js
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAdminAuth } from './AdminAuthContext';

const AdminAuth = ({ component: Component, ...rest }) => {
  const { isAdminAuthenticated } = useAdminAuth();

  return (
    <Route
      {...rest}
      element={isAdminAuthenticated ? <Component /> : <Navigate to="/admin/login" />}
    />
  );
};

export default AdminAuth;
