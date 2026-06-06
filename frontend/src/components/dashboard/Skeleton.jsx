import React from 'react';
import { motion } from 'framer-motion';

const Skeleton = ({ width = '100%', height = '20px', rounded = 'rounded-lg', className = '' }) => (
  <div
    className={`animate-pulse bg-gray-200 dark:bg-gray-700/50 ${rounded} ${className}`}
    style={{ width, height }}
  />
);

export const SkeletonCard = ({ lines = 3, className = '' }) => (
  <div className={`space-y-3 w-full ${className}`}>
    <Skeleton height="24px" width="60%" />
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} height="16px" width={i === lines - 1 ? '40%' : '100%'} />
    ))}
  </div>
);

export const SkeletonCircle = ({ size = '120px' }) => (
  <div
    className="animate-pulse bg-gray-200 dark:bg-gray-700/50 rounded-full mx-auto"
    style={{ width: size, height: size }}
  />
);

export default Skeleton;
