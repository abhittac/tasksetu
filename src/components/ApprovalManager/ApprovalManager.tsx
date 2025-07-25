
import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store';
import { updateTask } from '../../features/tasks/tasksSlice';
import { Task } from '../../types';
import Button from '../UI/Button';
import Modal from '../UI/Modal';

interface ApprovalReviewModalProps {
  task: Task;
  onClose: () => void;
  onApprove: (taskId: string, comment?: string) => void;
  onReject: (taskId: string, comment: string) => void;
}

const ApprovalReviewModal: React.FC<ApprovalReviewModalProps> = ({
  task,
  onClose,
  onApprove,
  onReject
}) => {
  const [comment, setComment] = useState('');
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);

  const handleSubmit = () => {
    if (action === 'approve') {
      onApprove(task.id, comment);
    } else if (action === 'reject' && comment.trim()) {
      onReject(task.id, comment);
    }
    onClose();
  };

  return (
    <Modal isOpen onClose={onClose} title="Review Approval Task">
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-gray-900">{task.title}</h3>
          <p className="text-gray-600 mt-1">{task.description}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Comments {action === 'reject' && '(Required for rejection)'}
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add your comments..."
          />
        </div>

        <div className="flex gap-3">
          <Button
            variant="primary"
            onClick={() => {
              setAction('approve');
              handleSubmit();
            }}
          >
            Approve
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setAction('reject');
              if (comment.trim()) handleSubmit();
            }}
            disabled={action === 'reject' && !comment.trim()}
          >
            Reject
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

const ApprovalManager: React.FC = () => {
  const dispatch = useAppDispatch();
  const { tasks } = useAppSelector(state => state.tasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const approvalTasks = tasks.filter(task => task.type === 'approval');

  const handleApprove = (taskId: string, comment?: string) => {
    dispatch(updateTask({
      id: taskId,
      updates: {
        status: 'COMPLETED',
        completedAt: new Date().toISOString(),
        approvalStatus: 'approved',
        comments: comment ? [...(tasks.find(t => t.id === taskId)?.comments || []), {
          id: Date.now().toString(),
          text: comment,
          author: 'Current User',
          timestamp: new Date().toISOString()
        }] : undefined
      }
    }));
  };

  const handleReject = (taskId: string, comment: string) => {
    dispatch(updateTask({
      id: taskId,
      updates: {
        status: 'REJECTED',
        approvalStatus: 'rejected',
        comments: [...(tasks.find(t => t.id === taskId)?.comments || []), {
          id: Date.now().toString(),
          text: comment,
          author: 'Current User',
          timestamp: new Date().toISOString()
        }]
      }
    }));
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="text-2xl font-bold text-gray-900">Approval Manager</h1>
        <p className="text-gray-600 mt-1">Review and manage approval tasks</p>
      </div>

      <div className="page-content">
        <div className="space-y-4">
          {approvalTasks.map(task => (
            <div key={task.id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                  <p className="text-gray-600 mt-1">{task.description}</p>
                  <div className="flex items-center gap-4 mt-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      task.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                      task.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {task.status}
                    </span>
                    <span className="text-sm text-gray-500">
                      Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                    </span>
                  </div>
                </div>
                {task.status === 'PENDING' && (
                  <Button
                    variant="primary"
                    onClick={() => setSelectedTask(task)}
                  >
                    Review
                  </Button>
                )}
              </div>
            </div>
          ))}

          {approvalTasks.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📋</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Approval Tasks</h3>
              <p className="text-gray-600">There are no approval tasks to review at the moment.</p>
            </div>
          )}
        </div>
      </div>

      {selectedTask && (
        <ApprovalReviewModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
};

export default ApprovalManager;
