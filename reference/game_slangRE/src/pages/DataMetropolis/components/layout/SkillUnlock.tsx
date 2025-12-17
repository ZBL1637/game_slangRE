import React, { useState, useEffect } from 'react';
import { Sparkles, Target } from 'lucide-react';
import { SCRIPT } from '../../data';
import './SkillUnlock.scss';

interface SkillUnlockProps {
  onUnlock: () => void;
}

export const SkillUnlock: React.FC<SkillUnlockProps> = ({ onUnlock }) => {
  const [step, setStep] = useState<'intro' | 'reveal' | 'details'>('intro');
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    timers.push(setTimeout(() => setStep('reveal'), 2000));
    timers.push(setTimeout(() => setShowParticles(true), 2500));
    timers.push(setTimeout(() => setStep('details'), 4000));

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="skill-unlock-overlay">
      <div className="skill-unlock-container">
        {/* 粒子效果 */}
        {showParticles && (
          <div className="particles">
            {Array.from({ length: 20 }).map((_, i) => (
              <div 
                key={i} 
                className="particle"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.5}s`,
                  animationDuration: `${1 + Math.random()}s`
                }}
              />
            ))}
          </div>
        )}

        {/* 介绍文字 */}
        {step === 'intro' && (
          <div className="intro-text animate-fade-in">
            <p>{SCRIPT.ch4_skill_unlock_text}</p>
          </div>
        )}

        {/* 技能揭示 */}
        {(step === 'reveal' || step === 'details') && (
          <div className="skill-reveal">
            {/* 技能图标 */}
            <div className={`skill-icon-container ${step === 'reveal' ? 'animate-scale-in' : ''}`}>
              <div className="icon-glow"></div>
              <div className="icon-ring"></div>
              <div className="skill-icon">
                <Target size={48} />
              </div>
            </div>

            {/* 技能名称 */}
            <div className={`skill-name ${step === 'reveal' ? 'animate-fade-in-up' : ''}`}>
              <Sparkles size={20} className="sparkle-icon" />
              <h2>{SCRIPT.ch4_skill_name}</h2>
              <Sparkles size={20} className="sparkle-icon" />
            </div>

            <p className="skill-english">{SCRIPT.ch4_skill_english}</p>

            {/* 技能详情 */}
            {step === 'details' && (
              <div className="skill-details animate-fade-in">
                <p className="skill-desc">{SCRIPT.ch4_skill_desc}</p>
                
                <div className="skill-effect">
                  <h4>技能效果</h4>
                  <ul>
                    <li>洞察Boss的当前弱点</li>
                    <li>接下来3回合内所有攻击暴击率提升50%</li>
                    <li>冷却时间：4回合</li>
                  </ul>
                </div>

                <div className="skill-lore">
                  <p>
                    "数据不会说谎，但需要有人去解读。
                    你已经掌握了从数据中发现敌人弱点的能力。"
                  </p>
                </div>

                <button className="confirm-btn" onClick={onUnlock}>
                  <Sparkles size={18} />
                  获得技能
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
