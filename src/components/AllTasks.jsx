
import React, { useState } from 'react'
import TaskDetail from './TaskDetail'

export default function AllTasks() {
  const [selectedTaskId, setSelectedTaskId] = useState(null)
  const [showSnoozeModal, setShowSnoozeModal] = useState(false)
  const [taskToSnooze, setTaskToSnooze] = useState(null)
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
        <button className="btn-primary">+ Add Task</button>
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
