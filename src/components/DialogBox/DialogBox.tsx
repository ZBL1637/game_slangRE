import React, { useState, useEffect } from 'react';
import { Panel } from '@/components/Panel/Panel';
import { Icon } from '@/components/Icon/Icon';
import './DialogBox.scss';

interface DialogBoxProps {
  text: string;
  speaker?: string;
  avatar?: React.ReactNode;
  onComplete?: () => void;
  speed?: number; // ms per char
}

export const DialogBox: React.FC<DialogBoxProps> = ({ 
  text, 
  speaker, 
  avatar, 
  onComplete,
  speed = 30 
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    let index = 0;
    
    // Clear any previous interval just in case
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      index++;
      setDisplayedText(text.substring(0, index));
      
      if (index >= text.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsTyping(false);
        if (onComplete) onComplete();
      }
    }, speed);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, speed, onComplete]);

  const handleSkip = () => {
    if (isTyping) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setDisplayedText(text);
      setIsTyping(false);
      if (onComplete) onComplete();
    }
  };

  return (
    <Panel className="rpg-dialog-box" onClick={handleSkip}>
      <div className="dialog-content">
        {avatar && <div className="dialog-avatar">{avatar}</div>}
        <div className="dialog-body">
          {speaker && <div className="dialog-speaker">{speaker}</div>}
          <div className="dialog-text">
            {displayedText}
            {!isTyping && <span className="cursor-blink">|</span>}
          </div>
        </div>
        {!isTyping && (
          <div className="dialog-indicator">
            <Icon name="arrow-down" size="sm" />
          </div>
        )}
      </div>
    </Panel>
  );
};
