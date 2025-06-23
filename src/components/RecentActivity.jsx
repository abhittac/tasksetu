
import React from 'react'

export default function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: 'task_completed',
      message: 'Task "Website Redesign" completed',
      user: 'John Doe',
      time: '2 hours ago',
      icon: '✅'
    },
    {
      id: 2,
      type: 'task_created',
      message: 'New task "Database Migration" created',
      user: 'Sarah Smith',
      time: '4 hours ago',
      icon: '➕'
    },
    {
      id: 3,
      type: 'task_updated',
      message: 'Task "API Development" updated',
      user: 'Mike Johnson',
      time: '6 hours ago',
      icon: '✏️'
    },
    {
      id: 4,
      type: 'comment_added',
      message: 'Comment added to "User Testing"',
      user: 'Lisa Wilson',
      time: '8 hours ago',
      icon: '💬'
    }
  ]

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
      </div>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm">{activity.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">{activity.message}</p>
              <p className="text-xs text-gray-500">by {activity.user} • {activity.time}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View all activity →
        </button>
      </div>
    </div>
  )
}
