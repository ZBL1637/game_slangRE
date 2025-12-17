// OutroSection - 章节结束
import React, { useState } from 'react';
import './OutroSection.scss';

interface OutroSectionProps {
  narrationText: string;
  completedChallenges: number;
  skillName: string;
  onContinue: () => void;
}

type OutroPhase = 'narration' | 'summary';

export const OutroSection: React.FC<OutroSectionProps> = ({
  narrationText,
  completedChallenges,
  skillName,
  onContinue
}) => {
  const [phase, setPhase] = useState<OutroPhase>('narration');

  const handleNarrationClick = () => {
    setPhase('summary');
  };

  return (
    <section className="outro-section">
      {/* 叙述阶段 */}
      {phase === 'narration' && (
        <div className="narration-screen animate-fade-in" onClick={handleNarrationClick}>
          <div className="narration-box">
            <p className="narration-text">{narrationText}</p>
          </div>
          <span className="click-hint">点击继续</span>
        </div>
      )}

      {/* 总结阶段 */}
      {phase === 'summary' && (
        <div className="summary-screen animate-fade-in-up">
          <div className="summary-card">
            <div className="chapter-badge">
              <span>第五章完成</span>
            </div>
            <h2>译语通天塔</h2>
            <h3>Tower of Translation</h3>

            <div className="achievements">
              <div className="achievement-item">
                <span className="icon">✅</span>
                <span className="text">完成 {completedChallenges} 个翻译圣坛挑战</span>
              </div>
              <div className="achievement-item">
                <span className="icon">✅</span>
                <span className="text">成功帮助波斯商人理解黑话</span>
              </div>
              <div className="achievement-item">
                <span className="icon">✅</span>
                <span className="text">掌握异化与归化翻译策略</span>
              </div>
            </div>

            <div className="skill-reminder">
              <h4>获得新技能</h4>
              <div className="skill-card">
                <span className="skill-icon">🔮</span>
                <div className="skill-info">
                  <span className="skill-name">{skillName}</span>
                  <span className="skill-desc">转化Boss攻击类型，30%几率转为治疗</span>
                </div>
              </div>
            </div>

            <div className="next-chapter">
              <span>🏰</span>
              <span>下一章：终章·魔王城</span>
            </div>

            <button className="continue-btn" onClick={onContinue}>
              前往终章 →
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
