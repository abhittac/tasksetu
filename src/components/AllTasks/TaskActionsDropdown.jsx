
import React, { useState } from "react";

export default function TaskActionsDropdown({ 
  task, 
  onCreateSubtask, 
  onSnooze, 
  onMarkAsRisk, 
  onMarkAsDone, 
  onView, 
  onDelete 
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors p-1"
        onClick={() => setIsOpen(!isOpen)}
        title="More actions"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-8 z-20 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
            <button
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
              onClick={() => {
                onView();
                setIsOpen(false);
              }}
            >
              <span className="text-lg">👁️</span>
              <span className="font-medium">View</span>
            </button>

            <button
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
              onClick={() => {
                onCreateSubtask();
                setIsOpen(false);
              }}
            >
              <span className="text-lg">🔗</span>
              <span className="font-medium">Create Sub-task</span>
            </button>

            <button
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
              onClick={() => {
                onSnooze();
                setIsOpen(false);
              }}
            >
              <span className="text-lg">⏸️</span>
              <span className="font-medium">Snooze</span>
            </button>

            <button
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
              onClick={() => {
                onMarkAsRisk();
                setIsOpen(false);
              }}
            >
              <span className="text-lg">⚠️</span>
              <span className="font-medium">Mark as Risk</span>
            </button>

            <button
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
              onClick={() => {
                onMarkAsDone();
                setIsOpen(false);
              }}
            >
              <span className="text-lg">✅</span>
              <span className="font-medium">Mark as Done</span>
            </button>

            <div className="border-t border-gray-200 my-1"></div>
            
            <button
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
              onClick={() => {
                onDelete();
                setIsOpen(false);
              }}
            >
              <span className="text-lg">🗑️</span>
              <span className="font-medium">Delete</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
