const mongoose = require('mongoose');

const SubtaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a subtask title'],
    trim: true,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const TaskSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  assignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  title: {
    type: String,
    required: [true, 'Please add a task title'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
    trim: true,
  },
  status: {
    type: String,
    enum: ['todo', 'in_progress', 'review', 'completed'],
    default: 'todo',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  dueDate: {
    type: Date,
    default: null,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  subtasks: [SubtaskSchema],
  aiInsights: {
    suggestedBreakdown: [String],
    timeEstimateHours: {
      type: Number,
      default: 0,
    },
    rationalization: {
      type: String,
      default: '',
    },
  },
  completedAt: {
    type: Date,
    default: null,
  },
}, { timestamps: true });

// Optimize query performance for main app filter/dashboard routes
TaskSchema.index({ creator: 1, status: 1 });
TaskSchema.index({ assignee: 1, status: 1 });
TaskSchema.index({ dueDate: 1 });

module.exports = mongoose.model('Task', TaskSchema);
