import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Shield, Settings, MessageSquare, Briefcase, X, Activity, UserMinus, Mail, Search } from 'lucide-react';
import { socket } from '../services/socket';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Workspace = () => {
  const navigate = useNavigate();
  
  // -- State Management --
  const [workspaceName, setWorkspaceName] = useState('Engineering Team');
  const [members, setMembers] = useState([
    { id: 1, name: 'Alice (You)', role: 'Owner', avatar: 'A', email: 'alice@example.com' },
    { id: 2, name: 'Bob', role: 'Member', avatar: 'B', email: 'bob@example.com' },
    { id: 3, name: 'Charlie', role: 'Member', avatar: 'C', email: 'charlie@example.com' },
  ]);
  
  const [activityLog, setActivityLog] = useState([
    { id: 1, text: 'Alice created the workspace.', time: '2 days ago' },
    { id: 2, text: 'Bob joined the workspace.', time: '1 day ago' },
    { id: 3, text: 'Charlie updated the Frontend Architecture task.', time: '5 hours ago' }
  ]);

  const [activeUsers, setActiveUsers] = useState(2);
  
  // -- Modals State --
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Invite Form State
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Member');

  useEffect(() => {
    socket.connect();
    socket.emit('join-workspace', 'workspace-eng-1');
    return () => {
      socket.emit('leave-workspace', 'workspace-eng-1');
      socket.disconnect();
    };
  }, []);

  // -- Handlers --
  const handleInviteMember = (e) => {
    e.preventDefault();
    if (!inviteEmail) return toast.error('Please enter an email address.');
    
    const newMember = {
      id: Date.now(),
      name: inviteEmail.split('@')[0],
      role: inviteRole,
      avatar: inviteEmail.charAt(0).toUpperCase(),
      email: inviteEmail
    };

    setMembers([...members, newMember]);
    setActivityLog([{ id: Date.now(), text: `Invited ${newMember.name} as ${inviteRole}.`, time: 'Just now' }, ...activityLog]);
    setInviteEmail('');
    setIsInviteModalOpen(false);
    toast.success(`${newMember.name} has been invited!`);
  };

  const handleRemoveMember = (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name} from the workspace?`)) {
      setMembers(members.filter(m => m.id !== id));
      setActivityLog([{ id: Date.now(), text: `Removed ${name} from the workspace.`, time: 'Just now' }, ...activityLog]);
      toast.success(`${name} removed.`);
    }
  };

  const handleLeaveWorkspace = () => {
    if (window.confirm('Are you sure you want to leave this workspace? You will lose access to all tasks.')) {
      toast.error('You left the workspace.');
      navigate('/');
    }
  };

  const handleDirectMessage = (name) => {
    toast(`Direct message sent to ${name}`, { icon: '💬' });
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-6xl mx-auto space-y-6 pb-12"
      >
        {/* Header Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 glass p-6 rounded-2xl border border-[var(--color-border-dark)] shadow-glass">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[var(--color-primary)] to-purple-500 flex items-center justify-center text-white shadow-lg">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-color)] tracking-tight">{workspaceName}</h1>
              <p className="text-sm text-gray-400 flex items-center gap-2 mt-1 font-medium">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                {activeUsers} members online
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsInviteModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white rounded-xl shadow-lg shadow-[var(--color-primary)]/30 font-semibold transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" /> Invite Member
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Team Members List */}
            <div className="glass rounded-2xl p-6 shadow-glass border border-[var(--color-border-dark)]">
              <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
                <h2 className="text-lg font-bold text-[var(--text-color)] flex items-center gap-2">
                  <Users className="w-5 h-5 text-[var(--color-primary)]" />
                  Team Directory
                </h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input type="text" placeholder="Search members..." className="bg-black/30 border border-gray-800 rounded-lg pl-9 pr-4 py-1.5 text-sm text-gray-300 focus:outline-none focus:border-[var(--color-primary)] transition-colors w-48" />
                </div>
              </div>

              <div className="space-y-3">
                <AnimatePresence>
                  {members.map(member => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={member.id} 
                      className="flex items-center justify-between p-3.5 bg-gray-900/30 rounded-xl hover:bg-gray-800/50 transition-all border border-transparent hover:border-gray-700 group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-gray-700 flex items-center justify-center font-bold text-gray-200 shadow-inner">
                          {member.avatar}
                        </div>
                        <div>
                          <p className="font-semibold text-[var(--text-color)] flex items-center gap-2">
                            {member.name}
                            {member.role === 'Owner' && <Shield className="w-3.5 h-3.5 text-yellow-500" />}
                          </p>
                          <p className="text-xs text-gray-500 font-medium">{member.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        {member.role !== 'Owner' && (
                          <span className="px-2 py-1 bg-gray-800 text-gray-400 text-[10px] uppercase font-bold rounded flex items-center h-fit my-auto mr-2">
                            {member.role}
                          </span>
                        )}
                        <button 
                          onClick={() => handleDirectMessage(member.name)}
                          className="p-2 text-gray-400 hover:text-[var(--color-primary)] bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
                          title="Send Message"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        {member.role !== 'Owner' && (
                          <button 
                            onClick={() => handleRemoveMember(member.id, member.name)}
                            className="p-2 text-gray-400 hover:text-red-400 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
                            title="Remove Member"
                          >
                            <UserMinus className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Activity Feed */}
            <div className="glass rounded-2xl p-6 shadow-glass border border-[var(--color-border-dark)]">
              <h2 className="text-lg font-bold text-[var(--text-color)] mb-6 flex items-center gap-2 border-b border-gray-800 pb-4">
                <Activity className="w-5 h-5 text-[var(--color-primary)]" />
                Recent Activity
              </h2>
              <div className="space-y-4 pl-2">
                <AnimatePresence>
                  {activityLog.map((log, index) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={log.id} 
                      className="relative pl-6 pb-4 border-l border-gray-800 last:border-0 last:pb-0"
                    >
                      <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-[var(--color-primary)] ring-4 ring-[var(--color-surface-dark)]"></div>
                      <p className="text-sm text-gray-300">{log.text}</p>
                      <span className="text-[10px] font-medium text-gray-500">{log.time}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            <div className="glass rounded-2xl p-6 shadow-glass border border-[var(--color-border-dark)] sticky top-6">
               <h2 className="text-lg font-bold text-[var(--text-color)] mb-4 flex items-center gap-2 border-b border-gray-800 pb-4">
                <Settings className="w-5 h-5 text-[var(--color-primary)]" />
                Workspace Settings
              </h2>
              <div className="space-y-2">
                <button 
                  onClick={() => setIsSettingsModalOpen(true)}
                  className="w-full text-left p-3 rounded-xl hover:bg-gray-800 transition-colors text-sm font-semibold text-gray-300 flex items-center justify-between group"
                >
                  General Settings
                  <Settings className="w-4 h-4 text-gray-500 group-hover:text-gray-300" />
                </button>
                <button 
                  onClick={() => toast('Permissions panel coming soon!', { icon: '🔒' })}
                  className="w-full text-left p-3 rounded-xl hover:bg-gray-800 transition-colors text-sm font-semibold text-gray-300 flex items-center justify-between group"
                >
                  Permissions & Roles
                  <Shield className="w-4 h-4 text-gray-500 group-hover:text-gray-300" />
                </button>
                <div className="pt-4 mt-2 border-t border-gray-800">
                  <button 
                    onClick={handleLeaveWorkspace}
                    className="w-full text-left p-3 rounded-xl hover:bg-red-500/10 transition-colors text-sm font-semibold text-red-400 flex items-center gap-2"
                  >
                    <UserMinus className="w-4 h-4" /> Leave Workspace
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* --- Modals --- */}
      <AnimatePresence>
        {isInviteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsInviteModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-[var(--color-surface-dark)] border border-gray-800 rounded-2xl shadow-2xl p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Mail className="w-5 h-5 text-[var(--color-primary)]" /> Invite Member
                </h3>
                <button onClick={() => setIsInviteModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleInviteMember} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Email Address</label>
                  <input type="email" required value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="colleague@company.com" className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-[var(--color-primary)]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Role</label>
                  <select value={inviteRole} onChange={e => setInviteRole(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-[var(--color-primary)] cursor-pointer">
                    <option value="Admin">Admin</option>
                    <option value="Member">Member</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </div>
                <button type="submit" className="w-full mt-6 py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white rounded-lg font-semibold transition-colors">
                  Send Invitation
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {isSettingsModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsSettingsModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-[var(--color-surface-dark)] border border-gray-800 rounded-2xl shadow-2xl p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-[var(--color-primary)]" /> General Settings
                </h3>
                <button onClick={() => setIsSettingsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); setIsSettingsModalOpen(false); toast.success('Settings saved!'); }} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Workspace Name</label>
                  <input type="text" required value={workspaceName} onChange={e => setWorkspaceName(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-[var(--color-primary)]" />
                </div>
                <button type="submit" className="w-full mt-6 py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white rounded-lg font-semibold transition-colors">
                  Save Changes
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Workspace;
