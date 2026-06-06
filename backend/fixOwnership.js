require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Task = require('./models/Task');
const Workspace = require('./models/Workspace');

const fixDataOwnership = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/task_management_ai');
    console.log('MongoDB Connected for ownership fix');
    
    // Find the actual admin user
    const admin = await User.findOne({ email: 'admin@gmail.com' });
    
    if (!admin) {
      console.log('Admin not found, cannot fix ownership');
      process.exit(1);
    }

    console.log(`Found Admin with ID: ${admin._id}`);

    // Update all tasks to be created by and assigned to this admin
    const tasksResult = await Task.updateMany(
      {}, 
      { $set: { creator: admin._id, assignee: admin._id } }
    );
    
    console.log(`Updated ${tasksResult.modifiedCount} tasks to belong to admin.`);

    // Update all workspaces to be owned by this admin
    const workspacesResult = await Workspace.updateMany(
      {},
      { $set: { owner: admin._id } }
    );
    
    console.log(`Updated ${workspacesResult.modifiedCount} workspaces to belong to admin.`);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

fixDataOwnership();
