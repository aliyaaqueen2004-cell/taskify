require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const fixPasswords = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/task_management_ai');
    console.log('MongoDB Connected for password fix');
    
    // The valid bcrypt hash for 'password123'
    const validHash = '$2b$12$o2/HZhoci6.haz6yEWNDquC4O0kc7EpGqh4pLdzJA43g2dKdbykAe';

    const result = await User.updateMany(
      {}, 
      { $set: { password: validHash } }
    );
    
    console.log(`Updated passwords for ${result.modifiedCount} users to 'password123'.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

fixPasswords();
