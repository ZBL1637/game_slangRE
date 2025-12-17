import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '@/context/PlayerContext';
import { IntroSection } from './components/layout/IntroSection';
import { OutroSection } from './components/layout/OutroSection';
import { TimelineMap } from './components/layout/TimelineMap';
import { EraExplorer } from './components/layout/EraExplorer';
import { SkillUnlock } from './components/layout/SkillUnlock';
import { TIMELINE_ERAS } from './data';
import { GameState } from './types';
import bgImage from '../../assets/images/timeroad.png';

import './BattlePlain.scss';

const BattlePlain: React.FC = () => {
  const navigate = useNavigate();
  const { state, addExp, unlockAchievement, unlockChapter, completeChapter, updateChapterProgress } = usePlayer();
  
  const savedProgress = state.chapterProgress?.['chapter_2'] || {};

  // 游戏状态
  const [gameState, setGameState] = useState<GameState>({
    currentEra: null,
    fragmentsCollected: savedProgress.fragmentsCollected || [],
    minigamesCompleted: savedProgress.minigamesCompleted || [],
    skillUnlocked: savedProgress.skillUnlocked || false
  });
  
  // UI状态
  const [introCompleted, setIntroCompleted] = useState(savedProgress.introCompleted || false);
  const [showEraExplorer, setShowEraExplorer] = useState(false);
  const [showSkillUnlock, setShowSkillUnlock] = useState(false);
  const [showOutro, setShowOutro] = useState(false);
  
  const contentRef = useRef<HTMLDivElement>(null);

  // 自动保存进度
  useEffect(() => {
    updateChapterProgress('chapter_2', {
      fragmentsCollected: gameState.fragmentsCollected,
      minigamesCompleted: gameState.minigamesCompleted,
      skillUnlocked: gameState.skillUnlocked,
      introCompleted
    });
  }, [gameState.fragmentsCollected, gameState.minigamesCompleted, gameState.skillUnlocked, introCompleted]);

  // 当完成介绍后滚动到主内容
  useEffect(() => {
    if (introCompleted && contentRef.current) {
      setTimeout(() => {
        contentRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [introCompleted]);

  // 检查是否收集完所有碎片
  useEffect(() => {
    if (gameState.fragmentsCollected.length === 4 && !gameState.skillUnlocked) {
      // 延迟显示技能解锁界面
      setTimeout(() => {
        setShowSkillUnlock(true);
      }, 1000);
    }
  }, [gameState.fragmentsCollected, gameState.skillUnlocked]);

  // 进入时代探索
  const handleEnterEra = (eraId: string) => {
    setGameState(prev => ({ ...prev, currentEra: eraId }));
    setShowEraExplorer(true);
  };

  // 完成时代小游戏
  const handleCompleteMinigame = (eraId: string) => {
    setGameState(prev => ({
      ...prev,
      minigamesCompleted: [...prev.minigamesCompleted, eraId],
      fragmentsCollected: [...prev.fragmentsCollected, `fragment_${eraId}`]
    }));
    setShowEraExplorer(false);
    
    // 添加经验
    addExp(50);
  };

  // 退出时代探索
  const handleExitEra = () => {
    setShowEraExplorer(false);
    setGameState(prev => ({ ...prev, currentEra: null }));
  };

  // 解锁技能
  const handleUnlockSkill = () => {
    setGameState(prev => ({ ...prev, skillUnlocked: true }));
    setShowSkillUnlock(false);
    
    // 解锁成就
    unlockAchievement('time_traveler');
    addExp(200);
    
    // 立即显示结尾，无缝衔接
    setShowOutro(true);
  };

  // 完成章节
  const handleComplete = useCallback(() => {
    completeChapter(2); // 标记当前章节为完成
    unlockChapter(3);
    navigate('/world-map');
  }, [completeChapter, unlockChapter, navigate]);

  const handleNextChapter = useCallback(() => {
    completeChapter(2);
    unlockChapter(3);
    navigate('/chapter/3');
  }, [completeChapter, unlockChapter, navigate]);

  // 获取当前时代数据
  const currentEraData = TIMELINE_ERAS.find(era => era.id === gameState.currentEra);

  return (
    <div className="battle-plain-page">
      
      {introCompleted && (
        <div className="global-bg-layer" style={{ backgroundImage: `url(${bgImage})` }} />
      )}

      <div 
        className="battle-plain-scroll-container"
        style={{ overflowY: introCompleted ? 'auto' : 'hidden' }}
      >
        {/* 1. 入场介绍（全屏） */}
        {!introCompleted && <IntroSection onComplete={() => setIntroCompleted(true)} />}

        {/* 2. 主内容区域 */}
        {introCompleted && (
          <div ref={contentRef} className="main-content">
            


            {/* 时间线地图 */}
            <TimelineMap 
              eras={TIMELINE_ERAS}
              completedEras={gameState.minigamesCompleted}
              onEnterEra={handleEnterEra}
            />

            {/* 跳过按钮（调试用） - 移入滚动内容区底部 */}
            {!gameState.skillUnlocked && (
              <div className="timeline-skip-option">
                <p>完成所有时代探索以解锁技能... 或者</p>
                <button onClick={() => {
                  setGameState({
                    currentEra: null,
                    fragmentsCollected: ['fragment_arcade', 'fragment_pc', 'fragment_mobile', 'fragment_modern'],
                    minigamesCompleted: ['arcade', 'pc', 'mobile', 'modern'],
                    skillUnlocked: false
                  });
                }}>
                  [跳过探索直接收集所有碎片]
                </button>
              </div>
            )}

          </div>
        )}
      </div>

      {/* 3. 时代探索弹窗 */}
      {showEraExplorer && currentEraData && (
        <EraExplorer 
          era={currentEraData}
          onComplete={() => handleCompleteMinigame(currentEraData.id)}
          onExit={handleExitEra}
        />
      )}

      {/* 4. 技能解锁界面 */}
      {showSkillUnlock && (
        <SkillUnlock onUnlock={handleUnlockSkill} />
      )}

      {/* 5. 成就通知 (已移除) */}

      {/* 6. 技能获得通知 (已移除) */}

      {/* 7. 结尾章节 */}
      {showOutro && (
        <div className="outro-overlay">
          <OutroSection onComplete={handleComplete} onNextChapter={handleNextChapter} />
        </div>
      )}

    </div>
  );
};

export default BattlePlain;
