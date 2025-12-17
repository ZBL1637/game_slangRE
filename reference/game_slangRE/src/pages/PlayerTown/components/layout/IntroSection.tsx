import React, { useState, useEffect } from 'react';
import { Users, ArrowRight } from 'lucide-react';
import { Chapter3Phase } from '../../types';
import { SCRIPT } from '../../data';
import './IntroSection.scss';

interface IntroSectionProps {
  phase: Chapter3Phase;
  onIntroComplete: () => void;
  onNPCComplete: () => void;
}

type IntroStep = 'entrance' | 'title' | 'narration1' | 'narration2' | 'npc';

export const IntroSection: React.FC<IntroSectionProps> = ({
  phase,
  onIntroComplete,
  onNPCComplete
}) => {
  const [step, setStep] = useState<IntroStep>('entrance');
  const [npcDialogueIndex, setNpcDialogueIndex] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  // 入场动画序列
  useEffect(() => {
    if (phase === 'intro') {
      const timers: NodeJS.Timeout[] = [];
      
      timers.push(setTimeout(() => setStep('title'), 1500));
      timers.push(setTimeout(() => setStep('narration1'), 3500));
      timers.push(setTimeout(() => setStep('narration2'), 6000));
      timers.push(setTimeout(() => {
        onIntroComplete();
      }, 8500));
      
      return () => timers.forEach(clearTimeout);
    }
  }, [phase, onIntroComplete]);

  // NPC对话内容
  const npcDialogues = [
    SCRIPT.ch3_npc_greeting,
    SCRIPT.ch3_npc_task
  ];

  // 处理NPC对话点击
  const handleNPCClick = () => {
    if (npcDialogueIndex < npcDialogues.length - 1) {
      setNpcDialogueIndex(prev => prev + 1);
    } else {
      setFadeOut(true);
      setTimeout(() => {
        onNPCComplete();
      }, 500);
    }
  };

  // 渲染入场动画
  if (phase === 'intro') {
    return (
      <section className={`intro-section ${fadeOut ? 'fade-out' : ''}`}>
        {step === 'entrance' && (
          <div className="entrance-screen">
            <div className="entrance-text animate-fade-in">
              <p>第三章</p>
              <p>CHAPTER 3</p>
            </div>
          </div>
        )}

        {step === 'title' && (
          <div className="title-screen">
            <div className="title-content animate-scale-in">
              <span className="chapter-index">CHAPTER 3</span>
              <h1>{SCRIPT.ch3_title}</h1>
              <p className="subtitle">{SCRIPT.ch3_subtitle}</p>
            </div>
          </div>
        )}

        {step === 'narration1' && (
          <div className="narration-screen">
            <div className="narration-box">
              <p className="narration-text animate-typewriter">
                {SCRIPT.ch3_intro_narration_1}
              </p>
            </div>
          </div>
        )}

        {step === 'narration2' && (
          <div className="narration-screen">
            <div className="narration-box">
              <p className="narration-text animate-typewriter">
                {SCRIPT.ch3_intro_narration_2}
              </p>
            </div>
          </div>
        )}
      </section>
    );
  }

  // 渲染NPC对话
  if (phase === 'npc_greeting') {
    return (
      <section className={`intro-section npc-phase ${fadeOut ? 'fade-out' : ''}`}>
        <div className="npc-screen" onClick={handleNPCClick}>
          <div className="npc-container">
            {/* NPC头像 */}
            <div className="npc-avatar">
              <div className="avatar-glow"></div>
              <Users size={64} className="npc-icon" />
            </div>

            {/* 对话框 */}
            <div className="dialogue-box">
              <div className="npc-header">
                <h3>{SCRIPT.ch3_npc_name}</h3>
                <span className="npc-title">{SCRIPT.ch3_npc_title}</span>
              </div>
              
              <div className="dialogue-content">
                <p className="animate-typewriter">
                  {npcDialogues[npcDialogueIndex]}
                </p>
              </div>

              {npcDialogueIndex === npcDialogues.length - 1 ? (
                <button className="start-btn">
                  开始探索
                  <ArrowRight size={18} />
                </button>
              ) : (
                <span className="click-hint">点击继续</span>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return null;
};
