
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store';
import TaskDetail from '../components/TaskDetail';

const TaskDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/all-tasks');
  };

  if (!id) {
    navigate('/all-tasks');
    return null;
  }

  return <TaskDetail taskId={parseInt(id)} onClose={handleClose} />;
};

export default TaskDetailPage;
