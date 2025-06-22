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
  const [selectedTasks, setSelectedTasks] = useState([])
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [bulkStatusModal, setBulkStatusModal] = useState(false)

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

  const handleTaskSelection = (taskId, isSelected) => {
    if (isSelected) {
      setSelectedTasks([...selectedTasks, taskId])
    } else {
      setSelectedTasks(selectedTasks.filter(id => id !== taskId))
    }
  }

  const handleSelectAll = () => {
    if (selectedTasks.length === filteredTasks.length) {
      setSelectedTasks([])
    } else {
      setSelectedTasks(filteredTasks.map(task => task.id))
    }
  }

  const canEditTaskStatus = (task) => {
    return (
      task.assigneeId === currentUser.id ||
      task.collaborators?.includes(currentUser.id) ||
      currentUser.role === 'admin'
    )
  }

  const getValidStatusTransitions = (currentStatus, taskData = null) => {
    const statusTransitions = {
      'pending': ['in-progress', 'on-hold', 'cancelled'],
      'in-progress': ['on-hold', 'completed', 'cancelled'],
      'on-hold': ['in-progress', 'cancelled'],
      'completed': [],
      'cancelled': []
    }

    let validTransitions = statusTransitions[currentStatus] || []

    // Apply sub-task completion logic
    if (taskData && taskData.subtasks && taskData.subtasks.length > 0) {
      const hasIncompleteSubtasks = taskData.subtasks.some(subtask => 
        subtask.status !== 'completed' && subtask.status !== 'cancelled'
      )

      if (hasIncompleteSubtasks) {
        validTransitions = validTransitions.filter(transition => transition !== 'completed')
      }
    }

    return validTransitions
  }

  const validateBulkStatusChange = (taskIds, newStatus) => {
    const errors = []
    const tasksToUpdate = tasks.filter(task => taskIds.includes(task.id))

    tasksToUpdate.forEach(task => {
      // Check edit permissions
      if (!canEditTaskStatus(task)) {
        errors.push(`No permission to edit task: ${task.title}`)
        return
      }

      // Check valid transitions
      const validTransitions = getValidStatusTransitions(task.status, task)
      if (!validTransitions.includes(newStatus)) {
        errors.push(`Invalid status change for "${task.title}": ${task.status} → ${newStatus}`)
        return
      }

      // Check sub-task completion logic
      if (newStatus === 'completed' && task.subtasks?.length > 0) {
        const incompleteSubtasks = task.subtasks.filter(st => 
          st.status !== 'completed' && st.status !== 'cancelled'
        )
        if (incompleteSubtasks.length > 0) {
          errors.push(`"${task.title}" has ${incompleteSubtasks.length} incomplete sub-tasks`)
        }
      }
    })

    return errors
  }

  const handleBulkStatusUpdate = (newStatus) => {
    const errors = validateBulkStatusChange(selectedTasks, newStatus)

    if (errors.length > 0) {
      alert('Cannot update status:\n' + errors.join('\n'))
      return
    }

    // Update tasks that passed validation
    const updatedTasks = tasks.map(task => {
      if (selectedTasks.includes(task.id)) {
        return {
          ...task,
          status: newStatus,
          updatedAt: new Date().toISOString(),
          updatedBy: currentUser.name
        }
      }
      return task
    })

    setTasks(updatedTasks)
    setSelectedTasks([])
    setBulkStatusModal(false)

    // Log activity for audit trail
    console.log('Bulk status update:', {
      taskIds: selectedTasks,
      newStatus,
      updatedBy: currentUser.name,
      timestamp: new Date().toISOString()
    })
  }

  const canDeleteTask = (task) => {
    return (
      task.createdBy === currentUser.name ||
      task.assigneeId === currentUser.id ||
      currentUser.role === 'admin' ||
      currentUser.role === 'company_admin'
    )
  }

  const [taskToDelete, setTaskToDelete] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleDeleteTask = (task) => {
    if (!canDeleteTask(task)) {
      alert("You don't have permission to delete this task.")
      return
    }
    setTaskToDelete(task)
    setShowDeleteModal(true)
  }

  const confirmDeleteTask = (deleteOptions) => {
    if (!taskToDelete) return

    // Soft delete implementation
    const deletedTask = {
      ...taskToDelete,
      isDeleted: true,
      deletedBy: currentUser.name,
      deletedAt: new Date().toISOString()
    }

    // Remove from tasks list (simulating soft delete filter)
    setTasks(tasks.filter(task => task.id !== taskToDelete.id))

    // Log deletion activity
    console.log('Task deleted:', {
      taskId: taskToDelete.id,
      taskTitle: taskToDelete.title,
      deletedBy: currentUser.name,
      deleteOptions,
      timestamp: new Date().toISOString()
    })

    setShowDeleteModal(false)
    setTaskToDelete(null)

    // Show success message
    alert('Task deleted successfully')
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
          {selectedTasks.length > 0 && (
            <div className="bulk-actions">
              <span className="bulk-count">{selectedTasks.length} selected</span>
              <button 
                className="btn-secondary"
                onClick={() => setBulkStatusModal(true)}
              >
                Update Status
              </button>
              <button 
                className="btn-secondary"
                onClick={() => setSelectedTasks([])}
              >
                Clear Selection
              </button>
            </div>
          )}
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
          <div className="th">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={selectedTasks.length === filteredTasks.length && filteredTasks.length > 0}
                onChange={handleSelectAll}
              />
              <span className="checkmark"></span>
            </label>
            Task
          </div>
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
          <TaskRow 
            key={task.id} 
            task={task} 
            isSnoozed={isSnoozed}
            snoozedUntil={snoozedUntil}
            isSelected={selectedTasks.includes(task.id)}
            onTaskClick={() => setSelectedTaskId(task.id)}
            onTaskSelect={(isSelected) => handleTaskSelection(task.id, isSelected)}
            onSnooze={handleSnoozeTask}
            onUnsnooze={handleUnsnoozeTask}
            onTaskUpdate={(updatedTask) => {
              setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t))
            }}
            onDeleteTask={handleDeleteTask}
            canSnoozeTask={canSnoozeTask}
            canEditStatus={canEditTaskStatus}
            canDeleteTask={canDeleteTask}
            getValidTransitions={getValidStatusTransitions}
            currentUser={currentUser}
          />
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

      {/* Bulk Status Update Modal */}
      {bulkStatusModal && (
        <BulkStatusModal
          selectedTasks={tasks.filter(task => selectedTasks.includes(task.id))}
          onSubmit={handleBulkStatusUpdate}
          onClose={() => setBulkStatusModal(false)}
          currentUser={currentUser}
        />
      )}

      {/* Task Delete Modal */}
      {showDeleteModal && (
        <TaskDeleteModal
          task={taskToDelete}
          onConfirm={confirmDeleteTask}
          onClose={() => {
            setShowDeleteModal(false)
            setTaskToDelete(null)
          }}
          currentUser={currentUser}
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
    priority: 'low',
    status: 'pending',
    assignee: 'self',
    dueDate: '',
    visibility: 'private',
    tags: [],
    attachments: [],
    isRecurring: false,
    recurrence: {
      type: 'dates', // 'dates', 'monthly', 'weekly'
      selectedDates: [],
      monthlyDay: '',
      weeklyDays: []
    }
  })

  const [showMoreOptions, setShowMoreOptions] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [currentUser] = useState({ id: 1, name: 'Current User', role: 'assignee' })
  const [isOrgUser] = useState(false) // Toggle this based on your app's context

  // Priority to due date mapping
  const priorityDueDays = {
    low: 30,
    medium: 14,
    high: 7,
    critical: 2
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    if (name === 'isRecurring') {
      setFormData({
        ...formData,
        [name]: checked,
        dueDate: checked ? '' : calculateDueDate(formData.priority)
      })
    } else if (name === 'priority') {
      setFormData({
        ...formData,
        [name]: value,
        dueDate: formData.isRecurring ? '' : calculateDueDate(value)
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

  const calculateDueDate = (priority) => {
    const today = new Date()
    const daysToAdd = priorityDueDays[priority] || 30
    const dueDate = new Date(today.getTime() + (daysToAdd * 24 * 60 * 60 * 1000))
    return dueDate.toISOString().split('T')[0]
  }

  // Initialize due date based on default priority
  React.useEffect(() => {
    if (!formData.isRecurring && !formData.dueDate) {
      setFormData(prev => ({
        ...prev,
        dueDate: calculateDueDate(prev.priority)
      }))
    }
  }, [])

  const handleTagAdd = (tag) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tag]
      })
    }
  }

  const handleTagRemove = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    })
  }

  const handleFileUpload = (files) => {
    const newFiles = Array.from(files).filter(file => {
      const totalSize = formData.attachments.reduce((sum, att) => sum + att.size, 0) + file.size
      return totalSize <= 5 * 1024 * 1024 // 5MB limit
    })

    const attachments = newFiles.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file
    }))

    setFormData({
      ...formData,
      attachments: [...formData.attachments, ...attachments]
    })
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const files = e.dataTransfer.files
    handleFileUpload(files)
  }

  const handleRecurrenceTypeChange = (type) => {
    setFormData({
      ...formData,
      recurrence: {
        ...formData.recurrence,
        type: type,
        selectedDates: [],
        monthlyDay: '',
        weeklyDays: []
      }
    })
  }

  const handleDateSelection = (date) => {
    const dates = formData.recurrence.selectedDates
    const updatedDates = dates.includes(date)
      ? dates.filter(d => d !== date)
      : [...dates, date]

    setFormData({
      ...formData,
      recurrence: {
        ...formData.recurrence,
        selectedDates: updatedDates
      }
    })
  }

  const handleWeeklyDayToggle = (day) => {
    const days = formData.recurrence.weeklyDays
    const updatedDays = days.includes(day)
      ? days.filter(d => d !== day)
      : [...days, day]

    setFormData({
      ...formData,
      recurrence: {
        ...formData.recurrence,
        weeklyDays: updatedDays
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
        {/* Basic Fields - Always Visible */}
        <div className="form-section">
          <div className="form-group full-width">
            <label htmlFor="title">Task Name*</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title (max 20 characters)"
              maxLength={20}
              required
              className="task-name-input"
            />
            <div className="character-count">
              {formData.title.length}/20 characters
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="assignee">Assigned To*</label>
              <select
                id="assignee"
                name="assignee"
                value={formData.assignee}
                onChange={handleChange}
                required
              >
                <option value="self">Myself</option>
                {isOrgUser && (
                  <>
                    <option value="john">John Smith</option>
                    <option value="sarah">Sarah Wilson</option>
                    <option value="mike">Mike Johnson</option>
                  </>
                )}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="priority">Priority*</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                required
              >
                <option value="low">Low (Due in 30 days)</option>
                <option value="medium">Medium (Due in 14 days)</option>
                <option value="high">High (Due in 7 days)</option>
                <option value="critical">Critical (Due in 2 days)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="dueDate">Due Date*</label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                disabled={formData.isRecurring}
                required={!formData.isRecurring}
                className={formData.isRecurring ? 'disabled-input' : ''}
              />
              {formData.isRecurring && (
                <small className="form-hint">Due date is disabled for recurring tasks</small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="visibility">Visibility*</label>
              <select
                id="visibility"
                name="visibility"
                value={formData.visibility}
                onChange={handleChange}
                required
              >
                <option value="private">Private</option>
                {isOrgUser && <option value="public">Public</option>}
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="form-group full-width">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add details, context, or notes. Supports formatting..."
              rows="4"
              className="rich-text-area"
            />
          </div>

          <div className="form-group full-width">
            <label>Labels / Tags</label>
            <div className="tags-input-container">
              <div className="tags-display">
                {formData.tags.map(tag => (
                  <span key={tag} className="tag-chip">
                    {tag}
                    <button 
                      type="button" 
                      className="tag-remove"
                      onClick={() => handleTagRemove(tag)}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="Type and press Enter to add tags"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    const value = e.target.value.trim()
                    if (value) {
                      handleTagAdd(value)
                      e.target.value = ''
                    }
                  }
                }}
                className="tag-input"
              />
            </div>
          </div>
        </div>

        {/* More Options Toggle */}
        <div className="form-section">
          <button
            type="button"
            className="more-options-toggle"
            onClick={() => setShowMoreOptions(!showMoreOptions)}
          >
            {showMoreOptions ? '▼' : '▶'} More Options
          </button>
        </div>

        {showMoreOptions && (
          <div className="form-section more-options">
            {/* Attachments */}
            <div className="form-group full-width">
              <label>Attachments</label>
              <div
                className={`file-drop-zone ${dragOver ? 'drag-over' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
              >
                <div className="drop-zone-content">
                  <span className="drop-icon">📎</span>
                  <p>Drag and drop files here or click to upload</p>
                  <small>Maximum total size: 5MB. Supports documents, images, and archives.</small>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="file-input-hidden"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.zip,.rar"
                  />
                </div>
              </div>

              {formData.attachments.length > 0 && (
                <div className="attachments-list">
                  {formData.attachments.map(attachment => (
                    <div key={attachment.id} className="attachment-item">
                      <span className="attachment-name">{attachment.name}</span>
                      <span className="attachment-size">
                        ({(attachment.size / 1024).toFixed(1)}KB)
                      </span>
                      <button
                        type="button"
                        className="attachment-remove"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            attachments: formData.attachments.filter(a => a.id !== attachment.id)
                          })
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recurring Task Section */}
        <div className="form-section">
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
                Make this a recurring task
              </label>
              <p className="recurring-description">
                For recurring tasks, due date is managed by the recurrence schedule
              </p>
            </div>
          </div>
        </div>

        {formData.isRecurring && (
          <div className="recurring-options">
            <h4 className="recurring-title">Recurrence Settings</h4>
            <p className="recurring-note">
              Select how often this task should repeat. Only one option can be selected.
            </p>

            <div className="recurrence-type-selector">
              <div className="recurrence-option">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="recurrence.type"
                    value="dates"
                    checked={formData.recurrence.type === 'dates'}
                    onChange={(e) => handleRecurrenceTypeChange(e.target.value)}
                  />
                  <span className="radio-custom"></span>
                  Specific Dates (Calendar Multi-Select)
                </label>

                {formData.recurrence.type === 'dates' && (
                  <div className="calendar-multiselect">
                    <p className="option-description">Select multiple dates from the calendar</p>
                    <div className="calendar-grid">
                      {/* Simple date picker implementation */}
                      <input
                        type="date"
                        onChange={(e) => {
                          if (e.target.value) {
                            handleDateSelection(e.target.value)
                            e.target.value = '' // Reset for multiple selections
                          }
                        }}
                        className="date-picker"
                      />
                      <div className="selected-dates">
                        {formData.recurrence.selectedDates.map(date => (
                          <span key={date} className="date-chip">
                            {new Date(date).toLocaleDateString()}
                            <button
                              type="button"
                              onClick={() => handleDateSelection(date)}
                              className="date-remove"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="recurrence-option">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="recurrence.type"
                    value="monthly"
                    checked={formData.recurrence.type === 'monthly'}
                    onChange={(e) => handleRecurrenceTypeChange(e.target.value)}
                  />
                  <span className="radio-custom"></span>
                  Monthly (Every X day of month)
                </label>

                {formData.recurrence.type === 'monthly' && (
                  <div className="monthly-options">
                    <p className="option-description">Select which day of each month</p>
                    <select
                      value={formData.recurrence.monthlyDay}
                      onChange={(e) => setFormData({
                        ...formData,
                        recurrence: {
                          ...formData.recurrence,
                          monthlyDay: e.target.value
                        }
                      })}
                      className="monthly-day-select"
                    >
                      <option value="">Select day of month</option>
                      {Array.from({length: 31}, (_, i) => i + 1).map(day => (
                        <option key={day} value={day}>
                          {day}{day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th'} of every month
                        </option>
                      ))}
                      <option value="last">Last day of every month</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="recurrence-option">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="recurrence.type"
                    value="weekly"
                    checked={formData.recurrence.type === 'weekly'}
                    onChange={(e) => handleRecurrenceTypeChange(e.target.value)}
                  />
                  <span className="radio-custom"></span>
                  Weekly (Every X day of week)
                </label>

                {formData.recurrence.type === 'weekly' && (
                  <div className="weekly-options">
                    <p className="option-description">Select which days of the week</p>
                    <div className="days-selector">
                      {[
                        { key: 'Monday', label: 'Mon' },
                        { key: 'Tuesday', label: 'Tue' },
                        { key: 'Wednesday', label: 'Wed' },
                        { key: 'Thursday', label: 'Thu' },
                        { key: 'Friday', label: 'Fri' },
                        { key: 'Saturday', label: 'Sat' },
                        { key: 'Sunday', label: 'Sun' }
                      ].map(day => (
                        <button
                          key={day.key}
                          type="button"
                          className={`day-button ${formData.recurrence.weeklyDays.includes(day.key) ? 'selected' : ''}`}
                          onClick={() => handleWeeklyDayToggle(day.key)}
                        >
                          {day.label}
                        </button<previous_generation>```python
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Recurrence Summary */}
            <div className="recurrence-summary">
              <h5>Recurrence Summary</h5>
              <div className="summary-content">
                {formData.recurrence.type === 'dates' && formData.recurrence.selectedDates.length > 0 && (
                  <p>Task will be created on: {formData.recurrence.selectedDates.map(date => 
                    new Date(date).toLocaleDateString()).join(', ')}</p>
                )}
                {formData.recurrence.type === 'monthly' && formData.recurrence.monthlyDay && (
                  <p>Task will be created on the {formData.recurrence.monthlyDay === 'last' ? 'last day' : 
                    `${formData.recurrence.monthlyDay}${formData.recurrence.monthlyDay === '1' ? 'st' : 
                    formData.recurrence.monthlyDay === '2' ? 'nd' : 
                    formData.recurrence.monthlyDay === '3' ? 'rd' : 'th'}`} of every month</p>
                )}
                {formData.recurrence.type === 'weekly' && formData.recurrence.weeklyDays.length > 0 && (
                  <p>Task will be created every {formData.recurrence.weeklyDays.join(', ')}</p>
                )}
                {!((formData.recurrence.type === 'dates' && formData.recurrence.selectedDates.length > 0) ||
                   (formData.recurrence.type === 'monthly' && formData.recurrence.monthlyDay) ||
                   (formData.recurrence.type === 'weekly' && formData.recurrence.weeklyDays.length > 0)) && (
                  <p className="no-selection">Please configure your recurrence settings above</p>
                )}
              </div>
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

function getStatusLabel(statusCode) {
  const statusMap = {
    'OPEN': 'Open',
    'INPROGRESS': 'In Progress', 
    'ONHOLD': 'On Hold',
    'DONE': 'Completed',
    'CANCELLED': 'Cancelled',
    // Legacy support
    'pending': 'Open',
    'in-progress': 'In Progress',
    'completed': 'Completed'
  }
  return statusMap[statusCode] || statusCode
}

function getValidStatusTransitions(currentStatus) {
  const statuses = [
    { code: 'OPEN', label: 'Open', transitions: ['INPROGRESS', 'ONHOLD', 'CANCELLED'] },
    { code: 'INPROGRESS', label: 'In Progress', transitions: ['ONHOLD', 'DONE', 'CANCELLED'] },
    { code: 'ONHOLD', label: 'On Hold', transitions: ['INPROGRESS', 'CANCELLED'] },
    { code: 'DONE', label: 'Completed', transitions: [] },
    { code: 'CANCELLED', label: 'Cancelled', transitions: [] }
  ]

  // Legacy status mapping
  const legacyMap = {
    'pending': 'OPEN',
    'in-progress': 'INPROGRESS', 
    'completed': 'DONE'
  }

  const mappedStatus = legacyMap[currentStatus] || currentStatus
  const currentStatusObj = statuses.find(s => s.code === mappedStatus)

  if (!currentStatusObj) return [{ code: currentStatus, label: getStatusLabel(currentStatus) }]

  const validTransitions = currentStatusObj.transitions.map(transitionCode => 
    statuses.find(s => s.code === transitionCode)
  ).filter(Boolean)

  return [currentStatusObj, ...validTransitions]
}

function TaskRow({ task, isSnoozed, snoozedUntil, isSelected, onTaskClick, onTaskSelect, onSnooze, onUnsnooze, onTaskUpdate, onDeleteTask, canSnoozeTask, canEditStatus, canDeleteTask, getValidTransitions, currentUser }) {
  const [editingField, setEditingField] = useState(null)
  const [editValue, setEditValue] = useState('')

  const handleFieldEdit = (field, currentValue) => {
    setEditingField(field)
    setEditValue(currentValue)
  }

  const handleFieldSave = () => {
    if (editingField && editValue !== task[editingField]) {
      const updatedTask = { ...task, [editingField]: editValue }
      onTaskUpdate(updatedTask)
    }
    setEditingField(null)
    setEditValue('')
  }

  const handleFieldCancel = () => {
    setEditingField(null)
    setEditValue('')
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleFieldSave()
    } else if (e.key === 'Escape') {
      handleFieldCancel()
    }
  }

  const priorities = ['low', 'medium', 'high', 'critical']
  const statuses = [
    { code: 'OPEN', label: 'Open', transitions: ['INPROGRESS', 'ONHOLD', 'CANCELLED'] },
    { code: 'INPROGRESS', label: 'In Progress', transitions: ['ONHOLD', 'DONE', 'CANCELLED'] },
    { code: 'ONHOLD', label: 'On Hold', transitions: ['INPROGRESS', 'CANCELLED'] },
    { code: 'DONE', label: 'Completed', transitions: [] },
    { code: 'CANCELLED', label: 'Cancelled', transitions: [] }
  ]
  const assignees = ['John Smith', 'Sarah Wilson', 'Mike Johnson', 'Emily Davis']

  return (
    <div className="table-row">
      <div className="td task-title">
        <label className="checkbox-label" onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onTaskSelect(e.target.checked)}
          />
          <span className="checkmark"></span>
        </label>
        <div className="task-title-content" onClick={onTaskClick}>
          <span className="task-title-text">{task.title}</span>
          {task.subtasks && task.subtasks.length > 0 && (
            <span className="subtask-count" title={`${task.subtasks.length} sub-tasks`}>
              {task.subtasks.length} sub-tasks
            </span>
          )}
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
      </div>

      <div className="td editable-field" onMouseEnter={(e) => e.target.classList.add('hover')}>
        {editingField === 'status' ? (
          <select 
            value={editValue} 
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleFieldSave}
            onKeyDown={handleKeyPress}
            autoFocus
            className="inline-edit-select"
          >
            <option value={task.status}>{getStatusLabel(task.status)} (Current)</option>
            {getValidTransitions(task.status, task).map(status => (
              <option key={status} value={status}>
                {getStatusLabel(status)}
              </option>
            ))}
          </select>
        ) : (
          <div 
            className={`editable-content ${canEditStatus(task) ? 'can-edit' : 'read-only'}`} 
            onClick={() => {
              if (canEditStatus(task)) {
                handleFieldEdit('status', task.status)
              }
            }}
            title={canEditStatus(task) ? 'Click to edit status' : 'No permission to edit status'}
          >
            <span className={`status-badge ${task.status.toLowerCase()}`}>
              {getStatusLabel(task.status)}
            </span>
            {canEditStatus(task) && <span className="edit-icon">✏️</span>}
            {!canEditStatus(task) && <span className="lock-icon">🔒</span>}
          </div>
        )}
      </div>

      <div className="td editable-field" onMouseEnter={(e) => e.target.classList.add('hover')}>
        {editingField === 'priority' ? (
          <select 
            value={editValue} 
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleFieldSave}
            onKeyDown={handleKeyPress}
            autoFocus
            className="inline-edit-select"
          >
            {priorities.map(priority => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        ) : (
          <div className="editable-content" onClick={() => handleFieldEdit('priority', task.priority)}>
            <span className={`priority-badge ${task.priority}`}>
              {task.priority}
            </span>
            <span className="edit-icon">✏️</span>
          </div>
        )}
      </div>

      <div className="td editable-field" onMouseEnter={(e) => e.target.classList.add('hover')}>
        {editingField === 'assignee' ? (
          <select 
            value={editValue} 
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleFieldSave}
            onKeyDown={handleKeyPress}
            autoFocus
            className="inline-edit-select"
          >
            {assignees.map(assignee => (
              <option key={assignee} value={assignee}>
                {assignee}
              </option>
            ))}
          </select>
        ) : (
          <div className="editable-content" onClick={() => handleFieldEdit('assignee', task.assignee)}>
            <span>{task.assignee}</span>
            <span className="edit-icon">✏️</span>
          </div>
        )}
      </div>

      <div className="td editable-field" onMouseEnter={(e) => e.target.classList.add('hover')}>
        {editingField === 'dueDate' ? (
          <input 
            type="date"
            value={editValue} 
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleFieldSave}
            onKeyDown={handleKeyPress}
            autoFocus
            className="inline-edit-input"
          />
        ) : (
          <div className="editable-content" onClick={() => handleFieldEdit('dueDate', task.dueDate)}>
            <span>{task.dueDate}</span>
            <span className="edit-icon">✏️</span>
          </div>
        )}
      </div>

      <div className="td">{task.category}</div>
      <div className="td">
        <div className="action-buttons">
          <button 
            className="btn-action"
            onClick={onTaskClick}
          >
            Edit
          </button>
          {isSnoozed ? (
            <button 
              className="btn-action"
              onClick={() => onUnsnooze(task.id)}
              disabled={!canSnoozeTask(task)}
            >
              Unsnooze
            </button>
          ) : (
            <button 
              className="btn-action"
              onClick={() => onSnooze(task)}
              disabled={!canSnoozeTask(task)}
            >
              Snooze
            </button>
          )}
          <button 
            className="btn-action delete"
            onClick={() => onDeleteTask(task)}
            disabled={!canDeleteTask(task)}
            title={canDeleteTask(task) ? "Delete task" : "No permission to delete"}
          >
            🗑️ Delete
          </button>
        </div>
      </div>
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

function TaskCard({ task, onTaskClick, currentUser, onTaskUpdate }) {
  const [isEditing, setIsEditing] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [showStatusConfirm, setShowStatusConfirm] = useState(false)

  const handleEdit = (field, currentValue) => {
    setIsEditing(field)
    setEditValue(currentValue)
  }

  const handleSave = () => {
    if (editValue !== task[isEditing]) {
      // Check if changing to a final status
      if (isEditing === 'status' && ['DONE', 'CANCELLED'].includes(editValue)) {
        setShowStatusConfirm(true)
        return
      }

      const updatedTask = { ...task, [isEditing]: editValue }
      onTaskUpdate(updatedTask)
    }
    setIsEditing(null)
    setEditValue('')
  }

  const handleStatusConfirm = () => {
    const updatedTask = { ...task, [isEditing]: editValue }
    onTaskUpdate(updatedTask)
    setShowStatusConfirm(false)
    setIsEditing(null)
    setEditValue('')
  }

  const handleCancel = () => {
    setIsEditing(null)
    setEditValue('')
    setShowStatusConfirm(false)
  }

  const canEdit = task.assigneeId === currentUser.id || currentUser.role === 'admin'

  return (
    <div className="task-card">
      <h3 className="task-title" onClick={onTaskClick}>{task.title}</h3>

      {/* Status Pill with Edit Dropdown */}
      {canEdit ? (
        <div className="status-edit-container">
          {isEditing === 'status' ? (
            <select
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSave}
              autoFocus
              className="status-edit-select"
            >
              <option value="OPEN">Open</option>
              <option value="INPROGRESS">In Progress</option>
              <option value="ONHOLD">On Hold</option>
              <option value="DONE">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          ) : (
            <div className="status-pill" onClick={() => handleEdit('status', task.status)}>
              {getStatusLabel(task.status)}
            </div>
          )}
        </div>
      ) : (
        <div className="status-pill">{getStatusLabel(task.status)}</div>
      )}

      <p className="task-details">Priority: {task.priority}</p>
      <p className="task-details">Due Date: {task.dueDate}</p>

      {showStatusConfirm && (
        <StatusChangeConfirmModal
          task={task}
          newStatus={editValue}
          onConfirm={handleStatusConfirm}
          onCancel={handleCancel}
        />
      )}
    </div>
  )
}

function StatusChangeConfirmModal({ task, newStatus, onConfirm, onCancel }) {
  const statusLabel = getStatusLabel(newStatus)
  const isFinalStatus = ['DONE', 'CANCELLED'].includes(newStatus)

  return (
    <div className="modal-overlay-small">
      <div className="status-confirm-modal">
        <div className="modal-header">
          <h3>Confirm Status Change</h3>
          <button className="close-button" onClick={onCancel}>×</button>
        </div>

        <div className="modal-content">
          <div className="status-change-info">
            <p>
              Change task status from <strong>{getStatusLabel(task.status)}</strong> to{' '}
              <strong className={`status-badge ${newStatus.toLowerCase()}`}>
                {statusLabel}
              </strong>
            </p>

            {isFinalStatus && (
              <div className="warning-message">
                <span className="warning-icon">⚠️</span>
                <p>This is a final status. The task will be marked as complete and may affect project metrics.</p>
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button className="btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button className="btn-primary" onClick={onConfirm}>
              Confirm Change
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function TaskDeleteModal({ task, onConfirm, onClose, currentUser }) {
  const [deleteOptions, setDeleteOptions] = useState({
    deleteSubtasks: false,
    deleteAttachments: false,
    confirmed: false
  })

  const hasSubtasks = task?.subtasks && task.subtasks.length > 0
  const hasAttachments = task?.attachments && task.attachments.length > 0
  const hasDependencies = task?.dependencies && task.dependencies.length > 0
  const hasLinkedItems = task?.linkedItems && task.linkedItems.length > 0

  const handleSubmit = () => {
    if (!deleteOptions.confirmed) {
      alert('Please confirm you understand this action is irreversible')
      return
    }
    onConfirm(deleteOptions)
  }

  const getWarningMessages = () => {
    const warnings = []

    if (hasSubtasks) {
      warnings.push(`This task has ${task.subtasks.length} subtask(s). Deleting it will delete all subtasks.`)
    }

    if (hasDependencies) {
      warnings.push('This task is referenced in another task. Deleting it may affect task dependencies.')
    }

    if (hasLinkedItems || hasAttachments) {
      warnings.push('All linked forms and files will also be deleted.')
    }

    if (task.createdBy !== currentUser.name && task.assigneeId !== currentUser.id) {
      warnings.push('This task was created by another user.')
    }

    return warnings
  }

  const warnings = getWarningMessages()

  return (
    <div className="modal-overlay">
      <div className="modal-container delete-task-modal">
        <div className="modal-header">
          <h3>🗑️ Delete Task</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          <div className="delete-task-info">
            <h4>Are you sure you want to delete this task?</h4>
            <div className="task-to-delete">
              <strong>"{task?.title}"</strong>
              <span className={`status-badge ${task?.status}`}>
                {getStatusLabel(task?.status)}
              </span>
            </div>
          </div>

          {warnings.length > 0 && (
            <div className="deletion-warnings">
              <h4>⚠️ Important Notice:</h4>
              <ul>
                {warnings.map((warning, index) => (
                  <li key={index} className="warning-item">{warning}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="deletion-options">
            {hasSubtasks && (
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={deleteOptions.deleteSubtasks}
                  onChange={(e) => setDeleteOptions({
                    ...deleteOptions,
                    deleteSubtasks: e.target.checked
                  })}
                />
                <span className="checkmark"></span>
                Also delete all {task.subtasks.length} subtask(s)
              </label>
            )}

            {(hasAttachments || hasLinkedItems) && (
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={deleteOptions.deleteAttachments}
                  onChange={(e) => setDeleteOptions({
                    ...deleteOptions,
                    deleteAttachments: e.target.checked
                  })}
                />
                <span className="checkmark"></span>
                Also delete attached forms and files
              </label>
            )}

            <label className="checkbox-label required-confirmation">
              <input
                type="checkbox"
                checked={deleteOptions.confirmed}
                onChange={(e) => setDeleteOptions({
                  ...deleteOptions,
                  confirmed: e.target.checked
                })}
                required
              />
              <span className="checkmark"></span>
              <strong>I understand this action is irreversible</strong>
            </label>
          </div>

          <div className="modal-actions">
            <button className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button 
              className="btn-danger" 
              onClick={handleSubmit}
              disabled={!deleteOptions.confirmed}
            >
              Delete Task
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function BulkStatusModal({ selectedTasks, onSubmit, onClose, currentUser }) {
  const [selectedStatus, setSelectedStatus] = useState('')
  const [errors, setErrors] = useState([])

  const availableStatuses = [
    { value: 'pending', label: 'Open' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'on-hold', label: 'On Hold' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ]

  const validateSelection = (status) => {
    const validationErrors = []

    selectedTasks.forEach(task => {
      // Check permissions
      const canEdit = (
        task.assigneeId === currentUser.id ||
        task.collaborators?.includes(currentUser.id) ||
        currentUser.role === 'admin'
      )

      if (!canEdit) {
        validationErrors.push(`No permission to edit: ${task.title}`)
        return
      }

      // Check sub-task completion for parent tasks
      if (status === 'completed' && task.subtasks?.length > 0) {
        const incompleteSubtasks = task.subtasks.filter(st => 
          st.status !== 'completed' && st.status !== 'cancelled'
        )
        if (incompleteSubtasks.length > 0) {
          validationErrors.push(`"${task.title}" has ${incompleteSubtasks.length} incomplete sub-tasks`)
        }
      }
    })

    setErrors(validationErrors)
    return validationErrors.length === 0
  }

  const handleStatusChange = (status) => {
    setSelectedStatus(status)
    validateSelection(status)
  }

  const handleSubmit = () => {
    if (selectedStatus && validateSelection(selectedStatus)) {
      onSubmit(selectedStatus)
    }
  }

  const tasksWithIssues = selectedTasks.filter(task => {
    if (selectedStatus === 'completed' && task.subtasks?.length > 0) {
      return task.subtasks.some(st => st.status !== 'completed' && st.status !== 'cancelled')
    }
    return false
  })

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>Update Status for {selectedTasks.length} Tasks</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          <div className="bulk-status-info">
            <h4>Selected Tasks:</h4>
            <div className="selected-tasks-list">
              {selectedTasks.map(task => (
                <div key={task.id} className="selected-task-item">
                  <span className="task-title">{task.title}</span>
                  <span className={`current-status ${task.status}`}>
                    {getStatusLabel(task.status)}
                  </span>
                  {task.subtasks?.length > 0 && (
                    <span className="subtask-count">
                      {task.subtasks.length} sub-tasks
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>New Status:</label>
            <select
              value={selectedStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="form-select"
            >
              <option value="">Select new status...</option>
              {availableStatuses.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          {errors.length > 0 && (
            <div className="validation-errors">
              <h4>⚠️ Issues Found:</h4>
              <ul>
                {errors.map((error, index) => (
                  <li key={index} className="error-item">{error}</li>
                ))}
              </ul>
            </div>
          )}

          {selectedStatus === 'completed' && tasksWithIssues.length > 0 && (
            <div className="warning-message">
              <span className="warning-icon">⚠️</span>
              <p>
                {tasksWithIssues.length} task(s) have incomplete sub-tasks. 
                Parent tasks cannot be completed until all sub-tasks are done or cancelled.
              </p>
            </div>
          )}

          <div className="modal-actions">
            <button className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button 
              className="btn-primary" 
              onClick={handleSubmit}
              disabled={!selectedStatus || errors.length > 0}
            >
              Update {selectedTasks.length} Task{selectedTasks.length !== 1 ? 's' : ''}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}