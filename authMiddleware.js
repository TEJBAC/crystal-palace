import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Admin } from './db.js'; // Ensure the correct path to your models
import './db.js'; // Ensure this path is correct and necessary for your project

dotenv.config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token is missing or invalid' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token is not valid' });
    }
    req.user = user;
    next();
  });
};

export const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Access token is missing or invalid' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findByPk(decoded.id);

    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    req.user = admin;
    next();
  } catch (err) {
    console.error('Authentication error:', err);
    res.status(403).json({ error: 'Access denied' });
  }
};

export default authenticateToken;
