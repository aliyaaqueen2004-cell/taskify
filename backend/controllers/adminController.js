const User = require('../models/User');
const Task = require('../models/Task');
const Workspace = require('../models/Workspace');

// @desc    Get system-wide metrics
// @route   GET /api/v1/admin/metrics
// @access  Private/Admin
const getSystemMetrics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalWorkspaces = await Workspace.countDocuments();
    const totalTasks = await Task.countDocuments();
    
    const completedTasksCount = await Task.countDocuments({ status: 'completed' });
    const pendingTasksCount = await Task.countDocuments({ status: { $ne: 'completed' } });
    
    // Aggregate tasks by status for more granular data
    const tasksByStatusAgg = await Task.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    const tasksByStatus = {
      todo: 0,
      in_progress: 0,
      review: 0,
      completed: 0
    };
    
    tasksByStatusAgg.forEach(stat => {
      if (tasksByStatus[stat._id] !== undefined) {
        tasksByStatus[stat._id] = stat.count;
      }
    });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalWorkspaces,
        totalTasks,
        completedTasksCount,
        pendingTasksCount,
        tasksByStatus,
        systemHealth: '100% Operational',
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/v1/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new user
// @route   POST /api/v1/admin/users
// @access  Private/Admin
const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user',
    });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a user
// @route   PUT /api/v1/admin/users/:id
// @access  Private/Admin
const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.role) user.role = req.body.role;
    if (req.body.password) user.password = req.body.password;

    const updatedUser = await user.save();
    
    res.status(200).json({
      success: true,
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        createdAt: updatedUser.createdAt,
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a user
// @route   DELETE /api/v1/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    await User.deleteOne({ _id: req.params.id });
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all tasks
// @route   GET /api/v1/admin/tasks
// @access  Private/Admin
const getAllTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({})
      .populate('creator', 'name email')
      .populate('assignee', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSystemMetrics,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getAllTasks,
};
