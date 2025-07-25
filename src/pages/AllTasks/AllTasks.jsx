
import React, { useState, useMemo } from 'react';
import { TaskList, TaskFilters } from '../../components/Tasks';

const AllTasks = ({ onTaskClick }) => {
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    assignee: ''
  });

  // Sample tasks data
  const [tasks] = useState([
    {
      id: 1,
      title: 'User authentication system',
      description: 'Implement OAuth, login, logout, and session management',
      assignee: 'John Doe',
      status: 'progress',
      priority: 'high',
      dueDate: '2024-01-25',
      category: 'Development',
      progress: 75
    },
    {
      id: 2,
      title: 'Design new landing page',
      description: 'Create a modern, responsive landing page design',
      assignee: 'Jane Smith',
      status: 'todo',
      priority: 'medium',
      dueDate: '2024-01-30',
      category: 'Design',
      progress: 0
    },
    {
      id: 3,
      title: 'Fix mobile responsiveness issues',
      description: 'Address mobile layout problems on dashboard',
      assignee: 'Mike Johnson',
      status: 'done',
      priority: 'high',
      dueDate: '2024-01-20',
      category: 'Development',
      progress: 100
    }
  ]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = !filters.search || 
        task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.description.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesStatus = !filters.status || task.status === filters.status;
      const matchesPriority = !filters.priority || task.priority === filters.priority;
      const matchesAssignee = !filters.assignee || task.assignee.toLowerCase().includes(filters.assignee.toLowerCase());

      return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
    });
  }, [tasks, filters]);

  return (
    <div className="space-y-6">
      <TaskFilters filters={filters} onFilterChange={handleFilterChange} />
      <TaskList tasks={filteredTasks} onTaskClick={onTaskClick} />
    </div>
  );
};

export default AllTasks;
