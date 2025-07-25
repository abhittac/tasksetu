
import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store';
import { updateTask } from '../../features/tasks/tasksSlice';
import { Task } from '../../types';
import Button from '../UI/Button';

const MilestoneManager: React.FC = () => {
  const dispatch = useAppDispatch();
  const { tasks } = useAppSelector(state => state.tasks);

  const milestones = tasks.filter(task => task.type === 'milestone');

  const handleMarkAchieved = (milestoneId: string) => {
    dispatch(updateTask({
      id: milestoneId,
      updates: {
        status: 'COMPLETED',
        completedAt: new Date().toISOString()
      }
    }));
  };

  const getMilestoneProgress = (milestone: Task) => {
    if (!milestone.linkedTasks || milestone.linkedTasks.length === 0) {
      return { completed: 0, total: 0, percentage: 0 };
    }

    const linkedTasks = tasks.filter(task => milestone.linkedTasks?.includes(task.id));
    const completed = linkedTasks.filter(task => task.status === 'COMPLETED').length;
    const total = linkedTasks.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { completed, total, percentage };
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="text-2xl font-bold text-gray-900">Milestone Manager</h1>
        <p className="text-gray-600 mt-1">Track and manage project milestones</p>
      </div>

      <div className="page-content">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {milestones.map(milestone => {
            const progress = getMilestoneProgress(milestone);
            const isReady = milestone.milestoneType === 'linked' && progress.percentage === 100;

            return (
              <div key={milestone.id} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🎯</span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{milestone.title}</h3>
                      <p className="text-sm text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    milestone.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                    isReady ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {milestone.status === 'COMPLETED' ? 'ACHIEVED' :
                     isReady ? 'READY' :
                     milestone.milestoneType?.toUpperCase() || 'STANDALONE'}
                  </span>
                </div>

                {milestone.milestoneType === 'linked' && (
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Progress</span>
                      <span className="text-sm text-gray-600">
                        {progress.completed}/{progress.total} tasks completed
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          progress.percentage === 100 ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${progress.percentage}%` }}
                      />
                    </div>
                    <div className="text-right text-sm text-gray-600 mt-1">
                      {progress.percentage}%
                    </div>
                  </div>
                )}

                {milestone.dueDate && (
                  <div className="mb-4">
                    <span className="text-sm text-gray-500">
                      Due: {new Date(milestone.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {milestone.status !== 'COMPLETED' && (
                  <div className="flex gap-2">
                    {milestone.milestoneType === 'standalone' || isReady ? (
                      <Button
                        variant="primary"
                        onClick={() => handleMarkAchieved(milestone.id)}
                        className={isReady ? 'animate-pulse' : ''}
                      >
                        {isReady ? 'Mark as Achieved' : 'Mark as Achieved'}
                      </Button>
                    ) : (
                      <Button variant="secondary" disabled>
                        Waiting for dependencies
                      </Button>
                    )}
                  </div>
                )}

                {isReady && milestone.status !== 'COMPLETED' && (
                  <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm text-blue-800 font-medium">
                      🎉 READY FOR ACHIEVEMENT - All linked tasks completed!
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {milestones.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏁</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Milestones</h3>
            <p className="text-gray-600">Create milestones to track important project achievements.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MilestoneManager;
