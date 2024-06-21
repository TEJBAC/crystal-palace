import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Header from './components/Header';
import About from './components/About';
import Services from './components/Services';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Profile from './components/Profile';
import Gallery from './components/Gallery';
import Login from './components/Login';
import Logout from './components/Logout';
import BookingForm from './components/BookingForm';
import Confirmation from './components/Confimation';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './Context/AuthContext';
import { AdminAuthProvider } from './AdminAuthContext';
import MembershipSignup from './components/MembershipSignup';
import Admin from './components/Admin';
import ApprovedBookings from './components/ApproveBookings'; // Ensure this is imported correctly
import RejectedBookings from './components/RejectedBookings'; // Ensure this is imported correctly
import './css/styles.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  return (
    <AuthProvider>
      <AdminAuthProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Header />} />
            <Route path="/membership_signup" element={<MembershipSignup />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/profile" element={<ProtectedRoute isLoggedIn={isLoggedIn}><Profile /></ProtectedRoute>} />
            <Route path="/logout" element={<Logout setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/booking" element={<ProtectedRoute isLoggedIn={isLoggedIn}><BookingForm /></ProtectedRoute>} />
            <Route path="/confirmation" element={<ProtectedRoute isLoggedIn={isLoggedIn}><Confirmation /></ProtectedRoute>} />
            <Route path="/admin" element={<Admin setIsAdminAuthenticated={setIsAdminAuthenticated} />} />
            <Route path="/admin/login" element={<AdminLogin setIsAdminAuthenticated={setIsAdminAuthenticated} />} />
            <Route path="/admin/dashboard" element={<AdminDashboard setIsAdminAuthenticated={isAdminAuthenticated}><AdminDashboard /></AdminDashboard>} />
            <Route path="/admin/approved-bookings" element={<ApprovedBookings setIsAdminAuthenticated={isAdminAuthenticated}><ApprovedBookings /></ApprovedBookings>} />
            <Route path="/admin/rejected-bookings" element={<RejectedBookings setIsAdminAuthenticated={isAdminAuthenticated}><RejectedBookings /></RejectedBookings>} />
          </Routes>
          <About />
          <Services />
          <Testimonials />
          <Footer />
        </Router>
      </AdminAuthProvider>
    </AuthProvider>
  );
};

export default App;
