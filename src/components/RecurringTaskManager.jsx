
import React, { useState } from 'react'

export default function RecurringTaskManager() {
  const [recurringTasks] = useState([
    {
      id: 1,
      title: "Weekly Team Standup",
      frequency: "weekly",
      repeatEvery: 1,
      repeatOnDays: ["Mon"],
      startDate: "2024-01-01",
      endConditionType: "never",
      creator: "Admin User",
      status: "active",
      nextInstance: "2024-01-22",
      totalInstances: 12,
      completedInstances: 8
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
      creator: "Security Team",
      status: "active",
      nextInstance: "2024-02-01",
      totalInstances: 12,
      completedInstances: 1
    },
    {
      id: 3,
      title: "Daily Code Backup",
      frequency: "daily",
      repeatEvery: 1,
      repeatOnDays: [],
      startDate: "2024-01-01",
      endConditionType: "never",
      creator: "DevOps Team",
      status: "paused",
      nextInstance: "N/A",
      totalInstances: 21,
      completedInstances: 21
    }
  ])

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
    return display
  }

  return (
    <div className="recurring-task-manager">
      <div className="page-header">
        <h1>Recurring Tasks</h1>
        <p>Manage and monitor recurring task patterns</p>
      </div>

      <div className="recurring-filters">
        <div className="filter-group">
          <select className="filter-select">
            <option>All Status</option>
            <option>Active</option>
            <option>Paused</option>
            <option>Completed</option>
          </select>
          <select className="filter-select">
            <option>All Frequencies</option>
            <option>Daily</option>
            <option>Weekly</option>
            <option>Monthly</option>
            <option>Yearly</option>
          </select>
        </div>
        <button className="btn-primary">+ Create Recurring Task</button>
      </div>

      <div className="recurring-tasks-grid">
        {recurringTasks.map(task => (
          <div key={task.id} className="recurring-task-card">
            <div className="task-card-header">
              <h3>{task.title}</h3>
              <span className={getStatusBadge(task.status)}>
                {task.status}
              </span>
            </div>
            
            <div className="task-card-body">
              <div className="task-detail">
                <span className="detail-label">Frequency:</span>
                <span className="detail-value">{getFrequencyDisplay(task)}</span>
              </div>
              
              <div className="task-detail">
                <span className="detail-label">Creator:</span>
                <span className="detail-value">{task.creator}</span>
              </div>
              
              <div className="task-detail">
                <span className="detail-label">Next Instance:</span>
                <span className="detail-value">{task.nextInstance}</span>
              </div>
              
              <div className="task-detail">
                <span className="detail-label">Progress:</span>
                <span className="detail-value">
                  {task.completedInstances}/{task.totalInstances} completed
                </span>
              </div>
              
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{width: `${(task.completedInstances / task.totalInstances) * 100}%`}}
                ></div>
              </div>
            </div>
            
            <div className="task-card-actions">
              <button className="btn-action">Edit</button>
              <button className="btn-action">
                {task.status === 'active' ? 'Pause' : 'Resume'}
              </button>
              <button className="btn-action delete">Stop</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
