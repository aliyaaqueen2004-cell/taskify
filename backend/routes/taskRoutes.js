const express = require('express');
const {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
  archiveTask,
  restoreTask,
  completeTask,
} = require('../controllers/taskController');
const upload = require('../middleware/upload');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply auth protection to all task endpoints
router.use(protect);

router
  .route('/')
  .get(getTasks)
  .post(upload.array('attachments'), createTask);

router
  .route('/:id')
  .get(getTaskById)
  .patch(updateTask)
  .delete(deleteTask);

// Archive a task (soft delete)
router.patch('/:id/archive', archiveTask);
// Restore a task from archive
router.patch('/:id/restore', restoreTask);
// Mark task as complete
router.patch('/:id/complete', completeTask);

module.exports = router;
