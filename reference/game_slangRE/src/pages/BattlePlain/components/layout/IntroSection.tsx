import React, { useState, useEffect } from 'react';
import { SCRIPT, NPC_OPTIONS } from '../../data';
import { MessageCircle, Clock } from 'lucide-react';
import './IntroSection.scss';

interface IntroSectionProps {
  onComplete: () => void;
}

type IntroStep = 'entrance' | 'title' | 'narration' | 'npc_intro' | 'npc_choice' | 'npc_response';

export const IntroSection: React.FC<IntroSectionProps> = ({ onComplete }) => {
  const [step, setStep] = useState<IntroStep>('entrance');
  const [narrationIndex, setNarrationIndex] = useState(0);
  const [npcResponse, setNpcResponse] = useState<string>("");
  const [fadeOut, setFadeOut] = useState(false);

  const narrations = [
    SCRIPT.ch2_intro_narration_1,
    SCRIPT.ch2_intro_narration_2,
    SCRIPT.ch2_intro_narration_3,
    SCRIPT.ch2_intro_narration_4
  ];

  // 入场动画序列
  useEffect(() => {
    if (step === 'entrance') {
      const timer = setTimeout(() => setStep('title'), 2000);
      return () => clearTimeout(timer);
    }
    if (step === 'title') {
      const timer = setTimeout(() => setStep('narration'), 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // 处理旁白点击
  const handleNarrationClick = () => {
    if (narrationIndex < narrations.length - 1) {
      setNarrationIndex(prev => prev + 1);
    } else {
      setStep('npc_intro');
    }
  };

  // 处理NPC对话选项
  const handleOptionSelect = (response: string) => {
    setNpcResponse(response);
    setStep('npc_response');
  };

  // 完成介绍
  const finishIntro = () => {
    setFadeOut(true);
    setTimeout(() => onComplete(), 500);
  };

  return (
    <section className={`intro-section ${fadeOut ? 'fade-out' : ''}`}>
      
      {/* 入场黑屏 */}
      {step === 'entrance' && (
        <div className="entrance-screen">
          <div className="entrance-text animate-fade-in">
            <p>你离开了新手村...</p>
            <p>踏上了通往战斗本体平原的道路</p>
          </div>
        </div>
      )}

      {/* 章节标题 */}
      {step === 'title' && (
        <div className="title-screen">
          <div className="title-content animate-scale-in">
            <p className="chapter-index">{SCRIPT.ch2_title_chapter_index}</p>
            <h1>{SCRIPT.ch2_title_main}</h1>
            <p className="subtitle">{SCRIPT.ch2_title_sub}</p>
          </div>
        </div>
      )}

      {/* 旁白 */}
      {step === 'narration' && (
        <div className="narration-screen" onClick={handleNarrationClick}>
          <div className="narration-box">
            <p className="narration-text animate-typewriter">
              {narrations[narrationIndex]}
            </p>
            <div className="click-hint">
              点击继续 ({narrationIndex + 1}/{narrations.length})
            </div>
          </div>
        </div>
      )}

      {/* NPC介绍 */}
      {step === 'npc_intro' && (
        <div className="npc-screen">
          <div className="npc-container">
            {/* NPC形象 */}
            <div className="npc-avatar">
              <div className="avatar-glow"></div>
              <Clock size={64} className="npc-icon" />
            </div>
            
            {/* 对话框 */}
            <div className="dialogue-box animate-slide-up">
              <div className="npc-header">
                <h3>{SCRIPT.ch2_npc_name}</h3>
                <span className="npc-title">时光档案馆守护者</span>
              </div>
              
              <div className="dialogue-content">
                <p>{SCRIPT.ch2_npc_intro_1}</p>
                <p>{SCRIPT.ch2_npc_intro_2}</p>
                <p className="task-text">{SCRIPT.ch2_npc_task}</p>
              </div>
              
              <button 
                className="continue-btn"
                onClick={() => setStep('npc_choice')}
              >
                <MessageCircle size={18} />
                回应守护者
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NPC对话选项 */}
      {step === 'npc_choice' && (
        <div className="npc-screen">
          <div className="npc-container">
            <div className="npc-avatar">
              <div className="avatar-glow"></div>
              <Clock size={64} className="npc-icon" />
            </div>
            
            <div className="dialogue-box animate-slide-up">
              <div className="npc-header">
                <h3>{SCRIPT.ch2_npc_name}</h3>
              </div>
              
              <div className="choice-list">
                {NPC_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleOptionSelect(opt.response)}
                    className="choice-btn"
                  >
                    <span className="arrow">➢</span>
                    <span>{opt.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NPC回应 */}
      {step === 'npc_response' && (
        <div className="npc-screen">
          <div className="npc-container">
            <div className="npc-avatar">
              <div className="avatar-glow"></div>
              <Clock size={64} className="npc-icon" />
            </div>
            
            <div className="dialogue-box animate-slide-up">
              <div className="npc-header">
                <h3>{SCRIPT.ch2_npc_name}</h3>
              </div>
              
              <div className="dialogue-content">
                <p className="response-text">{npcResponse}</p>
              </div>
              
              <button 
                className="start-btn"
                onClick={finishIntro}
              >
                开始探索时间之路 →
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
