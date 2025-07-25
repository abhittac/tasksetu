
```tsx
import React from "react";
import { TaskFormData } from "../../types";
import { calculateDueDateFromPriority } from "../PriorityManager";

interface RegularTaskFormProps {
  formData: TaskFormData;
  isManualDueDate: boolean;
  onInputChange: (field: keyof TaskFormData, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose?: () => void;
  onShowMoreOptions: () => void;
  setIsManualDueDate: (manual: boolean) => void;
}

const RegularTaskForm: React.FC<RegularTaskFormProps> = ({
  formData,
  isManualDueDate,
  onInputChange,
  onSubmit,
  onClose,
  onShowMoreOptions,
  setIsManualDueDate,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-bold text-gray-900 mb-1">Task Details</h3>
          <p className="text-gray-600 text-sm">
            Fill in the basic information for your task
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Title */}
          <div className="lg:col-span-2">
            <label className="form-label">Task Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => onInputChange("title", e.target.value)}
              className="form-input"
              placeholder="Enter task title..."
              required
            />
          </div>

          {/* Description */}
          <div className="lg:col-span-2">
            <label className="form-label">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => onInputChange("description", e.target.value)}
              className="form-textarea"
              placeholder="Describe the task..."
              rows={4}
            />
          </div>

          {/* Assignee */}
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assign to
            </label>
            <select
              value={formData.assignee}
              onChange={(e) => onInputChange("assignee", e.target.value)}
              className="form-select"
            >
              <option value="">Select assignee...</option>
              <option value="john">John Doe</option>
              <option value="jane">Jane Smith</option>
              <option value="mike">Mike Johnson</option>
              <option value="sarah">Sarah Wilson</option>
            </select>
          </div>

          {/* Priority */}
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => onInputChange("priority", e.target.value)}
              className="form-select"
            >
              <option value="low">Low (30 days)</option>
              <option value="medium">Medium (14 days)</option>
              <option value="high">High (7 days)</option>
              <option value="critical">Critical (2 days)</option>
              <option value="urgent">Urgent (2 days)</option>
            </select>
          </div>

          {/* Status */}
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Initial Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => onInputChange("status", e.target.value)}
              className="form-select"
            >
              <option value="todo">To Do</option>
              <option value="progress">In Progress</option>
              <option value="review">In Review</option>
            </select>
          </div>

          {/* Category */}
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => onInputChange("category", e.target.value)}
              className="form-select"
            >
              <option value="">Select category...</option>
              <option value="development">Development</option>
              <option value="design">Design</option>
              <option value="research">Research</option>
              <option value="marketing">Marketing</option>
              <option value="support">Support</option>
            </select>
          </div>

          {/* Due Date */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Due Date
              {!isManualDueDate && (
                <span className="text-xs text-blue-600 ml-2">
                  (Auto-calculated from priority)
                </span>
              )}
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => onInputChange("dueDate", e.target.value)}
              className="form-input"
            />
            {!isManualDueDate && (
              <p className="text-xs text-gray-500 mt-1">
                Due date automatically calculated based on selected priority.
                Change manually to override.
              </p>
            )}
            {isManualDueDate && (
              <div className="flex items-center mt-1">
                <p className="text-xs text-gray-500">Manual override active.</p>
                <button
                  type="button"
                  onClick={() => {
                    setIsManualDueDate(false);
                    const calculatedDueDate = calculateDueDateFromPriority(
                      formData.priority
                    );
                    onInputChange("dueDate", calculatedDueDate);
                  }}
                  className="text-xs text-blue-600 hover:text-blue-800 ml-2 underline"
                >
                  Reset to auto-calculate
                </button>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => onInputChange("tags", e.target.value)}
              className="form-input"
              placeholder="Enter tags separated by commas..."
            />
            <p className="mt-1 text-xs text-gray-500">
              Separate multiple tags with commas
            </p>
          </div>
        </div>
      </div>

      {/* File Attachments */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Attachments
        </h3>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="mt-4">
            <label className="cursor-pointer">
              <span className="text-primary-600 hover:text-primary-500">
                Upload files
              </span>
              <input type="file" className="sr-only" multiple />
            </label>
            <p className="text-gray-500"> or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500 mt-2">PNG, JPG, PDF up to 10MB</p>
        </div>
      </div>

      {/* More Options Button */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Advanced Options
            </h3>
            <p className="text-sm text-gray-600">
              Configure additional task settings
            </p>
          </div>
          <button
            type="button"
            onClick={onShowMoreOptions}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <span>⚙️</span>
            <span>More Options</span>
          </button>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>
        <div>
          <button type="button" className="btn btn-secondary mr-1">
            Save as Draft
          </button>
          <button type="submit" className="btn btn-primary">
            Create Task
          </button>
        </div>
      </div>
    </form>
  );
};

export default RegularTaskForm;
```
