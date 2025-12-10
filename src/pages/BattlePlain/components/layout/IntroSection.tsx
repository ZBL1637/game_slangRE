import React, { useState } from 'react';
import { SCRIPT, NPC_OPTIONS } from '../../data';
import { HUD } from './HUD';
import { User, MessageCircle } from 'lucide-react';
import './IntroSection.scss';

interface IntroSectionProps {
  onComplete: () => void;
}

export const IntroSection: React.FC<IntroSectionProps> = ({ onComplete }) => {
  const [step, setStep] = useState<'narration' | 'dialogue_choice' | 'dialogue_result'>('narration');
  const [npcResponse, setNpcResponse] = useState<string>("");

  const handleOptionSelect = (response: string) => {
    setNpcResponse(response);
    setStep('dialogue_result');
  };

  const finishIntro = () => {
    onComplete();
  };

  return (
    <section className="intro-section">
      
      {/* Battle Scene Visuals & Interaction */}
      <div className="battle-scene">
        <div className="title-area">
            <h1 className="chapter-index">{SCRIPT.ch2_title_chapter_index}</h1>
            <h2>{SCRIPT.ch2_title_main}</h2>
            <p className="subtitle">{SCRIPT.ch2_title_sub}</p>
        </div>

        <div className="dialogue-box">
            {/* NPC Header */}
            <div className="npc-header">
                <div className="avatar">
                    <User size={32} className="icon" />
                </div>
                <div className="info">
                    <h3>{SCRIPT.ch2_npc_captain_name}</h3>
                    <p>LV. ?? ?? ??</p>
                </div>
            </div>

            {/* Content Switcher */}
            <div className="dialogue-content">
                {step === 'narration' && (
                    <div className="narration-step">
                        <p className="text">"{SCRIPT.ch2_dialog_captain_intro_1}"</p>
                        <p className="shout">{SCRIPT.ch2_dialog_captain_intro_2}</p>
                        <div className="action-area">
                             <button onClick={() => setStep('dialogue_choice')} className="respond-btn">
                                 <MessageCircle size={18} />
                                 回应团长
                             </button>
                        </div>
                    </div>
                )}

                {step === 'dialogue_choice' && (
                    <div className="choice-step">
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
                )}

                {step === 'dialogue_result' && (
                    <div className="result-step">
                        <p className="response-text">
                            {npcResponse}
                        </p>
                        <button onClick={finishIntro} className="start-btn">
                            开启技能树教程
                        </button>
                    </div>
                )}
            </div>
        </div>

        {/* HUD overlays the battle scene */}
        <HUD />
      </div>
    </section>
  );
};
