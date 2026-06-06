import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Activity, PlusCircle, CheckCircle2 } from 'lucide-react';
import { SkeletonCard } from './Skeleton';

const ActivityTimeline = () => {
  const { items, isLoading } = useSelector(state => state.tasks);

  const activities = useMemo(() => {
    const logs = [];
    items.forEach(t => {
      logs.push({
        id: `created-${t._id}`,
        type: 'created',
        taskTitle: t.title,
        date: new Date(t.createdAt || Date.now()),
      });
      if (t.status === 'completed' && t.completedAt) {
        logs.push({
          id: `completed-${t._id}`,
          type: 'completed',
          taskTitle: t.title,
          date: new Date(t.completedAt),
        });
      }
    });
    return logs.sort((a, b) => b.date - a.date).slice(0, 4);
  }, [items]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="glass rounded-2xl p-6 shadow-glass h-full"
    >
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-green-500/10 rounded-lg">
          <Activity className="w-5 h-5 text-green-500" />
        </div>
        <h2 className="text-xl font-bold text-[var(--text-color)]">Activity Log</h2>
      </div>

      {isLoading && items.length === 0 ? (
        <SkeletonCard lines={4} />
      ) : activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-32">
          <p className="text-sm text-gray-500">No recent activity.</p>
        </div>
      ) : (
        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:ml-[1.15rem] before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[var(--color-primary)] before:via-gray-600 before:to-transparent">
          {activities.map((item, index) => (
            <motion.div 
              key={item.id} 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
            >
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-4 border-[var(--bg-color)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-md ${
                item.type === 'completed' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
              }`}>
                {item.type === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
              </div>
              <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] glass p-3 rounded-xl ml-4 md:ml-0 shadow-sm border border-[var(--border-color)] group-hover:border-[var(--color-primary)] transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <div className="font-bold text-[var(--text-color)] text-sm">
                    {item.type === 'completed' ? 'Completed Task' : 'Created Task'}
                  </div>
                  <time className="text-xs text-[var(--color-primary)] font-bold">
                    {item.date.toLocaleDateString()}
                  </time>
                </div>
                <div className="text-gray-400 text-xs truncate font-medium">"{item.taskTitle}"</div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default ActivityTimeline;
