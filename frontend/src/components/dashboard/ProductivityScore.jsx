import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';
import { SkeletonCircle } from './Skeleton';

const ProductivityScore = () => {
  const { items, isLoading } = useSelector(state => state.tasks);

  const score = useMemo(() => {
    const total = items.length;
    if (total === 0) return 0;
    const completed = items.filter(t => t.status === 'completed').length;
    return Math.round((completed / total) * 100);
  }, [items]);

  const chartData = [
    { name: 'Score', value: score, fill: 'url(#scoreGradient)' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      whileHover={{ scale: 1.02 }}
      className="glass rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary)] rounded-full blur-[80px] opacity-10 pointer-events-none"></div>

      <h3 className="text-sm font-bold text-[var(--text-tertiary)] uppercase tracking-widest mb-2">
        Productivity
      </h3>

      {isLoading && items.length === 0 ? (
        <div className="my-6">
          <SkeletonCircle size="140px" />
        </div>
      ) : (
        <div className="relative w-[180px] h-[180px] my-2">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="75%"
              outerRadius="100%"
              barSize={14}
              data={chartData}
              startAngle={90}
              endAngle={-270}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" />
                  <stop offset="100%" stopColor="#4f46e5" />
                </linearGradient>
              </defs>
              <RadialBar
                background={{ fill: 'var(--surface-active)', opacity: 0.5 }}
                dataKey="value"
                cornerRadius={12}
                animationDuration={1500}
                animationEasing="ease-out"
              />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span 
              initial={{ scale: 0.5 }} 
              animate={{ scale: 1 }} 
              transition={{ type: "spring", delay: 0.5 }}
              className="text-4xl font-extrabold text-[var(--text-color)]"
            >
              {score}%
            </motion.span>
            <span className="text-xs text-[var(--text-secondary)] mt-1 font-medium">Completed</span>
          </div>
        </div>
      )}

      <p className="text-[var(--text-tertiary)] text-xs mt-2 text-center font-medium">
        Based on overall task completion
      </p>
    </motion.div>
  );
};

export default ProductivityScore;
