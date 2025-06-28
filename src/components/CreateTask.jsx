
import React, { useState, useRef, useEffect } from 'react'

export default function CreateTask({ onClose, userContext = { isOrganization: true } }) {
  const [taskType, setTaskType] = useState('regular')
  const [showMoreOptions, setShowMoreOptions] = useState(false)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})
  const titleInputRef = useRef(null)

  // Calculate default due date (today + 30 days)
  const getDefaultDueDate = () => {
    const today = new Date()
    const defaultDate = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000))
    return defaultDate.toISOString().split('T')[0]
  }

  const [formData, setFormData] = useState({
    title: 'Untitled Task',
    description: '',
    assignee: '',
    priority: 'low', // Default to low priority
    status: 'todo',
    dueDate: getDefaultDueDate(), // Auto-filled default
    category: '',
    tags: '',
    attachments: []
  })

  const [moreOptionsData, setMoreOptionsData] = useState({
    referenceProcess: '',
    customForm: '',
    dependencies: [],
    taskTypeAdvanced: 'simple'
  })

  // Focus title when editing
  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus()
      titleInputRef.current.select()
    }
  }, [isEditingTitle])

  // Live validation
  const validateField = (field, value) => {
    const errors = { ...validationErrors }
    
    switch (field) {
      case 'title':
        if (!value || value.trim() === '') {
          errors.title = 'Task title is required'
        } else {
          delete errors.title
        }
        break
      case 'dueDate':
        if (value && new Date(value) < new Date()) {
          errors.dueDate = 'Due date cannot be in the past'
        } else {
          delete errors.dueDate
        }
        break
      case 'assignee':
        if (value && !value.includes('@') && value.includes('.')) {
          // Basic email validation if it looks like an email
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!emailRegex.test(value)) {
            errors.assignee = 'Invalid email format'
          } else {
            delete errors.assignee
          }
        } else {
          delete errors.assignee
        }
        break
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validate required fields
    const requiredFields = ['title']
    let hasErrors = false
    
    requiredFields.forEach(field => {
      if (!validateField(field, formData[field])) {
        hasErrors = true
      }
    })

    if (moreOptionsData.taskTypeAdvanced === '') {
      setValidationErrors(prev => ({ ...prev, taskTypeAdvanced: 'Task type is required' }))
      hasErrors = true
    }

    if (hasErrors) {
      return
    }

    console.log('Creating task:', { ...formData, ...moreOptionsData })
    if (onClose) onClose()
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Live validation
    validateField(field, value)
  }

  const handleMoreOptionsChange = (field, value) => {
    setMoreOptionsData(prev => ({
      ...prev,
      [field]: value
    }))

    // Validate advanced fields
    if (field === 'taskTypeAdvanced' && value) {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.taskTypeAdvanced
        return newErrors
      })
    }
  }

  const handleTitleClick = () => {
    setIsEditingTitle(true)
  }

  const handleTitleBlur = () => {
    setIsEditingTitle(false)
    if (formData.title.trim() === '') {
      handleInputChange('title', 'Untitled Task')
    }
  }

  const handleTitleKeyPress = (e) => {
    if (e.key === 'Enter') {
      setIsEditingTitle(false)
      if (formData.title.trim() === '') {
        handleInputChange('title', 'Untitled Task')
      }
    }
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
            {/* Inline Editable Title */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Title *
              </label>
              {isEditingTitle ? (
                <input
                  ref={titleInputRef}
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  onBlur={handleTitleBlur}
                  onKeyPress={handleTitleKeyPress}
                  className={`form-input ${validationErrors.title ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Enter task title..."
                />
              ) : (
                <div
                  onClick={handleTitleClick}
                  className={`form-input cursor-pointer hover:border-blue-300 transition-colors ${
                    validationErrors.title ? 'border-red-500' : ''
                  } ${formData.title === 'Untitled Task' ? 'text-gray-500 italic' : ''}`}
                >
                  {formData.title}
                </div>
              )}
              {validationErrors.title && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {validationErrors.title}
                </p>
              )}
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

            {/* Assignee with live validation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assign to
              </label>
              <SearchableSelect
                value={formData.assignee}
                onChange={(value) => handleInputChange('assignee', value)}
                options={[
                  { value: '', label: 'Select assignee...' },
                  { value: 'john@company.com', label: 'John Doe (john@company.com)' },
                  { value: 'jane@company.com', label: 'Jane Smith (jane@company.com)' },
                  { value: 'mike@company.com', label: 'Mike Johnson (mike@company.com)' },
                  { value: 'sarah@company.com', label: 'Sarah Wilson (sarah@company.com)' }
                ]}
                placeholder="Search for assignee..."
                error={validationErrors.assignee}
              />
            </div>

            {/* Priority with default */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                className="form-select"
              >
                <option value="low">Low (Default)</option>
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

            {/* Due Date with validation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                className={`form-input ${validationErrors.dueDate ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
              />
              {validationErrors.dueDate && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {validationErrors.dueDate}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <SearchableSelect
                value={formData.category}
                onChange={(value) => handleInputChange('category', value)}
                options={[
                  { value: '', label: 'Select category...' },
                  { value: 'development', label: 'Development' },
                  { value: 'design', label: 'Design' },
                  { value: 'research', label: 'Research' },
                  { value: 'marketing', label: 'Marketing' },
                  { value: 'support', label: 'Support' }
                ]}
                placeholder="Search categories..."
              />
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

        {/* Context-Aware More Options Button - Only show for Organization users */}
        {userContext.isOrganization && (
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
        )}

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

      {/* More Options Modal - Only shown for Organization users */}
      {showMoreOptions && userContext.isOrganization && (
        <MoreOptionsModal
          data={moreOptionsData}
          onChange={handleMoreOptionsChange}
          onClose={() => setShowMoreOptions(false)}
          onSave={() => setShowMoreOptions(false)}
          validationErrors={validationErrors}
        />
      )}
    </div>
  )
}

// Searchable Select Component
function SearchableSelect({ value, onChange, options, placeholder, error }) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [displayValue, setDisplayValue] = useState('')
  const dropdownRef = useRef(null)

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => {
    const selectedOption = options.find(option => option.value === value)
    setDisplayValue(selectedOption ? selectedOption.label : '')
  }, [value, options])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (selectedValue) => {
    onChange(selectedValue)
    setIsOpen(false)
    setSearchTerm('')
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`form-select cursor-pointer flex items-center justify-between ${
          error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
        }`}
      >
        <span className={displayValue ? 'text-gray-900' : 'text-gray-500'}>
          {displayValue || placeholder}
        </span>
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
          <div className="p-2 border-b border-gray-200">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                    option.value === value ? 'bg-blue-50 text-blue-900' : 'text-gray-900'
                  }`}
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-500 text-center">
                No options found
              </div>
            )}
          </div>
        </div>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <span className="mr-1">⚠️</span>
          {error}
        </p>
      )}
    </div>
  )
}

// More Options Modal Component with enhanced features
function MoreOptionsModal({ data, onChange, onClose, onSave, validationErrors }) {
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
    onSave()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
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
            <SearchableSelect
              value={data.referenceProcess}
              onChange={(value) => onChange('referenceProcess', value)}
              options={[
                { value: '', label: 'Select a process...' },
                ...filteredProcesses.map(process => ({
                  value: process.id,
                  label: process.name
                }))
              ]}
              placeholder="Search for a process..."
            />
            <p className="text-xs text-gray-500 mt-1">Link this task to an existing process (e.g., SOP or workflow)</p>
          </div>

          {/* Custom Form */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Form
            </label>
            <SearchableSelect
              value={data.customForm}
              onChange={(value) => onChange('customForm', value)}
              options={[
                { value: '', label: 'Select a form...' },
                ...filteredForms.map(form => ({
                  value: form.id,
                  label: form.name
                }))
              ]}
              placeholder="Search for a form..."
            />
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

          {/* Task Type with validation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Type *
            </label>
            <select
              value={data.taskTypeAdvanced}
              onChange={(e) => onChange('taskTypeAdvanced', e.target.value)}
              className={`form-select ${validationErrors?.taskTypeAdvanced ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
              required
            >
              <option value="">Select task type...</option>
              <option value="simple">Simple</option>
              <option value="recurring">Recurring</option>
              <option value="approval">Approval</option>
            </select>
            {validationErrors?.taskTypeAdvanced && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <span className="mr-1">⚠️</span>
                {validationErrors.taskTypeAdvanced}
              </p>
            )}
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
