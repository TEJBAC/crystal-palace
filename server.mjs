import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { sequelize, Membership, Booking, Admin } from './db.js';
import authenticateToken from './authMiddleware.js';
import {authenticateAdmin} from './authMiddleware.js';
import multer from 'multer';
import path from 'path';

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

const JWT_SECRET = process.env.JWT_SECRET;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

sequelize.sync()
  .then(() => console.log('Database synced'))
  .catch((err) => console.error('Unable to sync the database:', err));

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: EMAIL_USER,
    to,
    subject,
    text
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 } // 1MB
}).single('profileImage');

// Membership signup
app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password, membershipType } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const membership = await Membership.create({ name, email, password: hashedPassword, membershipType });
    res.status(201).json(membership);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Membership login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const membership = await Membership.findOne({ where: { email } });
    if (!membership || !(await bcrypt.compare(password, membership.password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: membership.id, email: membership.email }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ error: 'An error occurred during login' });
  }
});

// Booking
app.get('/api/admin/dashboard', authenticateAdmin, (req, res) => {
  // Your dashboard logic here
  res.json({
    totalBookings: 100,
    totalRevenue: 5000,
    totalProfit: 2000,
    numberOfEmployees: 50,
    attendance: 95,
    totalMaintenance: 500,
    notifications: ['Notification 1', 'Notification 2'],
    upcomingBookings: [
      { date: '2023-06-15', name: 'Booking 1', status: 'Confirmed' },
      { date: '2023-06-16', name: 'Booking 2', status: 'Pending' },
    ],
  });
});

app.post('/api/bookings', authenticateToken, async (req, res) => {
  try {
    const { name, email_id, Phone_no, date, time, guests, message, event } = req.body;

    if (!name || !email_id || !Phone_no || !date || !time || !guests || !message || !event) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const booking = await Booking.create({
      name,
      email_id,
      Phone_no,
      date,
      time,
      guests,
      message,
      event,
      status: 'pending',
      userId: req.user.id,
    });

    // Send confirmation email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email_id, // Using the provided email_id for the booking
      subject: 'Booking Confirmation',
      text: `Dear ${name},\n\nYour booking for the event "${event}" on ${date} at ${time} has been received. We look forward to hosting you and your ${guests} guests.\n\nMessage: ${message}\n\nThank you!`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ error: 'Failed to send confirmation email' });
      }
      res.status(201).json({ booking, emailStatus: 'Confirmation email sent' });
    });
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(500).json({ error: err.message });
  }
});


// Admin: Get all bookings
app.get('/api/admin/bookings', authenticateAdmin, async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }
  try {
    const bookings = await Booking.findAll(); // Adjust according to your schema
    res.status(200).json(bookings);
  } catch (err) {
    console.error('Error fetching bookings:', err);
    return next(err);
  }
});

app.post('/api/sendRequest',authenticateToken, async(req,res)=>{
  try{
    const bookingDetails = req.body;
    const booking = await Booking.create({
      ...bookingDetails,
      status: 'pending',
      userId: req.user.id
    });
    sendEmail(booking.email_id, 'Booking Request', `Your booking for ${booking.event} on ${booking.date} at ${booking.time} has been requested.`);
    res.status(200).send('Booking request sent to admin for verification.');
  }catch(err){
    console.error('Error sending booking request:', err);
    res.status(500).json({ error: err.message });

  }
});


// Admin: Approve booking
app.post('/api/admin/approvebooking', authenticateAdmin, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    booking.status = 'approved';
    booking.adminId = req.user.id;  // Set the adminId to the current admin's ID
    await booking.save();
    const user = await Membership.findByPk(booking.userId);
    sendEmail(user.email, 'Booking Approved', `Your booking for ${booking.event} on ${booking.date} at ${booking.time} has been approved.`);
    res.status(200).json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Reject booking
app.post('/api/admin/rejectbooking', authenticateAdmin, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    booking.status = 'rejected';
    booking.adminId = req.user.id;  // Set the adminId to the current admin's ID
    await booking.save();
    const user = await Membership.findByPk(booking.userId);
    sendEmail(user.email, 'Booking Rejected', `Your booking for ${booking.event} on ${booking.date} at ${booking.time} has been rejected.`);
    res.status(200).json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin login
app.post('/api/admin/login', async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ where: { username } });

    if (!admin) {
      return res.status(401).json({ message: 'Invalid username' });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ id: admin.id }, JWT_SECRET, { expiresIn: '1h' });

    return res.json({ token, role: admin.role });
  } catch (error) {
    console.error('Login error:', error);
    return next(error);
  }
});


// Admin dashboard
app.get('/api/admin/dashboard', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    console.log('Access denied: User does not have admin rights');
    return res.sendStatus(403); // User does not have admin rights
  }

  // Replace with actual data fetching logic
  res.json({
    totalBookings: 100,
    totalRevenue: 50000,
    totalProfit: 20000,
    numberOfEmployees: 10,
    attendance: 95,
    totalMaintenance: 5000,
    upcomingBookings: [
      { date: '2024-06-14', name: 'John Doe', status: 'Confirmed' },
      { date: '2024-06-15', name: 'Jane Doe', status: 'Pending' },
    ],
    notifications: ['New booking received', 'Maintenance scheduled']
  });
});


// User profile
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const membership = await Membership.findByPk(req.user.id, {
      attributes: ['name', 'email', 'membershipType']
    });
    if (!membership) {
      return res.status(404).json({ error: 'User not found' });
    }

    const bookingHistory = await Booking.findAll({ where: { userId: req.user.id } });

    res.json({ user: membership, bookingHistory });
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while fetching the profile' });
  }
});

// Upload profile image
app.post('/api/uploadProfileImage', authenticateToken, (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'An error occurred while uploading the profile image' });
    }
    res.status(200).json({ message: 'Profile image uploaded successfully', filePath: `/uploads/${req.file.filename}` });
  });
});

app.listen(5000, () => console.log('Server is running on port 5000'));
