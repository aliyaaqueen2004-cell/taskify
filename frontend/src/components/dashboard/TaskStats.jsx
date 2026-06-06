import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, AlertTriangle, Layers } from 'lucide-react';
import Skeleton from './Skeleton';

const TaskStats = () => {
  const { items, isLoading } = useSelector(state => state.tasks);

  const stats = useMemo(() => {
    const now = new Date();
    return {
      total: items.length,
      completed: items.filter(t => t.status === 'completed').length,
      pending: items.filter(t => t.status !== 'completed' && t.status !== 'archived').length,
      overdue: items.filter(t => t.dueDate && new Date(t.dueDate) < now && t.status !== 'completed' && t.status !== 'archived').length,
    };
  }, [items]);

  const statCards = [
    { key: 'total', label: 'Total Tasks', icon: Layers, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { key: 'completed', label: 'Completed', icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10' },
    { key: 'pending', label: 'In Progress', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { key: 'overdue', label: 'Overdue', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10' },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemAnim = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="col-span-1 lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4"
    >
      {statCards.map((card) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.key}
            variants={itemAnim}
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="glass rounded-2xl p-5 flex flex-col items-center justify-center gap-3 relative overflow-hidden group"
          >
            <div className={`absolute inset-0 bg-gradient-to-br from-transparent to-[var(--color-primary)] opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`} />
            
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.bg}`}>
              <Icon className={`w-6 h-6 ${card.color}`} />
            </div>
            
            {isLoading && items.length === 0 ? (
              <Skeleton width="40px" height="32px" rounded="rounded-lg" />
            ) : (
              <motion.span 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                key={stats[card.key]}
                className="text-3xl font-bold text-[var(--text-color)]"
              >
                {stats[card.key]}
              </motion.span>
            )}
            <span className="text-sm text-[var(--text-secondary)] font-medium">{card.label}</span>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default TaskStats;
