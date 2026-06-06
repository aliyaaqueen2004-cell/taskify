import React from 'react';
import { motion } from 'framer-motion';

const Pricing = () => {
  return (
    <div className="py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4 mb-16"
      >
        <h1 className="text-4xl font-bold text-[var(--text-color)]">Simple, Transparent Pricing</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">Choose the plan that best fits your team's needs.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {/* Placeholder plans */}
        {['Starter', 'Pro', 'Enterprise'].map((plan, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`p-8 rounded-3xl glass border ${idx === 1 ? 'border-[var(--color-primary)] shadow-lg shadow-[var(--color-primary)]/10 relative scale-105' : 'border-[var(--border-color)]'} space-y-6 flex flex-col`}
          >
            {idx === 1 && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[var(--color-primary)] text-white text-xs font-bold rounded-full">
                Most Popular
              </span>
            )}
            <h3 className="text-2xl font-bold text-[var(--text-color)]">{plan}</h3>
            <div className="text-4xl font-bold text-[var(--text-color)]">
              ${idx === 0 ? '0' : idx === 1 ? '29' : '99'} <span className="text-lg font-normal text-gray-500">/mo</span>
            </div>
            <ul className="space-y-3 flex-1">
              {[1, 2, 3, 4].map(i => (
                <li key={i} className="flex items-center gap-3 text-sm text-gray-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
                  Premium feature {i}
                </li>
              ))}
            </ul>
            <button className={`w-full py-3 rounded-xl font-medium transition-all ${idx === 1 ? 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]' : 'bg-gray-100 dark:bg-gray-800 text-[var(--text-color)] hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
              Get Started
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
