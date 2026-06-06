import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Shield } from 'lucide-react';

const Features = () => {
  const featuresList = [
    { icon: Sparkles, title: 'AI-Powered Insights', desc: 'Get intelligent suggestions and task prioritization automatically.' },
    { icon: Zap, title: 'Real-Time Sync', desc: 'Collaborate with your team instantly with real-time updates.' },
    { icon: Shield, title: 'Enterprise Security', desc: 'Bank-grade encryption keeping your work safe and secure.' },
  ];

  return (
    <div className="py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4 mb-16"
      >
        <h1 className="text-4xl font-bold text-[var(--text-color)]">Platform Features</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">Everything you need to manage your projects efficiently.</p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {featuresList.map((feat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 rounded-2xl glass border border-[var(--border-color)] space-y-4 text-center hover:-translate-y-2 transition-transform duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center mx-auto">
              <feat.icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[var(--text-color)]">{feat.title}</h3>
            <p className="text-sm text-gray-400">{feat.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Features;
