import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Menu, User, LogOut, Bell, MessageSquare, CheckCircle, AtSign } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/authSlice';
import { socket } from '../../services/socket';

const Navbar = ({ toggleSidebar }) => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'assignment', text: 'Sarah assigned you to "Update API Docs"', read: false, time: '2m ago' },
    { id: 2, type: 'comment', text: 'Mike commented on "Database Migration"', read: false, time: '1h ago' },
    { id: 3, type: 'system', text: 'Workspace "Engineering" created successfully', read: true, time: '1d ago' },
  ]);

  useEffect(() => {
    // Listen for real-time notifications from Socket.io
    const handleNotification = (data) => {
      setNotifications(prev => [{ id: Date.now(), ...data, read: false, time: 'Just now' }, ...prev]);
    };

    socket.on('notification', handleNotification);
    return () => socket.off('notification', handleNotification);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    dispatch(logout());
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'assignment': return <AtSign className="w-4 h-4 text-purple-500" />;
      case 'comment': return <MessageSquare className="w-4 h-4 text-blue-500" />;
      default: return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  return (
    <motion.header 
      className="glass sticky top-0 z-40 w-full h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-[var(--border-color)]"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-md hover:bg-[var(--surface-hover)] transition-colors"
        >
          <Menu className="w-6 h-6 text-[var(--text-color)]" />
        </button>
        <h1 className="text-xl font-bold text-[var(--color-primary)] hidden sm:block">Taskify</h1>
      </div>

      <div className="flex items-center gap-4 relative">
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-[var(--surface-hover)] transition-colors"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-[var(--text-secondary)]" />}
        </button>

        {/* Notification Center */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-full hover:bg-[var(--surface-hover)] transition-colors relative"
          >
            <Bell className="w-5 h-5 text-[var(--text-color)]" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[var(--bg-color)] animate-pulse"></span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-80 bg-[var(--surface-base)] border border-[var(--border-subtle)] shadow-2xl rounded-2xl overflow-hidden z-50"
              >
                <div className="flex justify-between items-center p-4 border-b border-[var(--border-subtle)] bg-[var(--surface-hover)]">
                  <h3 className="font-bold text-[var(--text-color)]">Notifications</h3>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="text-xs text-[var(--color-primary)] hover:underline font-medium">Mark all read</button>
                  )}
                </div>
                <div className="max-h-[300px] overflow-y-auto custom-scrollbar flex flex-col">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-[var(--text-secondary)] text-sm">No new notifications.</div>
                  ) : (
                    notifications.map(notification => (
                      <div key={notification.id} className={`flex gap-3 p-4 border-b border-[var(--border-subtle)] last:border-0 hover:bg-[var(--surface-hover)] transition-colors cursor-pointer ${!notification.read ? 'bg-[var(--color-primary)]/5' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${!notification.read ? 'bg-[var(--color-primary)]/20' : 'bg-[var(--surface-active)]'}`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm ${!notification.read ? 'text-[var(--text-color)] font-semibold' : 'text-[var(--text-secondary)]'}`}>{notification.text}</p>
                          <p className="text-xs text-[var(--text-tertiary)] mt-1">{notification.time}</p>
                        </div>
                        {!notification.read && <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] self-center"></div>}
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="flex items-center gap-3 border-l border-[var(--border-subtle)] pl-4">
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium text-[var(--text-color)]">{user?.name || 'User'}</p>
            <p className="text-xs text-[var(--text-secondary)]">{user?.email || 'user@example.com'}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[var(--color-primary)] to-purple-500 flex items-center justify-center text-white font-bold shadow-lg">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 rounded-full text-red-500 hover:bg-red-500/10 transition-colors ml-2"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
