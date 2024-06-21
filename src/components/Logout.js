// Logout.js
import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../Context/AuthContext';

const Logout = ({ setIsLoggedIn }) => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    setIsLoggedIn(false); // Update parent state
    navigate('/');
  }, [logout, navigate, setIsLoggedIn]);

  return null;
};

export default Logout;
