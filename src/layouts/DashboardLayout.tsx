
import React from 'react';
import { useAppSelector, useAppDispatch } from '../store';
import { setCurrentView, setShowCreateTaskDrawer } from '../features/ui/uiSlice';
import Sidebar from '../components/Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { currentView, showCreateTaskDrawer } = useAppSelector(state => state.ui);

  const handleViewChange = (view: string) => {
    dispatch(setCurrentView(view));
  };

  const handleCreateTask = () => {
    dispatch(setShowCreateTaskDrawer(true));
  };

  return (
    <div className="app-layout">
      <Sidebar
        currentView={currentView}
        onViewChange={handleViewChange}
        onCreateTask={handleCreateTask}
      />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
