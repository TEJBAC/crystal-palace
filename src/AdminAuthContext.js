// src/AdminAuthContext.js
import React, { createContext, useState, useContext } from 'react';

const AdminAuthContext = createContext();

export const useAdminAuth = () => useContext(AdminAuthContext);

export const AdminAuthProvider = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(localStorage.getItem('adminToken') !== null);

  const login = (token) => {
    localStorage.setItem('adminToken', token);
    setIsAdminAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setIsAdminAuthenticated(false);
  };

  return (
    <AdminAuthContext.Provider value={{ isAdminAuthenticated, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
