// ============================================================================
// DefeatScreen - 失败画面
// ============================================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FinalChapterState } from '../../types';
import { ENDING_TEXT, NARRATION_TEXTS, NPC_DIALOGUES } from '../../data';
import './DefeatScreen.scss';

interface DefeatScreenProps {
  gameState: FinalChapterState;
  onRestart: () => void;
}

type DefeatPhase = 'boss_triumph' | 'narration' | 'ending' | 'retry';

const DefeatScreen: React.FC<DefeatScreenProps> = ({ gameState, onRestart }) => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<DefeatPhase>('boss_triumph');

  const handleClick = () => {
    switch (phase) {
      case 'boss_triumph':
        setPhase('narration');
        break;
      case 'narration':
        setPhase('ending');
        break;
      case 'ending':
        setPhase('retry');
        break;
    }
  };

  const renderContent = () => {
    switch (phase) {
      case 'boss_triumph':
        return (
          <div className="boss-triumph-screen" onClick={handleClick}>
            <div className="triumph-animation">
              <div className="boss-empowered">
                <div className="power-surge">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className="surge-ring"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
                <div className="boss-icon">🌀</div>
              </div>
              <div className="triumph-text">
                <h2>信息过载协议启动！</h2>
                <p>{NPC_DIALOGUES.defeat[0].text}</p>
              </div>
            </div>
            <span className="click-hint">点击继续</span>
          </div>
        );

      case 'narration':
        return (
          <div className="narration-screen" onClick={handleClick}>
            <div className="collapsing-world">
              <div className="glitch-effect">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className="glitch-line"
                    style={{
                      top: `${i * 10}%`,
                      animationDelay: `${Math.random() * 0.5}s`
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="narration-box">
              <p className="narration-text">{NARRATION_TEXTS.defeat}</p>
            </div>
            <span className="click-hint">点击继续</span>
          </div>
        );

      case 'ending':
        return (
          <div className="ending-screen" onClick={handleClick}>
            <div className="ending-content">
              <div className="ending-icon">💔</div>
              <div className="ending-text">
                {ENDING_TEXT.defeat.split('\n\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>
            <span className="click-hint">点击继续</span>
          </div>
        );

      case 'retry':
        return (
          <div className="retry-screen">
            <div className="retry-card">
              <div className="defeat-badge">
                <span className="badge-icon">💀</span>
                <span className="badge-text">战斗失败</span>
              </div>
              
              <h2>战斗总结</h2>
              
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-label">坚持回合</span>
                  <span className="stat-value">{gameState.currentTurn}/{gameState.maxTurns}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Boss剩余血量</span>
                  <span className="stat-value">{gameState.boss.currentHp}/{gameState.boss.maxHp}</span>
                </div>
              </div>

              <div className="tips-section">
                <h3>战斗提示</h3>
                <ul className="tips-list">
                  <li>
                    <span className="tip-icon">⏱️</span>
                    <span>使用"时之凝固"打断Boss的"终极过滤"充能</span>
                  </li>
                  <li>
                    <span className="tip-icon">🎯</span>
                    <span>在Boss护盾消失后使用"弱点分析"最大化伤害</span>
                  </li>
                  <li>
                    <span className="tip-icon">🔊</span>
                    <span>用"共鸣之声"复制Boss的护盾保护自己</span>
                  </li>
                  <li>
                    <span className="tip-icon">🔮</span>
                    <span>"言灵·转化"有机会将伤害转为治疗</span>
                  </li>
                </ul>
              </div>

              <div className="action-buttons">
                <button className="retry-btn" onClick={onRestart}>
                  <span className="btn-icon">🔄</span>
                  <span>再次挑战</span>
                </button>
                <button className="home-btn" onClick={() => navigate('/') }>
                  返回主页
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="defeat-screen-container">
      {renderContent()}
    </div>
  );
};

export default DefeatScreen;
