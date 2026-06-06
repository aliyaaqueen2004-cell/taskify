import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { motion } from 'framer-motion';
import { Users, Folder, CheckSquare, Activity, CheckCircle, Clock } from 'lucide-react';

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await api.get('/admin/metrics');
        setMetrics(response.data.data);
      } catch (error) {
        console.error('Error fetching admin metrics', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-400">Loading metrics...</div>;
  if (!metrics) return <div className="p-8 text-center text-red-500">Failed to load metrics.</div>;

  const statCards = [
    { title: 'Total Users', value: metrics.totalUsers, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Active Workspaces', value: metrics.totalWorkspaces, icon: Folder, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { title: 'Total Tasks', value: metrics.totalTasks, icon: CheckSquare, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { title: 'System Health', value: metrics.systemHealth, icon: Activity, color: 'text-green-500', bg: 'bg-green-500/10' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-color)]">Admin Dashboard</h1>
        <p className="text-gray-400 mt-1">Platform overview and system health metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 rounded-2xl glass border border-[var(--border-color)] flex items-center gap-4"
          >
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm text-gray-400 font-medium">{stat.title}</p>
              <h3 className="text-2xl font-bold text-[var(--text-color)]">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="p-6 rounded-2xl glass border border-[var(--border-color)]">
          <h2 className="text-xl font-bold text-[var(--text-color)] mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-[var(--color-primary)]" />
            Task Completion Stats
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <span className="text-gray-600 dark:text-gray-400">Completed Tasks</span>
              <span className="text-xl font-bold text-green-500">{metrics.completedTasksCount}</span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <span className="text-gray-600 dark:text-gray-400">Pending Tasks</span>
              <span className="text-xl font-bold text-yellow-500">{metrics.pendingTasksCount}</span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl glass border border-[var(--border-color)]">
           <h2 className="text-xl font-bold text-[var(--text-color)] mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[var(--color-primary)]" />
            Tasks By Status
          </h2>
          <div className="grid grid-cols-2 gap-4">
             {Object.entries(metrics.tasksByStatus || {}).map(([status, count]) => (
                <div key={status} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-[var(--text-color)]">{count}</span>
                  <span className="text-xs text-gray-500 uppercase tracking-wider mt-1">{status.replace('_', ' ')}</span>
                </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
