import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import { SCRIPT } from '../../data';
import './OutroSection.scss';

interface OutroSectionProps {
  onComplete: () => void;
}

export const OutroSection: React.FC<OutroSectionProps> = ({ onComplete }) => {
  const [step, setStep] = useState<'narration1' | 'narration2' | 'summary' | 'complete'>('narration1');
  const navigate = useNavigate();

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    timers.push(setTimeout(() => setStep('narration2'), 3500));
    timers.push(setTimeout(() => setStep('summary'), 7000));

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="outro-section">
      {/* 叙述1 */}
      {step === 'narration1' && (
        <div className="narration-screen">
          <div className="narration-box animate-fade-in">
            <p className="narration-text">
              {SCRIPT.ch4_outro_narration_1}
            </p>
          </div>
        </div>
      )}

      {/* 叙述2 */}
      {step === 'narration2' && (
        <div className="narration-screen">
          <div className="narration-box animate-fade-in">
            <p className="narration-text">
              {SCRIPT.ch4_outro_narration_2}
            </p>
          </div>
        </div>
      )}

      {/* 章节总结 */}
      {(step === 'summary' || step === 'complete') && (
        <div className="summary-screen animate-fade-in">
          <div className="summary-card">
            <div className="chapter-badge">
              <span>第四章</span>
            </div>
            
            <h2>章节完成</h2>
            <h3>{SCRIPT.ch4_title}</h3>

            <div className="achievements">
              <div className="achievement-item">
                <span className="icon">📊</span>
                <span className="text">完成玩家光谱分析</span>
              </div>
              <div className="achievement-item">
                <span className="icon">😊</span>
                <span className="text">完成情感极性透视</span>
              </div>
              <div className="achievement-item">
                <span className="icon">🎭</span>
                <span className="text">完成术语类别情感分布</span>
              </div>
              <div className="achievement-item">
                <span className="icon">🎮</span>
                <span className="text">完成多游戏术语分布</span>
              </div>
              <div className="achievement-item">
                <span className="icon">🎯</span>
                <span className="text">获得技能「{SCRIPT.ch4_skill_name}」</span>
              </div>
            </div>

            <div className="skill-reminder">
              <h4>已获得技能</h4>
              <div className="skill-card">
                <div className="skill-icon">🎯</div>
                <div className="skill-info">
                  <span className="skill-name">{SCRIPT.ch4_skill_name}</span>
                  <span className="skill-desc">{SCRIPT.ch4_skill_effect}</span>
                </div>
              </div>
            </div>

            <div className="next-chapter">
              <MapPin size={16} />
              <span>下一站：译语通天塔</span>
            </div>

            <button className="continue-btn" onClick={() => navigate('/chapter/5')} style={{ marginTop: '0.75rem' }}>
              前往下一章
              <ArrowRight size={18} />
            </button>

            <button className="continue-btn" onClick={onComplete}>
              返回世界地图
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
