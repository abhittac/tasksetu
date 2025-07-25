
import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../store';
import { hideToast } from '../../features/ui/uiSlice';

const ToastNotification: React.FC = () => {
  const dispatch = useAppDispatch();
  const { toast } = useAppSelector(state => state.ui);

  useEffect(() => {
    if (toast.isVisible) {
      const timer = setTimeout(() => {
        dispatch(hideToast());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [toast.isVisible, dispatch]);

  if (!toast.isVisible) return null;

  const bgColorClasses = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`${bgColorClasses[toast.type]} text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2`}>
        <span>{toast.message}</span>
        <button
          onClick={() => dispatch(hideToast())}
          className="ml-2 text-white hover:text-gray-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ToastNotification;
