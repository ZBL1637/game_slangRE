import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GameFrame } from '@/components/GameFrame/GameFrame';
import { HUDBar } from '@/components/HUDBar/HUDBar'; // 使用新组件
import { usePlayer } from '@/context/PlayerContext';
import './Layout.scss';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = usePlayer();

  // 简单的路径映射到标题
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'DataNews RPG'; // Title Screen 不需要额外标题
    if (path === '/world-map') return 'World Map';
    if (path === '/dictionary') return 'Dictionary';
    if (path === '/achievements') return 'Achievements';
    if (path === '/quests') return 'Quest Log';
    if (path === '/lab') return 'Data Lab';
    if (path === '/profile') return 'Profile';
    if (path.startsWith('/chapter/')) return `Chapter ${path.split('/')[2]}`;
    return 'Unknown Location';
  };

  const isTitleScreen = location.pathname === '/';

  return (
    <GameFrame>
      <div className="game-layout">
        {/* 顶部 HUD 区域 */}
        {!isTitleScreen && (
          <div className="layout-header">
             <HUDBar 
               level={state.level}
               currentExp={state.currentExp}
               maxExp={state.expToNext}
               title={getPageTitle()}
               onBack={() => navigate('/')}
             />
          </div>
        )}

        {/* 主内容区域 */}
        <main className="layout-main">
          {children}
        </main>
      </div>
    </GameFrame>
  );
};
