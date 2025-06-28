import React, { useState, useEffect } from 'react'

export default function CreateTask({ onClose }) {
  // Simulate user context - in real app this would come from auth/context
  const [userType] = useState('org') // Change to 'solo' to test solo user behavior
  const [currentUser] = useState({ id: 'user1', name: 'John Doe' })

  const [showMoreOptions, setShowMoreOptions] = useState(false)
  const [formData, setFormData] = useState({
    taskName: '',
    assignedTo: userType === 'solo' ? currentUser.id : '',
    priority: 'medium',
    dueDate: '',
    visibility: userType === 'solo' ? 'private' : 'public'
  })

  // More options (only for org users)
  const [moreOptionsData, setMoreOptionsData] = useState({
    referenceProcess: '',
    formTemplate: '',
    dependency: ''
  })

  // Sample data - in real app this would come from API
  const orgUsers = [
    { id: 'user1', name: 'John Doe' },
    { id: 'user2', name: 'Jane Smith' },
    { id: 'user3', name: 'Mike Johnson' },
    { id: 'user4', name: 'Sarah Wilson' }
  ]

  const referenceProcesses = [
    { id: 'proc1', name: 'Employee Onboarding' },
    { id: 'proc2', name: 'Customer Support Workflow' },
    { id: 'proc3', name: 'Bug Report Process' },
    { id: 'proc4', name: 'Feature Request Process' }
  ]

  const formTemplates = [
    { id: 'form1', name: 'New Hire Details' },
    { id: 'form2', name: 'Bug Report Template' },
    { id: 'form3', name: 'Customer Feedback Form' },
    { id: 'form4', name: 'Project Requirements' }
  ]

  const existingTasks = [
    { id: 'task1', name: 'Setup Development Environment' },
    { id: 'task2', name: 'Design Database Schema' },
    { id: 'task3', name: 'Create API Endpoints' },
    { id: 'task4', name: 'Write Documentation' }
  ]

  // Calculate due date based on priority
  const calculateDueDate = (priority) => {
    const today = new Date()
    let daysToAdd = 30 // default

    if (userType === 'solo') {
      // Solo user: Low priority or unchanged = +30 days
      if (priority === 'low' || priority === 'medium') {
        daysToAdd = 30
      } else if (priority === 'high') {
        daysToAdd = 7
      }
    } else {
      // Org user: High priority = +7 days
      if (priority === 'high') {
        daysToAdd = 7
      } else {
        daysToAdd = 30
      }
    }

    const dueDate = new Date(today)
    dueDate.setDate(today.getDate() + daysToAdd)
    return dueDate.toISOString().split('T')[0]
  }

  // Auto-fill due date when priority changes
  useEffect(() => {
    const newDueDate = calculateDueDate(formData.priority)
    setFormData(prev => ({
      ...prev,
      dueDate: newDueDate
    }))
  }, [formData.priority, userType])

  const handleInputChange = (field, value) => {
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

  const handleSubmit = (e) => {
    e.preventDefault()

    const taskData = {
      ...formData,
      ...(userType === 'org' && showMoreOptions ? moreOptionsData : {}),
      userType,
      createdAt: new Date().toISOString(),
      createdBy: currentUser.name
    }

    console.log('Task Creation Data:', taskData)

    // Handle task creation logic here
    if (onClose) onClose()
  }

  return (
    <div className="space-y-6">
      {/* User Type Indicator */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Create New Task</h2>
            <p className="text-gray-600 mt-1">
              Creating as: <span className="font-semibold capitalize">{userType} User</span>
            </p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            userType === 'solo' 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {userType === 'solo' ? '👤 Solo Mode' : '🏢 Organization Mode'}
          </div>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card">
          <div className="card-header">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Task Details</h3>
            <p className="text-gray-600">Fill in the basic information for your task</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Task Name */}
            <div className="lg:col-span-2">
              <label className="form-label">
                Task Name *
              </label>
              <input
                type="text"
                value={formData.taskName}
                onChange={(e) => handleInputChange('taskName', e.target.value)}
                className="form-input"
                placeholder="Enter task name..."
                required
              />
            </div>

            {/* Assigned To */}
            <div>
              <label className="form-label">
                Assigned To *
              </label>
              {userType === 'solo' ? (
                <input
                  type="text"
                  value={currentUser.name}
                  className="form-input bg-gray-100 cursor-not-allowed"
                  disabled
                />
              ) : (
                <select
                  value={formData.assignedTo}
                  onChange={(e) => handleInputChange('assignedTo', e.target.value)}
                  className="form-select"
                  required
                >
                  <option value="">Select assignee...</option>
                  {orgUsers.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              )}
              {userType === 'solo' && (
                <p className="text-xs text-gray-500 mt-1">
                  Auto-assigned to you in solo mode
                </p>
              )}
            </div>

            {/* Priority */}
            <div>
              <label className="form-label">
                Priority *
              </label>
              <select
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                className="form-select"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {userType === 'solo' 
                  ? 'Low/Medium = 30 days, High = 7 days'
                  : 'High priority = 7 days, others = 30 days'
                }
              </p>
            </div>

            {/* Due Date */}
            <div>
              <label className="form-label">
                Due Date *
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                className="form-input"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Auto-calculated based on priority
              </p>
            </div>

            {/* Visibility */}
            <div>
              <label className="form-label">
                Visibility *
              </label>
              <select
                value={formData.visibility}
                onChange={(e) => handleInputChange('visibility', e.target.value)}
                className="form-select"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {userType === 'solo' 
                  ? 'Defaults to private for solo users'
                  : 'Choose who can see this task'
                }
              </p>
            </div>
          </div>
        </div>

        {/* More Options - Only for Org Users */}
        {userType === 'org' && (
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">More Options</h3>
                <p className="text-sm text-gray-600">Additional configuration for organization tasks</p>
              </div>
              <button
                type="button"
                onClick={() => setShowMoreOptions(!showMoreOptions)}
                className="btn btn-secondary flex items-center space-x-2"
              >
                <span>{showMoreOptions ? '🔼' : '🔽'}</span>
                <span>{showMoreOptions ? 'Hide' : 'Show'} Options</span>
              </button>
            </div>

            {showMoreOptions && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4 border-t border-gray-200">
                {/* Reference Process */}
                <div>
                  <label className="form-label">
                    Reference Process
                  </label>
                  <select
                    value={moreOptionsData.referenceProcess}
                    onChange={(e) => handleMoreOptionsChange('referenceProcess', e.target.value)}
                    className="form-select"
                  >
                    <option value="">Select process...</option>
                    {referenceProcesses.map(process => (
                      <option key={process.id} value={process.id}>
                        {process.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Link to an existing workflow
                  </p>
                </div>

                {/* Form Template */}
                <div>
                  <label className="form-label">
                    Form Template
                  </label>
                  <select
                    value={moreOptionsData.formTemplate}
                    onChange={(e) => handleMoreOptionsChange('formTemplate', e.target.value)}
                    className="form-select"
                  >
                    <option value="">Select template...</option>
                    {formTemplates.map(template => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Use a predefined form
                  </p>
                </div>

                {/* Dependency */}
                <div>
                  <label className="form-label">
                    Dependency
                  </label>
                  <select
                    value={moreOptionsData.dependency}
                    onChange={(e) => handleMoreOptionsChange('dependency', e.target.value)}
                    className="form-select"
                  >
                    <option value="">Select dependency...</option>
                    {existingTasks.map(task => (
                      <option key={task.id} value={task.id}>
                        {task.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Task that must complete first
                  </p>
                </div>
              </div>
            )}
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

      {/* Debug Info */}
      <div className="card bg-gray-50">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Debug Info</h4>
        <div className="text-xs text-gray-600 space-y-1">
          <p><strong>User Type:</strong> {userType}</p>
          <p><strong>Current Form Data:</strong></p>
          <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
            {JSON.stringify(formData, null, 2)}
          </pre>
          {userType === 'org' && showMoreOptions && (
            <>
              <p><strong>More Options Data:</strong></p>
              <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
                {JSON.stringify(moreOptionsData, null, 2)}
              </pre>
            </>
          )}
        </div>
      </div>
    </div>
  )
}