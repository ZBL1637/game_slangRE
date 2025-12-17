// ============================================================================
// VictoryScreen - 胜利画面
// ============================================================================

import React, { useState } from 'react';
import { FinalChapterState } from '../../types';
import { ENDING_TEXT, NARRATION_TEXTS } from '../../data';
import './VictoryScreen.scss';

interface VictoryScreenProps {
  gameState: FinalChapterState;
  onRestart: () => void;
}

type VictoryPhase = 'boss_defeat' | 'narration' | 'ending' | 'summary';

const VictoryScreen: React.FC<VictoryScreenProps> = ({ gameState, onRestart }) => {
  const [phase, setPhase] = useState<VictoryPhase>('boss_defeat');

  const handleClick = () => {
    switch (phase) {
      case 'boss_defeat':
        setPhase('narration');
        break;
      case 'narration':
        setPhase('ending');
        break;
      case 'ending':
        setPhase('summary');
        break;
    }
  };

  const renderContent = () => {
    switch (phase) {
      case 'boss_defeat':
        return (
          <div className="boss-defeat-screen" onClick={handleClick}>
            <div className="defeat-animation">
              <div className="boss-dissolving">
                <div className="dissolve-particles">
                  {[...Array(50)].map((_, i) => (
                    <div
                      key={i}
                      className="particle"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 2}s`
                      }}
                    />
                  ))}
                </div>
                <div className="boss-fading">🌀</div>
              </div>
              <div className="defeat-text">
                <h2>算法霸主被击败了！</h2>
                <p>"不可能...我是完美的算法..."</p>
              </div>
            </div>
            <span className="click-hint">点击继续</span>
          </div>
        );

      case 'narration':
        return (
          <div className="narration-screen" onClick={handleClick}>
            <div className="clearing-storm">
              <div className="stars">
                {[...Array(100)].map((_, i) => (
                  <div
                    key={i}
                    className="star"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 3}s`
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="narration-box">
              <p className="narration-text">{NARRATION_TEXTS.victory}</p>
            </div>
            <span className="click-hint">点击继续</span>
          </div>
        );

      case 'ending':
        return (
          <div className="ending-screen" onClick={handleClick}>
            <div className="ending-content">
              <div className="ending-icon">✨</div>
              <div className="ending-text">
                {ENDING_TEXT.victory.split('\n\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>
            <span className="click-hint">点击继续</span>
          </div>
        );

      case 'summary':
        return (
          <div className="summary-screen">
            <div className="summary-card">
              <div className="victory-badge">
                <span className="badge-icon">🏆</span>
                <span className="badge-text">游戏通关</span>
              </div>
              
              <h2>战斗总结</h2>
              
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-label">总回合数</span>
                  <span className="stat-value">{gameState.currentTurn}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">剩余生命</span>
                  <span className="stat-value">{gameState.player.currentHp}/{gameState.player.maxHp}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Boss最终血量</span>
                  <span className="stat-value">0/{gameState.boss.maxHp}</span>
                </div>
              </div>

              <div className="skills-used">
                <h3>技能回顾</h3>
                <div className="skills-list">
                  {gameState.player.skills.map(skill => (
                    <div key={skill.id} className="skill-review">
                      <span className="skill-icon">{skill.icon}</span>
                      <div className="skill-info">
                        <span className="skill-name">{skill.name}</span>
                        <span className="skill-source">{skill.chapterSource}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="action-buttons">
                <button className="restart-btn" onClick={onRestart}>
                  重新挑战
                </button>
                <button className="gallery-btn" onClick={() => window.location.href = '/'}>
                  返回主页
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="victory-screen-container">
      {renderContent()}
    </div>
  );
};

export default VictoryScreen;
