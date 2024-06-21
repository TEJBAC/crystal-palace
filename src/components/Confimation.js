// src/components/Confirmation.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Confirmation.css';

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingDetails } = location.state || {};

  const handleEdit = () => {
    navigate('/booking', { state: { bookingDetails } });
  };

  const handleSendRequest = async () => {
    try {
      await axios.post('http://localhost:5000/api/sendRequest', bookingDetails, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      alert('Booking request sent to admin for verification.');
    } catch (error) {
      alert('Failed to send booking request. Please try again.');
    }
  };

  return (
    <div className="confirmation-container">
      <h2>Booking Confirmation</h2>
      {bookingDetails ? (
        <div className="confirmation-details">
          <p><span>Name:</span> {bookingDetails.name}</p>
          <p><span>Email:</span> {bookingDetails.email_id}</p>
          <p><span>Phone:</span> {bookingDetails.Phone_no}</p>
          <p><span>Date:</span> {bookingDetails.date}</p>
          <p><span>Time:</span> {bookingDetails.time}</p>
          <p><span>Guests:</span> {bookingDetails.guests}</p>
          <p><span>Event:</span> {bookingDetails.event}</p>
          <p><span>Message:</span> {bookingDetails.message}</p>
          <button onClick={handleEdit} className="btn btn-secondary">Edit</button>
          <button onClick={handleSendRequest} className="btn btn-primary">Send Request</button>
        </div>
      ) : (
        <p>No booking details available.</p>
      )}
    </div>
  );
};

export default Confirmation;
