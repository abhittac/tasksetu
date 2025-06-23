import React, { useState } from 'react'

export default function RecurringTaskManager() {
  const [currentUser] = useState({ id: 1, name: 'Current User', role: 'admin' })
  const [recurringTasks, setRecurringTasks] = useState([
    {
      id: 1,
      title: "Weekly Team Standup",
      frequency: "weekly",
      repeatEvery: 1,
      repeatOnDays: ["Mon"],
      startDate: "2024-01-01",
      endConditionType: "never",
      endValue: null,
      time: "10:00",
      creator: "Admin User",
      creatorId: 1,
      status: "active",
      nextInstance: "2024-01-29",
      totalInstances: 12,
      completedInstances: 8,
      baseTaskId: 101,
      description: "Weekly team sync meeting task"
    },
    {
      id: 2,
      title: "Monthly Security Review",
      frequency: "monthly",
      repeatEvery: 1,
      repeatOnDays: [],
      startDate: "2024-01-01",
      endConditionType: "after",
      endValue: "12",
      time: "09:00",
      creator: "Security Team",
      creatorId: 2,
      status: "active",
      nextInstance: "2024-02-01",
      totalInstances: 12,
      completedInstances: 1,
      baseTaskId: 102,
      description: "Monthly security audit and review"
    },
    {
      id: 3,
      title: "Daily Code Backup",
      frequency: "daily",
      repeatEvery: 1,
      repeatOnDays: [],
      startDate: "2024-01-01",
      endConditionType: "never",
      endValue: null,
      time: "23:00",
      creator: "DevOps Team",
      creatorId: 3,
      status: "paused",
      nextInstance: "N/A",
      totalInstances: 21,
      completedInstances: 21,
      baseTaskId: 103,
      description: "Automated daily backup of code repositories"
    }
  ])

  const [filterStatus, setFilterStatus] = useState('all')
  const [filterFrequency, setFilterFrequency] = useState('all')
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  const getStatusBadge = (status) => {
    const statusClasses = {
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-red-100 text-red-800'
    }
    return `status-badge ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`
  }

  const getFrequencyDisplay = (task) => {
    let display = `Every ${task.repeatEvery} ${task.frequency}`
    if (task.frequency === 'weekly' && task.repeatOnDays.length > 0) {
      display += ` on ${task.repeatOnDays.join(', ')}`
    }
    if (task.time) {
      display += ` at ${task.time}`
    }
    return display
  }

  const canManageRecurrence = (task) => {
    return task.creatorId === currentUser.id || currentUser.role === 'admin'
  }

  const handleToggleStatus = (taskId) => {
    setRecurringTasks(tasks =>
      tasks.map(task =>
        task.id === taskId
          ? { ...task, status: task.status === 'active' ? 'paused' : 'active' }
          : task
      )
    )
  }

  const handleStopRecurrence = (taskId) => {
    if (window.confirm('Are you sure you want to stop this recurrence? This will prevent future tasks from being created.')) {
      setRecurringTasks(tasks =>
        tasks.map(task =>
          task.id === taskId
            ? { ...task, status: 'completed' }
            : task
        )
      )
    }
  }

  const handleEditRecurrence = (task) => {
    setEditingTask(task)
    setShowEditModal(true)
  }

  const filteredTasks = recurringTasks.filter(task => {
    if (filterStatus !== 'all' && task.status !== filterStatus) return false
    if (filterFrequency !== 'all' && task.frequency !== filterFrequency) return false
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Recurring Tasks</h1>
          <p className="mt-2 text-lg text-gray-600">Manage automated recurring tasks and schedules</p>
        </div>
        <button className="mt-4 lg:mt-0 btn btn-primary">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Recurring Task
        </button>
      </div>

      {/* Stats Cards */}
      {/*
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-blue-600 text-lg">🔄</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">12</p>
              <p className="text-sm text-gray-600">Total Recurring</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-green-600 text-lg">✅</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">8</p>
              <p className="text-sm text-gray-600">Active</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-yellow-600 text-lg">⏸️</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">3</p>
              <p className="text-sm text-gray-600">Paused</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-purple-600 text-lg">📊</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">247</p>
              <p className="text-sm text-gray-600">Generated Tasks</p>
            </div>
          </div>
        </div>
      </div>
      */}

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="form-select"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={filterFrequency}
            onChange={(e) => setFilterFrequency(e.target.value)}
            className="form-select"
          >
            <option value="all">All Frequencies</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="custom">Custom</option>
          </select>
        </div>
      </div>

      {/* Recurring Tasks List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <div key={task.id} className="card hover:shadow-md transition-shadow">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{task.title}</h3>
                    <span className={getStatusBadge(task.status)}>{task.status}</span>
                  </div>
                  <span className="text-sm text-gray-500">#{task.baseTaskId}</span>
                </div>

                <p className="text-gray-600 mb-4">{task.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Pattern:</span>
                    <p className="text-gray-600">{getFrequencyDisplay(task)}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Creator:</span>
                    <p className="text-gray-600">{task.creator}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Started:</span>
                    <p className="text-gray-600">{task.startDate}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Next Instance:</span>
                    <p className="text-gray-600">{task.nextInstance}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <span className="font-medium text-gray-700">Progress:</span>
                  <span className="ml-2 text-gray-600">{task.completedInstances}/{task.endConditionType === 'after' ? task.endValue : '∞'} completed</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-2 mt-4 lg:mt-0 lg:ml-6">
                {canManageRecurrence(task) && (
                  <>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleEditRecurrence(task)}
                      disabled={task.status === 'completed'}
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Edit
                    </button>

                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleToggleStatus(task.id)}
                      disabled={task.status === 'completed'}
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {task.status === 'active' ? 'Pause' : 'Resume'}
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleStopRecurrence(task.id)}
                      disabled={task.status === 'completed'}
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                      </svg>
                      Stop
                    </button>
                  </>
                )}
                {!canManageRecurrence(task) && (
                  <span className="no-permissions">View Only</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="empty-state">
          <h3>No recurring tasks found</h3>
          <p>Create your first recurring task to automate repetitive workflows.</p>
          <button className="btn btn-primary">+ Create Recurring Task</button>
        </div>
      )}

      {showEditModal && editingTask && (
        <EditRecurrenceModal
          task={editingTask}
          onClose={() => {
            setShowEditModal(false)
            setEditingTask(null)
          }}
          onSave={(updatedTask) => {
            setRecurringTasks(tasks =>
              tasks.map(task =>
                task.id === updatedTask.id ? updatedTask : task
              )
            )
            setShowEditModal(false)
            setEditingTask(null)
          }}
        />
      )}

      {/* Calendar View Section */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Calendar & Upcoming Instances</h2>
          <div className="flex gap-2">
            <button className="btn btn-secondary btn-sm">Previous</button>
            <button className="btn btn-secondary btn-sm">Next</button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Calendar View</h3>
          <p className="text-gray-600">View upcoming recurring task instances in calendar format</p>
          <button className="btn btn-primary mt-4">Open Calendar</button>
        </div>
      </div>
    </div>
  )
}

function EditRecurrenceModal({ task, onClose, onSave }) {
  const [formData, setFormData] = useState({
    frequency: task.frequency,
    repeatEvery: task.repeatEvery,
    repeatOnDays: task.repeatOnDays,
    time: task.time,
    endConditionType: task.endConditionType,
    endValue: task.endValue
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleDayToggle = (day) => {
    const days = formData.repeatOnDays
    const updatedDays = days.includes(day)
      ? days.filter(d => d !== day)
      : [...days, day]

    setFormData({
      ...formData,
      repeatOnDays: updatedDays
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...task,
      ...formData
    })
  }

  return (
    <div className="modal-overlay">
      <div className="modal-container edit-recurrence-modal">
        <div className="modal-header">
          <h3>Edit Recurrence: {task.title}</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-content">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="frequency">Frequency</label>
              <select
                id="frequency"
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="repeatEvery">Repeat Every</label>
              <input
                type="number"
                id="repeatEvery"
                name="repeatEvery"
                value={formData.repeatEvery}
                onChange={handleChange}
                min="1"
                max="365"
              />
            </div>

            <div className="form-group">
              <label htmlFor="time">Time</label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
              />
            </div>
          </div>

          {formData.frequency === 'weekly' && (
            <div className="form-group full-width">
              <label>Repeat On Days</label>
              <div className="days-selector">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                  <button
                    key={day}
                    type="button"
                    className={`day-button ${formData.repeatOnDays.includes(day) ? 'selected' : ''}`}
                    onClick={() => handleDayToggle(day)}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="form-group">
            <label>End Condition</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="endConditionType"
                  value="never"
                  checked={formData.endConditionType === 'never'}
                  onChange={handleChange}
                />
                Never
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="endConditionType"
                  value="after"
                  checked={formData.endConditionType === 'after'}
                  onChange={handleChange}
                />
                After occurrences
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="endConditionType"
                  value="on"
                  checked={formData.endConditionType === 'on'}
                  onChange={handleChange}
                />
                On date
              </label>
            </div>
          </div>

          {formData.endConditionType !== 'never' && (
            <div className="form-group">
              <label htmlFor="endValue">
                {formData.endConditionType === 'after' ? 'Number of Occurrences' : 'End Date'}
              </label>
              <input
                type={formData.endConditionType === 'after' ? 'number' : 'date'}
                id="endValue"
                name="endValue"
                value={formData.endValue}
                onChange={handleChange}
                min={formData.endConditionType === 'after' ? '1' : undefined}
              />
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Update Recurrence
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}