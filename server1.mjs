import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import cors from 'cors';
import { sequelize, Admin } from './db.js';

const app = express();
app.use(cors()); // Enable CORS
app.use(bodyParser.json());

sequelize.sync()
  .then(() => console.log('Database synced'))
  .catch((err) => console.error('Unable to sync the database:', err));

const createAdmin = async (username, password) => {
  try {
    console.log('Creating admin with username:', username);
    console.log('Password before hashing:', password);

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed password:', hashedPassword);

    const admin = await Admin.create({ username, password: hashedPassword });
    console.log('Admin created successfully:', admin);
  } catch (err) {
    console.error('Failed to create admin:', err.message);
  }
};

// Define the admin username and password here
const adminUsername = 'Tej';
const adminPassword = '2004';

// Create the admin when the server starts
createAdmin(adminUsername, adminPassword);

app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ where: { username } });

    if (!admin) {
      return res.status(401).json({ message: 'Invalid username' });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate a token (for simplicity, using a dummy token here)
    const token = jwt.sign({ id: admin.id }, JWT_SECRET, { expiresIn: '1h' });

    return res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => console.log('Server is running on port 5000'));
