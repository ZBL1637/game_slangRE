import React from 'react';
import MatrixRain from '@/components/MatrixRain/MatrixRain';
import './GameFrame.scss';

interface GameFrameProps {
  children: React.ReactNode;
}

export const GameFrame: React.FC<GameFrameProps> = ({ children }) => {
  return (
    <div className="game-frame-container">
      <div className="game-frame-screen">
        {/* 背景矩阵雨特效 */}
        <MatrixRain />
        
        {/* CRT 扫描线效果层 */}
        <div className="scanlines"></div>
        {/* 屏幕内容 */}
        <div className="screen-content">
          {children}
        </div>
      </div>
    </div>
  );
};
