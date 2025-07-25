
import React, { useState } from 'react';

export default function TaskDeleteConfirmationModal({ task, options, onConfirm, onCancel, currentUser }) {
  const [deleteOptions, setDeleteOptions] = useState({
    deleteSubtasks: false,
    deleteAttachments: false,
    deleteLinkedItems: false,
    ...options
  });

  const handleConfirm = () => {
    onConfirm(deleteOptions);
  };

  const handleOptionChange = (option, value) => {
    setDeleteOptions(prev => ({
      ...prev,
      [option]: value
    }));
  };

  const hasSubtasks = task.subtasks && task.subtasks.length > 0;
  const hasAttachments = task.attachments && task.attachments.length > 0;
  const hasLinkedItems = task.linkedItems && task.linkedItems.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overlay-animate">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md modal-animate-slide-right">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Task</h3>
              <p className="text-sm text-gray-600">This action cannot be undone</p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-gray-900 mb-2">
              Are you sure you want to delete the task:
            </p>
            <p className="font-medium text-gray-900 bg-gray-50 p-3 rounded-lg">
              "{task.title}"
            </p>
          </div>

          {(hasSubtasks || hasAttachments || hasLinkedItems) && (
            <div className="mb-6 space-y-3">
              <p className="text-sm font-medium text-gray-700">Additional Options:</p>
              
              {hasSubtasks && (
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={deleteOptions.deleteSubtasks}
                    onChange={(e) => handleOptionChange('deleteSubtasks', e.target.checked)}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    Delete {task.subtasks.length} sub-task{task.subtasks.length !== 1 ? 's' : ''}
                  </span>
                </label>
              )}

              {hasAttachments && (
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={deleteOptions.deleteAttachments}
                    onChange={(e) => handleOptionChange('deleteAttachments', e.target.checked)}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    Delete attachments
                  </span>
                </label>
              )}

              {hasLinkedItems && (
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={deleteOptions.deleteLinkedItems}
                    onChange={(e) => handleOptionChange('deleteLinkedItems', e.target.checked)}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    Delete linked items
                  </span>
                </label>
              )}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
