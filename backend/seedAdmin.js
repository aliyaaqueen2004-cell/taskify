require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const seedAdmin = async () => {
  try {
    // Connect to the DB using the same URI as the server
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskify');
    console.log('MongoDB Connected for seeding');

    const adminEmail = 'admin@gmail.com';
    const adminPassword = 'admin123';

    // Check if admin exists
    let admin = await User.findOne({ email: adminEmail });
    if (admin) {
      console.log('Admin user already exists. Enforcing role and password...');
      admin.password = adminPassword;
      admin.role = 'admin';
      await admin.save();
      console.log('Admin credentials updated successfully.');
    } else {
      console.log('Creating new admin user...');
      admin = await User.create({
        name: 'System Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
      });
      console.log('Admin user created successfully.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
