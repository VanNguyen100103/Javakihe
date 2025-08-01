import React from 'react';

const LoadingSpinner = ({ size = 'medium', text = 'Đang tải...' }) => {
  const sizeClasses = {
    small: 'p-4',
    medium: 'p-8',
    large: 'p-16'
  };

  const spinnerSizeClasses = {
    small: 'w-5 h-5 border-2',
    medium: 'w-10 h-10 border-4',
    large: 'w-15 h-15 border-6'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${sizeClasses[size]}`}>
      <div className={`border border-gray-300 border-t-primary-500 rounded-full animate-spin ${spinnerSizeClasses[size]}`}></div>
      {text && <div className="mt-4 text-gray-600 text-sm">{text}</div>}
    </div>
  );
};

export default LoadingSpinner; 