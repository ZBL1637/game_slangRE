// ============================================================================
// 第五章：译语通天塔 (Tower of Translation) - 主组件
// ============================================================================

import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chapter5State, ChallengeType } from './types';
import { CHALLENGES, NPC_DIALOGUES, SKILL_DATA, NARRATION_TEXTS } from './data';

// 布局组件
import { IntroSection } from './components/layout/IntroSection';
import { TowerOverview } from './components/layout/TowerOverview';
import { ChallengeHub } from './components/layout/ChallengeHub';
import { FinalTask } from './components/layout/FinalTask';
import { SkillUnlock } from './components/layout/SkillUnlock';
import { OutroSection } from './components/layout/OutroSection';

// 挑战组件
import { KeywordChallenge } from './components/challenges/KeywordChallenge';
import { StyleChallenge } from './components/challenges/StyleChallenge';
import { MetaphorChallenge } from './components/challenges/MetaphorChallenge';

import './TranslationTower.scss';

export const TranslationTower: React.FC = () => {
  const navigate = useNavigate();

  // 游戏状态
  const [gameState, setGameState] = useState<Chapter5State>({
    currentPhase: 'intro',
    completedChallenges: [],
    unlockedSkills: [],
    merchantUnderstanding: 0,
    currentChallenge: null
  });

  // 是否显示挑战弹窗
  const [showChallengeModal, setShowChallengeModal] = useState(false);

  // 处理阶段转换
  const handlePhaseChange = useCallback((newPhase: Chapter5State['currentPhase']) => {
    setGameState(prev => ({ ...prev, currentPhase: newPhase }));
  }, []);

  // 开始挑战
  const handleStartChallenge = useCallback((challengeId: ChallengeType) => {
    // 检查挑战是否可用
    const challengeIndex = CHALLENGES.findIndex(c => c.id === challengeId);
    const isAvailable = challengeIndex === 0 || 
      gameState.completedChallenges.includes(CHALLENGES[challengeIndex - 1].id);
    
    if (isAvailable) {
      setGameState(prev => ({ ...prev, currentChallenge: challengeId }));
      setShowChallengeModal(true);
    }
  }, [gameState.completedChallenges]);

  // 完成挑战
  const handleChallengeComplete = useCallback((challengeId: ChallengeType) => {
    setGameState(prev => ({
      ...prev,
      completedChallenges: [...prev.completedChallenges, challengeId],
      unlockedSkills: [...prev.unlockedSkills, CHALLENGES.find(c => c.id === challengeId)?.reward || ''],
      currentChallenge: null
    }));
    setShowChallengeModal(false);

    // 检查是否完成所有挑战
    if (gameState.completedChallenges.length + 1 >= CHALLENGES.length) {
      // 延迟显示最终任务
      setTimeout(() => {
        handlePhaseChange('final');
      }, 1500);
    }
  }, [gameState.completedChallenges.length, handlePhaseChange]);

  // 关闭挑战弹窗
  const handleCloseChallenge = useCallback(() => {
    setShowChallengeModal(false);
    setGameState(prev => ({ ...prev, currentChallenge: null }));
  }, []);

  // 完成最终任务
  const handleFinalTaskComplete = useCallback(() => {
    setGameState(prev => ({ ...prev, merchantUnderstanding: 100 }));
    handlePhaseChange('skill');
  }, [handlePhaseChange]);

  // 确认技能获取
  const handleSkillConfirm = useCallback(() => {
    handlePhaseChange('outro');
  }, [handlePhaseChange]);

  // 继续到下一章
  const handleContinue = useCallback(() => {
    navigate('/chapter/final');
  }, [navigate]);

  // 跳过到结尾（开发用）
  const handleSkipToEnd = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      completedChallenges: CHALLENGES.map(c => c.id),
      merchantUnderstanding: 100
    }));
    handlePhaseChange('skill');
  }, [handlePhaseChange]);

  // 渲染当前挑战组件
  const renderChallengeModal = () => {
    if (!showChallengeModal || !gameState.currentChallenge) return null;

    const challengeProps = {
      onComplete: () => handleChallengeComplete(gameState.currentChallenge!),
      onClose: handleCloseChallenge
    };

    switch (gameState.currentChallenge) {
      case 'keyword':
        return <KeywordChallenge {...challengeProps} />;
      case 'style':
        return <StyleChallenge {...challengeProps} />;
      case 'metaphor':
        return <MetaphorChallenge {...challengeProps} />;
      default:
        return null;
    }
  };

  // 渲染当前阶段
  const renderCurrentPhase = () => {
    switch (gameState.currentPhase) {
      case 'intro':
        return (
          <IntroSection
            dialogues={NPC_DIALOGUES.intro}
            narrationText={NARRATION_TEXTS.intro}
            onComplete={() => handlePhaseChange('tower')}
          />
        );

      case 'tower':
        return (
          <TowerOverview
            narrationText={NARRATION_TEXTS.tower_desc}
            onEnterChallenges={() => handlePhaseChange('challenges')}
          />
        );

      case 'challenges':
        return (
          <ChallengeHub
            challenges={CHALLENGES}
            completedChallenges={gameState.completedChallenges}
            onStartChallenge={handleStartChallenge}
          />
        );

      case 'final':
        return (
          <FinalTask
            dialogues={NPC_DIALOGUES.all_complete}
            onComplete={handleFinalTaskComplete}
          />
        );

      case 'skill':
        return (
          <SkillUnlock
            skillData={SKILL_DATA}
            dialogues={NPC_DIALOGUES.final_success}
            onConfirm={handleSkillConfirm}
          />
        );

      case 'outro':
        return (
          <OutroSection
            narrationText={NARRATION_TEXTS.outro}
            completedChallenges={gameState.completedChallenges.length}
            skillName={SKILL_DATA.name}
            onContinue={handleContinue}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="translation-tower-page">
      {/* 背景效果 */}
      <div className="tower-background">
        <div className="language-streams">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="language-stream"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 5}s`
              }}
            >
              {['你好', 'Hello', 'مرحبا', '안녕', 'Bonjour', '翻译'][i % 6]}
            </div>
          ))}
        </div>
        <div className="tower-silhouette"></div>
      </div>

      {/* 主内容 */}
      <main className="main-content">
        {renderCurrentPhase()}
      </main>

      {/* 挑战弹窗 */}
      {renderChallengeModal()}

      {/* 进度提示 */}
      {gameState.currentPhase === 'challenges' && (
        <div className="progress-hint">
          <span>已完成挑战: {gameState.completedChallenges.length}/{CHALLENGES.length}</span>
          {gameState.completedChallenges.length === CHALLENGES.length && (
            <span className="complete-hint">全部完成！</span>
          )}
        </div>
      )}

      {/* 开发用跳过按钮（不在技能获取阶段显示） */}
      {process.env.NODE_ENV === 'development' && gameState.currentPhase !== 'outro' && gameState.currentPhase !== 'skill' && (
        <div className="skip-option">
          <p>开发模式</p>
          <button onClick={handleSkipToEnd}>跳过到技能获取</button>
        </div>
      )}
    </div>
  );
};

export default TranslationTower;
