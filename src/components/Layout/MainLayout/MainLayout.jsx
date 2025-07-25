
import React from 'react';
import Sidebar from '../Sidebar';
import Header from '../Header';

const MainLayout = ({ children, activeTab, setActiveTab, title, onCreateTask }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={title} onCreateTask={onCreateTask} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
