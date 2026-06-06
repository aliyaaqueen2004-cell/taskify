import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters } from '../../features/taskSlice';
import { Search } from 'lucide-react';

const TaskFilters = () => {
  const dispatch = useDispatch();
  const { filters } = useSelector(state => state.tasks);

  const handleSearch = (e) => {
    dispatch(setFilters({ searchQuery: e.target.value }));
  };

  const handleStatus = (e) => {
    dispatch(setFilters({ status: e.target.value }));
  };

  const handlePriority = (e) => {
    dispatch(setFilters({ priority: e.target.value }));
  };

  return (
    <div className="glass p-4 rounded-xl flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
      <div className="relative w-full md:w-1/3">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input 
          type="text" 
          placeholder="Search tasks..." 
          value={filters.searchQuery}
          onChange={handleSearch}
          className="w-full pl-10 pr-4 py-2 bg-[var(--color-surface-dark)] border border-[var(--color-border-dark)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] text-sm text-[var(--text-color)]"
        />
      </div>
      
      <div className="flex gap-4 w-full md:w-auto">
        <select 
          value={filters.status} 
          onChange={handleStatus}
          className="bg-[var(--color-surface-dark)] border border-[var(--color-border-dark)] rounded-lg px-4 py-2 text-sm text-[var(--text-color)] focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="review">Review</option>
          <option value="completed">Completed</option>
          <option value="archived">Archived</option>
        </select>

        <select 
          value={filters.priority} 
          onChange={handlePriority}
          className="bg-[var(--color-surface-dark)] border border-[var(--color-border-dark)] rounded-lg px-4 py-2 text-sm text-[var(--text-color)] focus:outline-none"
        >
          <option value="all">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>
    </div>
  );
};

export default TaskFilters;
