import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { motion } from 'framer-motion';

const AdminTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get('/admin/tasks');
        setTasks(response.data.data);
      } catch (error) {
        console.error('Error fetching tasks', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400';
      case 'in_progress': return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400';
      case 'review': return 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'urgent': return 'text-red-500 font-bold';
      case 'high': return 'text-orange-500 font-semibold';
      case 'medium': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-color)]">Task Oversight</h1>
        <p className="text-gray-400 mt-1">Platform-wide detailed view of all active, finished, and pending tasks.</p>
      </div>

      <div className="glass border border-[var(--border-color)] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading tasks...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-[var(--border-color)]">
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Task Title</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Creator</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Assignee</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Priority</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task, idx) => (
                  <motion.tr 
                    key={task._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-[var(--border-color)] last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/30"
                  >
                    <td className="px-6 py-4 font-medium text-[var(--text-color)]">
                      {task.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{task.creator?.name || 'Unknown'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{task.assignee?.name || 'Unassigned'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${getStatusColor(task.status)}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-sm uppercase tracking-wider ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTasks;
