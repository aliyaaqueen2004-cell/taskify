const express = require('express');
const router = express.Router();
const { getSystemMetrics, getAllUsers, createUser, updateUser, deleteUser, getAllTasks } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Protect all admin routes
router.use(protect);
router.use(authorize('admin'));

router.get('/metrics', getSystemMetrics);

router.route('/users')
  .get(getAllUsers)
  .post(createUser);
  
router.route('/users/:id')
  .put(updateUser)
  .delete(deleteUser);

router.get('/tasks', getAllTasks);

module.exports = router;
