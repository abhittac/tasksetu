
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
    snoozeNote: null
  })

  const tabs = [
    { id: 'details', label: 'Details', icon: '📋' },
    { id: 'comments', label: 'Comments', icon: '💬' },
    { id: 'activity', label: 'Activity', icon: '📊' },
    { id: 'attachments', label: 'Files & Links', icon: '📎' }
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

  return (
    <div className="task-detail-modal">
      <div className="task-detail-overlay" onClick={onClose}></div>
      <div className="task-detail-container">
        <div className="task-detail-header">
          <div className="task-detail-title">
            <h2>
              {task.title}
              {isSnoozed && (
                <span className="snooze-indicator-large" title={`Snoozed until ${snoozedUntil.toLocaleString()}`}>
                  😴
                </span>
              )}
            </h2>
            <span className={`status-badge ${task.status}`}>
              {task.status.replace('-', ' ')}
            </span>
          </div>
          <div className="header-actions">
            {isSnoozed ? (
              <button 
                className="btn-secondary"
                onClick={handleUnsnooze}
                disabled={!canSnoozeTask()}
              >
                Unsnooze
              </button>
            ) : (
              <button 
                className="btn-secondary"
                onClick={() => setShowSnoozeModal(true)}
                disabled={!canSnoozeTask()}
              >
                Snooze
              </button>
            )}
            <button className="close-button" onClick={onClose}>×</button>
          </div>
        </div>

        <div className="task-detail-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="task-detail-content">
          {activeTab === 'details' && (
            <div className="task-details-panel">
              <div className="detail-section">
                <h3>Description</h3>
                <p>{task.description}</p>
              </div>
              
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Status</label>
                  <select value={task.status} className="detail-input">
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                
                <div className="detail-item">
                  <label>Priority</label>
                  <select value={task.priority} className="detail-input">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div className="detail-item">
                  <label>Assignee</label>
                  <input type="text" value={task.assignee} className="detail-input" />
                </div>
                
                <div className="detail-item">
                  <label>Due Date</label>
                  <input type="date" value={task.dueDate} className="detail-input" />
                </div>
                
                <div className="detail-item">
                  <label>Category</label>
                  <select value={task.category} className="detail-input">
                    <option value="Backend">Backend</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Design">Design</option>
                    <option value="Documentation">Documentation</option>
                  </select>
                </div>
                
                <div className="detail-item">
                  <label>Tags</label>
                  <input 
                    type="text" 
                    value={task.tags.join(', ')} 
                    className="detail-input"
                    placeholder="Comma separated tags"
                  />
                </div>
              </div>
              
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
                  <strong>Created by:</strong> {task.createdBy} on {task.createdAt}
                </div>
                <div className="meta-item">
                  <strong>Last updated:</strong> {task.updatedAt}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'comments' && <TaskComments taskId={taskId} />}
          {activeTab === 'activity' && <ActivityFeed taskId={taskId} />}
          {activeTab === 'attachments' && <TaskAttachments taskId={taskId} />}
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
