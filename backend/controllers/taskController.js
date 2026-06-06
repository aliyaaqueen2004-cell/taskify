const Task = require('../models/Task');

// @desc    Get all tasks (with filtering, searching, sorting)
// @route   GET /api/v1/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const { status, priority, search, sortBy, order, page = 1, limit = 20 } = req.query;
    
    const skip = (page - 1) * limit;
    const query = { creator: req.user._id };

    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    // Sort options
    let sortOptions = { createdAt: -1 }; // Default: Newest first
    if (sortBy) {
      const sortOrder = order === 'asc' ? 1 : -1;
      sortOptions = { [sortBy]: sortOrder };
    }

    const tasks = await Task.find(query).sort(sortOptions).skip(skip).limit(parseInt(limit));
    const total = await Task.countDocuments(query);
    res.status(200).json({
      tasks,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new task
// @route   POST /api/v1/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate, tags, subtasks } = req.body;

    if (!title) {
      res.status(400);
      throw new Error('Task title is required');
    }

    const task = await Task.create({
      creator: req.user._id,
      title,
      description: description || '',
      status: status || 'todo',
      priority: priority || 'medium',
      dueDate: dueDate || null,
      tags: tags || [],
      subtasks: subtasks || [],
    });

    // Attach uploaded files if any
    if (req.files && req.files.length) {
      const attached = req.files.map((file) => ({
        filename: file.originalname,
        url: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`,
        mime: file.mimetype,
        size: file.size,
      }));
      task.attachments = attached;
      await task.save();
    }

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single task by ID
// @route   GET /api/v1/tasks/:id
// @access  Private
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, creator: req.user._id });

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task
// @route   PUT /api/v1/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, creator: req.user._id });

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    // List of updateable fields
    const fieldsToUpdate = ['title', 'description', 'status', 'priority', 'dueDate', 'tags', 'subtasks', 'aiInsights'];

    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined) {
        task[field] = req.body[field];
      }
    });

    // Record completed timestamp if changing to completed status
    if (req.body.status === 'completed' && task.status !== 'completed') {
      task.completedAt = new Date();
    } else if (req.body.status && req.body.status !== 'completed') {
      task.completedAt = null;
    }

    const updatedTask = await task.save();
    res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/v1/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, creator: req.user._id });

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    await task.deleteOne();
    res.status(200).json({ message: 'Task deleted successfully', id: req.params.id });
  } catch (error) {
    next(error);
  }
};

// @desc    Archive task (soft delete)
// @route   PATCH /api/v1/tasks/:id/archive
// @access  Private
const archiveTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, creator: req.user._id });
    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }
    task.status = 'archived';
    await task.save();
    res.status(200).json({ message: 'Task archived' });
  } catch (error) {
    next(error);
  }
};

// @desc    Restore task from archive
// @route   PATCH /api/v1/tasks/:id/restore
// @access  Private
const restoreTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, creator: req.user._id });
    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }
    if (task.status !== 'archived') {
      res.status(400);
      throw new Error('Task is not archived');
    }
    task.status = 'todo';
    await task.save();
    res.status(200).json({ message: 'Task restored' });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark task as complete (shortcut)
// @route   PATCH /api/v1/tasks/:id/complete
// @access  Private
const completeTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, creator: req.user._id });
    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }
    task.status = 'completed';
    task.completedAt = new Date();
    await task.save();
    res.status(200).json({ message: 'Task marked complete' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
  archiveTask,
  restoreTask,
  completeTask,
};
