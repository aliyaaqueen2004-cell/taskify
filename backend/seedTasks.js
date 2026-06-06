require('dotenv').config();
const mongoose = require('mongoose');
const Task = require('./models/Task');
const User = require('./models/User');

const seedTasks = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/task_management_ai');
    console.log('MongoDB Connected for seeding tasks');
    
    // Find the admin user to attach the tasks to
    const admin = await User.findOne({ email: 'admin@gmail.com' });
    if (!admin) {
      console.log('Admin not found!');
      process.exit(1);
    }

    const tasksData = [
      {
        title: "Setup Authentication API",
        description: "Implement JWT based authentication in Node.js",
        status: "completed",
        priority: "high",
        creator: admin._id,
        assignee: admin._id,
      },
      {
        title: "Design Dashboard Mockups",
        description: "Create Figma files for the new Admin Dashboard",
        status: "in_progress",
        priority: "medium",
        creator: admin._id,
        assignee: admin._id,
      },
      {
        title: "Write End-to-End Tests",
        description: "Cover the registration flow using Cypress",
        status: "todo",
        priority: "urgent",
        creator: admin._id,
        assignee: admin._id,
      },
      {
        title: "Optimize Database Queries",
        description: "Add indexing to the Tasks collection for faster load times.",
        status: "review",
        priority: "high",
        creator: admin._id,
        assignee: admin._id,
      },
      {
        title: "Prepare Marketing Copy",
        description: "Draft the announcement post for the new release.",
        status: "todo",
        priority: "low",
        creator: admin._id,
        assignee: admin._id,
      }
    ];

    // Clear existing tasks just in case they were malformed
    await Task.deleteMany({});

    // Insert the tasks
    await Task.insertMany(tasksData);
    
    console.log('Successfully seeded 5 tasks attached to the admin account!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedTasks();
