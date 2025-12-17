import { useState, useEffect } from 'react';

export const useInput = () => {
  const [input, setInput] = useState({
    up: false,
    down: false,
    left: false,
    right: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent scrolling
      if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
      
      switch (e.key.toLowerCase()) {
        case 'w': case 'arrowup': setInput((prev) => ({ ...prev, up: true })); break;
        case 's': case 'arrowdown': setInput((prev) => ({ ...prev, down: true })); break;
        case 'a': case 'arrowleft': setInput((prev) => ({ ...prev, left: true })); break;
        case 'd': case 'arrowright': setInput((prev) => ({ ...prev, right: true })); break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'w': case 'arrowup': setInput((prev) => ({ ...prev, up: false })); break;
        case 's': case 'arrowdown': setInput((prev) => ({ ...prev, down: false })); break;
        case 'a': case 'arrowleft': setInput((prev) => ({ ...prev, left: false })); break;
        case 'd': case 'arrowright': setInput((prev) => ({ ...prev, right: false })); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return input;
};
