import React from 'react';
import './Panel.scss';

interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  title?: string;
}

export const Panel: React.FC<PanelProps> = ({ children, title, className = '', style, ...props }) => {
  return (
    <div className={`rpg-panel ${className}`} style={style} {...props}>
      {title && <div className="rpg-panel-title">{title}</div>}
      <div className="rpg-panel-content">
        {children}
      </div>
      {/* 装饰性角落 */}
      <div className="corner top-left"></div>
      <div className="corner top-right"></div>
      <div className="corner bottom-left"></div>
      <div className="corner bottom-right"></div>
    </div>
  );
};
