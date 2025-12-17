import React, { useState, useEffect } from 'react';
import { SCRIPT } from '../../data';
import { Clock } from 'lucide-react';
import './SkillUnlock.scss';

interface SkillUnlockProps {
  onUnlock: () => void;
}

export const SkillUnlock: React.FC<SkillUnlockProps> = ({ onUnlock }) => {
  const [phase, setPhase] = useState<'compass' | 'npc' | 'skill'>('compass');

  useEffect(() => {
    // 自动播放动画序列
    const timer1 = setTimeout(() => setPhase('npc'), 2500);
    const timer2 = setTimeout(() => setPhase('skill'), 5500);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="skill-unlock-overlay">
      <div className="skill-unlock-content">
        
        {/* 罗盘合成动画 */}
        {phase === 'compass' && (
          <div className="compass-phase">
            <div className="compass-animation">
              <div className="fragment fragment-1">💎</div>
              <div className="fragment fragment-2">💎</div>
              <div className="fragment fragment-3">💎</div>
              <div className="fragment fragment-4">💎</div>
              <div className="compass-center">
                <div className="compass-glow"></div>
                <span className="compass-icon">🧭</span>
              </div>
            </div>
            <h2>时之罗盘成形中...</h2>
          </div>
        )}

        {/* NPC对话 */}
        {phase === 'npc' && (
          <div className="npc-phase">
            <div className="npc-avatar">
              <div className="avatar-glow"></div>
              <Clock size={64} className="npc-icon" />
            </div>
            <div className="npc-dialogue">
              <h3>{SCRIPT.ch2_npc_name}</h3>
              <p className="dialogue-text">{SCRIPT.ch2_skill_unlock_text}</p>
            </div>
          </div>
        )}

        {/* 技能获得 */}
        {phase === 'skill' && (
          <div className="skill-phase">
            <div className="skill-animation">
              <div className="skill-glow"></div>
              <div className="skill-icon">
                <Clock size={48} />
              </div>
            </div>
            
            <div className="skill-info">
              <span className="skill-label">新技能获得</span>
              <h2 className="skill-name">{SCRIPT.ch2_skill_name}</h2>
              <p className="skill-desc">{SCRIPT.ch2_skill_desc}</p>
              
              <div className="skill-effect">
                <div className="effect-icon">⏸️</div>
                <div className="effect-text">
                  <span className="effect-label">战斗效果</span>
                  <span className="effect-value">使Boss 2回合无法行动</span>
                </div>
              </div>
            </div>
            
            <button className="unlock-btn" onClick={onUnlock}>
              接受力量 →
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
