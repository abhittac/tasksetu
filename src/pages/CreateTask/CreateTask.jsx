
import React, { useState } from 'react';
import { TaskTypeSelector, RegularTaskForm } from '../../components/Forms';
import { Modal } from '../../components/UI';

const CreateTask = ({ isOpen, onClose }) => {
  const [selectedType, setSelectedType] = useState('regular');

  const handleTaskSubmit = (taskData) => {
    console.log('Creating task:', { type: selectedType, data: taskData });
    // Here you would typically send the data to your API
    onClose();
  };

  const renderTaskForm = () => {
    switch (selectedType) {
      case 'regular':
        return (
          <RegularTaskForm 
            onSubmit={handleTaskSubmit}
            onCancel={onClose}
          />
        );
      case 'recurring':
        return <div className="p-6 text-center text-gray-500">Recurring task form coming soon...</div>;
      case 'milestone':
        return <div className="p-6 text-center text-gray-500">Milestone task form coming soon...</div>;
      case 'approval':
        return <div className="p-6 text-center text-gray-500">Approval task form coming soon...</div>;
      default:
        return null;
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Create New Task"
      size="xl"
    >
      <div className="space-y-6">
        <TaskTypeSelector 
          selectedType={selectedType} 
          onTypeChange={setSelectedType} 
        />
        {renderTaskForm()}
      </div>
    </Modal>
  );
};

export default CreateTask;
