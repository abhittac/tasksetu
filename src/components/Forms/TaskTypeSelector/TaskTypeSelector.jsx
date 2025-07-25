
import React from 'react';

const TaskTypeSelector = ({ selectedType, onTypeChange }) => {
  const taskTypes = [
    {
      id: 'regular',
      name: 'Regular Task',
      description: 'Standard one-time task',
      icon: '📋',
      color: 'blue'
    },
    {
      id: 'recurring',
      name: 'Recurring Task',
      description: 'Repeats on schedule',
      icon: '🔄',
      color: 'green'
    },
    {
      id: 'milestone',
      name: 'Milestone',
      description: 'Project checkpoint',
      icon: '🎯',
      color: 'purple'
    },
    {
      id: 'approval',
      name: 'Approval Task',
      description: 'Requires approval workflow',
      icon: '✅',
      color: 'orange'
    }
  ];

  const getColorClasses = (color, isSelected) => {
    const colors = {
      blue: isSelected 
        ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-md transform scale-102'
        : 'border-gray-200 hover:border-blue-300 hover:shadow-sm hover:transform hover:scale-101',
      green: isSelected
        ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-md transform scale-102'
        : 'border-gray-200 hover:border-green-300 hover:shadow-sm hover:transform hover:scale-101',
      purple: isSelected
        ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-violet-50 shadow-md transform scale-102'
        : 'border-gray-200 hover:border-purple-300 hover:shadow-sm hover:transform hover:scale-101',
      orange: isSelected
        ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-yellow-50 shadow-md transform scale-102'
        : 'border-gray-200 hover:border-orange-300 hover:shadow-sm hover:transform hover:scale-101'
    };
    return colors[color];
  };

  const getIconClasses = (color, isSelected) => {
    const colors = {
      blue: isSelected ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-600 group-hover:bg-blue-200',
      green: isSelected ? 'bg-green-500 text-white' : 'bg-green-100 text-green-600 group-hover:bg-green-200',
      purple: isSelected ? 'bg-purple-500 text-white' : 'bg-purple-100 text-purple-600 group-hover:bg-purple-200',
      orange: isSelected ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-600 group-hover:bg-orange-200'
    };
    return colors[color];
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Task Type</h3>
        <p className="text-gray-600">Choose the type of task you want to create</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {taskTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => onTypeChange(type.id)}
            className={`p-3 border-2 rounded-xl text-left transition-all duration-300 group ${getColorClasses(type.color, selectedType === type.id)}`}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${getIconClasses(type.color, selectedType === type.id)}`}>
                <span className="text-sm">{type.icon}</span>
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-semibold text-gray-900 group-hover:text-blue-700">
                  {type.name}
                </h4>
                <p className="text-xs text-gray-500 group-hover:text-gray-600 truncate">
                  {type.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TaskTypeSelector;
