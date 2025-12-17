import React, { useState, useEffect } from 'react';
import { SCRIPT, NPC_OPTIONS } from '../../data';
import { Clock } from 'lucide-react';
import bgImage from '../../../../assets/images/2background.png';
import timelordImg from '../../../../assets/images/timelord.png';
import { DialogBox } from '../../../TutorialVillage/components/DialogBox';
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
  const [bgLoaded, setBgLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = bgImage;
    img.onload = () => {
      setBgLoaded(true);
    };
    img.onerror = () => {
      console.error("Failed to load background image:", bgImage);
      // Even if failed, we might want to set loaded to true to show what we have (or fallback)
      // But since we have a parent background color, maybe keep it false? 
      // Let's set it to true so at least it tries to render, or debug easier.
      setBgLoaded(true); 
    };
    
    // Safety timeout
    const timer = setTimeout(() => {
      if (!img.complete) {
        setBgLoaded(true);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

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

  const [npcIntroIndex, setNpcIntroIndex] = useState(0);

  const npcIntroDialogues = [
    SCRIPT.ch2_npc_intro_1,
    SCRIPT.ch2_npc_intro_2,
    `[TASK] ${SCRIPT.ch2_npc_task}`
  ];

  // 处理NPC介绍点击
  const handleNpcIntroNext = () => {
    if (npcIntroIndex < npcIntroDialogues.length - 1) {
      setNpcIntroIndex(prev => prev + 1);
    } else {
      setStep('npc_choice');
    }
  };

  // 处理旁白点击
  const handleNarrationClick = () => {
    if (narrationIndex < narrations.length - 1) {
      setNarrationIndex(prev => prev + 1);
    } else {
      setStep('npc_intro');
    }
  };

  // Handle NPC option selection
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
      
      {/* Background with zoom animation */}
      <div 
        className={`intro-bg ${bgLoaded ? 'loaded' : ''}`} 
        style={{ backgroundImage: `url(${bgImage})` }} 
      />

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
        <DialogBox
          speaker=""
          text={narrations[narrationIndex]}
          onNext={handleNarrationClick}
          showNextArrow={true}
        />
      )}

      {/* NPC介绍 */}
      {step === 'npc_intro' && (
        <DialogBox
          speaker={SCRIPT.ch2_npc_name}
          text={npcIntroDialogues[npcIntroIndex]}
          onNext={handleNpcIntroNext}
          showNextArrow={true}
          characterImage={timelordImg}
          variant="center"
        />
      )}

      {/* NPC对话选项 */}
      {step === 'npc_choice' && (
        <div className="npc-screen">
          <div className="npc-container">
            {/* Keeping the choice screen as is for now, or could adapt to a choice dialog style */}
             <div className="dialogue-box animate-slide-up rpg-card">
               {/* 角落装饰 */}
               <div className="corner-deco top-left"></div>
               <div className="corner-deco top-right"></div>
               <div className="corner-deco bottom-left"></div>
               <div className="corner-deco bottom-right"></div>

              <div className="npc-header-strip">
                <div className="header-icon-slot">
                  <Clock size={18} />
                </div>
                <h3>{SCRIPT.ch2_npc_name}</h3>
                <div className="header-deco-slot">
                  <div className="deco-dot"></div>
                </div>
              </div>
              
              <div className="choice-list">
                {NPC_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleOptionSelect(opt.response)}
                    className="choice-btn rpg-btn"
                  >
                    <div className="indicator-col">
                      <span className="arrow">▶</span>
                    </div>
                    <span className="btn-text">{opt.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NPC回应 */}
      {step === 'npc_response' && (
        <DialogBox
          speaker={SCRIPT.ch2_npc_name}
          text={npcResponse}
          onNext={finishIntro}
          showNextArrow={true}
          characterImage={timelordImg}
        />
      )}

      {/* 跳过按钮 */}
      <button className="skip-intro-btn" onClick={finishIntro}>
        跳过动画
      </button>

    </section>
  );
};
