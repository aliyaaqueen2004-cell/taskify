const { getTaskBreakdown } = require('../services/aiService');

// @desc    Suggest subtasks and estimates for a task draft
// @route   POST /api/v1/ai/suggest-breakdown
// @access  Private
const suggestBreakdown = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      res.status(400);
      throw new Error('Please provide at least a task title');
    }

    const insights = await getTaskBreakdown(title, description);
    res.status(200).json(insights);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  suggestBreakdown,
};
