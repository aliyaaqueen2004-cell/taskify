import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Zap, Shield, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col gap-16 py-8">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center px-4 pt-12 pb-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-64 bg-gradient-to-r from-[var(--color-primary)] to-purple-500 blur-[120px] opacity-20 pointer-events-none rounded-full"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 space-y-6 max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-[var(--color-primary)]/30 text-sm text-[var(--color-primary)] font-medium mb-4">
            <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse"></span>
            TaskFlow AI 2.0 is now live
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-[var(--text-color)] tracking-tight leading-tight">
            Manage your work with <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-purple-400">
              intelligent precision
            </span>
          </h1>
          
          <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
            The intelligent workspace designed for modern, fast-moving teams. Unify your tasks, automate workflows, and boost your productivity seamlessly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link to="/">
              <button className="px-8 py-4 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold text-lg transition-all flex items-center gap-2 hover:gap-3 shadow-lg shadow-[var(--color-primary)]/20">
                Go to Dashboard <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <Link to="/features">
              <button className="px-8 py-4 rounded-xl glass border border-[var(--border-medium)] hover:bg-[var(--surface-hover)] text-[var(--text-color)] font-bold text-lg transition-all">
                Explore Features
              </button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Highlights Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 max-w-7xl mx-auto w-full">
        {[
          {
            icon: Zap,
            title: "Lightning Fast",
            desc: "Built on modern web technologies ensuring instantaneous updates and zero lag.",
            color: "text-yellow-500",
            bg: "bg-yellow-500/10"
          },
          {
            icon: Users,
            title: "Built for Teams",
            desc: "Collaborate in real-time, assign tasks, and track team progress effortlessly.",
            color: "text-blue-500",
            bg: "bg-blue-500/10"
          },
          {
            icon: Shield,
            title: "Enterprise Secure",
            desc: "Your data is encrypted and secure, matching the highest industry standards.",
            color: "text-green-500",
            bg: "bg-green-500/10"
          }
        ].map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + idx * 0.1 }}
            className="p-8 rounded-3xl glass border border-[var(--border-color)] space-y-4 hover:shadow-xl hover:shadow-[var(--color-primary)]/5 transition-all duration-300 hover:-translate-y-1"
          >
            <div className={`w-14 h-14 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center`}>
              <item.icon className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-[var(--text-color)]">{item.title}</h3>
            <p className="text-[var(--text-secondary)] leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Trust Section */}
      <section className="text-center py-12 border-t border-[var(--border-color)]">
        <p className="text-sm font-medium text-[var(--text-tertiary)] mb-8 uppercase tracking-wider">Trusted by innovative teams worldwide</p>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale">
          {/* Placeholder for logos */}
          {['Acme Corp', 'GlobalNet', 'TechFlow', 'InnovateInc'].map(company => (
            <div key={company} className="flex items-center gap-2 text-2xl font-bold text-[var(--text-color)]">
              <CheckCircle2 className="w-6 h-6" /> {company}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
