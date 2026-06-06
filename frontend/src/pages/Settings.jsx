import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Bell, Palette, LogOut, Moon, Sun, Check, Bot, 
  Shield, Key, MonitorSmartphone, Download, Trash2, ChevronRight 
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { logout } from '../features/authSlice';
import toast from 'react-hot-toast';

const Settings = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { isDarkMode, toggleTheme } = useTheme();
  
  const [activeTab, setActiveTab] = useState('profile');
  
  // States
  const [notifications, setNotifications] = useState({ email: true, push: false, weeklyReport: true });
  const [apiKey, setApiKey] = useState('');
  const [fullName, setFullName] = useState(user?.name || 'Mock User');
  
  // Preferences
  const [startOfWeek, setStartOfWeek] = useState('Monday');
  const [timeFormat, setTimeFormat] = useState('12h');

  useEffect(() => {
    const key = localStorage.getItem('openai_api_key');
    if (key) setApiKey(key);
  }, []);

  const handleSave = (section) => {
    if (section === 'ai') {
      if (apiKey.trim()) localStorage.setItem('openai_api_key', apiKey.trim());
      else localStorage.removeItem('openai_api_key');
      toast.success('AI Configuration Saved!');
    } else if (section === 'profile') {
      toast.success('Profile updated successfully!');
    } else if (section === 'appearance') {
      toast.success('Preferences saved!');
    } else if (section === 'security') {
      toast.success('Password updated successfully!');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'appearance', label: 'Appearance & Preferences', icon: Palette },
    { id: 'security', label: 'Account Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'ai', label: 'AI Configuration', icon: Bot },
  ];

  const fadeVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto space-y-8 pb-12"
    >
      <div>
        <h1 className="text-3xl font-bold text-[var(--color-primary)]">Settings</h1>
        <p className="text-gray-400 mt-1">Manage your account settings and preferences.</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-72 flex flex-col gap-2 shrink-0">
          <div className="glass p-3 rounded-2xl border border-[var(--color-border-dark)] shadow-glass space-y-1">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-all ${
                    isActive 
                      ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/20' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 opacity-50" />}
                </button>
              );
            })}
            
            <div className="h-px bg-gray-800 my-2 mx-2"></div>
            
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-500 hover:bg-red-500/10 transition-all"
            >
              <LogOut className="w-5 h-5" />
              Log Out
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={fadeVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="glass rounded-2xl p-6 lg:p-8 shadow-glass border border-[var(--color-border-dark)] min-h-[500px] flex flex-col"
            >
              
              {/* --- PROFILE TAB --- */}
              {activeTab === 'profile' && (
                <div className="space-y-8 flex-1">
                  <div className="border-b border-gray-800 pb-4">
                    <h2 className="text-2xl font-bold text-[var(--text-color)]">Profile Settings</h2>
                    <p className="text-sm text-gray-500 mt-1">Update your personal information and avatar.</p>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="relative group cursor-pointer">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[var(--color-primary)] to-purple-400 flex items-center justify-center text-3xl font-bold text-white shadow-lg border-4 border-[var(--color-surface-dark)]">
                        {fullName.charAt(0)}
                      </div>
                      <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs font-bold text-white">EDIT</span>
                      </div>
                    </div>
                    <div>
                      <button className="px-5 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-semibold transition-colors text-[var(--text-color)] border border-gray-700">
                        Upload Avatar
                      </button>
                      <p className="text-xs text-gray-500 mt-2">JPG, GIF or PNG. Max size of 800K</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Full Name</label>
                      <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full px-4 py-2.5 bg-black/30 border border-gray-800 rounded-lg focus:outline-none focus:border-[var(--color-primary)] text-white transition-colors" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
                      <input type="email" value={user?.email || 'abc@gmail.com'} className="w-full px-4 py-2.5 bg-black/30 border border-gray-800 rounded-lg text-gray-500 opacity-60 cursor-not-allowed" disabled />
                    </div>
                  </div>

                  <div className="pt-4">
                    <button onClick={() => handleSave('profile')} className="px-6 py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white rounded-lg font-semibold shadow-lg shadow-[var(--color-primary)]/20 transition-all flex items-center gap-2 active:scale-95">
                      <Check className="w-4 h-4"/> Save Changes
                    </button>
                  </div>

                  <div className="mt-12 pt-8 border-t border-gray-800">
                    <h3 className="text-lg font-bold text-red-500 mb-4">Danger Zone</h3>
                    <div className="border border-red-500/20 rounded-xl p-4 bg-red-500/5 space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <p className="font-semibold text-gray-200">Export Account Data</p>
                          <p className="text-xs text-gray-400">Download a copy of all your tasks and settings.</p>
                        </div>
                        <button onClick={() => toast.success('Export started! Check your email soon.')} className="px-4 py-2 border border-gray-700 hover:bg-gray-800 rounded-lg text-sm font-semibold text-gray-300 flex items-center gap-2 transition-colors">
                          <Download className="w-4 h-4"/> Export Data
                        </button>
                      </div>
                      <div className="h-px bg-red-500/10"></div>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <p className="font-semibold text-gray-200">Delete Account</p>
                          <p className="text-xs text-gray-400">Permanently delete your account and all data.</p>
                        </div>
                        <button onClick={() => toast.error('Action disabled in demo mode')} className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors">
                          <Trash2 className="w-4 h-4"/> Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* --- APPEARANCE & PREFERENCES TAB --- */}
              {activeTab === 'appearance' && (
                <div className="space-y-8 flex-1">
                  <div className="border-b border-gray-800 pb-4">
                    <h2 className="text-2xl font-bold text-[var(--text-color)]">Appearance & Preferences</h2>
                    <p className="text-sm text-gray-500 mt-1">Customize how TaskFlow looks and behaves for you.</p>
                  </div>
                  
                  <div className="space-y-6 max-w-2xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-black/20 rounded-xl border border-gray-800 gap-4">
                      <div>
                        <h3 className="font-semibold text-[var(--text-color)]">Theme Preference</h3>
                        <p className="text-xs text-gray-400 mt-1">Switch between dark and light mode.</p>
                      </div>
                      <div className="flex bg-black/40 p-1 rounded-lg border border-gray-800">
                        <button onClick={() => isDarkMode && toggleTheme()} className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-all ${!isDarkMode ? 'bg-white text-gray-900 shadow-md' : 'text-gray-400 hover:text-white'}`}>
                          <Sun className="w-4 h-4" /> Light
                        </button>
                        <button onClick={() => !isDarkMode && toggleTheme()} className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-all ${isDarkMode ? 'bg-[var(--color-surface-dark)] text-white shadow-md border border-gray-700' : 'text-gray-400 hover:text-white'}`}>
                          <Moon className="w-4 h-4" /> Dark
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-black/20 rounded-xl border border-gray-800 gap-4">
                      <div>
                        <h3 className="font-semibold text-[var(--text-color)]">Accent Color</h3>
                        <p className="text-xs text-gray-400 mt-1">Choose your primary application color.</p>
                      </div>
                      <div className="flex gap-3">
                        {['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'].map((color, idx) => (
                          <button 
                            key={idx}
                            onClick={() => toast('Accent colors are locked in this theme.', { icon: '🎨' })}
                            className={`w-6 h-6 rounded-full ring-2 ring-offset-2 ring-offset-[var(--color-surface-dark)] transition-transform hover:scale-110 ${idx === 0 ? 'ring-purple-500' : 'ring-transparent'}`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       <div className="p-4 bg-black/20 rounded-xl border border-gray-800 space-y-3">
                        <label className="text-sm font-semibold text-gray-300">Start of Week</label>
                        <select value={startOfWeek} onChange={e => setStartOfWeek(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-[var(--color-primary)]">
                          <option value="Monday">Monday</option>
                          <option value="Sunday">Sunday</option>
                        </select>
                       </div>
                       <div className="p-4 bg-black/20 rounded-xl border border-gray-800 space-y-3">
                        <label className="text-sm font-semibold text-gray-300">Time Format</label>
                        <select value={timeFormat} onChange={e => setTimeFormat(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-[var(--color-primary)]">
                          <option value="12h">12-hour (1:00 PM)</option>
                          <option value="24h">24-hour (13:00)</option>
                        </select>
                       </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-800">
                    <button onClick={() => handleSave('appearance')} className="px-6 py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white rounded-lg font-semibold shadow-lg shadow-[var(--color-primary)]/20 transition-all flex items-center gap-2 active:scale-95">
                      <Check className="w-4 h-4"/> Save Preferences
                    </button>
                  </div>
                </div>
              )}

              {/* --- SECURITY TAB --- */}
              {activeTab === 'security' && (
                <div className="space-y-8 flex-1">
                  <div className="border-b border-gray-800 pb-4">
                    <h2 className="text-2xl font-bold text-[var(--text-color)]">Account Security</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage your password and active sessions.</p>
                  </div>
                  
                  <div className="space-y-6 max-w-xl">
                    <div className="bg-black/20 p-5 rounded-xl border border-gray-800">
                      <h3 className="text-lg font-bold text-gray-200 flex items-center gap-2 mb-4">
                        <Key className="w-5 h-5 text-[var(--color-primary)]" /> Change Password
                      </h3>
                      <form onSubmit={(e) => { e.preventDefault(); handleSave('security'); }} className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Current Password</label>
                          <input type="password" required className="w-full px-4 py-2.5 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:border-[var(--color-primary)] text-white transition-colors" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">New Password</label>
                          <input type="password" required className="w-full px-4 py-2.5 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:border-[var(--color-primary)] text-white transition-colors" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Confirm New Password</label>
                          <input type="password" required className="w-full px-4 py-2.5 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:border-[var(--color-primary)] text-white transition-colors" />
                        </div>
                        <button type="submit" className="px-6 py-2.5 mt-2 bg-white/5 hover:bg-white/10 text-white border border-gray-700 rounded-lg font-semibold transition-all">
                          Update Password
                        </button>
                      </form>
                    </div>

                    <div className="bg-black/20 p-5 rounded-xl border border-gray-800">
                      <h3 className="text-lg font-bold text-gray-200 flex items-center gap-2 mb-4">
                        <MonitorSmartphone className="w-5 h-5 text-[var(--color-primary)]" /> Active Sessions
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/5 rounded-lg">
                          <div className="flex items-center gap-3">
                            <MonitorSmartphone className="w-5 h-5 text-[var(--color-primary)]" />
                            <div>
                              <p className="text-sm font-semibold text-gray-200">Windows PC - Chrome</p>
                              <p className="text-xs text-green-400 font-medium mt-0.5">Active now • New York, US</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-3 border border-gray-800 bg-gray-900/50 rounded-lg opacity-70">
                          <div className="flex items-center gap-3">
                            <MonitorSmartphone className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="text-sm font-semibold text-gray-300">iPhone 13 - Safari</p>
                              <p className="text-xs text-gray-500 font-medium mt-0.5">Last active 2 days ago</p>
                            </div>
                          </div>
                          <button onClick={() => toast.success('Session revoked')} className="text-xs text-red-400 hover:text-red-300 font-semibold px-3 py-1 bg-red-500/10 rounded">Revoke</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* --- NOTIFICATIONS TAB --- */}
              {activeTab === 'notifications' && (
                <div className="space-y-8 flex-1">
                  <div className="border-b border-gray-800 pb-4">
                    <h2 className="text-2xl font-bold text-[var(--text-color)]">Notification Preferences</h2>
                    <p className="text-sm text-gray-500 mt-1">Control how and when you receive alerts.</p>
                  </div>
                  
                  <div className="space-y-4 max-w-2xl">
                    {[
                      { id: 'email', title: 'Email Notifications', desc: 'Receive daily summaries and reminders via email', state: notifications.email },
                      { id: 'push', title: 'Push Notifications', desc: 'Get instant browser alerts for urgent tasks', state: notifications.push },
                      { id: 'weeklyReport', title: 'Weekly Productivity Report', desc: 'Receive a detailed breakdown every Monday', state: notifications.weeklyReport }
                    ].map(item => (
                      <div key={item.id} className="flex items-center justify-between p-5 bg-black/20 rounded-xl border border-gray-800 transition-colors hover:bg-black/30">
                        <div>
                          <h3 className="font-semibold text-gray-200">{item.title}</h3>
                          <p className="text-sm text-gray-400 mt-0.5">{item.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" checked={item.state} onChange={(e) => setNotifications({...notifications, [item.id]: e.target.checked})} />
                          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* --- AI CONFIGURATION TAB --- */}
              {activeTab === 'ai' && (
                <div className="space-y-8 flex-1">
                  <div className="border-b border-gray-800 pb-4">
                    <h2 className="text-2xl font-bold text-[var(--text-color)]">AI Configuration</h2>
                    <p className="text-sm text-gray-500 mt-1">Connect your OpenAI account to unlock advanced intelligence.</p>
                  </div>
                  
                  <div className="space-y-6 max-w-2xl">
                    <div className="p-5 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl flex gap-4">
                      <Bot className="w-6 h-6 text-purple-400 shrink-0 mt-1" />
                      <div>
                        <h3 className="font-bold text-gray-200 mb-1">Unlock Full Capabilities</h3>
                        <p className="text-sm text-gray-400 leading-relaxed">
                          TaskFlow uses a limited simulation mode by default. By providing your own OpenAI API key, the assistant can draft emails, analyze complex schedules, and answer general questions with full intelligence.
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">OpenAI API Key</label>
                      <input 
                        type="password" 
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="sk-..." 
                        className="w-full px-4 py-3 bg-black/30 border border-gray-800 rounded-lg focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] text-white font-mono tracking-widest transition-all" 
                      />
                      <p className="text-xs text-gray-500 mt-2 font-medium">Your key is stored securely in your browser's LocalStorage. It is never sent to our servers.</p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-800">
                    <button onClick={() => handleSave('ai')} className="px-6 py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white rounded-lg font-semibold shadow-lg shadow-[var(--color-primary)]/20 transition-all flex items-center gap-2 active:scale-95">
                      <Check className="w-4 h-4"/> Save API Key
                    </button>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;
