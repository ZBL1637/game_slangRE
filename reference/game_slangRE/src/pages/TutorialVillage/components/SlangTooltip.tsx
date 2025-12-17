import React, { useState } from 'react';
import './SlangTooltip.scss';

interface SlangTooltipProps {
  term: string;
  definition: string;
  translation: string;
  context: string;
}

export const SlangTooltip: React.FC<SlangTooltipProps> = ({ term, definition, translation, context }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <span className="slang-tooltip">
      <span 
        className="term"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        {term}
      </span>
      
      {isOpen && (
        <div className="popup">
          <div className="title">{term}</div>
          <div className="definition">{definition}</div>
          <div className="translation">
            人话：{translation}
          </div>
          <div className="context">
            常见于：{context}
          </div>
          <div className="arrow"></div>
        </div>
      )}
    </span>
  );
};
