import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';
import Skeleton from './Skeleton';

const Charts = () => {
  const { items, isLoading } = useSelector(state => state.tasks);

  const data = useMemo(() => {
    const counts = { completed: 0, in_progress: 0, todo: 0, review: 0 };
    items.forEach(t => {
      if (counts[t.status] !== undefined) counts[t.status]++;
    });
    return [
      { name: 'Completed', value: counts.completed, color: '#10B981' }, 
      { name: 'In Progress', value: counts.in_progress, color: '#3B82F6' },
      { name: 'To Do', value: counts.todo, color: '#F59E0B' },
      { name: 'Review', value: counts.review, color: '#8B5CF6' },
    ].filter(d => d.value > 0);
  }, [items]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className="glass rounded-2xl p-5 shadow-glass h-[280px] flex flex-col relative overflow-hidden"
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="p-2 bg-purple-500/10 rounded-lg">
          <PieChartIcon className="w-5 h-5 text-purple-500" />
        </div>
        <h2 className="text-lg font-bold text-[var(--text-color)]">Task Distribution</h2>
      </div>
      
      {isLoading && items.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
           <Skeleton width="160px" height="160px" rounded="rounded-full" />
        </div>
      ) : data.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
          No task data available
        </div>
      ) : (
        <div className="flex-1 w-full relative">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={85}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(30, 31, 43, 0.85)', 
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)', 
                  borderRadius: '12px', 
                  color: '#fff',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
                }}
                itemStyle={{ color: '#fff', fontWeight: 'bold' }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
};

export default Charts;
