
import React from 'react'

export default function RecentActivity() {
  const activities = [
    {
      user: "John Smith",
      action: "completed task",
      target: "Database Migration",
      time: "2 minutes ago",
      avatar: "👤"
    },
    {
      user: "Sarah Wilson",
      action: "created project",
      target: "Mobile App Redesign",
      time: "15 minutes ago",
      avatar: "👤"
    },
    {
      user: "Mike Johnson",
      action: "assigned task",
      target: "API Documentation",
      time: "1 hour ago",
      avatar: "👤"
    },
    {
      user: "Emily Davis",
      action: "updated project",
      target: "Website Optimization",
      time: "2 hours ago",
      avatar: "👤"
    },
    {
      user: "David Brown",
      action: "completed milestone",
      target: "Phase 1 Development",
      time: "3 hours ago",
      avatar: "👤"
    }
  ]

  return (
    <div className="recent-activity">
      <h3>Recent Activity</h3>
      <div className="activity-list">
        {activities.map((activity, index) => (
          <div key={index} className="activity-item">
            <div className="activity-avatar">{activity.avatar}</div>
            <div className="activity-content">
              <div className="activity-text">
                <strong>{activity.user}</strong> {activity.action} <span className="activity-target">{activity.target}</span>
              </div>
              <div className="activity-time">{activity.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
