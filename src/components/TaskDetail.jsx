import React, { useState, useRef } from 'react'
import TaskComments from './TaskComments'
import ActivityFeed from './ActivityFeed'
import TaskAttachments from './TaskAttachments'

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

export default function TaskDetail({ taskId, onClose }) {
  const [activeTab, setActiveTab] = useState('details')
  const [showSnoozeModal, setShowSnoozeModal] = useState(false)
  const [currentUser] = useState({ id: 1, name: 'Current User', role: 'assignee' })

  // Mock task data - in real app this would come from props or API
  const [task, setTask] = useState({
    id: taskId,
    title: "Database Migration",
    description: "Migrate the existing database from MySQL to PostgreSQL while ensuring data integrity and minimal downtime.",
    status: "in-progress",
    priority: "high",
    assignee: "John Smith",
    assigneeId: 1,
    category: "Backend",
    dueDate: "2024-01-25",
    tags: ["database", "migration", "backend"],
    createdBy: "Sarah Wilson",
    createdAt: "2024-01-15 09:00",
    updatedAt: "2024-01-20 14:30",
    snoozedUntil: null,
    snoozeNote: null,
    subtasks: [
      { id: 101, title: "Backup existing database", status: "completed", assignee: "John Smith", dueDate: "2024-01-20" },
      { id: 102, title: "Set up PostgreSQL instance", status: "completed", assignee: "Mike Johnson", dueDate: "2024-01-22" },
      { id: 103, title: "Create migration scripts", status: "in-progress", assignee: "Sarah Wilson", dueDate: "2024-01-24" },
      { id: 104, title: "Test data integrity", status: "pending", assignee: "Emily Davis", dueDate: "2024-01-26" },
      { id: 105, title: "Update application configs", status: "pending", assignee: "John Smith", dueDate: "2024-01-27" }
    ],
    linkedItems: [
      { id: 1, type: "form", title: "Migration Checklist", status: "in-progress" },
      { id: 2, type: "document", title: "Migration Plan", status: "completed" },
      { id: 3, type: "task", title: "Update Documentation", status: "pending" }
    ],
    milestones: [
      { id: 1, title: "Database Backup Complete", status: "completed", date: "2024-01-20" },
      { id: 2, title: "Migration Scripts Ready", status: "in-progress", date: "2024-01-24" },
      { id: 3, title: "Full Migration Complete", status: "pending", date: "2024-01-28" }
    ],
    isApprovalTask: false,
    reminders: [
      { id: 1, type: "due_date", message: "Due in 3 days", date: "2024-01-25" }
    ]
  })

  const tabs = [
    { id: 'details', label: 'Details', icon: '📋' },
    { id: 'subtasks', label: 'Subtasks', icon: '📝', count: task.subtasks?.length || 0 },
    { id: 'comments', label: 'Comments', icon: '💬' },
    { id: 'activity', label: 'Activity', icon: '📊' },
    { id: 'attachments', label: 'Files & Links', icon: '📎' },
    { id: 'linked', label: 'Linked Items', icon: '🔗', count: task.linkedItems?.length || 0 }
  ]

  const now = new Date()
  const snoozedUntil = task.snoozedUntil ? new Date(task.snoozedUntil) : null
  const isSnoozed = snoozedUntil && snoozedUntil > now

  const canSnoozeTask = () => {
    return task.assigneeId === currentUser.id || currentUser.role === 'admin'
  }

  const handleSnoozeSubmit = (snoozeData) => {
    setTask({
      ...task,
      snoozedUntil: snoozeData.snoozeUntil,
      snoozeNote: snoozeData.note
    })
    setShowSnoozeModal(false)
  }

  const handleUnsnooze = () => {
    setTask({
      ...task,
      snoozedUntil: null,
      snoozeNote: null
    })
  }

  const handleCreateSubtask = () => {
    // Implementation for creating subtask
    console.log('Create subtask')
  }

  const handleExportTask = () => {
    // Implementation for exporting task
    console.log('Export task')
  }

  return (
    <div className="task-detail-modal">
      <div className="task-detail-overlay" onClick={onClose}></div>
      <div className="task-detail-container unified-view">
        {/* Header Section */}
        <div className="task-detail-header">
          <div className="task-header-main">
            <div className="task-title-section">
              <EditableTitle 
                title={task.title} 
                onSave={(newTitle) => setTask({...task, title: newTitle})}
              />
              <div className="task-badges">
                <span className={`status-badge ${task.status.toLowerCase()}`}>
                  {getStatusLabel(task.status)}
                </span>
                <span className={`priority-badge ${task.priority}`}>
                  {task.priority}
                </span>
                {task.tags.map(tag => (
                  <span key={tag} className="tag-badge">#{tag}</span>
                ))}
                {isSnoozed && (
                  <span className="snooze-indicator-large" title={`Snoozed until ${snoozedUntil.toLocaleString()}`}>
                    😴 Snoozed
                  </span>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
              <button className="btn-action" onClick={handleCreateSubtask}>
                + Subtask
              </button>
              {isSnoozed ? (
                <button 
                  className="btn-action"
                  onClick={handleUnsnooze}
                  disabled={!canSnoozeTask()}
                >
                  Unsnooze
                </button>
              ) : (
                <button 
                  className="btn-action"
                  onClick={() => setShowSnoozeModal(true)}
                  disabled={!canSnoozeTask()}
                >
                  Snooze
                </button>
              )}
              <button className="btn-action" onClick={handleExportTask}>
                Export
              </button>
              <button className="close-button" onClick={onClose}>×</button>
            </div>
          </div>

          {/* Info Panel */}
          <div className="task-info-panel">
            <div className="info-grid">
              <EditableInfoItem
                label="Assignee"
                value={task.assignee}
                type="select"
                options={['John Smith', 'Sarah Wilson', 'Mike Johnson', 'Emily Davis']}
                onSave={(newValue) => setTask({...task, assignee: newValue})}
              />
              <EditableInfoItem
                label="Due Date"
                value={task.dueDate}
                type="date"
                onSave={(newValue) => setTask({...task, dueDate: newValue})}
              />
              <EditableInfoItem
                label="Priority"
                value={task.priority}
                type="select"
                options={['low', 'medium', 'high', 'critical']}
                onSave={(newValue) => setTask({...task, priority: newValue})}
              />
              <div className="info-item">
                <label>Created By</label>
                <span>{task.createdBy}</span>
              </div>
            </div>

            {task.reminders.length > 0 && (
              <div className="reminders-section">
                <h4>Reminders</h4>
                {task.reminders.map(reminder => (
                  <div key={reminder.id} className="reminder-item">
                    <span className="reminder-icon">⏰</span>
                    <span>{reminder.message}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="task-detail-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              {tab.label}
              {tab.count > 0 && <span className="tab-count">({tab.count})</span>}
            </button>
          ))}
        </div>

        {/* Content Section */}
        <div className="task-detail-content">
          {activeTab === 'details' && (
            <div className="task-details-panel">
              <div className="detail-section">
                <h3>Description</h3>
                <p>{task.description}</p>
              </div>

              {/* Milestone/Approval Visual Cues */}
              {task.milestones.length > 0 && (
                <div className="milestones-section">
                  <h3>Milestones</h3>
                  <div className="milestone-list">
                    {task.milestones.map(milestone => (
                      <div key={milestone.id} className="milestone-item">
                        <span className={`milestone-icon ${milestone.status}`}>
                          {milestone.status === 'completed' ? '✅' : 
                           milestone.status === 'in-progress' ? '🔄' : '⭐'}
                        </span>
                        <div className="milestone-info">
                          <span className="milestone-title">{milestone.title}</span>
                          <span className="milestone-date">{milestone.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {isSnoozed && (
                <div className="snooze-info">
                  <h4>Snooze Information</h4>
                  <div className="snooze-details">
                    <div className="meta-item">
                      <strong>Snoozed until:</strong> {snoozedUntil.toLocaleString()}
                    </div>
                    {task.snoozeNote && (
                      <div className="meta-item">
                        <strong>Snooze note:</strong> {task.snoozeNote}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="detail-meta">
                <div className="meta-item">
                  <strong>Created:</strong> {task.createdAt}
                </div>
                <div className="meta-item">
                  <strong>Last updated:</strong> {task.updatedAt}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'subtasks' && (
            <SubtasksPanel 
              subtasks={task.subtasks} 
              onCreateSubtask={handleCreateSubtask}
              parentTask={task}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'comments' && <TaskComments taskId={taskId} />}
          {activeTab === 'activity' && <ActivityFeed taskId={taskId} />}
          {activeTab === 'attachments' && <TaskAttachments taskId={taskId} />}

          {activeTab === 'linked' && (
            <LinkedItemsPanel linkedItems={task.linkedItems} />
          )}
        </div>

        {showSnoozeModal && (
          <SnoozeModal
            task={task}
            onSubmit={handleSnoozeSubmit}
            onClose={() => setShowSnoozeModal(false)}
          />
        )}
      </div>
    </div>
  )
}

function SubtasksPanel({ subtasks, onCreateSubtask, parentTask, currentUser }) {
  const [filter, setFilter] = useState('all')
  const [showInlineAdd, setShowInlineAdd] = useState(false)
  const [expandedSubtask, setExpandedSubtask] = useState(null)
  const [subtaskList, setSubtaskList] = useState(subtasks)

  const filteredSubtasks = subtaskList.filter(subtask => {
    if (filter === 'all') return true
    return subtask.status === filter
  })

  const handleCreateSubtask = (subtaskData) => {
    const newSubtask = {
      id: Date.now(),
      ...subtaskData,
      parentTaskId: parentTask.id,
      createdAt: new Date().toISOString(),
      createdBy: currentUser.name
    }
    setSubtaskList([...subtaskList, newSubtask])
    setShowInlineAdd(false)
  }

  const handleUpdateSubtask = (updatedSubtask) => {
    setSubtaskList(subtaskList.map(st => 
      st.id === updatedSubtask.id ? updatedSubtask : st
    ))
  }

  const handleDeleteSubtask = (subtaskId) => {
    setSubtaskList(subtaskList.filter(st => st.id !== subtaskId))
    if (expandedSubtask?.id === subtaskId) {
      setExpandedSubtask(null)
    }
  }

  const canEditSubtask = (subtask) => {
    return subtask.createdBy === currentUser.name || 
           subtask.assignee === currentUser.name || 
           currentUser.role === 'admin'
  }

  const canDeleteSubtask = (subtask) => {
    return subtask.createdBy === currentUser.name || currentUser.role === 'admin'
  }

  return (
    <div className="subtasks-panel">
      <div className="subtasks-header">
        <h3>Sub-tasks ({subtaskList.length})</h3>
        <div className="subtasks-filters">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="to-do">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="blocked">Blocked</option>
            <option value="completed">Completed</option>
          </select>
          <button 
            className="btn-primary" 
            onClick={() => setShowInlineAdd(true)}
          >
            + Add Sub-task
          </button>
        </div>
      </div>

      <div className="subtasks-list">
        {showInlineAdd && (
          <InlineSubtaskAdd
            parentTask={parentTask}
            currentUser={currentUser}
            onSubmit={handleCreateSubtask}
            onCancel={() => setShowInlineAdd(false)}
          />
        )}

        {filteredSubtasks.map(subtask => (
          <div key={subtask.id} className="subtask-item">
            <SubtaskSummary 
              subtask={subtask}
              isExpanded={expandedSubtask?.id === subtask.id}
              onExpand={() => {
                setExpandedSubtask(expandedSubtask?.id === subtask.id ? null : subtask)
              }}
              onUpdate={handleUpdateSubtask}
              onDelete={handleDeleteSubtask}
              canEdit={canEditSubtask(subtask)}
              canDelete={canDeleteSubtask(subtask)}
              currentUser={currentUser}
            />

            {expandedSubtask?.id === subtask.id && (
              <SubtaskDetailView 
                subtask={subtask}
                onUpdate={handleUpdateSubtask}
                onClose={() => setExpandedSubtask(null)}
                canEdit={canEditSubtask(subtask)}
                currentUser={currentUser}
              />
            )}
          </div>
        ))}

        {filteredSubtasks.length === 0 && !showInlineAdd && (
          <div className="empty-subtasks">
            <p>No sub-tasks found. Create your first sub-task to break down this task into manageable pieces.</p>
            <button 
              className="btn-secondary"
              onClick={() => setShowInlineAdd(true)}
            >
              + Add Sub-task
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function InlineSubtaskAdd({ parentTask, currentUser, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    assignee: currentUser.name,
    assigneeId: currentUser.id,
    priority: 'low',
    dueDate: parentTask.dueDate,
    status: 'to-do',
    visibility: parentTask.visibility || 'private',
    description: '',
    attachments: []
  })

  const [currentFieldIndex, setCurrentFieldIndex] = useState(0)
  const fieldRefs = useRef([])
  const priorityDueDays = { low: 30, medium: 14, high: 7, critical: 2 }

  const calculateDueDate = (priority) => {
    const today = new Date()
    const daysToAdd = priorityDueDays[priority] || 30
    const dueDate = new Date(today.getTime() + (daysToAdd * 24 * 60 * 60 * 1000))
    return dueDate.toISOString().split('T')[0]
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === 'priority') {
      setFormData({
        ...formData,
        [name]: value,
        dueDate: calculateDueDate(value)
      })
    } else if (name === 'assignee') {
      // In a real app, you'd lookup assignee ID from name
      setFormData({
        ...formData,
        [name]: value,
        assigneeId: value === currentUser.name ? currentUser.id : 2 // Mock ID
      })
    } else {
      setFormData({
        ...formData,
        [name]: value
      })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.title.trim()) {
      onSubmit(formData)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (e.target.name === 'title' && formData.title.trim()) {
        handleSubmit(e)
      } else {
        // Move to next field
        const nextIndex = currentFieldIndex + 1
        if (nextIndex < fieldRefs.current.length) {
          setCurrentFieldIndex(nextIndex)
          fieldRefs.current[nextIndex]?.focus()
        }
      }
    } else if (e.key === 'Tab') {
      // Handle tab navigation
      const isShift = e.shiftKey
      const nextIndex = isShift ? currentFieldIndex - 1 : currentFieldIndex + 1

      if (nextIndex >= 0 && nextIndex < fieldRefs.current.length) {
        e.preventDefault()
        setCurrentFieldIndex(nextIndex)
        fieldRefs.current[nextIndex]?.focus()
      }
    } else if (e.key === 'Escape') {
      onCancel()
    }
  }

  const handleFieldFocus = (index) => {
    setCurrentFieldIndex(index)
  }

  return (
    <div className="inline-subtask-add">
      <form onSubmit={handleSubmit} className="subtask-form">
        <div className="subtask-form-header">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter sub-task name (max 60 characters)"
            maxLength={60}
            required
            autoFocus
            className="subtask-title-input"
            onKeyDown={handleKeyPress}
          />
          <div className="character-count">{formData.title.length}/60</div>
        </div>

        <div className="subtask-form-fields">
          <div className="form-row">
            <div className="form-field">
              <label>Assigned To*</label>
              <select
                ref={el => fieldRefs.current[0] = el}
                name="assignee"
                value={formData.assignee}
                onChange={handleChange}
                onKeyDown={handleKeyPress}
                onFocus={() => handleFieldFocus(0)}
                required
              >
                <option value={currentUser.name}>Myself</option>
                <option value="John Smith">John Smith</option>
                <option value="Sarah Wilson">Sarah Wilson</option>
                <option value="Mike Johnson">Mike Johnson</option>
                <option value="Emily Davis">Emily Davis</option>
              </select>
            </div>

            <div className="form-field">
              <label>Priority</label>
              <select
                ref={el => fieldRefs.current[1] = el}
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                onKeyDown={handleKeyPress}
                onFocus={() => handleFieldFocus(1)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div className="form-field">
              <label>Due Date*</label>
              <input
                ref={el => fieldRefs.current[2] = el}
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                onKeyDown={handleKeyPress}
                onFocus={() => handleFieldFocus(2)}
                required
              />
            </div>

            <div className="form-field">
              <label>Status</label>
              <select
                ref={el => fieldRefs.current[3] = el}
                name="status"
                value={formData.status}
                onChange={handleChange}
                onKeyDown={handleKeyPress}
                onFocus={() => handleFieldFocus(3)}
              >
                <option value="to-do">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="blocked">Blocked</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="form-field full-width">
            <label>Notes/Description</label>
            <textarea
              ref={el => fieldRefs.current[4] = el}
              name="description"
              value={formData.description}
              onChange={handleChange}
              onKeyDown={handleKeyPress}
              onFocus={() => handleFieldFocus(4)}
              placeholder="Add details or context for this sub-task..."
              rows="3"
            />
          </div>
        </div>

        <div className="subtask-form-actions">
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Create Sub-task
          </button>
        </div>
      </form>
    </div>
  )
}

function SubtaskSummary({ subtask, isExpanded, onExpand, onUpdate, onDelete, canEdit, canDelete, currentUser }) {
  const [editingField, setEditingField] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [isHovered, setIsHovered] = useState(false)

  const handleFieldEdit = (field, currentValue) => {
    if (!canEdit) return
    setEditingField(field)
    setEditValue(currentValue)
  }

  const handleFieldSave = () => {
    if (editingField && editValue !== subtask[editingField]) {
      const updatedSubtask = { ...subtask, [editingField]: editValue }
      onUpdate(updatedSubtask)
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return '✅'
      case 'in-progress': return '🔄'
      case 'blocked': return '🚫'
      default: return '⏸️'
    }
  }

  const isOverdue = () => {
    const today = new Date().toISOString().split('T')[0]
    return subtask.dueDate < today && subtask.status !== 'completed'
  }

  const isCompleted = subtask.status === 'completed'

  return (
    <div 
      className={`subtask-summary ${isExpanded ? 'expanded' : ''} ${isOverdue() ? 'overdue' : ''} ${isCompleted ? 'completed-task' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="subtask-summary-main" onClick={onExpand}>
        <div className="subtask-info">
          <span className={`status-indicator ${subtask.status}`}>
            {getStatusIcon(subtask.status)}
          </span>

          <div className="subtask-details">
            {editingField === 'title' ? (
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={handleFieldSave}
                onKeyDown={handleKeyPress}
                autoFocus
                className="inline-edit-input"
                maxLength={60}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <h4 
                className={`subtask-title ${isCompleted ? 'completed' : ''} ${canEdit ? 'editable-field' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  if (canEdit) handleFieldEdit('title', subtask.title)
                }}
              >
                {subtask.title}
                {canEdit && isHovered && <span className="edit-icon-small">✏️</span>}
              </h4>
            )}

            <div className="subtask-meta">
              <div className="assignee-info">
                <span className="assignee-avatar">{subtask.assignee.charAt(0)}</span>
                <span className="assignee-name">{subtask.assignee}</span>
              </div>

              <div className={`due-date ${isOverdue() ? 'overdue' : ''} ${canEdit ? 'editable-field' : ''}`}>
                {editingField === 'dueDate' ? (
                  <input
                    type="date"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={handleFieldSave}
                    onKeyDown={handleKeyPress}
                    autoFocus
                    className="inline-edit-input"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span 
                    onClick={(e) => {
                      e.stopPropagation()
                      if (canEdit) handleFieldEdit('dueDate', subtask.dueDate)
                    }}
                  >
                    Due: {subtask.dueDate}
                    {canEdit && isHovered && <span className="edit-icon-small">✏️</span>}
                  </span>
                )}
              </div>

              {editingField === 'priority' ? (
                <select
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={handleFieldSave}
                  onKeyDown={handleKeyPress}
                  autoFocus
                  className="inline-edit-select"
                  onClick={(e) => e.stopPropagation()}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              ) : (
                <span 
                  className={`priority-indicator ${subtask.priority} ${canEdit ? 'editable-field' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    if (canEdit) handleFieldEdit('priority', subtask.priority)
                  }}
                >
                  {subtask.priority}
                  {canEdit && isHovered && <span className="edit-icon-small">✏️</span>}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="expand-indicator">
          {isExpanded ? '▼' : '▶'}
        </div>
      </div>

      <div className="subtask-actions" onClick={(e) => e.stopPropagation()}>
        {canDelete && (
          <button 
            className="btn-action delete"
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this sub-task?')) {
                onDelete(subtask.id)
              }
            }}
            title="Delete sub-task"
          >
            🗑️
          </button>
        )}
      </div>
    </div>
  )
}

function SubtaskDetailView({ subtask, onUpdate, onClose, canEdit, currentUser }) {
  const [formData, setFormData] = useState({
    ...subtask
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSave = () => {
    onUpdate(formData)
    onClose()
  }

  return (
    <div className="subtask-detail-view">
      <div className="subtask-detail-header">
        <h4>Sub-task Details</h4>
        <button className="close-button" onClick={onClose}>×</button>
      </div>

      <div className="subtask-detail-content">
        <div className="detail-form">
          <div className="form-row">
            <div className="form-field">
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={!canEdit}
              >
                <option value="to-do">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="blocked">Blocked</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="form-field">
              <label>Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                disabled={!canEdit}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div className="form-field">
              <label>Assignee</label>
              <select
                name="assignee"
                value={formData.assignee}
                onChange={handleChange}
                disabled={!canEdit}
              >
                <option value="John Smith">John Smith</option>
                <option value="Sarah Wilson">Sarah Wilson</option>
                <option value="Mike Johnson">Mike Johnson</option>
                <option value="Emily Davis">Emily Davis</option>
              </select>
            </div>
          </div>

          <div className="form-field full-width">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              disabled={!canEdit}
              rows="4"
            />
          </div>
        </div>

        <div className="subtask-meta-info">
          <div className="meta-item">
            <strong>Created:</strong> {new Date(subtask.createdAt).toLocaleString()}
          </div>
          <div className="meta-item">
            <strong>Created by:</strong> {subtask.createdBy}
          </div>
          <div className="meta-item">
            <strong>Visibility:</strong> {subtask.visibility}
          </div>
        </div>

        {canEdit && (
          <div className="subtask-detail-actions">
            <button className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn-primary" onClick={handleSave}>
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function LinkedItemsPanel({ linkedItems }) {
  return (
    <div className="linked-items-panel">
      <h3>Linked Items ({linkedItems.length})</h3>
      <div className="linked-items-list">
        {linkedItems.map(item => (
          <div key={item.id} className="linked-item">
            <div className="item-icon">
              {item.type === 'form' ? '📋' : 
               item.type === 'document' ? '📄' : '🔗'}
            </div>
            <div className="item-info">
              <h4>{item.title}</h4>
              <span className="item-type">{item.type}</span>
            </div>
            <span className={`status-badge ${item.status}`}>
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function EditableInfoItem({ label, value, type, options, onSave }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)

  const handleSave = () => {
    if (editValue !== value) {
      onSave(editValue)
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditValue(value)
    setIsEditing(false)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  return (
    <div className="info-item editable-info-item">
      <label>{label}</label>
      {isEditing ? (
        <div className="info-edit-container">
          {type === 'select' ? (
            <select
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyPress}
              autoFocus
              className="info-edit-select"
            >
              {options.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={type}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyPress}
              autoFocus
              className="info-edit-input"
            />
          )}
        </div>
      ) : (
        <div className="info-display" onClick={() => setIsEditing(true)}>
          <span className={type === 'select' && label === 'Priority' ? `priority-badge ${value}` : ''}>
            {value}
          </span>
          <span className="edit-icon-small">✏️</span>
        </div>
      )}
    </div>
  )
}

function EditableTitle({ title, onSave }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(title)

  const handleSave = () => {
    if (editValue.trim() && editValue !== title) {
      onSave(editValue.trim())
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditValue(title)
    setIsEditing(false)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  if (isEditing) {
    return (
      <div className="editable-title-container">
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyPress}
          autoFocus
          className="editable-title-input"
          maxLength={50}
        />
        <div className="edit-actions">
          <button onClick={handleSave} className="btn-save">✓</button>
          <button onClick={handleCancel} className="btn-cancel">✗</button>
        </div>
      </div>
    )
  }

  return (
    <div className="editable-title-display" onClick={() => setIsEditing(true)}>
      <h1 className="task-title">{title}</h1>
      <span className="edit-icon-title">✏️</span>
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