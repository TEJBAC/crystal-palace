import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNavbar from './AdminNavbar';
import './RejectedBooking.css';

const RejectedBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false); // State to control sidebar visibility

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          console.error('No token found in localStorage');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/admin/bookings', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setBookings(response.data.filter(booking => booking.status === 'rejected'));
      } catch (error) {
        if (error.response) {
          console.error('Error fetching bookings:', error.response.status, error.response.data);
        } else {
          console.error('Error fetching bookings:', error.message);
        }
      }
    };

    fetchBookings();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className={`admin-container ${isSidebarVisible ? 'open' : ''}`}>
      <div className="toggle-button" onClick={toggleSidebar}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <AdminNavbar />
      <div className="admin-content">
        <h2 className="admin-header">Rejected Bookings</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <tr key={booking.id}>
                <td>{booking.name}</td>
                <td>{booking.email_id}</td>
                <td>{booking.date}</td>
                <td>{booking.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RejectedBookings;
