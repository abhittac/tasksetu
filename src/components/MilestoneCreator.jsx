
import React, { useState } from 'react';

export default function MilestoneCreator({ onClose, onSubmit, preFilledDate, selectedDate }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignee: 'Current User',
    assigneeId: 1,
    priority: 'medium',
    dueDate: preFilledDate || selectedDate || '',
    milestoneType: 'standalone',
    visibility: 'private',
    linkedTasks: [],
    collaborators: []
  });

  const [errors, setErrors] = useState({});

  const teamMembers = [
    { id: 1, name: "Current User" },
    { id: 2, name: "John Smith" },
    { id: 3, name: "Jane Smith" },
    { id: 4, name: "Mike Johnson" },
    { id: 5, name: "Sarah Wilson" },
    { id: 6, name: "Emily Davis" }
  ];

  const availableTasks = [
    { id: 1, title: "UI Design Complete" },
    { id: 2, title: "Backend API Development" },
    { id: 3, title: "Testing Phase" },
    { id: 4, title: "Deployment" }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleCollaboratorToggle = (memberId) => {
    setFormData(prev => ({
      ...prev,
      collaborators: prev.collaborators.includes(memberId)
        ? prev.collaborators.filter(id => id !== memberId)
        : [...prev.collaborators, memberId]
    }));
  };

  const handleLinkedTaskToggle = (taskId) => {
    setFormData(prev => ({
      ...prev,
      linkedTasks: prev.linkedTasks.includes(taskId)
        ? prev.linkedTasks.filter(id => id !== taskId)
        : [...prev.linkedTasks, taskId]
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Milestone title is required';
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-2xl border border-purple-100 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">🎯</span>
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-bold text-gray-900 mb-2">Milestone Information</h4>
            <p className="text-sm text-gray-600">Define the basic properties and configuration for your milestone</p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <div className="form-group">
            <label htmlFor="title" className="form-label flex items-center gap-2">
              <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Milestone Title*
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter milestone title (e.g., Project Alpha Launch)"
              className={`form-input ${errors.title ? 'border-red-500' : ''}`}
            />
            {errors.title && <span className="text-red-500 text-sm">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe the milestone purpose, criteria, and background..."
              rows="3"
              className="form-textarea resize-none"
            />
          </div>
        </div>

        {/* Milestone Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label htmlFor="milestoneType" className="form-label flex items-center gap-2">
              <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Milestone Type
            </label>
            <select 
              id="milestoneType" 
              value={formData.milestoneType}
              onChange={(e) => handleInputChange('milestoneType', e.target.value)}
              className="form-select"
            >
              <option value="standalone">🎯 Standalone Milestone</option>
              <option value="linked">🔗 Linked to Tasks</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="dueDate" className="form-label flex items-center gap-2">
              <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Due Date*
            </label>
            <input
              type="date"
              id="dueDate"
              value={formData.dueDate}
              onChange={(e) => handleInputChange('dueDate', e.target.value)}
              className={`form-input ${errors.dueDate ? 'border-red-500' : ''}`}
            />
            {errors.dueDate && <span className="text-red-500 text-sm">{errors.dueDate}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="assignee" className="form-label flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Assigned To
            </label>
            <select 
              id="assignee" 
              value={formData.assigneeId}
              onChange={(e) => {
                const member = teamMembers.find(m => m.id === parseInt(e.target.value));
                handleInputChange('assigneeId', member.id);
                handleInputChange('assignee', member.name);
              }}
              className="form-select"
            >
              {teamMembers.map(member => (
                <option key={member.id} value={member.id}>
                  👤 {member.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="priority" className="form-label flex items-center gap-2">
              <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Priority
            </label>
            <select 
              id="priority" 
              value={formData.priority}
              onChange={(e) => handleInputChange('priority', e.target.value)}
              className="form-select"
            >
              <option value="low">🟢 Low</option>
              <option value="medium">🟡 Medium</option>
              <option value="high">🟠 High</option>
              <option value="critical">🔴 Critical</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="visibility" className="form-label flex items-center gap-2">
              <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Visibility
            </label>
            <select 
              id="visibility" 
              value={formData.visibility}
              onChange={(e) => handleInputChange('visibility', e.target.value)}
              className="form-select"
            >
              <option value="private">🔒 Private</option>
              <option value="public">👥 Public</option>
            </select>
          </div>
        </div>

        {/* Linked Tasks Section */}
        {formData.milestoneType === 'linked' && (
          <div className="form-group">
            <label className="form-label flex items-center gap-2">
              <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              Link to Tasks
            </label>
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl p-4">
              <div className="space-y-3">
                {availableTasks.map(task => (
                  <label key={task.id} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={formData.linkedTasks.includes(task.id)}
                      onChange={() => handleLinkedTaskToggle(task.id)}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" 
                    />
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-blue-500">⚙️</span>
                      <span className="text-sm font-medium text-gray-900 group-hover:text-indigo-700">{task.title}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Collaborators Section */}
        <div className="form-group">
          <label className="form-label flex items-center gap-2">
            <svg className="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Collaborators
          </label>
          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200 rounded-xl p-4">
            <div className="space-y-3">
              {teamMembers.filter(member => member.id !== formData.assigneeId).map(member => (
                <label key={member.id} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-teal-300 hover:bg-teal-50 transition-all duration-200 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={formData.collaborators.includes(member.id)}
                    onChange={() => handleCollaboratorToggle(member.id)}
                    className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500" 
                  />
                  <div className="flex items-center gap-2 flex-1">
                    <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white text-xs font-bold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-900 group-hover:text-teal-700">{member.name}</span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t-2 border-gray-100 sticky bottom-0 bg-white">
          <button 
            type="button" 
            className="btn btn-secondary px-8 py-3 text-sm font-semibold" 
            onClick={onClose}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary px-8 py-3 text-sm font-semibold flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Milestone
          </button>
        </div>
      </form>
    </div>
  );
}
