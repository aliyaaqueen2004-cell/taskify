import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Plus } from 'lucide-react';
import { fetchTasks } from '../features/taskSlice';
import TaskFilters from '../components/tasks/TaskFilters';
import TaskList from '../components/tasks/TaskList';
import TaskModal from '../components/tasks/TaskModal';
import { motion } from 'framer-motion';

const Tasks = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleCreate = () => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-primary)]">Tasks</h1>
          <p className="text-gray-400">Manage your projects, deadlines, and daily work.</p>
        </div>
        <button 
          onClick={handleCreate}
          className="flex items-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-[var(--color-primary)]/30 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Task
        </button>
      </div>

      <TaskFilters />
      
      <TaskList onEditTask={handleEdit} />

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        taskToEdit={taskToEdit} 
      />
    </motion.div>
  );
};

export default Tasks;
