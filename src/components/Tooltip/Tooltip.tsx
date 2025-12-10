import React, { useState } from 'react';
import './Tooltip.scss';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom';
}

export const Tooltip: React.FC<TooltipProps> = ({ 
  content, 
  children, 
  position = 'top' 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className="rpg-tooltip-container"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={`rpg-tooltip-popup position-${position}`}>
          <div className="tooltip-content">{content}</div>
          <div className="tooltip-arrow"></div>
        </div>
      )}
    </div>
  );
};
