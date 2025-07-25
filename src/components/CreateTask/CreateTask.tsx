
```tsx
import React, { useState, useEffect } from "react";
import { calculateDueDateFromPriority } from "../PriorityManager";
import RecurringTaskManager from "../RecurringTaskManager";
import MilestoneManager from "../MilestoneManager/MilestoneManager";
import { TaskFormData, MoreOptionsData } from "../../types";
import TaskTypeSelector from "./TaskTypeSelector";
import RegularTaskForm from "./RegularTaskForm";
import MoreOptionsModal from "./MoreOptionsModal";

interface CreateTaskProps {
  onClose?: () => void;
  initialTaskType?: "regular" | "recurring" | "milestone";
  preFilledDate?: string | null;
}

const CreateTask: React.FC<CreateTaskProps> = ({
  onClose,
  initialTaskType = "regular",
  preFilledDate = null,
}) => {
  const [taskType, setTaskType] = useState(initialTaskType);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
    assignee: "",
    priority: "medium",
    status: "todo",
    dueDate: preFilledDate || "",
    category: "",
    tags: "",
    attachments: [],
  });
  const [isManualDueDate, setIsManualDueDate] = useState(false);
  const [moreOptionsData, setMoreOptionsData] = useState<MoreOptionsData>({
    referenceProcess: "",
    customForm: "",
    dependencies: [],
    taskTypeAdvanced: "simple",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating task:", formData);
    if (onClose) onClose();
  };

  useEffect(() => {
    if (!isManualDueDate && formData.priority) {
      const calculatedDueDate = calculateDueDateFromPriority(formData.priority);
      setFormData((prev) => ({
        ...prev,
        dueDate: calculatedDueDate,
      }));
    }
  }, [formData.priority, isManualDueDate]);

  const handleInputChange = (field: keyof TaskFormData, value: any) => {
    if (field === "dueDate") {
      setIsManualDueDate(true);
    }
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMoreOptionsChange = (field: keyof MoreOptionsData, value: any) => {
    setMoreOptionsData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="create-task-container">
      <TaskTypeSelector taskType={taskType} setTaskType={setTaskType} />

      {taskType === "regular" && (
        <RegularTaskForm
          formData={formData}
          isManualDueDate={isManualDueDate}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          onClose={onClose}
          onShowMoreOptions={() => setShowMoreOptions(true)}
          setIsManualDueDate={setIsManualDueDate}
        />
      )}

      {taskType === "recurring" && <RecurringTaskManager onClose={onClose} />}

      {taskType === "milestone" && <MilestoneManager onClose={onClose} />}

      {showMoreOptions && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4 overlay-animate">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto modal-animate-slide-right">
            <MoreOptionsModal
              data={moreOptionsData}
              onChange={handleMoreOptionsChange}
              onClose={() => setShowMoreOptions(false)}
              onSave={() => setShowMoreOptions(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateTask;
```
