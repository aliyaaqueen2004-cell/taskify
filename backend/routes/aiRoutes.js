const express = require('express');
const { suggestBreakdown } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Protect all AI assistant routes
router.use(protect);

router.post('/suggest-breakdown', suggestBreakdown);

module.exports = router;
