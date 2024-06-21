import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNavbar from './AdminNavbar'; // Import the AdminNavbar component
import './admin.css'

const Admin = () => {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all'); // Add filter state
  const [isSidebarVisible, setIsSidebarVisible] = useState(true); // State to control sidebar visibility

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
        setBookings(response.data);
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

  const handleApprove = async (bookingId) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        console.error('No token found in localStorage');
        return;
      }

      await axios.post('http://localhost:5000/api/admin/approveBooking', { bookingId }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setBookings(bookings.map(booking => booking.id === bookingId ? { ...booking, status: 'approved' } : booking));
    } catch (error) {
      if (error.response) {
        console.error('Error approving booking:', error.response.status, error.response.data);
      } else {
        console.error('Error approving booking:', error.message);
      }
    }
  };

  const handleReject = async (bookingId) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        console.error('No token found in localStorage');
        return;
      }

      await axios.post('http://localhost:5000/api/admin/rejectBooking', { bookingId }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setBookings(bookings.map(booking => booking.id === bookingId ? { ...booking, status: 'rejected' } : booking));
    } catch (error) {
      if (error.response) {
        console.error('Error rejecting booking:', error.response.status, error.response.data);
      } else {
        console.error('Error rejecting booking:', error.message);
      }
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  const toggleSidebar = () => {
    setIsSidebarVisible(isSidebarVisible);
  };

  return (
    <div className="admin-wrapper">

      <AdminNavbar onButtonClick={toggleSidebar} /> {/* Pass the toggle function as prop */}
      <div className={`admin-container ${isSidebarVisible ? 'open' : ''}`}>
        <h2 className="admin-header">Admin Bookings</h2>
        <div className="admin-filters">
          <button onClick={() => setFilter('all')}>All</button>
          <button onClick={() => setFilter('approved')}>Approved</button>
          <button onClick={() => setFilter('rejected')}>Rejected</button>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map(booking => (
              <tr key={booking.id}>
                <td>{booking.name}</td>
                <td>{booking.email_id}</td>
                <td>{booking.date}</td>
                <td>{booking.status}</td>
                <td className="admin-buttons">
                  {booking.status === 'pending' && (
                    <>
                      <button className="admin-button approve" onClick={() => handleApprove(booking.id)}>Approve</button>
                      <button className="admin-button reject" onClick={() => handleReject(booking.id)}>Reject</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admin;
