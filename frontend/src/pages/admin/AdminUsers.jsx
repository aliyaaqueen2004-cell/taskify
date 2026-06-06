import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, User, Plus, Edit2, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching users', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({ name: user.name, email: user.email, password: '', role: user.role });
    } else {
      setEditingUser(null);
      setFormData({ name: '', email: '', password: '', role: 'user' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingUser) {
        // Prepare payload (don't send empty password)
        const payload = { ...formData };
        if (!payload.password) delete payload.password;
        
        await api.put(`/admin/users/${editingUser._id}`, payload);
        toast.success('User updated successfully');
      } else {
        if (!formData.password) {
          toast.error('Password is required for new users');
          setIsSubmitting(false);
          return;
        }
        await api.post('/admin/users', formData);
        toast.success('User created successfully');
      }
      handleCloseModal();
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await api.delete(`/admin/users/${id}`);
        toast.success('User deleted successfully');
        setUsers(users.filter(u => u._id !== id));
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-color)]">User Management</h1>
          <p className="text-[var(--text-secondary)] mt-1">View, add, edit, and remove platform users.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white rounded-xl font-medium transition-all shadow-lg shadow-[var(--color-primary)]/20"
        >
          <Plus className="w-5 h-5" /> Add User
        </button>
      </div>

      <div className="glass border border-[var(--border-color)] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[var(--text-tertiary)]">Loading users...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--surface-hover)] border-b border-[var(--border-color)]">
                  <th className="px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">Name</th>
                  <th className="px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">Email</th>
                  <th className="px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">Role</th>
                  <th className="px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">Joined</th>
                  <th className="px-6 py-4 text-sm font-semibold text-[var(--text-secondary)] text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <motion.tr 
                    key={user._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-[var(--border-color)] last:border-0 hover:bg-[var(--surface-hover)]"
                  >
                    <td className="px-6 py-4 font-medium text-[var(--text-color)] flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[var(--color-primary)] to-purple-500 flex items-center justify-center text-white text-xs">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      {user.name}
                    </td>
                    <td className="px-6 py-4 text-[var(--text-tertiary)]">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-[var(--color-primary)]/20 dark:text-purple-400' : 'bg-[var(--surface-active)] text-[var(--text-primary)]'}`}>
                        {user.role === 'admin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--text-tertiary)]">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleOpenModal(user)}
                          className="p-2 text-[var(--text-tertiary)] hover:text-[var(--color-primary)] hover:bg-[var(--surface-hover)] rounded-lg transition-all"
                          title="Edit User"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(user._id)}
                          className="p-2 text-[var(--text-tertiary)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={handleCloseModal}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-[var(--surface-base)] border border-[var(--border-color)] rounded-2xl shadow-2xl p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[var(--text-color)]">
                  {editingUser ? 'Edit User' : 'Add New User'}
                </h2>
                <button onClick={handleCloseModal} className="p-1 text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Full Name</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 bg-[var(--input-bg)] border border-[var(--border-subtle)] rounded-xl focus:outline-none focus:border-[var(--color-primary)] text-[var(--text-color)]"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Email</label>
                  <input 
                    type="email" 
                    required 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2 bg-[var(--input-bg)] border border-[var(--border-subtle)] rounded-xl focus:outline-none focus:border-[var(--color-primary)] text-[var(--text-color)]"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                    Password {editingUser && <span className="text-xs text-[var(--text-tertiary)] font-normal">(Leave blank to keep current)</span>}
                  </label>
                  <input 
                    type="password" 
                    required={!editingUser}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-4 py-2 bg-[var(--input-bg)] border border-[var(--border-subtle)] rounded-xl focus:outline-none focus:border-[var(--color-primary)] text-[var(--text-color)]"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Role</label>
                  <select 
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full px-4 py-2 bg-[var(--input-bg)] border border-[var(--border-subtle)] rounded-xl focus:outline-none focus:border-[var(--color-primary)] text-[var(--text-color)]"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button" 
                    onClick={handleCloseModal}
                    className="flex-1 py-2 px-4 rounded-xl font-medium text-[var(--text-secondary)] bg-[var(--surface-hover)] hover:bg-[var(--surface-active)] transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex-1 py-2 px-4 rounded-xl font-medium text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Saving...' : 'Save User'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminUsers;
