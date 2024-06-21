import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './admin.css';

const AdminNavbar = ({ onButtonClick }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
    onButtonClick(); // Call the parent function to handle sidebar visibility
  };

  return (
    <div className={`admin-navbar ${isOpen ? 'open' : ''}`}>
      <div className="toggle-button" onClick={toggleNavbar}>
        <span className={isOpen ? 'open' : ''}></span>
        <span className={isOpen ? 'open' : ''}></span>
        <span className={isOpen ? 'open' : ''}></span>
      </div>
      <h3>Admin Panel</h3>
      <nav>
        <ul>
          <li><Link to="/admin/dashboard">Dashboard</Link></li>
          <li><Link to="/admin/approved-bookings">Approved Bookings</Link></li>
          <li><Link to="/admin/rejected-bookings">Rejected Bookings</Link></li>
          <li><Link to="/admin">Pending Bookings</Link></li>
          <li><Link to="/admin/logout">Logout</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminNavbar;
