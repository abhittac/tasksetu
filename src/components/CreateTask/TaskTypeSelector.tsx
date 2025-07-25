
```tsx
import React from "react";

interface TaskTypeSelectorProps {
  taskType: "regular" | "recurring" | "milestone";
  setTaskType: (type: "regular" | "recurring" | "milestone") => void;
}

const TaskTypeSelector: React.FC<TaskTypeSelectorProps> = ({
  taskType,
  setTaskType,
}) => {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Task Type</h3>
        <p className="text-gray-600">
          Choose the type of task you want to create
        </p>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-3 gap-3">
        <button
          onClick={() => setTaskType("regular")}
          className={`p-3 border-2 rounded-xl text-left transition-all duration-300 group ${
            taskType === "regular"
              ? "border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-md transform scale-102"
              : "border-gray-200 hover:border-blue-300 hover:shadow-sm hover:transform hover:scale-101"
          }`}
        >
          <div className="flex items-center space-x-3">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                taskType === "regular"
                  ? "bg-blue-500 text-white"
                  : "bg-blue-100 text-blue-600 group-hover:bg-blue-200"
              }`}
            >
              <span className="text-sm">📋</span>
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-semibold text-gray-900 group-hover:text-blue-700">
                Regular Task
              </h4>
              <p className="text-xs text-gray-500 group-hover:text-gray-600 truncate">
                Standard one-time task
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setTaskType("recurring")}
          className={`p-3 border-2 rounded-xl text-left transition-all duration-300 group ${
            taskType === "recurring"
              ? "border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-md transform scale-102"
              : "border-gray-200 hover:border-green-300 hover:shadow-sm hover:transform hover:scale-101"
          }`}
        >
          <div className="flex items-center space-x-3">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                taskType === "recurring"
                  ? "bg-green-500 text-white"
                  : "bg-green-100 text-green-600 group-hover:bg-green-200"
              }`}
            >
              <span className="text-sm">🔄</span>
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-semibold text-gray-900 group-hover:text-green-700">
                Recurring Task
              </h4>
              <p className="text-xs text-gray-500 group-hover:text-gray-600 truncate">
                Repeats on schedule
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setTaskType("milestone")}
          className={`p-3 border-2 rounded-xl text-left transition-all duration-300 group ${
            taskType === "milestone"
              ? "border-purple-500 bg-gradient-to-br from-purple-50 to-violet-50 shadow-md transform scale-102"
              : "border-gray-200 hover:border-purple-300 hover:shadow-sm hover:transform hover:scale-101"
          }`}
        >
          <div className="flex items-center space-x-3">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                taskType === "milestone"
                  ? "bg-purple-500 text-white"
                  : "bg-purple-100 text-purple-600 group-hover:bg-purple-200"
              }`}
            >
              <span className="text-sm">🎯</span>
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-semibold text-gray-900 group-hover:text-purple-700">
                Milestone
              </h4>
              <p className="text-xs text-gray-500 group-hover:text-gray-600 truncate">
                Project checkpoint
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default TaskTypeSelector;
```
