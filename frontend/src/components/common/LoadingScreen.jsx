import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-[var(--bg-color)] relative overflow-hidden">
      {/* Background glowing orbs matching login screen */}
      <div className="absolute top-[10%] left-[20%] w-[30%] h-[30%] bg-[var(--color-primary)] rounded-full blur-[120px] opacity-10 animate-pulse"></div>
      <div className="absolute bottom-[10%] right-[20%] w-[30%] h-[30%] bg-[var(--color-primary)] rounded-full blur-[120px] opacity-10"></div>

      <motion.div
        className="glass p-8 rounded-2xl flex flex-col items-center justify-center gap-6 z-10 min-w-[200px]"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div 
          className="w-16 h-16 border-4 border-t-[var(--color-primary)] border-r-transparent border-b-transparent border-l-[var(--color-primary)] rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <h2 className="text-xl font-semibold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-purple-400">Loading...</h2>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;
