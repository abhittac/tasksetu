
import React from 'react';
import { Task } from '../../types';
import TaskCard from './TaskCard';
import LoadingSpinner from '../UI/LoadingSpinner';

interface TaskListProps {
  tasks: Task[];
  loading?: boolean;
  emptyMessage?: string;
  onTaskClick?: (task: Task) => void;
  className?: string;
}

const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  loading = false, 
  emptyMessage = "No tasks found",
  onTaskClick,
  className = ""
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📋</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Tasks</h3>
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {tasks.map((task) => (
        <TaskCard 
          key={task.id} 
          task={task} 
          onClick={onTaskClick}
        />
      ))}
    </div>
  );
};

export default TaskList;
