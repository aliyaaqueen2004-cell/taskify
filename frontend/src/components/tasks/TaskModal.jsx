import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare, Send, User, Calendar, Tag as TagIcon, AlignLeft } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { createTask, updateTask } from '../../features/taskSlice';
import { socket } from '../../services/socket';
import toast from 'react-hot-toast';

const TaskModal = ({ isOpen, onClose, taskToEdit }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'todo',
    dueDate: '',
    tags: '',
    assignee: ''
  });

  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        title: taskToEdit.title || '',
        description: taskToEdit.description || '',
        priority: taskToEdit.priority || 'medium',
        status: taskToEdit.status || 'todo',
        dueDate: taskToEdit.dueDate ? new Date(taskToEdit.dueDate).toISOString().split('T')[0] : '',
        tags: taskToEdit.tags ? taskToEdit.tags.join(', ') : '',
        assignee: taskToEdit.assignee || ''
      });
      setComments(taskToEdit.comments || [
        { id: 1, user: 'Sarah', text: 'Started working on this.', time: '2h ago' }
      ]);
    } else {
      setFormData({
        title: '', description: '', priority: 'medium', status: 'todo', dueDate: '', tags: '', assignee: ''
      });
      setComments([]);
    }
  }, [taskToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
      comments
    };
    if (taskToEdit) {
      dispatch(updateTask({ id: taskToEdit._id, updates: payload }));
      socket.emit('task-updated', { workspaceId: 'workspace-eng-1', taskId: taskToEdit._id });
      toast.success('Task updated successfully');
    } else {
      dispatch(createTask(payload));
      toast.success('Task created successfully');
    }
    onClose();
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    const newComment = { id: Date.now(), user: 'You', text: commentText, time: 'Just now' };
    setComments([...comments, newComment]);
    setCommentText('');
    
    if (taskToEdit) {
      socket.emit('new-comment', { workspaceId: 'workspace-eng-1', taskId: taskToEdit._id, comment: newComment });
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-3xl bg-[var(--surface-base)] border border-[var(--border-subtle)] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[85vh]"
        >
          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-8 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-widest">
                {taskToEdit ? `Task-${taskToEdit._id.slice(-4)}` : 'New Task'}
              </span>
              <button onClick={onClose} className="md:hidden p-2 text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form id="task-form" onSubmit={handleSubmit} className="flex-1 flex flex-col">
              <input 
                required 
                type="text" 
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                placeholder="Task Title"
                className="w-full bg-transparent text-2xl lg:text-3xl font-bold text-[var(--text-color)] placeholder-[var(--text-tertiary)] focus:outline-none mb-6" 
              />
              
              <div className="space-y-6 flex-1">
                <div className="flex items-start gap-4">
                  <AlignLeft className="w-5 h-5 text-[var(--text-tertiary)] mt-1" />
                  <textarea 
                    name="description" 
                    value={formData.description} 
                    onChange={handleChange} 
                    placeholder="Add a more detailed description..."
                    rows="3" 
                    className="w-full bg-[var(--input-bg)] hover:bg-[var(--surface-hover)] focus:bg-[var(--surface-hover)] transition-colors border border-transparent focus:border-[var(--border-medium)] rounded-xl p-4 text-[var(--text-primary)] focus:outline-none resize-none custom-scrollbar"
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Priority</label>
                    <select name="priority" value={formData.priority} onChange={handleChange} className="w-full px-3 py-2 bg-[var(--input-bg)] border border-[var(--border-subtle)] rounded-lg text-sm text-[var(--text-secondary)] focus:outline-none focus:border-[var(--color-primary)] cursor-pointer">
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Status</label>
                    <select name="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 bg-[var(--input-bg)] border border-[var(--border-subtle)] rounded-lg text-sm text-[var(--text-secondary)] focus:outline-none focus:border-[var(--color-primary)] cursor-pointer">
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="review">In Review</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Due Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)] pointer-events-none" />
                      <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} className="w-full pl-9 pr-3 py-2 bg-[var(--input-bg)] border border-[var(--border-subtle)] rounded-lg text-sm text-[var(--text-secondary)] focus:outline-none focus:border-[var(--color-primary)] [color-scheme:dark]" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Assignee</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)] pointer-events-none" />
                      <select name="assignee" value={formData.assignee} onChange={handleChange} className="w-full pl-9 pr-3 py-2 bg-[var(--input-bg)] border border-[var(--border-subtle)] rounded-lg text-sm text-[var(--text-secondary)] focus:outline-none focus:border-[var(--color-primary)] cursor-pointer">
                        <option value="">Unassigned</option>
                        <option value="alice">Alice</option>
                        <option value="bob">Bob</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Labels</label>
                  <div className="relative">
                    <TagIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)] pointer-events-none" />
                    <input type="text" name="tags" value={formData.tags} onChange={handleChange} placeholder="bug, feature, ui..." className="w-full pl-9 pr-3 py-2 bg-[var(--input-bg)] border border-[var(--border-subtle)] rounded-lg text-sm text-[var(--text-secondary)] focus:outline-none focus:border-[var(--color-primary)]" />
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Activity / Comments Sidebar */}
          <div className="w-full md:w-80 bg-[var(--surface-active)] border-t md:border-t-0 md:border-l border-[var(--border-subtle)] flex flex-col h-full">
            <div className="hidden md:flex justify-between items-center p-4 border-b border-[var(--border-subtle)]">
              <span className="font-semibold text-[var(--text-secondary)] text-sm">Activity</span>
              <button onClick={onClose} className="p-1.5 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] rounded-md transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar min-h-[200px]">
              {!taskToEdit ? (
                <div className="flex flex-col items-center justify-center h-full text-center opacity-50">
                  <MessageSquare className="w-8 h-8 text-[var(--text-tertiary)] mb-2" />
                  <p className="text-sm text-[var(--text-secondary)]">Save task to unlock discussions</p>
                </div>
              ) : comments.length === 0 ? (
                <p className="text-sm text-[var(--text-tertiary)] text-center mt-10">No comments yet.</p>
              ) : (
                comments.map(comment => (
                  <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} key={comment.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--surface-hover)] flex items-center justify-center flex-shrink-0 text-xs font-bold text-[var(--text-secondary)]">
                      {comment.user.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-semibold text-[var(--text-primary)]">{comment.user}</span>
                        <span className="text-[10px] text-[var(--text-tertiary)]">{comment.time}</span>
                      </div>
                      <p className="text-sm text-[var(--text-secondary)] mt-0.5">{comment.text}</p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {taskToEdit && (
              <div className="p-4 border-t border-[var(--border-subtle)] bg-[var(--surface-base)]">
                <form onSubmit={handleAddComment} className="relative">
                  <input 
                    type="text" 
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment..." 
                    className="w-full bg-[var(--input-bg)] border border-[var(--border-subtle)] rounded-lg pl-3 pr-10 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                  />
                  <button type="submit" disabled={!commentText.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-[var(--text-tertiary)] hover:text-[var(--color-primary)] disabled:opacity-30 transition-colors">
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

            <div className="p-4 border-t border-[var(--border-subtle)] bg-[var(--surface-hover)]">
              <button form="task-form" type="submit" className="w-full py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white rounded-lg font-semibold transition-all shadow-lg shadow-[var(--color-primary)]/20 active:scale-[0.98]">
                {taskToEdit ? 'Save Changes' : 'Create Task'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TaskModal;
