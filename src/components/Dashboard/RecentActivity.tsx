
import React from 'react';
import { useAppSelector } from '../../store';
import { formatDistanceToNow } from '../../lib/utils';

interface Activity {
  id: string;
  type: 'task_created' | 'task_completed' | 'task_updated' | 'comment_added';
  message: string;
  timestamp: string;
  user?: string;
}

const RecentActivity: React.FC = () => {
  const tasks = useAppSelector(state => state.tasks.tasks);

  // Generate recent activities from tasks
  const activities: Activity[] = React.useMemo(() => {
    const recentTasks = tasks
      .slice()
      .sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime())
      .slice(0, 5);

    return recentTasks.map(task => ({
      id: task.id,
      type: task.status === 'COMPLETED' ? 'task_completed' : 'task_updated',
      message: task.status === 'COMPLETED' 
        ? `Completed task: ${task.title}`
        : `Updated task: ${task.title}`,
      timestamp: task.updatedAt || task.createdAt,
      user: task.assignee
    }));
  }, [tasks]);

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'task_created': return '➕';
      case 'task_completed': return '✅';
      case 'task_updated': return '📝';
      case 'comment_added': return '💬';
      default: return '📋';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No recent activity</p>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm">{getActivityIcon(activity.type)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{activity.message}</p>
                {activity.user && (
                  <p className="text-xs text-gray-500">by {activity.user}</p>
                )}
                <p className="text-xs text-gray-400">
                  {formatDistanceToNow(new Date(activity.timestamp))} ago
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
