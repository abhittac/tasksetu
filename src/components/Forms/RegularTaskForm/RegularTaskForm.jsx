
import React, { useState, useEffect } from 'react';
import { Input, Select, Button } from '../../UI';

const RegularTaskForm = ({ onSubmit, onCancel, initialData = {} }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignee: '',
    priority: 'medium',
    status: 'todo',
    dueDate: '',
    category: '',
    tags: '',
    ...initialData
  });

  const [isManualDueDate, setIsManualDueDate] = useState(false);

  const priorityOptions = [
    { value: 'low', label: 'Low (30 days)' },
    { value: 'medium', label: 'Medium (14 days)' },
    { value: 'high', label: 'High (7 days)' },
    { value: 'critical', label: 'Critical (2 days)' },
    { value: 'urgent', label: 'Urgent (2 days)' }
  ];

  const statusOptions = [
    { value: 'todo', label: 'To Do' },
    { value: 'progress', label: 'In Progress' },
    { value: 'review', label: 'In Review' }
  ];

  const assigneeOptions = [
    { value: 'john', label: 'John Doe' },
    { value: 'jane', label: 'Jane Smith' },
    { value: 'mike', label: 'Mike Johnson' },
    { value: 'sarah', label: 'Sarah Wilson' }
  ];

  const categoryOptions = [
    { value: 'development', label: 'Development' },
    { value: 'design', label: 'Design' },
    { value: 'research', label: 'Research' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'support', label: 'Support' }
  ];

  const calculateDueDateFromPriority = (priority) => {
    const days = {
      low: 30,
      medium: 14,
      high: 7,
      critical: 2,
      urgent: 2
    };
    
    const date = new Date();
    date.setDate(date.getDate() + (days[priority] || 14));
    return date.toISOString().split('T')[0];
  };

  useEffect(() => {
    if (!isManualDueDate && formData.priority) {
      const calculatedDueDate = calculateDueDateFromPriority(formData.priority);
      setFormData(prev => ({ ...prev, dueDate: calculatedDueDate }));
    }
  }, [formData.priority, isManualDueDate]);

  const handleChange = (field, value) => {
    if (field === 'dueDate') {
      setIsManualDueDate(true);
    }
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const resetToAutoCalculate = () => {
    setIsManualDueDate(false);
    const calculatedDueDate = calculateDueDateFromPriority(formData.priority);
    setFormData(prev => ({ ...prev, dueDate: calculatedDueDate }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 mb-1">Task Details</h3>
          <p className="text-gray-600 text-sm">Fill in the basic information for your task</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="lg:col-span-2">
            <Input
              label="Task Title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter task title..."
              required
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe the task..."
              rows={4}
            />
          </div>

          <Select
            label="Assign to"
            options={assigneeOptions}
            value={formData.assignee}
            onChange={(e) => handleChange('assignee', e.target.value)}
            placeholder="Select assignee..."
          />

          <Select
            label="Priority"
            options={priorityOptions}
            value={formData.priority}
            onChange={(e) => handleChange('priority', e.target.value)}
          />

          <Select
            label="Initial Status"
            options={statusOptions}
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
          />

          <Select
            label="Category"
            options={categoryOptions}
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
            placeholder="Select category..."
          />

          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Due Date
              {!isManualDueDate && (
                <span className="text-xs text-blue-600 ml-2">
                  (Auto-calculated from priority)
                </span>
              )}
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleChange('dueDate', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {!isManualDueDate && (
              <p className="text-xs text-gray-500 mt-1">
                Due date automatically calculated based on selected priority. Change manually to override.
              </p>
            )}
            {isManualDueDate && (
              <div className="flex items-center mt-1">
                <p className="text-xs text-gray-500">Manual override active.</p>
                <button
                  type="button"
                  onClick={resetToAutoCalculate}
                  className="text-xs text-blue-600 hover:text-blue-800 ml-2 underline"
                >
                  Reset to auto-calculate
                </button>
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            <Input
              label="Tags"
              value={formData.tags}
              onChange={(e) => handleChange('tags', e.target.value)}
              placeholder="Enter tags separated by commas..."
            />
            <p className="mt-1 text-xs text-gray-500">
              Separate multiple tags with commas
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" type="button">
            Save as Draft
          </Button>
          <Button type="submit">
            Create Task
          </Button>
        </div>
      </div>
    </form>
  );
};

export default RegularTaskForm;
