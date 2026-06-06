import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, CheckSquare, Calendar, Settings, X, Users, Home, Sparkles, Tag, Shield, Database } from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user } = useSelector(state => state.auth);
  const navItems = [
    { path: '/home', icon: Home, label: 'Home' },
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/features', icon: Sparkles, label: 'Features' },
    { path: '/tasks', icon: CheckSquare, label: 'Tasks' },
    { path: '/calendar', icon: Calendar, label: 'Calendar' },
    { path: '/workspace', icon: Users, label: 'Team Workspace' },
    { path: '/settings', icon: Settings, label: 'Settings' },
    { path: '/pricing', icon: Tag, label: 'Pricing' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Content */}
      <motion.aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 glass border-r border-[var(--border-color)] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-[var(--border-color)]">
          <h2 className="text-2xl font-bold text-[var(--color-primary)]">Taskify</h2>
          <button onClick={toggleSidebar} className="lg:hidden p-1 rounded-md hover:bg-[var(--surface-hover)]">
            <X className="w-6 h-6 text-[var(--text-color)]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? 'bg-[var(--color-primary)] text-white shadow-md shadow-[var(--color-primary)]/30' 
                  : 'text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}

          {user?.role === 'admin' && (
            <div className="mt-8">
              <div className="px-4 py-2 mt-4 mb-2">
                <p className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wider flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5" /> Admin Panel
                </p>
              </div>
              
              {[
                { path: '/admin', icon: Database, label: 'Admin Dashboard' },
                { path: '/admin/users', icon: Users, label: 'Manage Users' },
                { path: '/admin/tasks', icon: CheckSquare, label: 'Task Oversight' },
              ].map((item) => (
                <NavLink
                  key={item.label}
                  to={item.path}
                  end={item.path === '/admin'}
                  className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-[var(--color-primary)] text-white shadow-md shadow-[var(--color-primary)]/30' 
                      : 'text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              ))}
            </div>
          )}
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
