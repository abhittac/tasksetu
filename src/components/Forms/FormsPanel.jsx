
import React, { useState } from 'react';
import AddFormModal from './AddFormModal';

function FormsPanel({ forms, taskId }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState("all");

  const filteredForms = forms.filter((form) => {
    if (filter === "all") return true;
    return form.status === filter;
  });

  const getFormIcon = (type) => {
    const icons = {
      checklist: "✅",
      survey: "📊",
      approval: "👍",
      feedback: "💬",
      assessment: "📝",
    };
    return icons[type] || "📄";
  };

  const getStatusColor = (status) => {
    const colors = {
      "not-started": "bg-gray-100 text-gray-800",
      "in-progress": "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      overdue: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getFormTypeColor = (type) => {
    const colors = {
      checklist: "bg-green-100 text-green-800",
      survey: "bg-blue-100 text-blue-800",
      approval: "bg-purple-100 text-purple-800",
      feedback: "bg-orange-100 text-orange-800",
      assessment: "bg-indigo-100 text-indigo-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  const handleAddForm = (formData) => {
    const newForm = {
      id: Date.now(),
      ...formData,
      status: 'not-started',
      progress: 0,
      taskId
    };
    console.log('Adding form:', newForm);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-lg">📋</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Attached Forms ({filteredForms.length})
            </h2>
            <p className="text-sm text-gray-600">
              Forms, checklists, and interactive documents
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="form-select text-sm"
          >
            <option value="all">All Status</option>
            <option value="not-started">Not Started</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="overdue">Overdue</option>
          </select>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary flex items-center gap-2 px-4 py-2"
          >
            <span className="text-sm">📋</span>
            <span>Add Form</span>
          </button>
        </div>
      </div>

      {/* Forms Grid */}
      {filteredForms.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredForms.map((form) => (
            <div
              key={form.id}
              className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center text-xl">
                    {getFormIcon(form.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 mb-2 truncate group-hover:text-emerald-600 transition-colors">
                      {form.title}
                    </h4>
                    <div className="flex flex-col gap-1">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium w-fit ${getFormTypeColor(form.type)}`}
                      >
                        {form.type}
                      </span>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium w-fit ${getStatusColor(form.status)}`}
                      >
                        {form.status.replace("-", " ")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              {form.progress !== undefined && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{form.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${form.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => console.log("View form:", form.id)}
                  className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                >
                  <span>👁️</span>
                  <span>View</span>
                </button>
                <button
                  onClick={() => console.log("Edit form:", form.id)}
                  className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                >
                  <span>✏️</span>
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => console.log("Remove form:", form.id)}
                  className="w-10 h-10 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm transition-colors flex items-center justify-center"
                  title="Remove Form"
                >
                  <span>🗑️</span>
                </button>
              </div>

              {/* Additional Form Info */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Created: Today</span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Active
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📋</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No forms attached
          </h3>
          <p className="text-gray-600 mb-4">
            Add forms, checklists, or surveys to collect structured data
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary flex items-center gap-2 px-4 py-2 mx-auto"
          >
            <span className="text-sm">📋</span>
            <span>Add Form</span>
          </button>
        </div>
      )}

      <AddFormModal 
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddForm}
      />
    </div>
  );
}

export default FormsPanel;
