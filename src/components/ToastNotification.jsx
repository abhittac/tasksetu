
import React, { useState, useEffect } from 'react';

export default function ToastNotification({ message, type = 'success', duration = 3000, onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = type === 'success' ? 'bg-green-600' : 
                  type === 'error' ? 'bg-red-600' : 
                  type === 'warning' ? 'bg-yellow-600' : 'bg-blue-600';

  const icon = type === 'success' ? '✅' : 
               type === 'error' ? '❌' : 
               type === 'warning' ? '⚠️' : 'ℹ️';

  return (
    <div
      className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-white shadow-lg transition-all duration-300 max-w-sm ${bgColor} ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      }`}
    >
      <div className="flex items-center space-x-2">
        <span className="text-lg">{icon}</span>
        <span className="text-sm font-medium">{message}</span>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="ml-2 text-white hover:text-gray-200 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
