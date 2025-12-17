import React, { useState, useEffect, useCallback } from 'react';
import { Database, ArrowRight } from 'lucide-react';
import { SCRIPT } from '../../data';
import './IntroSection.scss';

interface IntroSectionProps {
  onComplete: () => void;
}

type IntroStep = 'entrance' | 'title' | 'narration1' | 'narration2' | 'npc_greeting' | 'npc_task' | 'ready';

export const IntroSection: React.FC<IntroSectionProps> = ({ onComplete }) => {
  const [step, setStep] = useState<IntroStep>('entrance');
  const [fadeOut, setFadeOut] = useState(false);

  // 自动推进步骤
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    if (step === 'entrance') {
      timers.push(setTimeout(() => setStep('title'), 2000));
    } else if (step === 'title') {
      timers.push(setTimeout(() => setStep('narration1'), 3000));
    } else if (step === 'narration1') {
      timers.push(setTimeout(() => setStep('narration2'), 4000));
    } else if (step === 'narration2') {
      timers.push(setTimeout(() => setStep('npc_greeting'), 4000));
    }

    return () => timers.forEach(clearTimeout);
  }, [step]);

  // 处理NPC对话点击
  const handleDialogueClick = useCallback(() => {
    if (step === 'npc_greeting') {
      setStep('npc_task');
    } else if (step === 'npc_task') {
      setStep('ready');
    }
  }, [step]);

  // 开始探索
  const handleStart = useCallback(() => {
    setFadeOut(true);
    setTimeout(onComplete, 500);
  }, [onComplete]);

  return (
    <section className={`intro-section ${fadeOut ? 'fade-out' : ''} ${step.startsWith('npc') || step === 'ready' ? 'npc-phase' : ''}`}>
      {/* 入场屏幕 */}
      {step === 'entrance' && (
        <div className="entrance-screen animate-fade-in">
          <div className="entrance-text">
            <p>第四章</p>
            <p>CHAPTER IV</p>
          </div>
        </div>
      )}

      {/* 标题屏幕 */}
      {step === 'title' && (
        <div className="title-screen animate-fade-in">
          <div className="title-content">
            <span className="chapter-index">CHAPTER IV</span>
            <h1>{SCRIPT.ch4_title}</h1>
            <p className="subtitle">{SCRIPT.ch4_subtitle}</p>
          </div>
        </div>
      )}

      {/* 叙述1 */}
      {step === 'narration1' && (
        <div className="narration-screen animate-fade-in">
          <div className="narration-box">
            <p className="narration-text">{SCRIPT.ch4_intro_narration_1}</p>
          </div>
        </div>
      )}

      {/* 叙述2 */}
      {step === 'narration2' && (
        <div className="narration-screen animate-fade-in">
          <div className="narration-box">
            <p className="narration-text">{SCRIPT.ch4_intro_narration_2}</p>
          </div>
        </div>
      )}

      {/* NPC问候 */}
      {step === 'npc_greeting' && (
        <div className="npc-screen animate-fade-in" onClick={handleDialogueClick}>
          <div className="npc-container">
            <div className="npc-avatar">
              <div className="avatar-glow"></div>
              <Database size={48} className="npc-icon" />
            </div>
            <div className="dialogue-box">
              <div className="npc-header">
                <h3>{SCRIPT.ch4_npc_name}</h3>
                <span className="npc-title">{SCRIPT.ch4_npc_title}</span>
              </div>
              <div className="dialogue-content">
                <p>{SCRIPT.ch4_npc_greeting}</p>
              </div>
              <span className="click-hint">点击继续...</span>
            </div>
          </div>
        </div>
      )}

      {/* NPC任务 */}
      {step === 'npc_task' && (
        <div className="npc-screen animate-fade-in" onClick={handleDialogueClick}>
          <div className="npc-container">
            <div className="npc-avatar">
              <div className="avatar-glow"></div>
              <Database size={48} className="npc-icon" />
            </div>
            <div className="dialogue-box">
              <div className="npc-header">
                <h3>{SCRIPT.ch4_npc_name}</h3>
                <span className="npc-title">{SCRIPT.ch4_npc_title}</span>
              </div>
              <div className="dialogue-content">
                <p>{SCRIPT.ch4_npc_task}</p>
              </div>
              <span className="click-hint">点击继续...</span>
            </div>
          </div>
        </div>
      )}

      {/* 准备开始 */}
      {step === 'ready' && (
        <div className="npc-screen animate-fade-in">
          <div className="npc-container">
            <div className="npc-avatar">
              <div className="avatar-glow"></div>
              <Database size={48} className="npc-icon" />
            </div>
            <div className="dialogue-box">
              <div className="npc-header">
                <h3>{SCRIPT.ch4_npc_name}</h3>
                <span className="npc-title">{SCRIPT.ch4_npc_title}</span>
              </div>
              <div className="dialogue-content">
                <p>准备好了吗？让我们开始数据解谜之旅！</p>
              </div>
              <button className="start-btn" onClick={handleStart}>
                进入数据之城
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
