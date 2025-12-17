// ============================================================================
// BossDisplay - Boss显示组件
// ============================================================================

import React from 'react';
import { BossState, MinionState } from '../../types';
import './BossDisplay.scss';

interface BossDisplayProps {
  boss: BossState;
  minions: MinionState[];
  isAnimating: boolean;
  currentAnimation: string | null;
}

const BossDisplay: React.FC<BossDisplayProps> = ({
  boss,
  minions,
  
  currentAnimation
}) => {
  const hpPercent = (boss.currentHp / boss.maxHp) * 100;
  const aliveMinions = minions.filter(m => m.isAlive);

  return (
    <div className="boss-display">
      {/* Boss主体 */}
      <div className={`boss-entity ${boss.isStunned ? 'stunned' : ''} ${boss.isCharging ? 'charging' : ''}`}>
        {/* Boss视觉效果 */}
        <div className="boss-visual">
          {/* 数据流环绕 */}
          <div className="data-streams">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="stream"
                style={{
                  transform: `rotate(${i * 30}deg)`,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>

          {/* Boss核心 */}
          <div className="boss-core">
            <div className="core-glow" />
            <div className="boss-icon">
              {boss.isCharging ? '🌀' : boss.isStunned ? '❄️' : '👁️'}
            </div>
          </div>

          {/* 护盾效果 */}
          {boss.shield > 0 && (
            <div className="shield-effect">
              <div className="shield-ring" />
              <div className="shield-particles">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="particle" style={{ animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>
            </div>
          )}

          {/* 充能效果 */}
          {boss.isCharging && (
            <div className="charge-effect">
              <div className="charge-ring" />
              <div className="charge-progress">
                <span>{boss.chargeProgress}/3</span>
              </div>
            </div>
          )}

          {/* 眩晕效果 */}
          {boss.isStunned && (
            <div className="stun-effect">
              <div className="stun-stars">
                {[...Array(5)].map((_, i) => (
                  <span key={i} style={{ animationDelay: `${i * 0.2}s` }}>⭐</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Boss信息 */}
        <div className="boss-info">
          <div className="boss-name">
            <span className="name-text">{boss.name}</span>
            <span className="name-english">The Algorithm Overlord</span>
          </div>

          {/* 血条 */}
          <div className="hp-bar-container">
            <div className="hp-bar">
              <div
                className="hp-fill"
                style={{ width: `${hpPercent}%` }}
              />
              <div className="hp-text">
                {boss.currentHp} / {boss.maxHp}
              </div>
            </div>
          </div>

          {/* 状态效果 */}
          {boss.statusEffects.length > 0 && (
            <div className="status-effects">
              {boss.statusEffects.map(effect => (
                <div key={effect.id} className="effect-badge" title={effect.name}>
                  <span className="effect-icon">{effect.icon}</span>
                  <span className="effect-turns">{effect.remainingTurns}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 小怪显示 */}
      {aliveMinions.length > 0 && (
        <div className="minions-container">
          <div className="minions-label">守门人</div>
          <div className="minions-list">
            {aliveMinions.map(minion => (
              <div key={minion.id} className="minion-entity">
                <div className="minion-icon">🧱</div>
                <div className="minion-hp-bar">
                  <div
                    className="hp-fill"
                    style={{ width: `${(minion.currentHp / minion.maxHp) * 100}%` }}
                  />
                </div>
                <div className="minion-hp-text">
                  {minion.currentHp}/{minion.maxHp}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BossDisplay;
