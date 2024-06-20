import { Sequelize, DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

// Create a new Sequelize instance
const sequelize = new Sequelize('banquet_hall', 'root', '', 
{
  host: 'localhost',
  dialect: 'mysql',
  password: '',  // Update with your MySQL password if required
});

// Define the Membership model
const Membership = sequelize.define('Membership', {
  id: {
    type: DataTypes.UUID,
    defaultValue: uuidv4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  membershipType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Define the Booking model
const Booking = sequelize.define('Booking', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Phone_no:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  status:{
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'pending',
  },
  event: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  guests: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Membership,
      key: 'id',
    },
  },
});

// Define the Admin model
const Admin = sequelize.define('Admin', {
  id: {
    type: DataTypes.UUID,
    defaultValue: uuidv4,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  acceptedEvents: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

// Hook to hash password before saving
Admin.beforeCreate(async (admin) => {
  const salt = await bcrypt.genSalt(10);
  admin.password = await bcrypt.hash(admin.password, salt);
});

// Establish relationships
Membership.hasMany(Booking, { foreignKey: 'userId' });
Booking.belongsTo(Membership, { foreignKey: 'userId' });

// Export the sequelize instance and models
export { sequelize, Membership, Booking, Admin };

// Sync the database (optional here, better to handle in server.js)
sequelize.sync()
  .then(() => {
    console.log('Database synced');
  })
  .catch((err) => {
    console.error('Unable to sync the database:', err);
  });
