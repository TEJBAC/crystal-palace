import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/admin/login', { username, password });
      const { token, role } = response.data;

      localStorage.setItem('adminToken', token);

      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError('Login failed. Please check your username and password.');
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <h2>Admin Login</h2>
        <form className="admin-login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <button type="submit">Login</button>
        </form>
        {error && <div className="admin-login-error">{error}</div>}
      </div>
    </div>
  );
};

export default AdminLogin;
