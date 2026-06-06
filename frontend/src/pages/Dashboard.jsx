import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchTasks } from '../features/taskSlice';
import { motion } from 'framer-motion';

import Welcome from '../components/dashboard/Welcome';
import TaskStats from '../components/dashboard/TaskStats';
import ProductivityScore from '../components/dashboard/ProductivityScore';
import Charts from '../components/dashboard/Charts';
import RecentTasks from '../components/dashboard/RecentTasks';
import UpcomingDeadlines from '../components/dashboard/UpcomingDeadlines';
import ActivityTimeline from '../components/dashboard/ActivityTimeline';
import CalendarView from '../components/dashboard/CalendarView';

const Dashboard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <motion.div 
      variants={container} 
      initial="hidden" 
      animate="show" 
      className="space-y-6 max-w-7xl mx-auto pb-12"
    >
      <motion.div variants={item}>
        <Welcome />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={item} className="lg:col-span-2">
          <TaskStats />
        </motion.div>
        <motion.div variants={item} className="lg:col-span-1">
          <ProductivityScore />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={item} className="lg:col-span-2">
          <Charts />
        </motion.div>
        <motion.div variants={item} className="lg:col-span-1">
          <UpcomingDeadlines />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={item} className="lg:col-span-1">
          <CalendarView />
        </motion.div>
        <motion.div variants={item} className="lg:col-span-1">
          <RecentTasks />
        </motion.div>
        <motion.div variants={item} className="lg:col-span-1">
          <ActivityTimeline />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
