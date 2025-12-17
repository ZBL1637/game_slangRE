import React, { useState } from 'react';
import { TimelineEra } from '../../types';
import { QTEMinigame } from '../interactive/QTEMinigame';
import { CardPlacementMinigame } from '../interactive/CardPlacementMinigame';
import { GachaMinigame } from '../interactive/GachaMinigame';
import { BulletCatchMinigame } from '../interactive/BulletCatchMinigame';
import { X, BookOpen, Gamepad2, Gift } from 'lucide-react';
import chip1 from '../../../../assets/images/chip1.png';
import chip2 from '../../../../assets/images/chip2.png';
import chip3 from '../../../../assets/images/chip3.png';
import chip4 from '../../../../assets/images/chip4.png';
import './EraExplorer.scss';

interface EraExplorerProps {
  era: TimelineEra;
  onComplete: () => void;
  onExit: () => void;
}

type ExplorerPhase = 'intro' | 'history' | 'minigame' | 'reward';

export const EraExplorer: React.FC<EraExplorerProps> = ({ era, onComplete, onExit }) => {
  const [phase, setPhase] = useState<ExplorerPhase>('intro');
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [, setMinigameCompleted] = useState(false);

  // 处理历史事件导航
  const handleNextEvent = () => {
    if (currentEventIndex < era.events.length - 1) {
      setCurrentEventIndex(prev => prev + 1);
    } else {
      setPhase('minigame');
    }
  };

  const handlePrevEvent = () => {
    if (currentEventIndex > 0) {
      setCurrentEventIndex(prev => prev - 1);
    }
  };

  // 处理小游戏完成
  const handleMinigameComplete = () => {
    setMinigameCompleted(true);
    setPhase('reward');
  };

  // 渲染对应的小游戏
  const renderMinigame = () => {
    switch (era.minigame.type) {
      case 'qte':
        return <QTEMinigame onComplete={handleMinigameComplete} />;
      case 'card_placement':
        return <CardPlacementMinigame onComplete={handleMinigameComplete} />;
      case 'gacha':
        return <GachaMinigame onComplete={handleMinigameComplete} />;
      case 'bullet_catch':
        return <BulletCatchMinigame onComplete={handleMinigameComplete} />;
      default:
        return null;
    }
  };

  const getChipImage = (eraId: string) => {
    switch (eraId) {
      case 'arcade': return chip1;
      case 'pc': return chip2;
      case 'mobile': return chip3;
      case 'modern': return chip4;
      default: return chip1;
    }
  };

  return (
    <div className="era-explorer-overlay">
      <div className="era-explorer-modal">
        {/* 关闭按钮 */}
        <button className="close-btn" onClick={onExit}>
          <X size={24} />
        </button>

        {/* 头部 */}
        <div className="explorer-header">
          <span className="era-icon">{era.icon}</span>
          <div className="era-title">
            <h2>{era.name}</h2>
            <p>{era.period}</p>
          </div>
        </div>

        {/* 阶段指示器 */}
        <div className="phase-indicator">
          <div className={`phase-dot ${phase === 'history' ? '' : 'completed'}`} title="背景/设定">
            <BookOpen size={16} />
          </div>
          <div className="phase-line"></div>
          <div className={`phase-dot ${phase === 'history' ? 'active' : ['minigame', 'reward'].includes(phase) ? 'completed' : ''}`} title="历史事件">
            <BookOpen size={16} />
          </div>
          <div className="phase-line"></div>
          <div className={`phase-dot ${phase === 'minigame' ? 'active' : phase === 'reward' ? 'completed' : ''}`} title="挑战模式">
            <Gamepad2 size={16} />
          </div>
          <div className="phase-line"></div>
          <div className={`phase-dot ${phase === 'reward' ? 'active' : ''}`} title="奖励">
            <Gift size={16} />
          </div>
        </div>

        {/* 内容区域 */}
        <div className="explorer-content">
          
          {/* 介绍阶段 */}
          {phase === 'intro' && (
            <div className="intro-phase">
              <p className="era-description">{era.description}</p>
              <div className="action-area">
                <button className="primary-btn" onClick={() => setPhase('history')}>
                  探索历史事件 →
                </button>
              </div>
            </div>
          )}

          {/* 历史事件阶段 */}
          {phase === 'history' && (
            <div className="history-phase">
              <div className="event-card">
                <div className="event-header">
                  <span className="event-year">{era.events[currentEventIndex].year}</span>
                  <h3>{era.events[currentEventIndex].title}</h3>
                </div>
                
                <div className="event-details">
                  {era.events[currentEventIndex].details.map((detail, i) => (
                    <p key={i}>{detail}</p>
                  ))}
                </div>
                
                <div className="event-keywords">
                  {era.events[currentEventIndex].keywords.map((keyword, i) => (
                    <span key={i} className="keyword-chip">{keyword}</span>
                  ))}
                </div>
              </div>
              
              <div className="navigation">
                <button 
                  className="nav-btn"
                  onClick={handlePrevEvent}
                  disabled={currentEventIndex === 0}
                >
                  ← 上一个
                </button>
                <span className="event-counter">
                  {currentEventIndex + 1} / {era.events.length}
                </span>
                <button 
                  className="nav-btn primary"
                  onClick={handleNextEvent}
                >
                  {currentEventIndex === era.events.length - 1 ? '开始挑战 →' : '下一个 →'}
                </button>
              </div>
            </div>
          )}

          {/* 小游戏阶段 */}
          {phase === 'minigame' && (
            <div className={`minigame-phase ${era.minigame.type === 'qte' || era.minigame.type === 'card_placement' ? 'no-header' : ''}`}>
              {era.minigame.type !== 'qte' && era.minigame.type !== 'card_placement' && (
                <div className="minigame-header">
                  <h3>{era.minigame.title}</h3>
                  <p>{era.minigame.instructions}</p>
                </div>
              )}
              
              <div className={`minigame-container ${era.minigame.type}`}>
                {renderMinigame()}
              </div>
            </div>
          )}

          {/* 奖励阶段 */}
          {phase === 'reward' && (
            <div className="reward-phase">
              <div className="reward-animation">
                <div className="fragment-glow"></div>
                <img 
                  src={getChipImage(era.id)} 
                  alt="Time Fragment" 
                  className="fragment-img-large" 
                />
              </div>
              
              <h3>获得时间碎片！</h3>
              <div className="fragment-card">
                <h4>{era.fragment.name}</h4>
                <p>{era.fragment.description}</p>
                <div className="fragment-keywords">
                  {era.fragment.keywords.map((kw, i) => (
                    <span key={i} className="keyword-tag">{kw}</span>
                  ))}
                </div>
              </div>
              
              <button className="primary-btn" onClick={onComplete}>
                收下碎片，继续探索 →
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
