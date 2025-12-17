// IntroSection - 入场动画和NPC对话
import React, { useState, useEffect } from 'react';
import { NPCDialogue } from '../../types';
import './IntroSection.scss';

interface IntroSectionProps {
  dialogues: NPCDialogue[];
  narrationText: string;
  onComplete: () => void;
}

type IntroPhase = 'entrance' | 'title' | 'narration' | 'npc';

export const IntroSection: React.FC<IntroSectionProps> = ({
  dialogues,
  narrationText,
  onComplete
}) => {
  const [phase, setPhase] = useState<IntroPhase>('entrance');
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // 自动播放入场动画
  useEffect(() => {
    if (phase === 'entrance') {
      const timer = setTimeout(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setPhase('title');
          setIsTransitioning(false);
        }, 500);
      }, 2000);
      return () => clearTimeout(timer);
    }

    if (phase === 'title') {
      const timer = setTimeout(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setPhase('narration');
          setIsTransitioning(false);
        }, 500);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  // 处理点击继续
  const handleClick = () => {
    if (isTransitioning) return;

    if (phase === 'narration') {
      setIsTransitioning(true);
      setTimeout(() => {
        setPhase('npc');
        setIsTransitioning(false);
      }, 500);
      return;
    }

    if (phase === 'npc') {
      if (dialogueIndex < dialogues.length - 1) {
        setDialogueIndex(prev => prev + 1);
      } else {
        onComplete();
      }
    }
  };

  const currentDialogue = dialogues[dialogueIndex];

  return (
    <section 
      className={`intro-section ${phase}-phase ${isTransitioning ? 'fade-out' : ''}`}
      onClick={handleClick}
    >
      {/* 入场屏幕 */}
      {phase === 'entrance' && (
        <div className="entrance-screen animate-fade-in">
          <div className="entrance-text">
            <p>第五章</p>
            <p>CHAPTER FIVE</p>
          </div>
        </div>
      )}

      {/* 标题屏幕 */}
      {phase === 'title' && (
        <div className="title-screen animate-fade-in">
          <div className="title-content">
            <span className="chapter-index">CHAPTER 5</span>
            <h1>译语通天塔</h1>
            <p className="subtitle">Tower of Translation</p>
          </div>
        </div>
      )}

      {/* 叙述屏幕 */}
      {phase === 'narration' && (
        <div className="narration-screen animate-fade-in">
          <div className="narration-box">
            <p className="narration-text">{narrationText}</p>
          </div>
          <span className="click-hint">点击继续</span>
        </div>
      )}

      {/* NPC对话屏幕 */}
      {phase === 'npc' && currentDialogue && (
        <div className="npc-screen animate-fade-in">
          <div className="npc-container">
            <div className="npc-avatar">
              <div className="avatar-glow"></div>
              <span className="npc-icon">🧙‍♂️</span>
            </div>
            <div className="dialogue-box">
              <div className="npc-header">
                <h3>{currentDialogue.speaker}</h3>
                <span className="npc-title">通天塔守护者</span>
              </div>
              <div className="dialogue-content">
                <p>{currentDialogue.text}</p>
              </div>
              {dialogueIndex < dialogues.length - 1 ? (
                <span className="click-hint">点击继续</span>
              ) : (
                <button className="start-btn">
                  进入通天塔 →
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
