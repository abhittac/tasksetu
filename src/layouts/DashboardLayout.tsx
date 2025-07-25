
import React from 'react';
import { useAppSelector, useAppDispatch } from '../store';
import { setShowCreateTaskDrawer } from '../features/ui/uiSlice';
import Sidebar from '../components/Sidebar';
import CreateTaskDrawer from '../features/tasks/components/CreateTaskDrawer';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { showCreateTaskDrawer } = useAppSelector(state => state.ui);

  const handleCreateTask = () => {
    dispatch(setShowCreateTaskDrawer(true));
  };

  return (
    <div className="app-layout">
      <Sidebar onCreateTask={handleCreateTask} />
      <main className="main-content">
        {children}
      </main>
      {showCreateTaskDrawer && <CreateTaskDrawer />}
    </div>
  );
};

export default DashboardLayout;
