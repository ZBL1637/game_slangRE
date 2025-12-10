import React from 'react';
import './Button.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '',
  ...props 
}) => {
  return (
    <button 
      className={`rpg-btn rpg-btn-${variant} rpg-btn-${size} ${className}`} 
      {...props}
    >
      <span className="btn-content">
        <span className="pixel-arrow">▶</span>
        {children}
      </span>
    </button>
  );
};
