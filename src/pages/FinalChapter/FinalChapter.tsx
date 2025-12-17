// ============================================================================
// 终章：魔王城 (The Overlord's Citadel) - 主组件
// ============================================================================

import React, { useState, useCallback } from 'react';
import { FinalChapterState, BattlePhase } from './types';
import {
  INITIAL_BOSS_STATE,
  INITIAL_PLAYER_STATE,
  PLAYER_SKILLS,
  BOSS_SKILLS
} from './data';

// 导入子组件
import IntroSection from './components/layout/IntroSection';
import BattleArena from './components/battle/BattleArena';
import VictoryScreen from './components/layout/VictoryScreen';
import DefeatScreen from './components/layout/DefeatScreen';

import './FinalChapter.scss';

// 初始游戏状态
const getInitialState = (): FinalChapterState => ({
  currentPhase: 'intro',
  currentTurn: 1,
  maxTurns: 15,
  isPlayerTurn: true,
  player: {
    ...INITIAL_PLAYER_STATE,
    skills: PLAYER_SKILLS.map(skill => ({ ...skill }))
  },
  boss: {
    ...INITIAL_BOSS_STATE,
    skills: BOSS_SKILLS.map(skill => ({ ...skill }))
  },
  minions: [],
  battleLog: [],
  lastBossSkill: null,
  copiedSkill: null
});

const FinalChapter: React.FC = () => {
  const [gameState, setGameState] = useState<FinalChapterState>(getInitialState());

  // 切换游戏阶段
  const setPhase = useCallback((phase: BattlePhase) => {
    setGameState(prev => ({ ...prev, currentPhase: phase }));
  }, []);

  // 开始战斗
  const startBattle = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      currentPhase: 'battle',
      battleLog: [{
        turn: 1,
        actor: 'system',
        action: '战斗开始',
        detail: '与算法霸主的最终决战开始了！',
        timestamp: Date.now()
      }]
    }));
  }, []);

  // 更新游戏状态
  const updateGameState = useCallback((updates: Partial<FinalChapterState>) => {
    setGameState(prev => ({ ...prev, ...updates }));
  }, []);

  // 重新开始游戏
  const restartGame = useCallback(() => {
    setGameState(getInitialState());
  }, []);

  // 渲染当前阶段
  const renderCurrentPhase = () => {
    switch (gameState.currentPhase) {
      case 'intro':
        return (
          <IntroSection onComplete={startBattle} />
        );
      
      case 'battle':
        return (
          <BattleArena
            gameState={gameState}
            updateGameState={updateGameState}
            setPhase={setPhase}
          />
        );
      
      case 'victory':
        return (
          <VictoryScreen
            gameState={gameState}
            onRestart={restartGame}
          />
        );
      
      case 'defeat':
        return (
          <DefeatScreen
            gameState={gameState}
            onRestart={restartGame}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="final-chapter">
      <div className="chapter-background">
        <div className="data-storm">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="data-particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>
        <div className="code-rain">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="code-column"
              style={{
                left: `${i * 5}%`,
                animationDelay: `${Math.random() * 3}s`
              }}
            >
              {['0', '1', '{', '}', '<', '>', '/', '\\', '=', '+'].map((char, j) => (
                <span key={j}>{char}</span>
              ))}
            </div>
          ))}
        </div>
      </div>
      
      <div className="chapter-content">
        {renderCurrentPhase()}
      </div>
    </div>
  );
};

export default FinalChapter;
