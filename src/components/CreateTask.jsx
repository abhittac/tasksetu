import React, { useState } from 'react'

export default function CreateTask() {
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
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create New Task</h1>
        <p className="mt-2 text-lg text-gray-600">Add a new task to your workflow</p>
      </div>

      {/* Task Type Selector */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setTaskType('regular')}
            className={`p-4 border-2 rounded-lg text-left transition-all ${
              taskType === 'regular' 
                ? 'border-primary-500 bg-primary-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-lg">📋</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Regular Task</h4>
                <p className="text-sm text-gray-500">Standard one-time task</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setTaskType('recurring')}
            className={`p-4 border-2 rounded-lg text-left transition-all ${
              taskType === 'recurring' 
                ? 'border-primary-500 bg-primary-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-lg">🔄</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Recurring Task</h4>
                <p className="text-sm text-gray-500">Repeats on schedule</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setTaskType('milestone')}
            className={`p-4 border-2 rounded-lg text-left transition-all ${
              taskType === 'milestone' 
                ? 'border-primary-500 bg-primary-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-lg">🎯</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Milestone</h4>
                <p className="text-sm text-gray-500">Project checkpoint</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Task Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Task Details</h3>

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