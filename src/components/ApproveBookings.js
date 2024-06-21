import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNavbar from './AdminNavbar';
import './approvedBookings.css';

const ApprovedBookings = () => {
  const [bookings, setBookings] = useState([]);

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
            Authorization: `Bearer ${token}`
          }
        });
        setBookings(response.data.filter(booking => booking.status === 'approved'));
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

  return (
    <div className="admin-container">
      <AdminNavbar />
      <div className="content">
        <h2 className="admin-header">Approved Bookings</h2>
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

export default ApprovedBookings;
