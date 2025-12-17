// ============================================================================
// PlayerDisplay - 玩家显示组件
// ============================================================================

import React from 'react';
import { PlayerState } from '../../types';
import './PlayerDisplay.scss';

interface PlayerDisplayProps {
  player: PlayerState;
  isAnimating: boolean;
}

const PlayerDisplay: React.FC<PlayerDisplayProps> = ({ player, isAnimating }) => {
  const hpPercent = (player.currentHp / player.maxHp) * 100;

  // 根据血量百分比决定颜色
  const getHpColor = () => {
    if (hpPercent > 60) return 'healthy';
    if (hpPercent > 30) return 'warning';
    return 'danger';
  };

  return (
    <div className="player-display">
      <div className={`player-entity ${isAnimating ? 'animating' : ''}`}>
        {/* 玩家头像 */}
        <div className="player-avatar">
          <div className="avatar-glow" />
          <div className="avatar-icon">🎮</div>
          
          {/* 护盾效果 */}
          {player.shield > 0 && (
            <div className="shield-indicator">
              <span className="shield-icon">🛡️</span>
              <span className="shield-value">{player.shield}%</span>
            </div>
          )}
        </div>

        {/* 玩家信息 */}
        <div className="player-info">
          <div className="player-name">
            <span className="name-text">{player.name}</span>
          </div>

          {/* 血条 */}
          <div className="hp-bar-container">
            <div className={`hp-bar ${getHpColor()}`}>
              <div
                className="hp-fill"
                style={{ width: `${hpPercent}%` }}
              />
              <div className="hp-text">
                ❤️ {player.currentHp} / {player.maxHp}
              </div>
            </div>
          </div>

          {/* 状态效果 */}
          {player.statusEffects.length > 0 && (
            <div className="status-effects">
              {player.statusEffects.map(effect => (
                <div
                  key={effect.id}
                  className={`effect-badge ${effect.type}`}
                  title={`${effect.name} (${effect.remainingTurns}回合)`}
                >
                  <span className="effect-icon">{effect.icon}</span>
                  <span className="effect-turns">{effect.remainingTurns}</span>
                </div>
              ))}
            </div>
          )}

          {/* 暴击提升指示 */}
          {player.critBoost > 0 && (
            <div className="crit-boost-indicator">
              <span className="boost-icon">⚡</span>
              <span className="boost-text">暴击+{player.critBoost}%</span>
            </div>
          )}

          {/* 伤害转化指示 */}
          {player.damageConvert && (
            <div className="convert-indicator">
              <span className="convert-icon">🔮</span>
              <span className="convert-text">伤害转化已激活</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerDisplay;
