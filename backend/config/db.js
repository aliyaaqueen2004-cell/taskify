const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/task_management_ai');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log("Mongo URI exists:", !!process.env.MONGODB_URI);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    console.error(error.name);
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
