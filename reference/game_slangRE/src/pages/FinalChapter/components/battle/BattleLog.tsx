// ============================================================================
// BattleLog - 战斗日志组件
// ============================================================================

import React, { useRef, useEffect } from 'react';
import { BattleLogEntry } from '../../types';
import './BattleLog.scss';

interface BattleLogProps {
  logs: BattleLogEntry[];
}

const BattleLog: React.FC<BattleLogProps> = ({ logs }) => {
  const logContainerRef = useRef<HTMLDivElement>(null);

  // 自动滚动到最新日志
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const getActorIcon = (actor: BattleLogEntry['actor']) => {
    switch (actor) {
      case 'player': return '🎮';
      case 'boss': return '👁️';
      case 'system': return '📢';
    }
  };

  const getActorClass = (actor: BattleLogEntry['actor']) => {
    switch (actor) {
      case 'player': return 'player-log';
      case 'boss': return 'boss-log';
      case 'system': return 'system-log';
    }
  };

  return (
    <div className="battle-log">
      <div className="log-header">
        <span className="log-icon">📜</span>
        <span className="log-title">战斗日志</span>
      </div>
      <div className="log-container" ref={logContainerRef}>
        {logs.map((log, index) => (
          <div key={index} className={`log-entry ${getActorClass(log.actor)}`}>
            <div className="log-meta">
              <span className="turn-badge">回合 {log.turn}</span>
              <span className="actor-icon">{getActorIcon(log.actor)}</span>
            </div>
            <div className="log-content">
              <span className="action-name">{log.action}</span>
              <span className="action-detail">{log.detail}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BattleLog;
