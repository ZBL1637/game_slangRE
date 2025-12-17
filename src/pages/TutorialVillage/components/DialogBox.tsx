import React, { useState, useEffect } from 'react';
import './DialogBox.scss';

interface DialogBoxProps {
  speaker: string;
  text: string;
  onNext: () => void;
  showNextArrow?: boolean;
  characterImage?: string;
  variant?: 'default' | 'center';
}

export const DialogBox: React.FC<DialogBoxProps> = ({ 
  speaker, 
  text, 
  onNext, 
  showNextArrow = true, 
  characterImage,
  variant = 'default'
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) clearInterval(timerRef.current);

    setIsTyping(true);
    
    // Immediate initial state
    if (!text) {
      setDisplayedText('');
      setIsTyping(false);
      return;
    }

    // Start with first character to prevent layout shift
    setDisplayedText(text.charAt(0));
    let charIndex = 1;

    timerRef.current = setInterval(() => {
      if (charIndex < text.length) {
        charIndex++;
        // Use slice instead of appending to prevent duplication/accumulation errors
        setDisplayedText(text.slice(0, charIndex));
      } else {
        setIsTyping(false);
        if (timerRef.current) clearInterval(timerRef.current);
      }
    }, 30); // Typing speed

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [text]);

  const handleClick = () => {
    if (isTyping) {
      // Stop typing immediately
      if (timerRef.current) clearInterval(timerRef.current);
      // Show full text
      setDisplayedText(text);
      setIsTyping(false);
    } else {
      onNext();
    }
  };

  // Helper to parse text for special formatting
  const renderFormattedText = (content: string) => {
    // Check for [TASK] prefix
    if (content.startsWith('[TASK]')) {
      const taskContent = content.replace('[TASK]', '').trim();
      return (
        <span className="task-text-highlight">
          {taskContent}
        </span>
      );
    }
    return content;
  };

  return (
    <div className={`tutorial-dialog-wrapper variant-${variant}`}>
      {characterImage && (
        <div className="character-portrait">
          <img src={characterImage} alt={speaker} />
        </div>
      )}
      <div 
        className="tutorial-dialog-box"
        onClick={handleClick}
      >
        {speaker && (
          <div className="speaker-container">
            <span className="speaker-tag">
              {speaker}
            </span>
          </div>
        )}
        <div className="dialog-text">
          {isTyping ? displayedText : renderFormattedText(displayedText)}
        </div>
        {!isTyping && showNextArrow && (
          <div className="next-arrow">
            ▼
          </div>
        )}
      </div>
    </div>
  );
};
