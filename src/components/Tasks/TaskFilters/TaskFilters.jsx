
import React from 'react';
import { Select, Input } from '../../UI';

const TaskFilters = ({ filters, onFilterChange }) => {
  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'todo', label: 'To Do' },
    { value: 'progress', label: 'In Progress' },
    { value: 'review', label: 'In Review' },
    { value: 'done', label: 'Done' }
  ];

  const priorityOptions = [
    { value: '', label: 'All Priorities' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' },
    { value: 'urgent', label: 'Urgent' }
  ];

  const assigneeOptions = [
    { value: '', label: 'All Assignees' },
    { value: 'john', label: 'John Doe' },
    { value: 'jane', label: 'Jane Smith' },
    { value: 'mike', label: 'Mike Johnson' },
    { value: 'sarah', label: 'Sarah Wilson' }
  ];

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          placeholder="Search tasks..."
          value={filters.search || ''}
          onChange={(e) => onFilterChange('search', e.target.value)}
        />
        
        <Select
          options={statusOptions}
          value={filters.status || ''}
          onChange={(e) => onFilterChange('status', e.target.value)}
          placeholder="Filter by status"
        />
        
        <Select
          options={priorityOptions}
          value={filters.priority || ''}
          onChange={(e) => onFilterChange('priority', e.target.value)}
          placeholder="Filter by priority"
        />
        
        <Select
          options={assigneeOptions}
          value={filters.assignee || ''}
          onChange={(e) => onFilterChange('assignee', e.target.value)}
          placeholder="Filter by assignee"
        />
      </div>
    </div>
  );
};

export default TaskFilters;
