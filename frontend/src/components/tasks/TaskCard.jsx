import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Tag, Archive, Trash2, CheckCircle, Edit, MoreVertical, GripVertical } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { updateTask, deleteTask } from '../../features/taskSlice';
import toast from 'react-hot-toast';

const TaskCard = ({ task, onEdit, provided, snapshot }) => {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);

  const handleComplete = () => {
    dispatch(updateTask({ id: task._id, updates: { status: 'completed' } }));
    toast.success('Task marked as completed!');
  };
  
  const handleArchive = () => {
    dispatch(updateTask({ id: task._id, updates: { status: 'archived' } }));
    toast.success('Task archived');
  };
  
  const handleRestore = () => {
    dispatch(updateTask({ id: task._id, updates: { status: 'todo' } }));
    toast.success('Task restored to To Do');
  };
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      dispatch(deleteTask(task._id));
      toast.success('Task deleted');
    }
  };

  const priorityColors = {
    low: 'bg-green-500/20 text-green-500',
    medium: 'bg-yellow-500/20 text-yellow-500',
    high: 'bg-orange-500/20 text-orange-500',
    urgent: 'bg-red-500/20 text-red-500',
  };

  return (
    <div 
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className="mb-4"
      style={{
        ...provided.draggableProps.style,
      }}
    >
      <motion.div 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`glass rounded-xl p-4 border border-[var(--border-subtle)] ${snapshot.isDragging ? 'shadow-2xl ring-2 ring-[var(--color-primary)]' : 'shadow-glass'} relative flex flex-col gap-3 group bg-[var(--surface-base)] transition-colors`}
      >
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-2">
            <div className="mt-1 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity">
              <GripVertical className="w-4 h-4 text-[var(--text-tertiary)]" />
            </div>
            <h3 className={`font-semibold text-sm ${task.status === 'completed' ? 'line-through text-[var(--text-tertiary)]' : 'text-[var(--text-color)]'}`}>
              {task.title}
            </h3>
          </div>
          <div className="relative">
            <button onClick={() => setShowMenu(!showMenu)} className="p-1 hover:bg-[var(--surface-hover)] rounded transition-colors opacity-0 group-hover:opacity-100">
              <MoreVertical className="w-4 h-4 text-[var(--text-secondary)]" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-1 w-36 bg-[var(--surface-base)] border border-[var(--border-subtle)] rounded-lg shadow-xl z-20 py-1 overflow-hidden">
                <button onClick={() => { onEdit(task); setShowMenu(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-[var(--surface-hover)] flex items-center gap-2 text-[var(--text-primary)]"><Edit className="w-4 h-4"/> Edit</button>
                {task.status !== 'archived' ? (
                  <button onClick={() => { handleArchive(); setShowMenu(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-[var(--surface-hover)] flex items-center gap-2 text-orange-400"><Archive className="w-4 h-4"/> Archive</button>
                ) : (
                  <button onClick={() => { handleRestore(); setShowMenu(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-[var(--surface-hover)] flex items-center gap-2 text-blue-400"><Archive className="w-4 h-4"/> Restore</button>
                )}
                <button onClick={() => { handleDelete(); setShowMenu(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-[var(--surface-hover)] flex items-center gap-2 text-red-500"><Trash2 className="w-4 h-4"/> Delete</button>
              </div>
            )}
          </div>
        </div>

        {task.description && (
          <p className="text-xs text-[var(--text-secondary)] line-clamp-2 ml-6">{task.description}</p>
        )}

        <div className="flex flex-wrap gap-2 mt-1 ml-6">
          <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wide ${priorityColors[task.priority] || priorityColors.medium}`}>
            {task.priority || 'medium'}
          </span>
          {task.tags && task.tags.slice(0, 2).map((tag, idx) => (
             <span key={idx} className="text-[10px] px-2 py-0.5 rounded font-medium bg-[var(--surface-active)] text-[var(--text-primary)]">
              {tag}
             </span>
          ))}
        </div>

        <div className="flex justify-between items-center mt-2 pt-2 border-t border-[var(--border-subtle)] text-xs text-[var(--text-tertiary)] ml-6">
          <div className="flex items-center gap-3">
            {task.dueDate && (
              <div className="flex items-center gap-1 font-medium">
                <Clock className="w-3 h-3 text-[var(--text-secondary)]" />
                <span>{new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
              </div>
            )}
          </div>

          {task.status !== 'completed' && task.status !== 'archived' && (
            <button 
              onClick={handleComplete}
              className="flex items-center gap-1 text-[var(--text-tertiary)] hover:text-green-500 transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default TaskCard;
