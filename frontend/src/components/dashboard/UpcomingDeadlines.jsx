import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { CalendarClock } from 'lucide-react';
import { SkeletonCard } from './Skeleton';

const UpcomingDeadlines = () => {
  const { items, isLoading } = useSelector(state => state.tasks);

  const upcomingTasks = useMemo(() => {
    const now = new Date();
    now.setHours(0,0,0,0);
    return items
      .filter(t => t.dueDate && t.status !== 'completed' && t.status !== 'archived' && new Date(t.dueDate) >= now)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 4);
  }, [items]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="glass rounded-2xl p-6 shadow-glass h-full"
    >
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-red-500/10 rounded-lg">
          <CalendarClock className="w-5 h-5 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-[var(--text-color)]">Upcoming Deadlines</h2>
      </div>
      
      {isLoading && items.length === 0 ? (
        <SkeletonCard lines={4} />
      ) : upcomingTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-32 text-center">
          <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-2">
            <span className="text-green-500 text-xl">🎉</span>
          </div>
          <p className="text-sm text-gray-400 font-medium">No upcoming deadlines. Great job!</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {upcomingTasks.map((task, i) => {
            const date = new Date(task.dueDate);
            const isToday = date.toDateString() === new Date().toDateString();
            
            return (
              <motion.li 
                key={task._id} 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * i }}
                className="flex items-center gap-4 group"
              >
                <div className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl border ${isToday ? 'bg-red-500/20 border-red-500/50 text-red-500' : 'bg-[var(--color-surface-dark)] border-[var(--color-border-dark)] text-[var(--text-color)]'}`}>
                  <span className="text-[10px] font-bold uppercase">{date.toLocaleString('default', { month: 'short' })}</span>
                  <span className="text-lg font-black leading-none">{date.getDate()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[var(--text-color)] truncate group-hover:text-[var(--color-primary)] transition-colors">{task.title}</p>
                  <p className="text-xs text-gray-500 font-medium">{isToday ? <span className="text-red-400 font-semibold">Due Today</span> : `Due in ${Math.ceil((date - new Date()) / (1000 * 60 * 60 * 24))} days`}</p>
                </div>
              </motion.li>
            );
          })}
        </ul>
      )}
    </motion.div>
  );
};

export default UpcomingDeadlines;
