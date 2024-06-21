import React, { useState } from 'react';
import './BookingForm.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BookingForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email_id: '',
    Phone_no: '', // Updated to phone_no
    date: '',
    time: '',
    guests: '',
    message: '',
    event: 'default' // Initialize event field with a default value
  });
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post('http://localhost:5000/api/bookings', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setStatusMessage('Booking successful!');
      navigate('/confirmation', { state: { bookingDetails: formData } });
    } catch (error) {
      setStatusMessage('Booking failed. Please try again.');
    }
    setIsLoading(false);
  };

  return (
    <div className="booking-form-container">
      <h2>Book Your Event</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email_id">Email:</label>
          <input
            type="email"
            id="email_id"
            name="email_id"
            value={formData.email_id}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone_no">Phone:</label>
          <input
            type="tel"
            id="Phone_no"
            name="Phone_no"
            value={formData.Phone_no}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="time">Time:</label>
          <input
            type="time"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="guests">Number of Guests:</label>
          <input
            type="number"
            id="guests"
            name="guests"
            value={formData.guests}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="event">Event:</label>
          <select
            id="event"
            name="event"
            value={formData.event}
            onChange={handleChange}
            required
          >
            <option value="default">Select an event</option>
            <option value="wedding">Wedding</option>
            <option value="birthday">Birthday</option>
            <option value="corporate">Corporate</option>
            <option value="party">Party</option>
          </select>
        </div>
        <br />
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
      {statusMessage && <p>{statusMessage}</p>}
    </div>
  );
};

export default BookingForm;
