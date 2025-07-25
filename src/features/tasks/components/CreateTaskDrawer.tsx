
import React from 'react';
import { useAppSelector, useAppDispatch } from '../../../store';
import { setShowCreateTaskDrawer } from '../../ui/uiSlice';
import CreateTask from '../../../components/CreateTask';

const CreateTaskDrawer: React.FC = () => {
  const dispatch = useAppDispatch();
  const { showCreateTaskDrawer } = useAppSelector(state => state.ui);

  const handleClose = () => {
    dispatch(setShowCreateTaskDrawer(false));
  };

  if (!showCreateTaskDrawer) return null;

  return (
    <div className={`task-drawer ${showCreateTaskDrawer ? "open" : ""}`}>
      <div
        className="drawer-overlay"
        onClick={handleClose}
      ></div>
      <div className="drawer-content">
        <div className="drawer-header">
          <h2 className="text-2xl font-bold text-gray-900">
            Create New Task
          </h2>
          <button
            onClick={handleClose}
            className="close-btn"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="drawer-body">
          <CreateTask onClose={handleClose} />
        </div>
      </div>
    </div>
  );
};

export default CreateTaskDrawer;
