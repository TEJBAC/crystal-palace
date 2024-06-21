import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    handleGetData();
  }, []);

  const handleGetData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setError('No token found, please log in again.');
        return;
      }
      console.log('Token found:', token); // Log token for debugging
      const response = await axios.get('http://localhost:5000/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.data) {
        setData(response.data);
        setNotifications(response.data.notifications || []);
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setError('Access forbidden: Invalid or expired token');
      } else {
        setError('Failed to fetch data');
      }
      console.error('Error fetching data:', error); // Log error for debugging
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/login';
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-header">Admin Dashboard</h2>
      <div className="dashboard-buttons">
        <button className="dashboard-button" onClick={handleGetData} disabled={loading}>
          Get Data
        </button>
        <button className="dashboard-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {notifications.length > 0 && (
        <div className="notification-bar">
          <h3>Notifications</h3>
          <ul>
            {notifications.map((notification, index) => (
              <li key={index}>{notification}</li>
            ))}
          </ul>
        </div>
      )}
      {data && (
        <div>
          <div className="dashboard-stats">
            <div className="dashboard-card">
              <h3>Total Bookings</h3>
              <p>{data.totalBookings}</p>
            </div>
            <div className="dashboard-card">
              <h3>Total Revenue</h3>
              <p>${data.totalRevenue}</p>
            </div>
            <div className="dashboard-card">
              <h3>Total Profit</h3>
              <p>${data.totalProfit}</p>
            </div>
            <div className="dashboard-card">
              <h3>Number of Employees</h3>
              <p>{data.numberOfEmployees}</p>
            </div>
            <div className="dashboard-card">
              <h3>Attendance</h3>
              <p>{data.attendance}%</p>
            </div>
            <div className="dashboard-card">
              <h3>Total Maintenance</h3>
              <p>${data.totalMaintenance}</p>
            </div>
          </div>
          <div className="dashboard-calendar">
            <h3>Booking Calendar</h3>
            <div style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '5px' }}>
              Calendar Component
            </div>
          </div>
          <div className="booking-details">
            <h3>Upcoming Bookings</h3>
            {data.upcomingBookings && data.upcomingBookings.slice(0, 3).map((booking, index) => (
              <div key={index}>
                <p>{booking.date}: {booking.name} ({booking.status})</p>
              </div>
            ))}
          </div>
          <h3>Dashboard Data</h3>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
