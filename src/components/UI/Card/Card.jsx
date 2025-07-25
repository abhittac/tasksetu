
import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  padding = 'p-6',
  shadow = 'shadow-sm',
  hover = false 
}) => {
  const cardClasses = `
    bg-white rounded-lg border border-gray-200 ${shadow} ${padding} ${className}
    ${hover ? 'hover:shadow-md transition-shadow duration-200' : ''}
  `;

  return (
    <div className={cardClasses}>
      {children}
    </div>
  );
};

export default Card;
