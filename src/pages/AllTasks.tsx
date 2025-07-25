
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store';
import { setShowCreateTaskDrawer, setSelectedTaskId } from '../features/ui/uiSlice';
import AllTasks from '../components/AllTasks';

const AllTasksPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleCreateTask = () => {
    dispatch(setShowCreateTaskDrawer(true));
  };

  const handleNavigateToTask = (taskId: number) => {
    dispatch(setSelectedTaskId(taskId));
    navigate(`/task/${taskId}`);
  };

  return (
    <AllTasks
      onCreateTask={handleCreateTask}
      onNavigateToTask={handleNavigateToTask}
    />
  );
};

export default AllTasksPage;
