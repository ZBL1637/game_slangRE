// ============================================================================
// TurnIndicator - 回合指示器组件
// ============================================================================

import React from 'react';
import './TurnIndicator.scss';

interface TurnIndicatorProps {
  currentTurn: number;
  maxTurns: number;
  isPlayerTurn: boolean;
}

const TurnIndicator: React.FC<TurnIndicatorProps> = ({
  currentTurn,
  maxTurns,
  isPlayerTurn
}) => {
  const remainingTurns = maxTurns - currentTurn + 1;
  const progressPercent = ((currentTurn - 1) / maxTurns) * 100;

  // 根据剩余回合数决定紧迫程度
  const getUrgencyClass = () => {
    if (remainingTurns <= 3) return 'critical';
    if (remainingTurns <= 5) return 'warning';
    return 'normal';
  };

  return (
    <div className="turn-indicator">
      <div className="turn-info">
        <div className="turn-number">
          <span className="label">回合</span>
          <span className="value">{currentTurn}</span>
          <span className="separator">/</span>
          <span className="max">{maxTurns}</span>
        </div>
        
        <div className={`turn-owner ${isPlayerTurn ? 'player' : 'boss'}`}>
          <span className="owner-icon">{isPlayerTurn ? '🎮' : '👁️'}</span>
          <span className="owner-text">{isPlayerTurn ? '你的回合' : 'Boss回合'}</span>
        </div>
      </div>

      <div className="turn-progress">
        <div className="progress-bar">
          <div
            className={`progress-fill ${getUrgencyClass()}`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className={`remaining-turns ${getUrgencyClass()}`}>
          {remainingTurns > 0 ? (
            <span>剩余 {remainingTurns} 回合</span>
          ) : (
            <span>最后一回合！</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TurnIndicator;
