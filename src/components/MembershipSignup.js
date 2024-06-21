import React, { useState } from 'react';
import axios from 'axios';
import './MembershipSignup.css';

const MembershipSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    membershipType: ''
  });
  const [submissionStatus, setSubmissionStatus] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/signup', formData);
      setSubmissionStatus('Form submitted successfully!');
      console.log('Form submitted:', response.data);
    } catch (error) {
      setSubmissionStatus('Form submission failed.');
      console.error('There was an error submitting the form:', error);
    }
  };

  return (
    <div className="membership-container">
      <h1 className="membership-title">Membership Signup</h1>
      <form onSubmit={handleSubmit} className="membership-form">
        <div className="form-group">
          <label className="form-label">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
        <div className='form-group'>
          <label className="form-label">Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Membership Type:</label>
          <select
            name="membershipType"
            value={formData.membershipType}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">Select</option>
            <option value="bronze">Bronze</option>
            <option value="silver">Silver</option>
            <option value="gold">Gold</option>
          </select>
        </div>
        <button type="submit" className="form-button">Submit</button>
      </form>
      {submissionStatus && <p className="submission-status">{submissionStatus}</p>}
    </div>
  );
};;

export default MembershipSignup;
