import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import AuthContext from '../Context/AuthContext';

const Login = ({ setIsLoggedIn }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loginStatus, setLoginStatus] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', formData);
      const { token } = response.data;

      login(token);
      setIsLoggedIn(true); // Update parent state
      setLoginStatus('Login successful!');
      navigate('/profile');
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setLoginStatus('Invalid email or password.');
        } else {
          setLoginStatus('An error occurred. Please try again later.');
        }
      } else {
        setLoginStatus('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {loginStatus && <p>{loginStatus}</p>}
    </div>
  );
};

export default Login;
