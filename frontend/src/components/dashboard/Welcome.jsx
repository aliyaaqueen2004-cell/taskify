import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const Welcome = () => {
  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.tasks);
  const name = user?.name ? user.name.split(' ')[0] : 'User';
  
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const pendingCount = items.filter(t => t.status !== 'completed' && t.status !== 'archived').length;

  return (
    <motion.div
      className="glass p-6 sm:p-8 rounded-2xl shadow-glass relative overflow-hidden"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)] rounded-full blur-[100px] opacity-10 pointer-events-none transform translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="relative z-10">
        <h1 className="text-3xl font-bold text-[var(--text-color)]">
          {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-purple-400">{name}</span>!
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
          {pendingCount > 0 
            ? `You have ${pendingCount} task${pendingCount > 1 ? 's' : ''} on your plate today. Let's get things done.` 
            : "You're all caught up! Enjoy your day."}
        </p>
      </div>
    </motion.div>
  );
};

export default Welcome;
