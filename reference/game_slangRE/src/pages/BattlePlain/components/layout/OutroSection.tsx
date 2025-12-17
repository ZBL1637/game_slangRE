import React, { useState } from 'react';
import { SCRIPT } from '../../data';
import { ArrowRight } from 'lucide-react';
import './OutroSection.scss';

interface OutroSectionProps {
  onComplete: () => void;
}

export const OutroSection: React.FC<OutroSectionProps> = ({ onComplete }) => {
  const [narrationIndex, setNarrationIndex] = useState(0);
  const [showButton, setShowButton] = useState(false);

  const narrations = [
    SCRIPT.ch2_outro_narration_1,
    SCRIPT.ch2_outro_narration_2,
    SCRIPT.ch2_outro_narration_3,
    SCRIPT.ch2_outro_narration_4
  ];

  // 处理点击继续
  const handleClick = () => {
    if (narrationIndex < narrations.length - 1) {
      setNarrationIndex(prev => prev + 1);
    } else {
      setShowButton(true);
    }
  };

  return (
    <div className="outro-section" onClick={!showButton ? handleClick : undefined}>
      <div className="outro-content">
        {/* 章节回顾 */}
        <div className="chapter-recap">
          <span className="chapter-tag">CHAPTER 2 COMPLETE</span>
          <h2>战斗本体平原</h2>
          <p className="subtitle">时光档案馆探索完成</p>
        </div>

        {/* 旁白文字 */}
        <div className="narration-box">
          <p className="narration-text">
            {narrations[narrationIndex]}
          </p>
          {!showButton && (
            <span className="click-hint">
              点击继续 ({narrationIndex + 1}/{narrations.length})
            </span>
          )}
        </div>

        {/* 收获总结 */}
        {showButton && (
          <div className="rewards-summary">
            <h3>本章收获</h3>
            <div className="rewards-grid">
              <div className="reward-item">
                <span className="reward-icon">💎</span>
                <span className="reward-label">时间碎片</span>
                <span className="reward-value">×4</span>
              </div>
              <div className="reward-item">
                <span className="reward-icon">🧭</span>
                <span className="reward-label">时之罗盘</span>
                <span className="reward-value">×1</span>
              </div>
              <div className="reward-item skill">
                <span className="reward-icon">⏸️</span>
                <span className="reward-label">时之凝固</span>
                <span className="reward-value">技能</span>
              </div>
              <div className="reward-item">
                <span className="reward-icon">✨</span>
                <span className="reward-label">经验值</span>
                <span className="reward-value">+300</span>
              </div>
            </div>
          </div>
        )}

        {/* 下一章预告 */}
        {showButton && (
          <div className="next-chapter-preview">
            <span className="preview-label">下一章</span>
            <h3>玩家生态城镇</h3>
            <p>一个用词就能给人贴上标签的世界</p>
          </div>
        )}

        {/* 继续按钮 */}
        {showButton && (
          <button className="continue-btn" onClick={onComplete}>
            返回世界地图
            <ArrowRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
};
