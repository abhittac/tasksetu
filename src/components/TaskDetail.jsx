
import React, { useState } from 'react'
import TaskComments from './TaskComments'
import ActivityFeed from './ActivityFeed'
import TaskAttachments from './TaskAttachments'

export default function TaskDetail({ taskId, onClose }) {
  const [activeTab, setActiveTab] = useState('details')
  
  // Mock task data - in real app this would come from props or API
  const task = {
    id: taskId,
    title: "Database Migration",
    description: "Migrate the existing database from MySQL to PostgreSQL while ensuring data integrity and minimal downtime.",
    status: "in-progress",
    priority: "high",
    assignee: "John Smith",
    category: "Backend",
    dueDate: "2024-01-25",
    tags: ["database", "migration", "backend"],
    createdBy: "Sarah Wilson",
    createdAt: "2024-01-15 09:00",
    updatedAt: "2024-01-20 14:30"
  }

  const tabs = [
    { id: 'details', label: 'Details', icon: '📋' },
    { id: 'comments', label: 'Comments', icon: '💬' },
    { id: 'activity', label: 'Activity', icon: '📊' },
    { id: 'attachments', label: 'Files & Links', icon: '📎' }
  ]

  return (
    <div className="task-detail-modal">
      <div className="task-detail-overlay" onClick={onClose}></div>
      <div className="task-detail-container">
        <div className="task-detail-header">
          <div className="task-detail-title">
            <h2>{task.title}</h2>
            <span className={`status-badge ${task.status}`}>
              {task.status.replace('-', ' ')}
            </span>
          </div>
          <button className="close-button" onClick={onClose}>×</button>
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
      </div>
    </div>
  )
}
