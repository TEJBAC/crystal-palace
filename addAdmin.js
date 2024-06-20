import bcrypt from 'bcrypt';

const hashedPassword = '$2b$10$.hOXy1dNocxO4yOE/ywLGOWG5VdwtuorTvGrozJtLQBBk5PvtdQAe';
const plainPassword = '2004';

const verifyPassword = async (plainPassword, hashedPassword) => {
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  if (isMatch) {
    console.log('Password is correct!');
  } else {
    console.log('Password is incorrect.');
  }
};

verifyPassword(plainPassword, hashedPassword);
