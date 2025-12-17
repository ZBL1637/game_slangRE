import React, { useState } from 'react';

interface SlangTooltipProps {
  term: string;
  definition: string;
  translation: string;
  context: string;
}

export const SlangTooltip: React.FC<SlangTooltipProps> = ({ term, definition, translation, context }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <span className="relative inline-block">
      <span 
        className="text-amber-300 bg-stone-800/50 px-1 border-b-2 border-amber-500 cursor-pointer hover:bg-stone-700 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        {term}
      </span>
      
      {isOpen && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-stone-900 border-2 border-stone-500 text-stone-100 p-3 rounded shadow-2xl z-[60] text-sm">
          <div className="font-bold text-amber-500 mb-1 text-base">{term}</div>
          <div className="mb-2 text-stone-300">{definition}</div>
          <div className="mb-2 text-green-400 font-bold border-t border-stone-700 pt-1">
            人话：{translation}
          </div>
          <div className="text-xs text-stone-500 italic">
            常见于：{context}
          </div>
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-2 border-8 border-transparent border-t-stone-500"></div>
        </div>
      )}
    </span>
  );
};