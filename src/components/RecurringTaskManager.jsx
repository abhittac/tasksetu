
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
      active: 'status-badge active',
      paused: 'status-badge paused',
      completed: 'status-badge completed'
    }
    return statusClasses[status] || 'status-badge'
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
    <div className="recurring-task-manager">
      <div className="page-header">
        <h1>Recurring Tasks</h1>
        <p>Manage and monitor recurring task patterns across your organization</p>
      </div>

      <div className="recurring-filters">
        <div className="filter-group">
          <select 
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
          </select>
          <select 
            className="filter-select"
            value={filterFrequency}
            onChange={(e) => setFilterFrequency(e.target.value)}
          >
            <option value="all">All Frequencies</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="custom">Custom</option>
          </select>
        </div>
        <button className="btn-primary">+ Create Recurring Task</button>
      </div>

      <div className="recurring-tasks-grid">
        {filteredTasks.map(task => (
          <div key={task.id} className="recurring-task-card">
            <div className="task-card-header">
              <div className="task-title-section">
                <h3>{task.title}</h3>
                <span className="task-id">#{task.baseTaskId}</span>
              </div>
              <span className={getStatusBadge(task.status)}>
                {task.status}
              </span>
            </div>
            
            <div className="task-card-body">
              <div className="task-description">
                <p>{task.description}</p>
              </div>
              
              <div className="task-detail">
                <span className="detail-label">Pattern:</span>
                <span className="detail-value">{getFrequencyDisplay(task)}</span>
              </div>
              
              <div className="task-detail">
                <span className="detail-label">Creator:</span>
                <span className="detail-value">{task.creator}</span>
              </div>
              
              <div className="task-detail">
                <span className="detail-label">Started:</span>
                <span className="detail-value">{task.startDate}</span>
              </div>
              
              <div className="task-detail">
                <span className="detail-label">Next Instance:</span>
                <span className="detail-value next-instance">
                  {task.status === 'active' ? task.nextInstance : 'N/A'}
                </span>
              </div>
              
              <div className="task-detail">
                <span className="detail-label">Progress:</span>
                <span className="detail-value">
                  {task.completedInstances}/{task.endConditionType === 'after' ? task.endValue : '∞'} completed
                </span>
              </div>
              
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{
                    width: task.endConditionType === 'after' 
                      ? `${Math.min((task.completedInstances / parseInt(task.endValue)) * 100, 100)}%`
                      : `${Math.min((task.completedInstances / 50) * 100, 100)}%` // Show progress up to 50 for "never" ending
                  }}
                ></div>
              </div>

              {task.endConditionType !== 'never' && (
                <div className="end-condition">
                  <small className="detail-label">
                    {task.endConditionType === 'after' 
                      ? `Ends after ${task.endValue} occurrences` 
                      : `Ends on ${task.endValue}`}
                  </small>
                </div>
              )}
            </div>
            
            <div className="task-card-actions">
              {canManageRecurrence(task) && (
                <>
                  <button 
                    className="btn-action"
                    onClick={() => handleEditRecurrence(task)}
                    disabled={task.status === 'completed'}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn-action"
                    onClick={() => handleToggleStatus(task.id)}
                    disabled={task.status === 'completed'}
                  >
                    {task.status === 'active' ? 'Pause' : 'Resume'}
                  </button>
                  <button 
                    className="btn-action delete"
                    onClick={() => handleStopRecurrence(task.id)}
                    disabled={task.status === 'completed'}
                  >
                    Stop
                  </button>
                </>
              )}
              {!canManageRecurrence(task) && (
                <span className="no-permissions">View Only</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="empty-state">
          <h3>No recurring tasks found</h3>
          <p>Create your first recurring task to automate repetitive workflows.</p>
          <button className="btn-primary">+ Create Recurring Task</button>
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
