
import React, { useState } from 'react'

export default function ActivityFeed({ taskId }) {
  const [activities] = useState([
    {
      id: 1,
      type: 'task_created',
      user: 'John Smith',
      timestamp: '2024-01-15 09:00',
      details: {
        title: 'Database Migration'
      }
    },
    {
      id: 2,
      type: 'field_updated',
      user: 'Sarah Wilson',
      timestamp: '2024-01-15 10:15',
      details: {
        field: 'status',
        oldValue: 'pending',
        newValue: 'in-progress'
      }
    },
    {
      id: 3,
      type: 'assignment',
      user: 'Mike Johnson',
      timestamp: '2024-01-15 11:30',
      details: {
        assignedTo: 'Emily Davis',
        previousAssignee: 'Mike Johnson'
      }
    },
    {
      id: 4,
      type: 'comment_added',
      user: 'Emily Davis',
      timestamp: '2024-01-15 12:45',
      details: {
        commentPreview: 'I\'ve started working on the database schema...'
      }
    },
    {
      id: 5,
      type: 'file_uploaded',
      user: 'John Smith',
      timestamp: '2024-01-15 14:20',
      details: {
        fileName: 'migration-script.sql',
        fileSize: '15KB'
      }
    },
    {
      id: 6,
      type: 'milestone_updated',
      user: 'Sarah Wilson',
      timestamp: '2024-01-15 16:00',
      details: {
        milestone: 'Database Setup Complete',
        status: 'completed'
      }
    }
  ])

  const getActivityIcon = (type) => {
    const icons = {
      task_created: '✅',
      field_updated: '✏️',
      assignment: '👤',
      comment_added: '💬',
      file_uploaded: '📎',
      file_deleted: '🗑️',
      milestone_updated: '🎯',
      approval_requested: '⏳',
      approval_granted: '✅'
    }
    return icons[type] || '📝'
  }

  const getActivityMessage = (activity) => {
    const { type, user, details } = activity
    
    switch (type) {
      case 'task_created':
        return `${user} created task "${details.title}"`
      case 'field_updated':
        return `${user} updated ${details.field} from "${details.oldValue}" to "${details.newValue}"`
      case 'assignment':
        return `${user} assigned task to ${details.assignedTo}`
      case 'comment_added':
        return `${user} added a comment: "${details.commentPreview}"`
      case 'file_uploaded':
        return `${user} uploaded file "${details.fileName}" (${details.fileSize})`
      case 'file_deleted':
        return `${user} deleted file "${details.fileName}"`
      case 'milestone_updated':
        return `${user} marked milestone "${details.milestone}" as ${details.status}`
      case 'approval_requested':
        return `${user} requested approval from ${details.approver}`
      case 'approval_granted':
        return `${user} approved the task`
      default:
        return `${user} performed an action`
    }
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60))
      return `${diffInMinutes} minutes ago`
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays} days ago`
    }
  }

  return (
    <div className="activity-feed">
      <div className="activity-header">
        <h3>Activity Feed</h3>
        <div className="activity-filters">
          <select className="filter-select small">
            <option value="all">All Activities</option>
            <option value="comments">Comments</option>
            <option value="updates">Field Updates</option>
            <option value="files">File Actions</option>
            <option value="assignments">Assignments</option>
          </select>
        </div>
      </div>

      <div className="activity-timeline">
        {activities.map(activity => (
          <div key={activity.id} className="activity-item">
            <div className="activity-icon">
              {getActivityIcon(activity.type)}
            </div>
            <div className="activity-content">
              <div className="activity-message">
                {getActivityMessage(activity)}
              </div>
              <div className="activity-timestamp">
                {formatTimestamp(activity.timestamp)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
