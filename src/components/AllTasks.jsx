
import React from 'react'

export default function AllTasks() {
  const tasks = [
    {
      id: 1,
      title: "Database Migration",
      status: "completed",
      priority: "high",
      assignee: "John Smith",
      dueDate: "2024-01-15",
      category: "Backend"
    },
    {
      id: 2,
      title: "Mobile App Redesign",
      status: "in-progress",
      priority: "medium",
      assignee: "Sarah Wilson",
      dueDate: "2024-01-20",
      category: "Design"
    },
    {
      id: 3,
      title: "API Documentation",
      status: "pending",
      priority: "low",
      assignee: "Mike Johnson",
      dueDate: "2024-01-25",
      category: "Documentation"
    },
    {
      id: 4,
      title: "Security Audit",
      status: "in-progress",
      priority: "high",
      assignee: "Emily Davis",
      dueDate: "2024-01-18",
      category: "Security"
    }
  ]

  return (
    <div className="all-tasks">
      <div className="page-header">
        <h1>All Tasks</h1>
        <p>Manage and track all project tasks</p>
      </div>

      <div className="tasks-filters">
        <div className="filter-group">
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
        
        {tasks.map(task => (
          <div key={task.id} className="table-row">
            <div className="td task-title">{task.title}</div>
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
                <button className="btn-action">Edit</button>
                <button className="btn-action">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
