import React, { useState } from 'react'

export default function CreateTask({ onClose }) {
  const [taskType, setTaskType] = useState('regular')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignee: '',
    priority: 'medium',
    status: 'todo',
    dueDate: '',
    category: '',
    tags: '',
    attachments: []
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Creating task:', formData)
    // Handle task creation
    if (onClose) onClose()
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="space-y-6">

      {/* Task Type Selector */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Task Type</h3>
          <p className="text-gray-600">Choose the type of task you want to create</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => setTaskType('regular')}
            className={`p-3 border-2 rounded-xl text-left transition-all duration-300 group ${
              taskType === 'regular' 
                ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-md transform scale-102' 
                : 'border-gray-200 hover:border-blue-300 hover:shadow-sm hover:transform hover:scale-101'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                taskType === 'regular' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-blue-100 text-blue-600 group-hover:bg-blue-200'
              }`}>
                <span className="text-sm">📋</span>
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-semibold text-gray-900 group-hover:text-blue-700">Regular Task</h4>
                <p className="text-xs text-gray-500 group-hover:text-gray-600 truncate">Standard one-time task</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setTaskType('recurring')}
            className={`p-3 border-2 rounded-xl text-left transition-all duration-300 group ${
              taskType === 'recurring' 
                ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-md transform scale-102' 
                : 'border-gray-200 hover:border-green-300 hover:shadow-sm hover:transform hover:scale-101'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                taskType === 'recurring' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-green-100 text-green-600 group-hover:bg-green-200'
              }`}>
                <span className="text-sm">🔄</span>
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-semibold text-gray-900 group-hover:text-green-700">Recurring Task</h4>
                <p className="text-xs text-gray-500 group-hover:text-gray-600 truncate">Repeats on schedule</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setTaskType('milestone')}
            className={`p-3 border-2 rounded-xl text-left transition-all duration-300 group ${
              taskType === 'milestone' 
                ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-violet-50 shadow-md transform scale-102' 
                : 'border-gray-200 hover:border-purple-300 hover:shadow-sm hover:transform hover:scale-101'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                taskType === 'milestone' 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-purple-100 text-purple-600 group-hover:bg-purple-200'
              }`}>
                <span className="text-sm">🎯</span>
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-semibold text-gray-900 group-hover:text-purple-700">Milestone</h4>
                <p className="text-xs text-gray-500 group-hover:text-gray-600 truncate">Project checkpoint</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Task Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card">
          <div className="card-header">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Task Details</h3>
            <p className="text-gray-600">Fill in the basic information for your task</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Title */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="form-input"
                placeholder="Enter task title..."
                required
              />
            </div>

            {/* Description */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="form-textarea"
                placeholder="Describe the task..."
                rows={4}
              />
            </div>

            {/* Assignee */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assign to
              </label>
              <select
                value={formData.assignee}
                onChange={(e) => handleInputChange('assignee', e.target.value)}
                className="form-select"
              >
                <option value="">Select assignee...</option>
                <option value="john">John Doe</option>
                <option value="jane">Jane Smith</option>
                <option value="mike">Mike Johnson</option>
                <option value="sarah">Sarah Wilson</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                className="form-select"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Initial Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="form-select"
              >
                <option value="todo">To Do</option>
                <option value="progress">In Progress</option>
                <option value="review">In Review</option>
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                className="form-input"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="form-select"
              >
                <option value="">Select category...</option>
                <option value="development">Development</option>
                <option value="design">Design</option>
                <option value="research">Research</option>
                <option value="marketing">Marketing</option>
                <option value="support">Support</option>
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                className="form-input"
                placeholder="Enter tags separated by commas..."
              />
              <p className="mt-1 text-xs text-gray-500">Separate multiple tags with commas</p>
            </div>
          </div>
        </div>

        {/* Recurring Options (if recurring task selected) */}
        {taskType === 'recurring' && (
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Recurring Settings</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frequency
                </label>
                <select className="form-select">
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input type="date" className="form-input" />
              </div>
            </div>
          </div>
        )}

        {/* Milestone Options (if milestone selected) */}
        {taskType === 'milestone' && (
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Milestone Settings</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project
                </label>
                <select className="form-select">
                  <option value="">Select project...</option>
                  <option value="website">Website Redesign</option>
                  <option value="mobile">Mobile App</option>
                  <option value="api">API Development</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Milestone Type
                </label>
                <select className="form-select">
                  <option value="checkpoint">Checkpoint</option>
                  <option value="deliverable">Deliverable</option>
                  <option value="review">Review</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* File Attachments */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Attachments</h3>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="mt-4">
              <label className="cursor-pointer">
                <span className="text-primary-600 hover:text-primary-500">Upload files</span>
                <input type="file" className="sr-only" multiple />
              </label>
              <p className="text-gray-500"> or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500 mt-2">PNG, JPG, PDF up to 10MB</p>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-secondary">
            Save as Draft
          </button>
          <button type="submit" className="btn btn-primary">
            Create Task
          </button>
        </div>
      </form>
    </div>
  )
}