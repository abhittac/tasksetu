
import React, { useState } from 'react'

export default function MilestoneManager() {
  const [milestones, setMilestones] = useState([
    {
      id: 1,
      title: "Phase 1 Development Complete",
      type: "linked",
      status: "ready_for_confirmation",
      assignee: "John Smith",
      assigneeId: 1,
      dueDate: "2024-01-25",
      linkedTasks: [
        { id: 101, title: "Database Setup", status: "completed" },
        { id: 102, title: "API Endpoints", status: "completed" },
        { id: 103, title: "Frontend Integration", status: "completed" }
      ],
      confirmed: false,
      createdBy: "Project Manager",
      createdAt: "2024-01-15"
    },
    {
      id: 2,
      title: "Security Audit Complete",
      type: "standalone",
      status: "pending",
      assignee: "Emily Davis",
      assigneeId: 4,
      dueDate: "2024-02-01",
      linkedTasks: [],
      confirmed: false,
      createdBy: "Security Team",
      createdAt: "2024-01-20"
    },
    {
      id: 3,
      title: "MVP Launch Ready",
      type: "linked",
      status: "in_progress",
      assignee: "Sarah Wilson",
      assigneeId: 3,
      dueDate: "2024-02-15",
      linkedTasks: [
        { id: 201, title: "Testing Complete", status: "in-progress" },
        { id: 202, title: "Documentation", status: "pending" },
        { id: 203, title: "Deployment Setup", status: "completed" }
      ],
      confirmed: false,
      createdBy: "Product Owner",
      createdAt: "2024-01-18"
    }
  ])

  const [currentUser] = useState({ id: 1, name: 'Current User', role: 'admin' })
  const [selectedMilestone, setSelectedMilestone] = useState(null)

  const getMilestoneStatus = (milestone) => {
    if (milestone.confirmed) return 'confirmed'
    if (milestone.type === 'standalone') return milestone.status
    
    const allLinkedCompleted = milestone.linkedTasks.every(task => task.status === 'completed')
    return allLinkedCompleted ? 'ready_for_confirmation' : 'in_progress'
  }

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'status-badge pending',
      in_progress: 'status-badge in-progress',
      ready_for_confirmation: 'status-badge ready',
      confirmed: 'status-badge completed'
    }
    return statusClasses[status] || 'status-badge'
  }

  const canConfirmMilestone = (milestone) => {
    return (milestone.assigneeId === currentUser.id || currentUser.role === 'admin') 
           && getMilestoneStatus(milestone) === 'ready_for_confirmation'
  }

  const confirmMilestone = (milestoneId) => {
    setMilestones(milestones.map(milestone => 
      milestone.id === milestoneId 
        ? { ...milestone, confirmed: true, status: 'confirmed' }
        : milestone
    ))
  }

  const getCompletionPercentage = (milestone) => {
    if (milestone.type === 'standalone') return milestone.status === 'completed' ? 100 : 0
    if (milestone.linkedTasks.length === 0) return 0
    
    const completedTasks = milestone.linkedTasks.filter(task => task.status === 'completed').length
    return Math.round((completedTasks / milestone.linkedTasks.length) * 100)
  }

  return (
    <div className="milestone-manager">
      <div className="page-header">
        <h1>Milestone Tasks</h1>
        <p>Track and manage project milestones</p>
      </div>

      <div className="milestone-filters">
        <div className="filter-group">
          <select className="filter-select">
            <option>All Milestones</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Ready for Confirmation</option>
            <option>Confirmed</option>
          </select>
          <select className="filter-select">
            <option>All Types</option>
            <option>Standalone</option>
            <option>Linked</option>
          </select>
        </div>
        <button className="btn-primary">+ Create Milestone</button>
      </div>

      <div className="milestones-grid">
        {milestones.map(milestone => {
          const status = getMilestoneStatus(milestone)
          const completionPercentage = getCompletionPercentage(milestone)
          
          return (
            <div key={milestone.id} className="milestone-card">
              <div className="milestone-header">
                <div className="milestone-title">
                  <span className="milestone-icon">⭐</span>
                  <h3>{milestone.title}</h3>
                </div>
                <span className={getStatusBadge(status)}>
                  {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              </div>

              <div className="milestone-body">
                <div className="milestone-meta">
                  <div className="meta-item">
                    <span className="meta-label">Type:</span>
                    <span className="meta-value">{milestone.type}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Assignee:</span>
                    <span className="meta-value">{milestone.assignee}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Due Date:</span>
                    <span className="meta-value">{milestone.dueDate}</span>
                  </div>
                </div>

                {milestone.type === 'linked' && (
                  <div className="linked-tasks">
                    <h4>Linked Tasks ({milestone.linkedTasks.length})</h4>
                    <div className="progress-section">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${completionPercentage}%` }}
                        ></div>
                      </div>
                      <span className="progress-text">{completionPercentage}% Complete</span>
                    </div>
                    <div className="task-list">
                      {milestone.linkedTasks.map(task => (
                        <div key={task.id} className="linked-task">
                          <span className={`task-status ${task.status}`}>
                            {task.status === 'completed' ? '✅' : '⏳'}
                          </span>
                          <span className="task-title">{task.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="milestone-actions">
                <button 
                  className="btn-action"
                  onClick={() => setSelectedMilestone(milestone)}
                >
                  View Details
                </button>
                {canConfirmMilestone(milestone) && (
                  <button 
                    className="btn-primary"
                    onClick={() => confirmMilestone(milestone.id)}
                  >
                    Confirm Milestone
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {selectedMilestone && (
        <MilestoneDetail 
          milestone={selectedMilestone}
          onClose={() => setSelectedMilestone(null)}
          onConfirm={confirmMilestone}
          canConfirm={canConfirmMilestone(selectedMilestone)}
        />
      )}
    </div>
  )
}

function MilestoneDetail({ milestone, onClose, onConfirm, canConfirm }) {
  const status = milestone.confirmed ? 'confirmed' : 
                milestone.type === 'standalone' ? milestone.status :
                milestone.linkedTasks.every(task => task.status === 'completed') ? 'ready_for_confirmation' : 'in_progress'

  return (
    <div className="milestone-detail-modal">
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-container">
        <div className="modal-header">
          <h2>
            <span className="milestone-icon">⭐</span>
            {milestone.title}
          </h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          <div className="milestone-info">
            <div className="info-grid">
              <div className="info-item">
                <label>Status:</label>
                <span className={`status-badge ${status}`}>
                  {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              </div>
              <div className="info-item">
                <label>Type:</label>
                <span>{milestone.type}</span>
              </div>
              <div className="info-item">
                <label>Assignee:</label>
                <span>{milestone.assignee}</span>
              </div>
              <div className="info-item">
                <label>Due Date:</label>
                <span>{milestone.dueDate}</span>
              </div>
              <div className="info-item">
                <label>Created By:</label>
                <span>{milestone.createdBy}</span>
              </div>
              <div className="info-item">
                <label>Created:</label>
                <span>{milestone.createdAt}</span>
              </div>
            </div>
          </div>

          {milestone.type === 'linked' && (
            <div className="dependencies-section">
              <h3>Task Dependencies</h3>
              <div className="dependency-list">
                {milestone.linkedTasks.map(task => (
                  <div key={task.id} className="dependency-item">
                    <span className={`dependency-status ${task.status}`}>
                      {task.status === 'completed' ? '✅' : 
                       task.status === 'in-progress' ? '🔄' : '⏳'}
                    </span>
                    <span className="dependency-title">{task.title}</span>
                    <span className={`status-badge ${task.status}`}>
                      {task.status.replace('-', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>Close</button>
          {canConfirm && (
            <button 
              className="btn-primary"
              onClick={() => {
                onConfirm(milestone.id)
                onClose()
              }}
            >
              Confirm Milestone
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
