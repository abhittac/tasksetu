
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Task } from '../../types';
import { formatDate } from '../../lib/utils';
import { PRIORITY_CONFIG, STATUS_CONFIG } from '../../lib/constants';

interface TaskCardProps {
  task: Task;
  onClick?: (task: Task) => void;
  className?: string;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick, className = "" }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick(task);
    } else {
      navigate(`/task/${task.id}`);
    }
  };

  const priorityConfig = PRIORITY_CONFIG[task.priority];
  const statusConfig = STATUS_CONFIG[task.status];

  const getTaskTypeIcon = () => {
    switch (task.type) {
      case 'milestone': return '🎯';
      case 'approval': return '✅';
      case 'recurring': return '🔄';
      default: return '📋';
    }
  };

  return (
    <div 
      className={`task-card cursor-pointer hover:shadow-md transition-all duration-200 ${className}`}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getTaskTypeIcon()}</span>
          <h3 className="font-semibold text-gray-900 line-clamp-1">{task.title}</h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityConfig.className}`}>
            {task.priority}
          </span>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusConfig.className}`}>
            {task.status}
          </span>
        </div>
      </div>

      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-4">
          {task.assignee && (
            <span>👤 {task.assignee}</span>
          )}
          {task.dueDate && (
            <span>📅 {formatDate(new Date(task.dueDate))}</span>
          )}
        </div>
        {task.subtasks && task.subtasks.length > 0 && (
          <span className="bg-gray-100 px-2 py-1 rounded">
            {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length} subtasks
          </span>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
