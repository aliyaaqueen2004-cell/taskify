import React, { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, List as ListIcon, HelpCircle } from 'lucide-react';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay, isSameMonth, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { fetchTasks } from '../features/taskSlice';
import TaskModal from '../components/tasks/TaskModal';

const Calendar = () => {
  const dispatch = useDispatch();
  const { items } = useSelector(state => state.tasks);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('month');

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const days = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentDate]);

  const taskMap = useMemo(() => {
    const map = {};
    items.forEach(task => {
      if (task.dueDate && task.status !== 'archived') {
        const dateStr = format(new Date(task.dueDate), 'yyyy-MM-dd');
        if (!map[dateStr]) map[dateStr] = [];
        map[dateStr].push(task);
      }
    });
    return map;
  }, [items]);

  const unscheduledTasks = useMemo(() => {
    return items.filter(t => !t.dueDate && t.status !== 'archived' && t.status !== 'completed');
  }, [items]);

  const monthlyStats = useMemo(() => {
    const currentMonthTasks = items.filter(t => {
      if(!t.dueDate) return false;
      return isSameMonth(new Date(t.dueDate), currentDate);
    });
    return {
      total: currentMonthTasks.length,
      completed: currentMonthTasks.filter(t => t.status === 'completed').length,
    };
  }, [items, currentDate]);

  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const handleTaskClick = (task, e) => {
    e.stopPropagation();
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleQuickAdd = (day, e) => {
    e.stopPropagation();
    setSelectedTask({
      title: '',
      description: '',
      priority: 'medium',
      status: 'todo',
      dueDate: format(day, "yyyy-MM-dd"),
      tags: []
    });
    setIsModalOpen(true);
  };

  const openUnscheduled = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'in_progress': return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      case 'review': return 'bg-purple-500/20 text-purple-500 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col lg:flex-row gap-6 h-auto lg:h-[calc(100vh-6rem)]"
    >
      {/* Sidebar */}
      <div className="w-full lg:w-80 flex flex-col gap-6">
        <div className="glass rounded-2xl p-6 shadow-glass">
          <h2 className="text-lg font-bold text-[var(--color-primary)] mb-4">Monthly Insights</h2>
          <div className="flex justify-between items-center bg-[var(--color-surface-dark)] p-4 rounded-xl border border-[var(--color-border-dark)]">
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase">Tasks Due</p>
              <p className="text-2xl font-black text-[var(--text-color)]">{monthlyStats.total}</p>
            </div>
            <div className="h-10 w-px bg-[var(--color-border-dark)]"></div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase">Completed</p>
              <p className="text-2xl font-black text-green-500">{monthlyStats.completed}</p>
            </div>
          </div>
        </div>

        <div className="glass flex-1 rounded-2xl p-6 shadow-glass flex flex-col overflow-hidden min-h-[300px]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[var(--color-primary)] flex items-center gap-2">
              <HelpCircle className="w-5 h-5"/>
              Unscheduled
            </h2>
            <span className="bg-gray-700 text-white text-xs font-bold px-2 py-1 rounded-full">{unscheduledTasks.length}</span>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {unscheduledTasks.length === 0 ? (
              <p className="text-sm text-gray-500 text-center mt-10">No unscheduled tasks. You're super organized!</p>
            ) : (
              unscheduledTasks.map(task => (
                <motion.div 
                  key={task._id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => openUnscheduled(task)}
                  className="p-3 bg-[var(--color-surface-dark)] border border-[var(--color-border-dark)] hover:border-[var(--color-primary)] rounded-xl cursor-pointer transition-colors"
                >
                  <p className="text-sm font-semibold text-[var(--text-color)] truncate">{task.title}</p>
                  <div className="flex gap-2 mt-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${getStatusColor(task.status)}`}>{task.status.replace('_', ' ')}</span>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-2 font-medium">Click to schedule</p>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Main Calendar Area */}
      <div className="flex-1 flex flex-col min-h-[600px] lg:min-h-0">
        <div className="flex flex-col sm:flex-row justify-between items-center bg-card backdrop-blur-xs p-4 rounded-2xl shadow-glass gap-4 mb-4">
          <div className="flex items-center gap-2 bg-[var(--color-surface-dark)] p-1 rounded-lg border border-[var(--color-border-dark)]">
            <button 
              onClick={() => setViewMode('month')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md font-medium text-sm transition-colors ${viewMode === 'month' ? 'bg-[var(--color-primary)] text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
            >
              <CalendarIcon className="w-4 h-4" /> Month
            </button>
            <button 
              onClick={() => setViewMode('agenda')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md font-medium text-sm transition-colors ${viewMode === 'agenda' ? 'bg-[var(--color-primary)] text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
            >
              <ListIcon className="w-4 h-4" /> Agenda
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setCurrentDate(new Date())}
              className="px-4 py-1.5 text-sm font-medium rounded-lg hover:bg-[var(--color-surface-dark)] border border-[var(--color-border-dark)] transition-colors"
            >
              Today
            </button>
            <div className="flex items-center bg-[var(--color-surface-dark)] rounded-lg border border-[var(--color-border-dark)] p-1">
              <button onClick={prevMonth} className="p-1 hover:bg-gray-700 rounded transition-colors"><ChevronLeft className="w-5 h-5"/></button>
              <span className="text-sm font-bold min-w-[120px] text-center">{format(currentDate, 'MMMM yyyy')}</span>
              <button onClick={nextMonth} className="p-1 hover:bg-gray-700 rounded transition-colors"><ChevronRight className="w-5 h-5"/></button>
            </div>
          </div>
        </div>

        <div className="glass flex-1 rounded-2xl p-4 shadow-glass overflow-hidden flex flex-col min-h-0">
          <AnimatePresence mode="wait">
            {viewMode === 'month' ? (
              <motion.div 
                key="month"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex flex-col h-full"
              >
                <div className="grid grid-cols-7 gap-px mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center font-bold text-gray-500 py-2 uppercase text-xs tracking-wider">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="flex-1 grid grid-cols-7 gap-2 auto-rows-fr overflow-y-auto pr-2 pb-2 custom-scrollbar">
                  {days.map((day) => {
                    const dateStr = format(day, 'yyyy-MM-dd');
                    const dayTasks = taskMap[dateStr] || [];
                    const isToday = isSameDay(day, new Date());
                    const isCurrentMonth = isSameMonth(day, currentDate);
                    
                    return (
                      <div 
                        key={day.toString()}
                        className={`group relative min-h-[100px] p-2 rounded-xl border flex flex-col gap-1 transition-colors ${
                          isCurrentMonth 
                            ? 'bg-[var(--color-surface-dark)]/50 border-[var(--color-border-dark)] hover:border-gray-500' 
                            : 'bg-transparent border-transparent opacity-50'
                        } ${isToday ? 'ring-2 ring-[var(--color-primary)] ring-inset' : ''}`}
                      >
                        <div className="flex justify-between items-start">
                          <div className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full mb-1 ${
                            isToday ? 'bg-[var(--color-primary)] text-white shadow-lg' : 'text-[var(--text-color)]'
                          }`}>
                            {format(day, 'd')}
                          </div>
                          {isCurrentMonth && (
                            <button 
                              onClick={(e) => handleQuickAdd(day, e)}
                              className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-white hover:bg-[var(--color-primary)] rounded-md transition-all"
                              title="Add Task"
                            >
                              <Plus className="w-4 h-4"/>
                            </button>
                          )}
                        </div>
                        
                        <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                          {dayTasks.map(task => (
                            <div 
                              key={task._id}
                              onClick={(e) => handleTaskClick(task, e)}
                              className={`text-[10px] sm:text-xs font-semibold px-2 py-1 rounded border truncate cursor-pointer hover:opacity-80 transition-opacity ${getStatusColor(task.status)} ${task.status === 'completed' ? 'line-through opacity-60' : ''}`}
                              title={task.title}
                            >
                              {task.title}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="agenda"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex-1 overflow-y-auto pr-4 space-y-8 custom-scrollbar pt-2"
              >
                {days.filter(day => taskMap[format(day, 'yyyy-MM-dd')]?.length > 0 && isSameMonth(day, currentDate)).length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <CalendarIcon className="w-12 h-12 mb-4 opacity-20" />
                    <p>No tasks scheduled for this month.</p>
                  </div>
                ) : (
                  days.map((day) => {
                    const dateStr = format(day, 'yyyy-MM-dd');
                    const dayTasks = taskMap[dateStr];
                    if (!dayTasks || dayTasks.length === 0 || !isSameMonth(day, currentDate)) return null;

                    return (
                      <div key={dateStr} className="flex flex-col md:flex-row gap-6">
                        <div className="w-full md:w-32 flex-shrink-0 pt-2">
                          <p className="text-sm font-bold text-gray-400 uppercase">{format(day, 'EEEE')}</p>
                          <p className={`text-2xl font-black ${isSameDay(day, new Date()) ? 'text-[var(--color-primary)]' : 'text-[var(--text-color)]'}`}>
                            {format(day, 'MMM d')}
                          </p>
                        </div>
                        <div className="flex-1 space-y-3 border-l-2 border-[var(--color-border-dark)] pl-6">
                          {dayTasks.map(task => (
                            <div 
                              key={task._id}
                              onClick={(e) => handleTaskClick(task, e)}
                              className={`p-4 rounded-xl border flex flex-col cursor-pointer hover:bg-[var(--color-surface-dark)] transition-colors ${getStatusColor(task.status)} bg-opacity-10`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <h3 className={`font-bold text-base ${task.status === 'completed' ? 'line-through opacity-70' : ''}`}>{task.title}</h3>
                                <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-md bg-black/20 text-white/90">
                                  {task.priority}
                                </span>
                              </div>
                              <p className="text-sm opacity-80 line-clamp-2">{task.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        taskToEdit={selectedTask} 
      />
    </motion.div>
  );
};

export default Calendar;
