import React, { useState, useEffect } from 'react';
import './DialogBox.scss';

interface DialogBoxProps {
  speaker: string;
  text: string;
  onNext: () => void;
  showNextArrow?: boolean;
  characterImage?: string;
}

export const DialogBox: React.FC<DialogBoxProps> = ({ speaker, text, onNext, showNextArrow = true, characterImage }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    let index = 0;
    // Immediately show the first character to prevent empty state flicker
    // and ensure index logic is consistent
    if (text.length > 0) {
        setDisplayedText(text.charAt(0));
        index = 1;
    }

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
    <div className="tutorial-dialog-wrapper">
      {characterImage && (
        <div className="character-portrait">
          <img src={characterImage} alt={speaker} />
        </div>
      )}
      <div 
        className="tutorial-dialog-box"
        onClick={handleClick}
      >
        <div className="speaker-container">
          <span className="speaker-tag">
            {speaker}
          </span>
        </div>
        <div className="dialog-text">
          {displayedText}
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
