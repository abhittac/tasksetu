
import React from 'react';
import { Button } from '../../UI';

const Header = ({ title, onCreateTask }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        <div className="flex items-center space-x-4">
          <Button onClick={onCreateTask}>
            Create Task
          </Button>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Welcome, Admin</span>
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
              A
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
