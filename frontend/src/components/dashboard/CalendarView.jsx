import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { SkeletonCard } from './Skeleton';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay, isSameMonth, addMonths, subMonths } from 'date-fns';

const CalendarView = () => {
  const { items, isLoading } = useSelector(state => state.tasks);
  const [currentDate, setCurrentDate] = useState(new Date());

  const days = useMemo(() => {
    return eachDayOfInterval({
      start: startOfMonth(currentDate),
      end: endOfMonth(currentDate)
    });
  }, [currentDate]);

  const taskDates = useMemo(() => {
    const dates = {};
    items.forEach(t => {
      if (t.dueDate && t.status !== 'completed' && t.status !== 'archived') {
        const dateStr = format(new Date(t.dueDate), 'yyyy-MM-dd');
        if (!dates[dateStr]) dates[dateStr] = [];
        dates[dateStr].push(t);
      }
    });
    return dates;
  }, [items]);

  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      className="glass rounded-2xl p-6 shadow-glass h-full"
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            <CalendarIcon className="w-5 h-5 text-indigo-500" />
          </div>
          <h2 className="text-xl font-bold text-[var(--text-color)]">Calendar</h2>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="p-1 hover:bg-gray-700 rounded transition-colors"><ChevronLeft className="w-5 h-5"/></button>
          <span className="text-sm font-semibold min-w-[100px] text-center">{format(currentDate, 'MMMM yyyy')}</span>
          <button onClick={nextMonth} className="p-1 hover:bg-gray-700 rounded transition-colors"><ChevronRight className="w-5 h-5"/></button>
        </div>
      </div>

      {isLoading && items.length === 0 ? (
        <SkeletonCard lines={4} />
      ) : (
        <div className="w-full">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <div key={day} className="text-center text-xs font-semibold text-gray-500 py-1">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {/* Pad beginning of month */}
            {Array.from({ length: startOfMonth(currentDate).getDay() }).map((_, i) => (
              <div key={`empty-${i}`} className="h-8 sm:h-10"></div>
            ))}
            
            {days.map((day) => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const dayTasks = taskDates[dateStr] || [];
              const isToday = isSameDay(day, new Date());
              const isCurrentMonth = isSameMonth(day, currentDate);
              
              return (
                <motion.div 
                  key={day.toString()}
                  whileHover={{ scale: 1.1 }}
                  className={`relative h-8 sm:h-10 rounded-lg flex items-center justify-center cursor-default text-sm font-medium ${
                    isToday ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/40' : 
                    isCurrentMonth ? 'text-[var(--text-color)] hover:bg-[var(--color-surface-dark)] border border-transparent hover:border-[var(--color-border-dark)] transition-colors' : 'text-gray-600'
                  }`}
                  title={dayTasks.length > 0 ? `${dayTasks.length} tasks due` : ''}
                >
                  {format(day, 'd')}
                  {dayTasks.length > 0 && (
                    <div className="absolute bottom-1 flex gap-0.5">
                      <div className={`w-1 h-1 rounded-full ${isToday ? 'bg-white' : 'bg-red-500'}`}></div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CalendarView;
