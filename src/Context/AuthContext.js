import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedAuthStatus = localStorage.getItem('isAuthenticated');
    const storedToken = localStorage.getItem('token');
    if (storedAuthStatus && storedToken) {
      setIsAuthenticated(JSON.parse(storedAuthStatus));
      setToken(storedToken);
    }
  }, []);

  const login = (token) => {
    setIsAuthenticated(true);
    setToken(token);
    localStorage.setItem('isAuthenticated', true);
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setToken(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
