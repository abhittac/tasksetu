
import React, { useState } from 'react'
import TaskComments from './TaskComments'
import ActivityFeed from './ActivityFeed'
import TaskAttachments from './TaskAttachments'

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
                <span className={`status-badge ${task.status}`}>
                  {task.status.replace('-', ' ')}
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
            <SubtasksPanel subtasks={task.subtasks} onCreateSubtask={handleCreateSubtask} />
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

function SubtasksPanel({ subtasks, onCreateSubtask }) {
  const [filter, setFilter] = useState('all')

  const filteredSubtasks = subtasks.filter(subtask => {
    if (filter === 'all') return true
    return subtask.status === filter
  })

  return (
    <div className="subtasks-panel">
      <div className="subtasks-header">
        <h3>Subtasks ({subtasks.length})</h3>
        <div className="subtasks-filters">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <button className="btn-primary" onClick={onCreateSubtask}>
            + Add Subtask
          </button>
        </div>
      </div>

      <div className="subtasks-list">
        {filteredSubtasks.map(subtask => (
          <div key={subtask.id} className="subtask-item">
            <div className="subtask-info">
              <span className={`status-indicator ${subtask.status}`}>
                {subtask.status === 'completed' ? '✅' : 
                 subtask.status === 'in-progress' ? '🔄' : '⏸️'}
              </span>
              <div className="subtask-details">
                <h4>{subtask.title}</h4>
                <div className="subtask-meta">
                  <span>Assignee: {subtask.assignee}</span>
                  <span>Due: {subtask.dueDate}</span>
                </div>
              </div>
            </div>
            <div className="subtask-actions">
              <button className="btn-action">Edit</button>
              <button className="btn-action">Delete</button>
            </div>
          </div>
        ))}
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
