import React, { useEffect, useState, useRef } from 'react';

// --- Constants ---
export const SPRITE_SIZE = 32;
export const SCALE = 3; // 
export const FRAMES_PER_ROW = 6;
export const IDLE_FRAME = 0;
export const ANIMATION_SPEED = 100;

export enum Direction {
  DOWN = 0,
  RIGHT = 1,
  LEFT = 2,
  UP = 3,
}

export const DIRECTION_ROW_MAP: Record<Direction, number> = {
  [Direction.DOWN]: 0,
  [Direction.RIGHT]: 1,
  [Direction.LEFT]: 2,
  [Direction.UP]: 3,
};

// --- Helper: Generate Placeholder Sprite ---
export const generatePlaceholderSpriteSheet = (): string => {
  const canvas = document.createElement('canvas');
  canvas.width = SPRITE_SIZE * FRAMES_PER_ROW;
  canvas.height = SPRITE_SIZE * 4;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  for (let row = 0; row < 4; row++) {
    for (let frame = 0; frame < FRAMES_PER_ROW; frame++) {
      const x = frame * SPRITE_SIZE;
      const y = row * SPRITE_SIZE;
      
      const cx = x + SPRITE_SIZE / 2;
      const cy = y + SPRITE_SIZE / 2;

      ctx.clearRect(x, y, SPRITE_SIZE, SPRITE_SIZE);

      const bounce = frame % 2 === 0 ? 0 : 2;
      
      // Cape/Body
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(cx - 6, cy - 8 + bounce, 12, 14);

      // Head
      ctx.fillStyle = '#FFC300';
      ctx.fillRect(cx - 5, cy - 14 + bounce, 10, 8);
      
      // Hair
      ctx.fillStyle = '#5D4037';
      ctx.fillRect(cx - 6, cy - 16 + bounce, 12, 4);

      // Eyes/Direction
      ctx.fillStyle = 'black';
      if (row === 0) { // Down
        ctx.fillRect(cx - 2, cy - 12 + bounce, 1, 1);
        ctx.fillRect(cx + 2, cy - 12 + bounce, 1, 1);
      } else if (row === 1) { // Right
        ctx.fillRect(cx + 2, cy - 12 + bounce, 1, 1);
      } else if (row === 2) { // Left
        ctx.fillRect(cx - 2, cy - 12 + bounce, 1, 1);
      }

      // Legs
      ctx.fillStyle = '#2C3E50';
      const leftLegY = (frame === 1 || frame === 4) ? -3 : 0;
      ctx.fillRect(cx - 4, cy + 6 + bounce + leftLegY, 3, 6);
      const rightLegY = (frame === 2 || frame === 5) ? -3 : 0;
      ctx.fillRect(cx + 1, cy + 6 + bounce + rightLegY, 3, 6);
    }
  }

  return canvas.toDataURL();
};

interface SpriteCharProps {
  image: string;
  x: number;
  y: number;
  direction: Direction;
  isMoving: boolean;
}

export const SpriteCharacter: React.FC<SpriteCharProps> = ({
  image,
  x,
  y,
  direction,
  isMoving,
}) => {
  const [frame, setFrame] = useState(0);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const animate = () => {
      const now = Date.now();
      
      if (isMoving) {
        const currentFrame = Math.floor((now / ANIMATION_SPEED) % FRAMES_PER_ROW);
        setFrame(currentFrame);
      } else {
        setFrame(IDLE_FRAME);
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isMoving]);

  const row = DIRECTION_ROW_MAP[direction];
  const bgPosX = -(frame * SPRITE_SIZE);
  const bgPosY = -(row * SPRITE_SIZE);

  return (
    <div 
      style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: `${SPRITE_SIZE * SCALE}px`, 
        height: `${SPRITE_SIZE * SCALE}px`, 
        transform: `translate3d(${x}px, ${y}px, 0)`, 
        backgroundImage: `url(${image})`, 
        backgroundRepeat: 'no-repeat', 
        backgroundPosition: `${bgPosX * SCALE}px ${bgPosY * SCALE}px`, 
        backgroundSize: `${SPRITE_SIZE * FRAMES_PER_ROW * SCALE}px ${SPRITE_SIZE * 4 * SCALE}px`, 
        imageRendering: 'pixelated', 
        zIndex: Math.floor(y), 
        transition: 'transform 0.1s linear', 
      }} 
    >
      {/* Shadow */}
      <div 
        style={{ 
          position: 'absolute', 
          bottom: 4, 
          left: '25%', 
          width: '50%', 
          height: '15%', 
          backgroundColor: 'rgba(0,0,0,0.4)', 
          borderRadius: '50%', 
          filter: 'blur(2px)', 
        }} 
      />
    </div>
  );
};
