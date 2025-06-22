
import React, { useState } from 'react'

export default function ApprovalManager() {
  const [currentUser] = useState({ id: 1, name: 'Current User', role: 'manager' })
  const [approvalTasks, setApprovalTasks] = useState([
    {
      id: 1,
      title: "Budget Approval Q1 2024",
      mode: "sequential",
      status: "pending",
      approvers: [
        { id: 1, name: "John Smith", role: "manager", status: "approved", comment: "Looks good", approvedAt: "2024-01-15" },
        { id: 2, name: "Sarah Wilson", role: "director", status: "pending", comment: null, approvedAt: null },
        { id: 3, name: "Mike Johnson", role: "cfo", status: "waiting", comment: null, approvedAt: null }
      ],
      creator: "Emily Davis",
      createdAt: "2024-01-10",
      dueDate: "2024-01-30",
      autoApprove: false,
      description: "Quarterly budget approval for development team"
    },
    {
      id: 2,
      title: "Security Policy Update",
      mode: "all",
      status: "in-progress",
      approvers: [
        { id: 4, name: "Alex Turner", role: "security", status: "approved", comment: "Security measures adequate", approvedAt: "2024-01-12" },
        { id: 5, name: "Lisa Chen", role: "compliance", status: "pending", comment: null, approvedAt: null },
        { id: 6, name: "David Brown", role: "legal", status: "rejected", comment: "Need additional clauses", approvedAt: "2024-01-14" }
      ],
      creator: "Security Team",
      createdAt: "2024-01-08",
      dueDate: "2024-01-25",
      autoApprove: false,
      description: "Updated security policy for remote work guidelines"
    },
    {
      id: 3,
      title: "New Hire Approval",
      mode: "any",
      status: "approved",
      approvers: [
        { id: 7, name: "HR Manager", role: "hr", status: "approved", comment: "Excellent candidate", approvedAt: "2024-01-16" },
        { id: 8, name: "Team Lead", role: "manager", status: "waiting", comment: null, approvedAt: null }
      ],
      creator: "Recruiting Team",
      createdAt: "2024-01-14",
      dueDate: "2024-01-20",
      autoApprove: false,
      description: "Approval for new senior developer position"
    }
  ])

  const getApprovalStatus = (task) => {
    const { approvers, mode } = task
    const approved = approvers.filter(a => a.status === 'approved')
    const rejected = approvers.filter(a => a.status === 'rejected')
    const pending = approvers.filter(a => a.status === 'pending')

    if (rejected.length > 0 && mode !== 'any') return 'rejected'
    
    switch (mode) {
      case 'any':
        return approved.length > 0 ? 'approved' : pending.length > 0 ? 'pending' : 'waiting'
      case 'all':
        return approved.length === approvers.length ? 'approved' : 
               rejected.length > 0 ? 'rejected' : 'pending'
      case 'sequential':
        const currentIndex = approved.length
        if (currentIndex === approvers.length) return 'approved'
        if (rejected.length > 0) return 'rejected'
        return 'pending'
      default:
        return 'pending'
    }
  }

  const canUserApprove = (task, approver) => {
    if (approver.status !== 'pending') return false
    if (task.mode === 'sequential') {
      const approverIndex = task.approvers.findIndex(a => a.id === approver.id)
      const previousApproved = task.approvers.slice(0, approverIndex).every(a => a.status === 'approved')
      return previousApproved
    }
    return true
  }

  const handleApproval = (taskId, approverId, action, comment) => {
    setApprovalTasks(tasks => tasks.map(task => {
      if (task.id !== taskId) return task
      
      const updatedApprovers = task.approvers.map(approver => {
        if (approver.id === approverId) {
          return {
            ...approver,
            status: action,
            comment: comment || null,
            approvedAt: new Date().toISOString().split('T')[0]
          }
        }
        return approver
      })

      return {
        ...task,
        approvers: updatedApprovers,
        status: getApprovalStatus({ ...task, approvers: updatedApprovers })
      }
    }))
  }

  return (
    <div className="approval-manager">
      <div className="page-header">
        <h1>Approval Tasks</h1>
        <p>Manage approval workflows and tasks</p>
      </div>

      <div className="approval-filters">
        <select className="filter-select">
          <option>All Status</option>
          <option>Pending</option>
          <option>Approved</option>
          <option>Rejected</option>
        </select>
        <select className="filter-select">
          <option>All Modes</option>
          <option>Any Approver</option>
          <option>All Approvers</option>
          <option>Sequential</option>
        </select>
        <button className="btn-primary">+ Create Approval Task</button>
      </div>

      <div className="approval-tasks-grid">
        {approvalTasks.map(task => (
          <ApprovalTaskCard 
            key={task.id} 
            task={task} 
            currentUser={currentUser}
            onApproval={handleApproval}
          />
        ))}
      </div>
    </div>
  )
}

