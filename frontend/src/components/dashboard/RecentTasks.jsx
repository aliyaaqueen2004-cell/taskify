import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Clock, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SkeletonCard } from './Skeleton';

const RecentTasks = () => {
  const { items, isLoading } = useSelector(state => state.tasks);

  const recentTasks = useMemo(() => {
    return [...items]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 5);
  }, [items]);

  const statusColors = {
    todo: 'bg-gray-500/20 text-[var(--text-tertiary)]',
    in_progress: 'bg-blue-500/20 text-blue-500',
    review: 'bg-purple-500/20 text-purple-500',
    completed: 'bg-green-500/20 text-green-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass rounded-2xl p-6 shadow-glass h-full flex flex-col"
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Clock className="w-5 h-5 text-blue-500" />
          </div>
          <h2 className="text-xl font-bold text-[var(--text-color)]">Recent Tasks</h2>
        </div>
        <Link to="/tasks" className="text-sm font-medium text-[var(--color-primary)] hover:text-purple-400 transition-colors flex items-center gap-1">
          View All <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {isLoading && items.length === 0 ? (
        <SkeletonCard lines={5} />
      ) : recentTasks.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <p className="text-[var(--text-secondary)] text-sm py-4">No recent tasks.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {recentTasks.map((task, i) => (
            <motion.li 
              key={task._id} 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="flex justify-between items-center p-3 rounded-xl hover:bg-[var(--surface-hover)] transition-colors group border border-transparent hover:border-[var(--border-subtle)]"
            >
              <div className="flex-1 min-w-0 pr-4">
                <p className={`text-sm font-semibold truncate ${task.status === 'completed' ? 'line-through text-[var(--text-tertiary)]' : 'text-[var(--text-color)]'}`}>
                  {task.title}
                </p>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5 truncate">{task.description}</p>
              </div>
              <span className={`px-2.5 py-1 rounded-md text-xs font-bold capitalize whitespace-nowrap ${statusColors[task.status] || statusColors.todo}`}>
                {task.status.replace('_', ' ')}
              </span>
            </motion.li>
          ))}
        </ul>
      )}
    </motion.div>
  );
};

export default RecentTasks;
