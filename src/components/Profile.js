import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState('');
  const [bookingHistory, setBookingHistory] = useState([]);
  const [profileImage, setProfileImage] = useState('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setUserDetails(response.data.user);
        setBookingHistory(response.data.bookingHistory);
        setProfileImage(response.data.user.profileImage); // Assuming the profile image URL is part of user data
      } catch (err) {
        console.error('Error fetching user details:', err);
        setError('Failed to fetch user details.');
      }
    };

    fetchUserDetails();
  }, []);

  const handleImageUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('profileImage', profileImage);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/uploadProfileImage', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setProfileImage(response.data.profileImage); // Assuming response includes new image URL
      setError('Profile image uploaded successfully.');
    } catch (err) {
      console.error('Error uploading profile image:', err);
      setError('Failed to upload profile image.');
    }
  };

  return (
    <div className="profile-container">
      <h1>Profile</h1>
      {error && <p className="error-message">{error}</p>}
      {userDetails ? (
        <img src={profileImage} alt="Profile" className="profile-image" />
      ) : (
        <p>Loading...</p>
      )}

      {userDetails && (
        <div className="user-details">
          <p><strong>Name:</strong> {userDetails.name}</p>
          <p><strong>Email:</strong> {userDetails.email}</p>
          <p><strong>Membership Type:</strong> {userDetails.membershipType}</p>
          <p><strong>Booking History:</strong></p>
          <ul>
            {bookingHistory.map((booking, index) => (
              <li key={index}>{booking.event} on {booking.date} at {booking.time}</li>
            ))}
          </ul>
          <form onSubmit={handleImageUpload}>
            <label htmlFor="profileImage">Upload Profile Image:</label>
            <input
              type="file"
              id="profileImage"
              name="profileImage"
              onChange={(e) => setProfileImage(e.target.files[0])}
            />
            <button type="submit">Upload</button>
          </form>
        </div>
      )}

    </div>
  );
};

export default Profile;
