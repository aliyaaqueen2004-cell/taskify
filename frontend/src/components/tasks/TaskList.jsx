import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import { updateTask } from '../../features/taskSlice';
import toast from 'react-hot-toast';

const TaskList = ({ onEditTask }) => {
  const dispatch = useDispatch();
  const { items, filters, isLoading } = useSelector(state => state.tasks);

  const filteredTasks = useMemo(() => {
    return items.filter(task => {
      if (task.status === 'archived') return false; // Hide archived from board by default
      if (filters.status !== 'all' && task.status !== filters.status) return false;
      if (filters.priority !== 'all' && task.priority !== filters.priority) return false;
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const titleMatch = task.title?.toLowerCase().includes(query);
        const descMatch = task.description?.toLowerCase().includes(query);
        if (!titleMatch && !descMatch) return false;
      }
      return true;
    });
  }, [items, filters]);

  const columns = [
    { id: 'todo', title: 'To Do', color: 'border-gray-500' },
    { id: 'in_progress', title: 'In Progress', color: 'border-blue-500' },
    { id: 'review', title: 'Review', color: 'border-purple-500' },
    { id: 'completed', title: 'Completed', color: 'border-green-500' }
  ];

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const task = items.find(t => t._id === draggableId);
    if (!task) return;

    if (task.status !== destination.droppableId) {
      dispatch(updateTask({ id: draggableId, updates: { status: destination.droppableId } }));
      toast.success(`Moved to ${destination.droppableId.replace('_', ' ')}`);
    }
  };

  if (isLoading && items.length === 0) {
    return (
      <div className="flex justify-center p-12">
        <div className="w-10 h-10 border-4 border-t-[var(--color-primary)] border-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-6 overflow-x-auto custom-scrollbar pb-8 min-h-[60vh] snap-x snap-mandatory">
        {columns.map(column => {
          const columnTasks = filteredTasks.filter(t => t.status === column.id);

          return (
            <div key={column.id} className="min-w-[320px] w-[320px] snap-center flex flex-col bg-black/10 rounded-2xl p-4 border border-[var(--color-border-dark)]">
              <div className={`flex items-center justify-between mb-4 pb-2 border-b-2 ${column.color}`}>
                <h3 className="font-bold text-gray-200 capitalize tracking-wide text-sm">{column.title}</h3>
                <span className="text-xs font-bold bg-gray-800 px-2 py-1 rounded-full text-gray-400">{columnTasks.length}</span>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 transition-colors rounded-xl ${snapshot.isDraggingOver ? 'bg-[var(--color-primary)]/5 ring-1 ring-[var(--color-primary)]' : ''}`}
                  >
                    {columnTasks.map((task, index) => (
                      <Draggable key={task._id} draggableId={task._id} index={index}>
                        {(provided, snapshot) => (
                          <TaskCard 
                            task={task} 
                            onEdit={onEditTask} 
                            provided={provided} 
                            snapshot={snapshot} 
                          />
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    
                    {columnTasks.length === 0 && !snapshot.isDraggingOver && (
                      <div className="h-24 border-2 border-dashed border-gray-700/50 rounded-xl flex items-center justify-center text-sm text-gray-500 font-medium opacity-50">
                        Drop tasks here
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};

export default TaskList;
