
import React from 'react'

export default function Deadlines() {
  const deadlines = [
    {
      title: "Mobile App Beta Release",
      priority: "high",
      category: "Website Development",
      date: "2024-01-10"
    },
    {
      title: "Security Audit Report",
      priority: "medium",
      category: "Security Review",
      date: "2024-01-18"
    },
    {
      title: "User Testing Phase 2",
      priority: "high",
      category: "UX Research",
      date: "2024-01-20"
    },
    {
      title: "Database Performance Optimization",
      priority: "medium",
      category: "Backend Infrastructure",
      date: "2024-01-22"
    }
  ]

  return (
    <div className="deadlines">
      <h3>Deadlines</h3>
      <div className="deadlines-list">
        {deadlines.map((deadline, index) => (
          <div key={index} className="deadline-item">
            <div className="deadline-content">
              <div className="deadline-title">{deadline.title}</div>
              <div className="deadline-category">{deadline.category}</div>
              <div className="deadline-date">{deadline.date}</div>
            </div>
            <div className={`deadline-priority ${deadline.priority}`}>
              {deadline.priority}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
