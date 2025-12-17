import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '@/context/PlayerContext';
import { IntroSection } from './components/layout/IntroSection';
import { OutroSection } from './components/layout/OutroSection';
import { TimelineMap } from './components/layout/TimelineMap';
import { EraExplorer } from './components/layout/EraExplorer';
import { SkillUnlock } from './components/layout/SkillUnlock';
import { FragmentCollection } from './components/visuals/FragmentCollection';
import { SCRIPT, TIMELINE_ERAS } from './data';
import { GameState } from './types';
import { Trophy, Clock } from 'lucide-react';
import './BattlePlain.scss';

const BattlePlain: React.FC = () => {
  const navigate = useNavigate();
  const { addExp, unlockAchievement, unlockChapter } = usePlayer();
  
  // 游戏状态
  const [gameState, setGameState] = useState<GameState>({
    currentEra: null,
    fragmentsCollected: [],
    minigamesCompleted: [],
    skillUnlocked: false
  });
  
  // UI状态
  const [introCompleted, setIntroCompleted] = useState(false);
  const [showEraExplorer, setShowEraExplorer] = useState(false);
  const [showSkillUnlock, setShowSkillUnlock] = useState(false);
  const [showOutro, setShowOutro] = useState(false);
  const [showAchievement, setShowAchievement] = useState(false);
  
  const contentRef = useRef<HTMLDivElement>(null);

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
    setShowAchievement(true);
    
    // 解锁成就
    unlockAchievement('time_traveler');
    addExp(200);
    
    // 延迟显示结尾
    setTimeout(() => {
      setShowAchievement(false);
      setShowOutro(true);
    }, 3000);
  };

  // 完成章节
  const handleComplete = () => {
    unlockChapter(3);
    navigate('/world-map');
  };

  // 获取当前时代数据
  const currentEraData = TIMELINE_ERAS.find(era => era.id === gameState.currentEra);

  return (
    <div className="battle-plain-page">
      
      {/* 1. 入场介绍（全屏） */}
      <IntroSection onComplete={() => setIntroCompleted(true)} />

      {/* 2. 主内容区域 */}
      {introCompleted && (
        <div ref={contentRef} className="main-content">
          
          {/* 碎片收集进度 */}
          <FragmentCollection 
            fragments={TIMELINE_ERAS.map(era => ({
              ...era.fragment,
              collected: gameState.fragmentsCollected.includes(era.fragment.id)
            }))}
          />

          {/* 时间线地图 */}
          <TimelineMap 
            eras={TIMELINE_ERAS}
            completedEras={gameState.minigamesCompleted}
            onEnterEra={handleEnterEra}
          />

          {/* 跳过按钮（调试用） */}
          {!gameState.skillUnlocked && (
            <div className="skip-option">
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

      {/* 5. 成就通知 */}
      {showAchievement && (
        <div className="achievement-toast">
          <div className="toast-content">
            <div className="icon-box">
              <Trophy size={24} />
            </div>
            <div className="text-box">
              <h4>成就解锁</h4>
              <p className="title">{SCRIPT.ch2_achievement_title.replace("🏆 ", "")}</p>
              <p className="reward">{SCRIPT.ch2_achievement_reward}</p>
            </div>
          </div>
        </div>
      )}

      {/* 6. 技能获得通知 */}
      {gameState.skillUnlocked && !showOutro && (
        <div className="skill-toast">
          <div className="toast-content">
            <div className="icon-box">
              <Clock size={24} />
            </div>
            <div className="text-box">
              <h4>技能获得</h4>
              <p className="title">{SCRIPT.ch2_skill_name}</p>
              <p className="desc">{SCRIPT.ch2_skill_desc}</p>
            </div>
          </div>
        </div>
      )}

      {/* 7. 结尾章节 */}
      {showOutro && (
        <div className="outro-overlay">
          <OutroSection onComplete={handleComplete} />
        </div>
      )}

    </div>
  );
};

export default BattlePlain;
