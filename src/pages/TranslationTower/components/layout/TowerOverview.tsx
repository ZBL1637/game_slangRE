// TowerOverview - 通天塔概览
import React, { useState, useEffect } from 'react';
import './TowerOverview.scss';

interface TowerOverviewProps {
  narrationText: string;
  onEnterChallenges: () => void;
}

export const TowerOverview: React.FC<TowerOverviewProps> = ({
  narrationText,
  onEnterChallenges
}) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="tower-overview-section">
      {/* 塔的视觉效果 */}
      <div className="tower-visual">
        <div className="tower-structure">
          <div className="tower-top">
            <div className="tower-spire">🔮</div>
          </div>
          <div className="tower-body">
            <div className="tower-floor floor-3">
              <span className="floor-icon">🔗</span>
              <span className="floor-name">文化隐喻</span>
            </div>
            <div className="tower-floor floor-2">
              <span className="floor-icon">🔄</span>
              <span className="floor-name">风格转换</span>
            </div>
            <div className="tower-floor floor-1">
              <span className="floor-icon">🔤</span>
              <span className="floor-name">关键词翻译</span>
            </div>
          </div>
          <div className="tower-base">
            <span className="base-text">集市入口</span>
          </div>
        </div>

        {/* 流动的文字 */}
        <div className="flowing-texts">
          {['翻译', 'Translation', '文化', 'Culture', '理解', 'Understanding'].map((text, i) => (
            <span 
              key={i} 
              className="flowing-text"
              style={{ 
                animationDelay: `${i * 0.5}s`,
                left: `${10 + i * 15}%`
              }}
            >
              {text}
            </span>
          ))}
        </div>
      </div>

      {/* 内容区域 */}
      {showContent && (
        <div className="content-area animate-fade-in-up">
          <div className="description-card">
            <p>{narrationText}</p>
          </div>

          {/* 集市场景 */}
          <div className="market-scene">
            <h3>塔下集市</h3>
            <div className="merchants-preview">
              <div className="merchant-bubble">
                <span className="merchant-avatar">🧔</span>
                <div className="speech-bubble confused">
                  <p>"神装"？是卖衣服的吗？</p>
                </div>
              </div>
              <div className="merchant-bubble">
                <span className="merchant-avatar">👳</span>
                <div className="speech-bubble confused">
                  <p>"开黑"？要去黑暗的地方？</p>
                </div>
              </div>
              <div className="local-player">
                <span className="player-avatar">🎮</span>
                <div className="speech-bubble">
                  <p>有没有人来开黑？带你上分！</p>
                </div>
              </div>
            </div>
          </div>

          <button className="enter-btn" onClick={onEnterChallenges}>
            <span className="btn-icon">🏛️</span>
            <span className="btn-text">进入翻译圣坛</span>
          </button>
        </div>
      )}
    </section>
  );
};
