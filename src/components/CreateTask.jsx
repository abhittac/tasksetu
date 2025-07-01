import React, { useState, useEffect } from 'react'
import { calculateDueDateFromPriority } from './PriorityManager'
import RecurringTaskManager from './RecurringTaskManager'
import MilestoneManager from './MilestoneManager'

export default function CreateTask({ onClose }) {
  const [taskType, setTaskType] = useState('regular')
  const [showMoreOptions, setShowMoreOptions] = useState(false)
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
  const [isManualDueDate, setIsManualDueDate] = useState(false)
  const [moreOptionsData, setMoreOptionsData] = useState({
    referenceProcess: '',
    customForm: '',
    dependencies: [],
    taskTypeAdvanced: 'simple'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Creating task:', formData)
    // Handle task creation
    if (onClose) onClose()
  }

  // Auto-calculate due date when priority changes (unless manually overridden)
  useEffect(() => {
    if (!isManualDueDate && formData.priority) {
      const calculatedDueDate = calculateDueDateFromPriority(formData.priority)
      setFormData(prev => ({
        ...prev,
        dueDate: calculatedDueDate
      }))
    }
  }, [formData.priority, isManualDueDate])

  const handleInputChange = (field, value) => {
    if (field === 'dueDate') {
      setIsManualDueDate(true)
    }
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleMoreOptionsChange = (field, value) => {
    setMoreOptionsData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="space-y-6 mt-0">

      {/* Task Type Selector */}
      <div className="create-task-form">
        <div className="task-type-selector">
          <div className="form-section-header">
            <h3 className="form-section-title">Task Type</h3>
            <p className="form-section-description">Choose the type of task you want to create</p>
          </div>
          <div className="task-type-grid">
            <button
              type="button"
              onClick={() => setTaskType('regular')}
              className={`task-type-option ${taskType === 'regular' ? 'selected' : ''}`}
            >
              <div className="task-type-header">
                <div className="task-type-icon-large">📋</div>
                <div className="task-type-title">Regular Task</div>
              </div>
              <div className="task-type-description">Standard one-time task</div>
            </button>

            <button
              type="button"
              onClick={() => setTaskType('recurring')}
              className={`task-type-option ${taskType === 'recurring' ? 'selected' : ''}`}
            >
              <div className="task-type-header">
                <div className="task-type-icon-large">🔄</div>
                <div className="task-type-title">Recurring Task</div>
              </div>
              <div className="task-type-description">Repeats on schedule</div>
            </button>

            <button
              type="button"
              onClick={() => setTaskType('milestone')}
              className={`task-type-option ${taskType === 'milestone' ? 'selected' : ''}`}
            >
              <div className="task-type-header">
                <div className="task-type-icon-large">🎯</div>
                <div className="task-type-title">Milestone</div>
              </div>
              <div className="task-type-description">Project checkpoint</div>
            </button>
          </div>
        </div>
      </div>

      {/* Conditional Task Forms */}
      {taskType === 'regular' && (
        <form onSubmit={handleSubmit} className="space-y-6">
        <div className="form-section">
          <div className="form-section-header">
            <h3 className="form-section-title">Task Details</h3>
            <p className="form-section-description">Fill in the basic information for your task</p>
          </div>

          <div className="form-grid">
            {/* Title */}
            <div className="form-field full-width">
              <label className="form-label">
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
            <div className="form-field full-width">
              <label className="form-label">
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
            <div className="form-field">
              <label className="form-label">
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
            <div className="form-field">
              <label className="form-label">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                className="form-select"
              >
                <option value="low">Low (30 days)</option>
                <option value="medium">Medium (14 days)</option>
                <option value="high">High (7 days)</option>
                <option value="critical">Critical (2 days)</option>
                <option value="urgent">Urgent (2 days)</option>
              </select>
            </div>

            {/* Status */}
            <div className="form-field">
              <label className="form-label">
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
            <div className="form-field">
              <label className="form-label">
                Due Date
                {!isManualDueDate && (
                  <span className="text-xs text-blue-600 ml-2">(Auto-calculated from priority)</span>
                )}
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                className="form-input"
              />
              {!isManualDueDate && (
                <p className="form-help-text">
                  Due date automatically calculated based on selected priority. Change manually to override.
                </p>
              )}
              {isManualDueDate && (
                <div className="flex items-center mt-1">
                  <p className="form-help-text">Manual override active.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsManualDueDate(false)
                      const calculatedDueDate = calculateDueDateFromPriority(formData.priority)
                      setFormData(prev => ({
                        ...prev,
                        dueDate: calculatedDueDate
                      }))
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800 ml-2 underline"
                  >
                    Reset to auto-calculate
                  </button>
                </div>
              )}
            </div>

            {/* Category */}
            <div className="form-field">
              <label className="form-label">
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
            <div className="form-field">
              <label className="form-label">
                Tags
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                className="form-input"
                placeholder="Enter tags separated by commas..."
              />
              <p className="form-help-text">Separate multiple tags with commas</p>
            </div>
          </div>
        </div>

        

        {/* File Attachments */}
        <div className="form-section">
          <div className="form-section-header">
            <h3 className="form-section-title">Attachments</h3>
          </div>
          <div className="file-upload-area">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📁</div>
            <div>
              <p>
                <strong>Drag and drop files here or </strong>
                <button type="button" className="text-blue-600 hover:text-blue-800 underline">Choose Files</button>
              </p>
              <p className="text-gray-500">No file chosen</p>
            </div>
            <p className="text-xs text-gray-500 mt-2">PNG, JPG, PDF up to 10MB</p>
          </div>
        </div>

        {/* More Options Button */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Advanced Options</h3>
              <p className="text-sm text-gray-600">Configure additional task settings</p>
            </div>
            <button
              type="button"
              onClick={() => setShowMoreOptions(true)}
              className="btn btn-secondary flex items-center space-x-2"
            >
              <span>⚙️</span>
              <span>More Options</span>
            </button>
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
      )}

      {/* Recurring Task Form */}
      {taskType === 'recurring' && (
        <RecurringTaskManager onClose={onClose} />
      )}

      {/* Milestone Task Form */}
      {taskType === 'milestone' && (
        <MilestoneManager onClose={onClose} />
      )}

      {/* More Options Modal */}
      {showMoreOptions && (
        <MoreOptionsModal
          data={moreOptionsData}
          onChange={handleMoreOptionsChange}
          onClose={() => setShowMoreOptions(false)}
          onSave={() => setShowMoreOptions(false)}
        />
      )}
    </div>
  )
}

// More Options Modal Component
function MoreOptionsModal({ data, onChange, onClose, onSave }) {
  const [searchTerms, setSearchTerms] = useState({
    process: '',
    form: '',
    dependencies: ''
  })

  // Sample data - in real app, these would come from API
  const referenceProcesses = [
    { id: 'sop001', name: 'Customer Onboarding SOP' },
    { id: 'sop002', name: 'Bug Report Workflow' },
    { id: 'sop003', name: 'Feature Request Process' },
    { id: 'sop004', name: 'Quality Assurance Checklist' },
    { id: 'sop005', name: 'Deployment Process' }
  ]

  const customForms = [
    { id: 'form001', name: 'Bug Report Form' },
    { id: 'form002', name: 'Feature Request Form' },
    { id: 'form003', name: 'Customer Feedback Form' },
    { id: 'form004', name: 'Project Evaluation Form' },
    { id: 'form005', name: 'Performance Review Form' }
  ]

  const existingTasks = [
    { id: 'task001', name: 'Setup Development Environment' },
    { id: 'task002', name: 'Design Database Schema' },
    { id: 'task003', name: 'Create API Endpoints' },
    { id: 'task004', name: 'Write Unit Tests' },
    { id: 'task005', name: 'User Interface Design' }
  ]

  const filteredProcesses = referenceProcesses.filter(process =>
    process.name.toLowerCase().includes(searchTerms.process.toLowerCase())
  )

  const filteredForms = customForms.filter(form =>
    form.name.toLowerCase().includes(searchTerms.form.toLowerCase())
  )

  const filteredTasks = existingTasks.filter(task =>
    task.name.toLowerCase().includes(searchTerms.dependencies.toLowerCase())
  )

  const handleDependencyToggle = (taskId) => {
    const currentDeps = data.dependencies || []
    const newDeps = currentDeps.includes(taskId)
      ? currentDeps.filter(id => id !== taskId)
      : [...currentDeps, taskId]
    onChange('dependencies', newDeps)
  }

  const handleSave = () => {
    // In real app, would validate and save data
    onSave()
  }

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm  bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">More Options</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl font-bold w-8 h-8 flex items-center justify-center"
            >
              ×
            </button>
          </div>
          <p className="text-gray-600 mt-1">Configure advanced task settings</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Reference Process */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reference Process
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search for a process..."
                value={searchTerms.process}
                onChange={(e) => setSearchTerms(prev => ({ ...prev, process: e.target.value }))}
                className="form-input mb-2"
              />
              <select
                value={data.referenceProcess}
                onChange={(e) => onChange('referenceProcess', e.target.value)}
                className="form-select"
              >
                <option value="">Select a process...</option>
                {filteredProcesses.map(process => (
                  <option key={process.id} value={process.id}>
                    {process.name}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-xs text-gray-500 mt-1">Link this task to an existing process (e.g., SOP or workflow)</p>
          </div>

          {/* Custom Form */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Form
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search for a form..."
                value={searchTerms.form}
                onChange={(e) => setSearchTerms(prev => ({ ...prev, form: e.target.value }))}
                className="form-input mb-2"
              />
              <select
                value={data.customForm}
                onChange={(e) => onChange('customForm', e.target.value)}
                className="form-select"
              >
                <option value="">Select a form...</option>
                {filteredForms.map(form => (
                  <option key={form.id} value={form.id}>
                    {form.name}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-xs text-gray-500 mt-1">Choose a predefined form to collect data for this task</p>
          </div>

          {/* Dependencies */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dependencies
            </label>
            <input
              type="text"
              placeholder="Search for tasks..."
              value={searchTerms.dependencies}
              onChange={(e) => setSearchTerms(prev => ({ ...prev, dependencies: e.target.value }))}
              className="form-input mb-2"
            />
            <div className="border border-gray-300 rounded-lg max-h-40 overflow-y-auto">
              {filteredTasks.map(task => (
                <label key={task.id} className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0">
                  <input
                    type="checkbox"
                    checked={data.dependencies?.includes(task.id) || false}
                    onChange={() => handleDependencyToggle(task.id)}
                    className="mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-900">{task.name}</span>
                </label>
              ))}
              {filteredTasks.length === 0 && (
                <div className="p-3 text-sm text-gray-500 text-center">
                  No tasks found
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">Select existing tasks that must be completed before this one starts</p>
          </div>

          {/* Task Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Type *
            </label>
            <select
              value={data.taskTypeAdvanced}
              onChange={(e) => onChange('taskTypeAdvanced', e.target.value)}
              className="form-select"
              required
            >
              <option value="simple">Simple</option>
              <option value="recurring">Recurring</option>
              <option value="approval">Approval</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Determines the task behavior</p>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3 sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="btn btn-primary"
          >
            Save Options
          </button>
        </div>
      </div>
    </div>
  )
}