function ApprovalTaskCard({ task, currentUser, onApproval }) {
  const [showApprovalModal, setShowApprovalModal] = useState(false)
  const [selectedApprover, setSelectedApprover] = useState(null)

  const overallStatus = getApprovalStatus(task)
  const userApprover = task.approvers.find(a => a.id === currentUser.id)
  const canApprove = userApprover && canUserApprove(task, userApprover)

  const handleApproveClick = (approver) => {
    setSelectedApprover(approver)
    setShowApprovalModal(true)
  }

  return (
    <>
      <div className="approval-task-card">
        <div className="task-card-header">
          <h3>{task.title}</h3>
          <span className={`status-badge ${overallStatus}`}>
            {overallStatus}
          </span>
        </div>

        <div className="task-card-body">
          <p className="task-description">{task.description}</p>
          
          <div className="approval-info">
            <div className="info-row">
              <span className="label">Mode:</span>
              <span className="value">{task.mode}</span>
            </div>
            <div className="info-row">
              <span className="label">Due Date:</span>
              <span className="value">{task.dueDate}</span>
            </div>
            <div className="info-row">
              <span className="label">Creator:</span>
              <span className="value">{task.creator}</span>
            </div>
          </div>

          <div className="approval-chain">
            <h4>Approval Chain</h4>
            {task.approvers.map((approver, index) => (
              <div key={approver.id} className="approver-item">
                <div className="approver-info">
                  <span className="approver-icon">
                    {approver.status === 'approved' ? '✅' : 
                     approver.status === 'rejected' ? '❌' : 
                     approver.status === 'pending' ? '⏳' : '⏸️'}
                  </span>
                  <span className="approver-name">{approver.name}</span>
                  <span className="approver-role">({approver.role})</span>
                </div>
                
                {approver.status === 'pending' && canUserApprove(task, approver) && approver.id === currentUser.id && (
                  <div className="approval-actions">
                    <button 
                      className="btn-approve"
                      onClick={() => handleApproveClick(approver)}
                    >
                      Review
                    </button>
                  </div>
                )}
                
                {approver.comment && (
                  <div className="approver-comment">
                    <small>"{approver.comment}"</small>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {showApprovalModal && (
        <ApprovalModal
          task={task}
          approver={selectedApprover}
          onApproval={onApproval}
          onClose={() => {
            setShowApprovalModal(false)
            setSelectedApprover(null)
          }}
        />
      )}
    </>
  )
}

function ApprovalModal({ task, approver, onApproval, onClose }) {
  const [comment, setComment] = useState('')
  const [action, setAction] = useState('')

  const handleSubmit = (selectedAction) => {
    if (!comment.trim() && selectedAction === 'rejected') {
      alert('Please provide a comment for rejection')
      return
    }
    
    onApproval(task.id, approver.id, selectedAction, comment)
    onClose()
  }

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>Review: {task.title}</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-content">
          <div className="approval-details">
            <p><strong>Description:</strong> {task.description}</p>
            <p><strong>Mode:</strong> {task.mode}</p>
            <p><strong>Due Date:</strong> {task.dueDate}</p>
          </div>

          <div className="form-group">
            <label>Comment (optional for approval, required for rejection):</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add your review comment..."
              className="form-input"
              rows="4"
            />
          </div>
          
          <div className="modal-actions">
            <button 
              className="btn-secondary" 
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              className="btn-danger"
              onClick={() => handleSubmit('rejected')}
            >
              Reject
            </button>
            <button 
              className="btn-success"
              onClick={() => handleSubmit('approved')}
            >
              Approve
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function getApprovalStatus(task) {
  const { approvers, mode } = task
  const approved = approvers.filter(a => a.status === 'approved')
  const rejected = approvers.filter(a => a.status === 'rejected')
  const pending = approvers.filter(a => a.status === 'pending')

  if (rejected.length > 0 && mode !== 'any') return 'rejected'
  
  switch (mode) {
    case 'any':
      return approved.length > 0 ? 'approved' : pending.length > 0 ? 'pending' : 'waiting'
    case 'all':
      return approved.length === approvers.length ? 'approved' : 
             rejected.length > 0 ? 'rejected' : 'pending'
    case 'sequential':
      const currentIndex = approved.length
      if (currentIndex === approvers.length) return 'approved'
      if (rejected.length > 0) return 'rejected'
      return 'pending'
    default:
      return 'pending'
  }
}

function canUserApprove(task, approver) {
  if (approver.status !== 'pending') return false
  if (task.mode === 'sequential') {
    const approverIndex = task.approvers.findIndex(a => a.id === approver.id)
    const previousApproved = task.approvers.slice(0, approverIndex).every(a => a.status === 'approved')
    return previousApproved
  }
  return true
}
