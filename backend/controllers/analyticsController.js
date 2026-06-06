const Task = require('../models/Task');

// @desc    Get dashboard analytics summaries
// @route   GET /api/v1/analytics/summary
// @access  Private
const getAnalyticsSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // 1. Basic Stats (Total, completed, pending)
    const totalTasks = await Task.countDocuments({ creator: userId });
    const completedTasks = await Task.countDocuments({ creator: userId, status: 'completed' });
    const pendingTasks = totalTasks - completedTasks;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // 2. Status Breakdown
    const statusCounts = await Task.aggregate([
      { $match: { creator: userId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const statusBreakdown = { todo: 0, in_progress: 0, review: 0, completed: 0 };
    statusCounts.forEach((item) => {
      if (statusBreakdown[item._id] !== undefined) {
        statusBreakdown[item._id] = item.count;
      }
    });

    // 3. Priority Breakdown
    const priorityCounts = await Task.aggregate([
      { $match: { creator: userId } },
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);
    const priorityBreakdown = { low: 0, medium: 0, high: 0, urgent: 0 };
    priorityCounts.forEach((item) => {
      if (priorityBreakdown[item._id] !== undefined) {
        priorityBreakdown[item._id] = item.count;
      }
    });

    // 4. Overdue Tasks
    const overdueTasks = await Task.countDocuments({
      creator: userId,
      status: { $ne: 'completed' },
      dueDate: { $lt: new Date() }
    });

    // 5. Productive Days (tasks completed per day in the last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const completionsByDay = await Task.aggregate([
      { 
        $match: { 
          creator: userId, 
          status: 'completed', 
          completedAt: { $gte: sevenDaysAgo } 
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$completedAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Format productive days history
    const completionHistory = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const match = completionsByDay.find(item => item._id === dateStr);
      completionHistory.push({
        date: dateStr,
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        completedCount: match ? match.count : 0
      });
    }

    // 6. Total AI Time Estimates
    const timeSummary = await Task.aggregate([
      { $match: { creator: userId } },
      { $group: { _id: null, totalHours: { $sum: '$aiInsights.timeEstimateHours' } } }
    ]);
    const totalEstimatedHours = timeSummary.length > 0 ? timeSummary[0].totalHours : 0;

    res.status(200).json({
      totalTasks,
      completedTasks,
      pendingTasks,
      completionRate,
      overdueTasks,
      statusBreakdown,
      priorityBreakdown,
      completionHistory,
      totalEstimatedHours,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAnalyticsSummary,
};
