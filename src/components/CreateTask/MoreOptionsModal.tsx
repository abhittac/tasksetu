
```tsx
import React, { useState } from "react";
import { MoreOptionsData } from "../../types";

interface MoreOptionsModalProps {
  data: MoreOptionsData;
  onChange: (field: keyof MoreOptionsData, value: any) => void;
  onClose: () => void;
  onSave: () => void;
}

const MoreOptionsModal: React.FC<MoreOptionsModalProps> = ({
  data,
  onChange,
  onClose,
  onSave,
}) => {
  const [searchTerms, setSearchTerms] = useState({
    process: "",
    form: "",
    dependencies: "",
  });

  const referenceProcesses = [
    { id: "sop001", name: "Customer Onboarding SOP" },
    { id: "sop002", name: "Bug Report Workflow" },
    { id: "sop003", name: "Feature Request Process" },
    { id: "sop004", name: "Quality Assurance Checklist" },
    { id: "sop005", name: "Deployment Process" },
  ];

  const customForms = [
    { id: "form001", name: "Bug Report Form" },
    { id: "form002", name: "Feature Request Form" },
    { id: "form003", name: "Customer Feedback Form" },
    { id: "form004", name: "Project Evaluation Form" },
    { id: "form005", name: "Performance Review Form" },
  ];

  const existingTasks = [
    { id: "task001", name: "Setup Development Environment" },
    { id: "task002", name: "Design Database Schema" },
    { id: "task003", name: "Create API Endpoints" },
    { id: "task004", name: "Write Unit Tests" },
    { id: "task005", name: "User Interface Design" },
  ];

  const filteredProcesses = referenceProcesses.filter((process) =>
    process.name.toLowerCase().includes(searchTerms.process.toLowerCase())
  );

  const filteredForms = customForms.filter((form) =>
    form.name.toLowerCase().includes(searchTerms.form.toLowerCase())
  );

  const filteredTasks = existingTasks.filter((task) =>
    task.name.toLowerCase().includes(searchTerms.dependencies.toLowerCase())
  );

  const handleDependencyToggle = (taskId: string) => {
    const currentDeps = data.dependencies || [];
    const newDeps = currentDeps.includes(taskId)
      ? currentDeps.filter((id) => id !== taskId)
      : [...currentDeps, taskId];
    onChange("dependencies", newDeps);
  };

  const handleSave = () => {
    onSave();
  };

  return (
    <>
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">More Options</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold w-8 h-8 flex items-center justify-center"
          >
            ×
          </button>
        </div>
        <p className="text-gray-600 mt-1">Configure advanced task settings</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Reference Process */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reference Process
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search for a process..."
              value={searchTerms.process}
              onChange={(e) =>
                setSearchTerms((prev) => ({ ...prev, process: e.target.value }))
              }
              className="form-input mb-2"
            />
            <select
              value={data.referenceProcess}
              onChange={(e) => onChange("referenceProcess", e.target.value)}
              className="form-select"
            >
              <option value="">Select a process...</option>
              {filteredProcesses.map((process) => (
                <option key={process.id} value={process.id}>
                  {process.name}
                </option>
              ))}
            </select>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Link this task to an existing process (e.g., SOP or workflow)
          </p>
        </div>

        {/* Custom Form */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Custom Form
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search for a form..."
              value={searchTerms.form}
              onChange={(e) =>
                setSearchTerms((prev) => ({ ...prev, form: e.target.value }))
              }
              className="form-input mb-2"
            />
            <select
              value={data.customForm}
              onChange={(e) => onChange("customForm", e.target.value)}
              className="form-select"
            >
              <option value="">Select a form...</option>
              {filteredForms.map((form) => (
                <option key={form.id} value={form.id}>
                  {form.name}
                </option>
              ))}
            </select>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Choose a predefined form to collect data for this task
          </p>
        </div>

        {/* Dependencies */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dependencies
          </label>
          <input
            type="text"
            placeholder="Search for tasks..."
            value={searchTerms.dependencies}
            onChange={(e) =>
              setSearchTerms((prev) => ({
                ...prev,
                dependencies: e.target.value,
              }))
            }
            className="form-input mb-2"
          />
          <div className="border border-gray-300 rounded-lg max-h-40 overflow-y-auto">
            {filteredTasks.map((task) => (
              <label
                key={task.id}
                className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              >
                <input
                  type="checkbox"
                  checked={data.dependencies?.includes(task.id) || false}
                  onChange={() => handleDependencyToggle(task.id)}
                  className="mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-900">{task.name}</span>
              </label>
            ))}
            {filteredTasks.length === 0 && (
              <div className="p-3 text-sm text-gray-500 text-center">
                No tasks found
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Select existing tasks that must be completed before this one starts
          </p>
        </div>

        {/* Task Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Task Type *
          </label>
          <select
            value={data.taskTypeAdvanced}
            onChange={(e) => onChange("taskTypeAdvanced", e.target.value)}
            className="form-select"
            required
          >
            <option value="simple">Simple</option>
            <option value="recurring">Recurring</option>
            <option value="approval">Approval</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Determines the task behavior
          </p>
        </div>
      </div>

      {/* Modal Actions */}
      <div className="p-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3 sm:justify-between">
        <button type="button" onClick={onClose} className="btn btn-secondary">
          Cancel
        </button>
        <button type="button" onClick={handleSave} className="btn btn-primary">
          Save Options
        </button>
      </div>
    </>
  );
};

export default MoreOptionsModal;
```
