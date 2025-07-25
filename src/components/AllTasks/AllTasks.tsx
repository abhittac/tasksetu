
import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../store';
import { updateTask, deleteTask } from '../../features/tasks/tasksSlice';
import { Task, TaskStatus, TaskPriority } from '../../types';
import TaskList from '../Tasks/TaskList';
import TaskFilters from '../Tasks/TaskFilters';
import CreateTaskDrawer from '../../features/tasks/components/CreateTaskDrawer';
import { setShowCreateTaskDrawer } from '../../features/ui/uiSlice';
import Button from '../UI/Button';

const AllTasks: React.FC = () => {
  const dispatch = useAppDispatch();
  const { tasks } = useAppSelector(state => state.tasks);
  const { showCreateTaskDrawer } = useAppSelector(state => state.ui);
  
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(tasks);
  const [filters, setFilters] = useState({
    status: 'all' as TaskStatus | 'all',
    priority: 'all' as TaskPriority | 'all',
    search: ''
  });

  useEffect(() => {
    let filtered = tasks;

    if (filters.status !== 'all') {
      filtered = filtered.filter(task => task.status === filters.status);
    }

    if (filters.priority !== 'all') {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }

    if (filters.search) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredTasks(filtered);
  }, [tasks, filters]);

  const handleCreateTask = () => {
    dispatch(setShowCreateTaskDrawer(true));
  };

  const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
    dispatch(updateTask({ id: taskId, updates }));
  };

  const handleTaskDelete = (taskId: string) => {
    dispatch(deleteTask(taskId));
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">All Tasks</h1>
            <p className="text-gray-600 mt-1">Manage and track all your tasks</p>
          </div>
          <Button variant="primary" onClick={handleCreateTask}>
            Create Task
          </Button>
        </div>
      </div>

      <div className="page-content">
        <div className="mb-6">
          <TaskFilters filters={filters} onFiltersChange={setFilters} />
        </div>

        <TaskList
          tasks={filteredTasks}
          onTaskUpdate={handleTaskUpdate}
          onTaskDelete={handleTaskDelete}
        />
      </div>

      {showCreateTaskDrawer && <CreateTaskDrawer />}
    </div>
  );
};

export default AllTasks;
