import React, { useState, useEffect } from 'react';

interface DialogBoxProps {
  speaker: string;
  text: string;
  onNext: () => void;
  showNextArrow?: boolean;
}

export const DialogBox: React.FC<DialogBoxProps> = ({ speaker, text, onNext, showNextArrow = true }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText((prev) => prev + text.charAt(index));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 30); // Typing speed

    return () => clearInterval(timer);
  }, [text]);

  const handleClick = () => {
    if (isTyping) {
      // Skip typing
      setDisplayedText(text);
      setIsTyping(false);
    } else {
      onNext();
    }
  };

  return (
    <div 
      className="absolute bottom-4 left-4 right-4 md:left-20 md:right-20 h-40 bg-stone-900 border-4 border-stone-400 rounded-lg p-4 cursor-pointer shadow-xl z-50 flex flex-col"
      onClick={handleClick}
    >
      <div className="flex-shrink-0 mb-2">
        <span className="bg-amber-600 text-white px-3 py-1 text-sm rounded font-bold border border-amber-800 shadow-sm">
          {speaker}
        </span>
      </div>
      <div className="flex-grow text-stone-100 text-lg leading-relaxed select-none">
        {displayedText}
      </div>
      {!isTyping && showNextArrow && (
        <div className="absolute bottom-4 right-4 animate-bounce text-amber-500">
          ▼
        </div>
      )}
    </div>
  );
};