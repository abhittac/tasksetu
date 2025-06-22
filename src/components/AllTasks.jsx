
import React, { useState } from 'react'
import TaskDetail from './TaskDetail'
import CreateTask from './CreateTask'

export default function AllTasks() {
  const [selectedTaskId, setSelectedTaskId] = useState(null)
  const [showSnoozeModal, setShowSnoozeModal] = useState(false)
  const [taskToSnooze, setTaskToSnooze] = useState(null)
  const [showCreateDrawer, setShowCreateDrawer] = useState(false)
  const [currentUser] = useState({ id: 1, name: 'Current User', role: 'assignee' }) // Mock user
  
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Database Migration",
      status: "completed",
      priority: "high",
      assignee: "John Smith",
      assigneeId: 2,
      dueDate: "2024-01-15",
      category: "Backend",
      snoozedUntil: null,
      snoozeNote: null
    },
    {
      id: 2,
      title: "Mobile App Redesign",
      status: "in-progress",
      priority: "medium",
      assignee: "Sarah Wilson",
      assigneeId: 3,
      dueDate: "2024-01-20",
      category: "Design",
      snoozedUntil: null,
      snoozeNote: null
    },
    {
      id: 3,
      title: "API Documentation",
      status: "pending",
      priority: "low",
      assignee: "Mike Johnson",
      assigneeId: 1,
      dueDate: "2024-01-25",
      category: "Documentation",
      snoozedUntil: "2024-01-23T09:00",
      snoozeNote: "Waiting for API changes to be finalized"
    },
    {
      id: 4,
      title: "Security Audit",
      status: "in-progress",
      priority: "high",
      assignee: "Emily Davis",
      assigneeId: 4,
      dueDate: "2024-01-18",
      category: "Security",
      snoozedUntil: null,
      snoozeNote: null
    }
  ])

  const [showSnoozed, setShowSnoozed] = useState(false)

  // Filter tasks based on snooze status
  const filteredTasks = tasks.filter(task => {
    const now = new Date()
    const snoozedUntil = task.snoozedUntil ? new Date(task.snoozedUntil) : null
    const isSnoozed = snoozedUntil && snoozedUntil > now
    
    return showSnoozed ? isSnoozed : !isSnoozed
  })

  const handleSnoozeTask = (task) => {
    setTaskToSnooze(task)
    setShowSnoozeModal(true)
  }

  const canSnoozeTask = (task) => {
    return task.assigneeId === currentUser.id || currentUser.role === 'admin'
  }

  const handleSnoozeSubmit = (snoozeData) => {
    if (!taskToSnooze) return

    setTasks(tasks.map(task => 
      task.id === taskToSnooze.id 
        ? { 
            ...task, 
            snoozedUntil: snoozeData.snoozeUntil,
            snoozeNote: snoozeData.note 
          }
        : task
    ))

    setShowSnoozeModal(false)
    setTaskToSnooze(null)
  }

  const handleUnsnoozeTask = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, snoozedUntil: null, snoozeNote: null }
        : task
    ))
  }

  return (
    <div className="all-tasks">
      <div className="page-header">
        <h1>All Tasks</h1>
        <p>Manage and track all project tasks</p>
      </div>

      <div className="tasks-filters">
        <div className="filter-group">
          <button 
            className={`filter-toggle ${showSnoozed ? 'active' : ''}`}
            onClick={() => setShowSnoozed(!showSnoozed)}
          >
            {showSnoozed ? 'Show Active Tasks' : 'Show Snoozed Tasks'}
          </button>
          <select className="filter-select">
            <option>All Status</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
          <select className="filter-select">
            <option>All Priority</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
          <select className="filter-select">
            <option>All Categories</option>
            <option>Backend</option>
            <option>Design</option>
            <option>Documentation</option>
            <option>Security</option>
          </select>
        </div>
        <button className="btn-primary" onClick={() => setShowCreateDrawer(true)}>+ Add Task</button>
      </div>

      <div className="tasks-table">
        <div className="table-header">
          <div className="th">Task</div>
          <div className="th">Status</div>
          <div className="th">Priority</div>
          <div className="th">Assignee</div>
          <div className="th">Due Date</div>
          <div className="th">Category</div>
          <div className="th">Actions</div>
        </div>
        
        {filteredTasks.map(task => {
          const now = new Date()
          const snoozedUntil = task.snoozedUntil ? new Date(task.snoozedUntil) : null
          const isSnoozed = snoozedUntil && snoozedUntil > now
          
          return (
          <div key={task.id} className="table-row">
            <div className="td task-title">
              {task.title}
              {task.isRecurringInstance && (
                <span className="recurring-indicator" title="This is a recurring task instance">
                  🔁
                </span>
              )}
              {isSnoozed && (
                <span className="snooze-indicator" title={`Snoozed until ${snoozedUntil.toLocaleString()}`}>
                  😴
                </span>
              )}
            </div>
            <div className="td">
              <span className={`status-badge ${task.status}`}>
                {task.status.replace('-', ' ')}
              </span>
            </div>
            <div className="td">
              <span className={`priority-badge ${task.priority}`}>
                {task.priority}
              </span>
            </div>
            <div className="td">{task.assignee}</div>
            <div className="td">{task.dueDate}</div>
            <div className="td">{task.category}</div>
            <div className="td">
              <div className="action-buttons">
                <button 
                  className="btn-action"
                  onClick={() => setSelectedTaskId(task.id)}
                >
                  Edit
                </button>
                {isSnoozed ? (
                  <button 
                    className="btn-action"
                    onClick={() => handleUnsnoozeTask(task.id)}
                    disabled={!canSnoozeTask(task)}
                  >
                    Unsnooze
                  </button>
                ) : (
                  <button 
                    className="btn-action"
                    onClick={() => handleSnoozeTask(task)}
                    disabled={!canSnoozeTask(task)}
                  >
                    Snooze
                  </button>
                )}
                <button className="btn-action">Delete</button>
              </div>
            </div>
          </div>
        )
        })}
      </div>
      
      {selectedTaskId && (
        <TaskDetail 
          taskId={selectedTaskId} 
          onClose={() => setSelectedTaskId(null)} 
        />
      )}

      {showSnoozeModal && (
        <SnoozeModal
          task={taskToSnooze}
          onSubmit={handleSnoozeSubmit}
          onClose={() => {
            setShowSnoozeModal(false)
            setTaskToSnooze(null)
          }}
        />
      )}

      {/* Create Task Drawer */}
      <div className={`task-drawer ${showCreateDrawer ? 'open' : ''}`}>
        <div className="drawer-overlay" onClick={() => setShowCreateDrawer(false)}></div>
        <div className="drawer-content">
          <CreateTaskDrawer onClose={() => setShowCreateDrawer(false)} />
        </div>
      </div>
    </div>
  )
}

