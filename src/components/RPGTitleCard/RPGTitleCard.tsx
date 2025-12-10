import React from 'react';
import './RPGTitleCard.scss';

export const RPGTitleCard: React.FC = () => {
  return (
    <div className="rpg-title-card-container">
      <div className="rpg-title-card-content">
        {/* Icon Header */}
        <div className="icon-header">
          <div className="icon-glow"></div>
          <div className="icons">
            {/* Sword Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="icon-sword">
              <path d="m11 19-6-6"></path>
              <path d="m5 21-2-2"></path>
              <path d="m8 16-4 4"></path>
              <path d="M9.5 17.5 21 6V3h-3L6.5 14.5"></path>
            </svg>
            {/* Message Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="icon-msg">
              <path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
        </div>

        {/* Main Title */}
        <h1 className="main-title">
          <span className="title-part-1">从<span className="highlight-blue">新手村</span></span>
          <span className="arrow">→</span>
          <span className="title-part-2">到满级玩家</span>
        </h1>

        {/* Subtitle */}
        <div className="title-subtitle">
          <span className="no-label">NO.01</span>
          <span className="subtitle-text">玩家黑话如何构成一种语言</span>
          <span className="slashes">///</span>
        </div>
      </div>
    </div>
  );
};