function CreateTaskDrawer({ onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    assignee: '',
    dueDate: '',
    category: '',
    tags: '',
    isRecurring: false,
    recurrence: {
      frequency: 'daily',
      repeatEvery: 1,
      repeatOnDays: [],
      startDate: '',
      endConditionType: 'never',
      endValue: '',
      time: '09:00'
    }
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (name === 'isRecurring') {
      setFormData({
        ...formData,
        [name]: checked
      })
    } else if (name.startsWith('recurrence.')) {
      const field = name.split('.')[1]
      setFormData({
        ...formData,
        recurrence: {
          ...formData.recurrence,
          [field]: value
        }
      })
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      })
    }
  }

  const handleDayToggle = (day) => {
    const days = formData.recurrence.repeatOnDays
    const updatedDays = days.includes(day) 
      ? days.filter(d => d !== day)
      : [...days, day]
    
    setFormData({
      ...formData,
      recurrence: {
        ...formData.recurrence,
        repeatOnDays: updatedDays
      }
    })
  }

  const getRecurrencePreview = (recurrence) => {
    if (!recurrence.frequency) return ''
    
    let preview = `Repeats every ${recurrence.repeatEvery} ${recurrence.frequency}`
    
    if (recurrence.frequency === 'weekly' && recurrence.repeatOnDays.length > 0) {
      preview += ` on ${recurrence.repeatOnDays.join(', ')}`
    }
    
    if (recurrence.time) {
      preview += ` at ${recurrence.time}`
    }
    
    if (recurrence.endConditionType === 'after' && recurrence.endValue) {
      preview += `. Ends after ${recurrence.endValue} occurrences.`
    } else if (recurrence.endConditionType === 'on' && recurrence.endValue) {
      preview += `. Ends on ${recurrence.endValue}.`
    } else {
      preview += '. Never ends.'
    }
    
    return preview
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const taskData = {
      ...formData,
      id: Date.now(), // Simple ID generation
      createdAt: new Date().toISOString(),
      isRecurringInstance: false,
      recurringMasterId: formData.isRecurring ? `recurring_${Date.now()}` : null
    }
    
    console.log('Task created:', taskData)
    
    if (formData.isRecurring) {
      console.log('Recurring pattern will be stored:', {
        id: taskData.recurringMasterId,
        creatorUserId: 1, // Current user ID
        baseTaskId: taskData.id,
        frequency: formData.recurrence.frequency,
        repeatEvery: formData.recurrence.repeatEvery,
        repeatOnDays: formData.recurrence.repeatOnDays.join(','),
        startDate: formData.recurrence.startDate,
        endConditionType: formData.recurrence.endConditionType,
        endValue: formData.recurrence.endValue,
        time: formData.recurrence.time,
        active: true
      })
    }
    
    // Add task creation logic here
    onClose() // Close drawer after submit
  }

  return (
    <div className="create-task-drawer">
      <div className="drawer-header">
        <h2>Create New Task</h2>
        <button className="close-button" onClick={onClose}>×</button>
      </div>

      <form className="drawer-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="title">Task Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select category</option>
              <option value="Backend">Backend</option>
              <option value="Frontend">Frontend</option>
              <option value="Design">Design</option>
              <option value="Documentation">Documentation</option>
              <option value="Security">Security</option>
              <option value="Testing">Testing</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="assignee">Assignee</label>
            <input
              type="text"
              id="assignee"
              name="assignee"
              value={formData.assignee}
              onChange={handleChange}
              placeholder="Assign to team member"
            />
          </div>

          <div className="form-group">
            <label htmlFor="dueDate">Due Date</label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group full-width">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the task details..."
            rows="4"
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="tags">Tags (comma separated)</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g., urgent, frontend, api"
          />
        </div>

        {/* Recurring Task Section */}
        <div className="form-group full-width">
          <div className="recurring-section">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isRecurring"
                checked={formData.isRecurring}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              Repeat this task
            </label>
            <p className="recurring-description">
              Automatically create new instances of this task based on your schedule
            </p>
          </div>
        </div>

        {formData.isRecurring && (
          <div className="recurring-options">
            <h4 className="recurring-title">Recurrence Settings</h4>
            
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="frequency">Frequency</label>
                <select
                  id="frequency"
                  name="recurrence.frequency"
                  value={formData.recurrence.frequency}
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
                <div className="repeat-every-group">
                  <input
                    type="number"
                    id="repeatEvery"
                    name="recurrence.repeatEvery"
                    value={formData.recurrence.repeatEvery}
                    onChange={handleChange}
                    min="1"
                    max="365"
                  />
                  <span className="repeat-unit">
                    {formData.recurrence.frequency === 'daily' ? 'day(s)' :
                     formData.recurrence.frequency === 'weekly' ? 'week(s)' :
                     formData.recurrence.frequency === 'monthly' ? 'month(s)' : 'period(s)'}
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="startDate">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  name="recurrence.startDate"
                  value={formData.recurrence.startDate}
                  onChange={handleChange}
                  required={formData.isRecurring}
                />
                <small className="form-hint">First task will be created on this date</small>
              </div>

              <div className="form-group">
                <label htmlFor="time">Time of Creation</label>
                <input
                  type="time"
                  id="time"
                  name="recurrence.time"
                  value={formData.recurrence.time}
                  onChange={handleChange}
                />
                <small className="form-hint">Time when new tasks will be created</small>
              </div>
            </div>

            {formData.recurrence.frequency === 'weekly' && (
              <div className="form-group full-width">
                <label>Repeat On Days</label>
                <div className="days-selector">
                  {[
                    { key: 'Mon', label: 'Mon' },
                    { key: 'Tue', label: 'Tue' },
                    { key: 'Wed', label: 'Wed' },
                    { key: 'Thu', label: 'Thu' },
                    { key: 'Fri', label: 'Fri' },
                    { key: 'Sat', label: 'Sat' },
                    { key: 'Sun', label: 'Sun' }
                  ].map(day => (
                    <button
                      key={day.key}
                      type="button"
                      className={`day-button ${formData.recurrence.repeatOnDays.includes(day.key) ? 'selected' : ''}`}
                      onClick={() => handleDayToggle(day.key)}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
                <small className="form-hint">Select which days of the week to repeat</small>
              </div>
            )}

            <div className="form-grid">
              <div className="form-group full-width">
                <label>End Condition</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="recurrence.endConditionType"
                      value="never"
                      checked={formData.recurrence.endConditionType === 'never'}
                      onChange={handleChange}
                    />
                    <span className="radio-custom"></span>
                    Never Ends
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="recurrence.endConditionType"
                      value="after"
                      checked={formData.recurrence.endConditionType === 'after'}
                      onChange={handleChange}
                    />
                    <span className="radio-custom"></span>
                    Ends after number of occurrences
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="recurrence.endConditionType"
                      value="on"
                      checked={formData.recurrence.endConditionType === 'on'}
                      onChange={handleChange}
                    />
                    <span className="radio-custom"></span>
                    Ends by specific date
                  </label>
                </div>
              </div>

              {formData.recurrence.endConditionType === 'after' && (
                <div className="form-group">
                  <label htmlFor="endValue">Number of Occurrences</label>
                  <input
                    type="number"
                    id="endValue"
                    name="recurrence.endValue"
                    value={formData.recurrence.endValue}
                    onChange={handleChange}
                    min="1"
                    placeholder="e.g., 10"
                  />
                  <small className="form-hint">Total number of tasks to create</small>
                </div>
              )}

              {formData.recurrence.endConditionType === 'on' && (
                <div className="form-group">
                  <label htmlFor="endValue">End Date</label>
                  <input
                    type="date"
                    id="endValue"
                    name="recurrence.endValue"
                    value={formData.recurrence.endValue}
                    onChange={handleChange}
                  />
                  <small className="form-hint">Stop creating tasks after this date</small>
                </div>
              )}
            </div>

            <div className="recurring-preview">
              <h5>Preview</h5>
              <p className="preview-text">
                {getRecurrencePreview(formData.recurrence)}
              </p>
            </div>
          </div>
        )}

        <div className="drawer-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary">
            {formData.isRecurring ? 'Create Recurring Task' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  )
}

function SnoozeModal({ task, onSubmit, onClose }) {
  const [snoozeData, setSnoozeData] = useState({
    snoozeUntil: '',
    note: ''
  })

  // Set default snooze time to next day 9 AM
  React.useEffect(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(9, 0, 0, 0)
    
    setSnoozeData({
      snoozeUntil: tomorrow.toISOString().slice(0, 16), // Format for datetime-local input
      note: ''
    })
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(snoozeData)
  }

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>Snooze Task: {task?.title}</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-content">
          <div className="form-group">
            <label>Snooze until:</label>
            <input
              type="datetime-local"
              value={snoozeData.snoozeUntil}
              onChange={(e) => setSnoozeData({...snoozeData, snoozeUntil: e.target.value})}
              required
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label>Optional note:</label>
            <textarea
              value={snoozeData.note}
              onChange={(e) => setSnoozeData({...snoozeData, note: e.target.value})}
              placeholder="Reason for snoozing (optional)"
              className="form-input"
              rows="3"
            />
          </div>
          
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Snooze Task
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
