import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { QTE_SEQUENCES } from '../../data';
import { Coins, RotateCcw } from 'lucide-react';
import './QTEMinigame.scss';

interface QTEMinigameProps {
  onComplete: () => void;
}

type GameStatus = 'ready' | 'playing' | 'success' | 'failed';

export const QTEMinigame: React.FC<QTEMinigameProps> = ({ onComplete }) => {
  const [status, setStatus] = useState<GameStatus>('ready');
  const [currentSequenceIndex, setCurrentSequenceIndex] = useState(0);
  const [currentKeyIndex, setCurrentKeyIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [maxTime, setMaxTime] = useState(0);
  const [combo, setCombo] = useState(0);
  const [showFeedback, setShowFeedback] = useState<'hit' | 'miss' | null>(null);
  const [showKonamiTooltip, setShowKonamiTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const tooltipTimerRef = useRef<NodeJS.Timeout | null>(null);
  const triggerRef = useRef<HTMLSpanElement>(null);

  const currentSequence = QTE_SEQUENCES[currentSequenceIndex];
  const currentKey = currentSequence?.[currentKeyIndex];

  // Tooltip interaction
  const handleMouseEnterTooltip = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      // Position above the trigger
      setTooltipPos({
        top: rect.top - 12, // 12px gap
        left: rect.left + rect.width / 2
      });
    }
    tooltipTimerRef.current = setTimeout(() => {
      setShowKonamiTooltip(true);
    }, 200);
  };

  const handleMouseLeaveTooltip = () => {
    if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
    setTimeout(() => {
      setShowKonamiTooltip(false);
    }, 150);
  };

  // Start Game
  const startGame = () => {
    setStatus('playing');
    setCurrentSequenceIndex(0);
    setCurrentKeyIndex(0);
    setCombo(0);
    if (QTE_SEQUENCES[0] && QTE_SEQUENCES[0][0]) {
      setTimeLeft(QTE_SEQUENCES[0][0].timing);
      setMaxTime(QTE_SEQUENCES[0][0].timing);
    }
  };

  // Timer logic
  useEffect(() => {
    if (status !== 'playing' || !currentKey) return;
    
    // Reset timer when key changes
    setTimeLeft(currentKey.timing);
    setMaxTime(currentKey.timing);
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          handleMiss();
          return 0;
        }
        return prev - 50;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [currentKeyIndex, status]); // Removed currentSequenceIndex to avoid double reset if not needed

  // Handle Miss
  const handleMiss = useCallback(() => {
    setShowFeedback('miss');
    setCombo(0);
    // Deduct time or score? User said "deduct 0.5s" (optional) or just fail.
    // Let's keep it simple: visual feedback + shake.
    setTimeout(() => setShowFeedback(null), 250);
  }, []);

  // Handle Key Press
  useEffect(() => {
    if (status !== 'playing') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!currentKey) return;
      
      const isCorrect = e.code === currentKey.key;

      if (isCorrect) {
        // Hit
        setShowFeedback('hit');
        setCombo(prev => prev + 1);
        setTimeout(() => setShowFeedback(null), 200);

        // Next Key
        if (currentKeyIndex < currentSequence.length - 1) {
          setCurrentKeyIndex(prev => prev + 1);
        } else {
          // Sequence Complete
          setStatus('success');
        }
      } else {
        // Miss
        handleMiss();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, currentKey, currentKeyIndex, combo, handleMiss]);

  // Render Key Sequence
  const renderKeySequence = () => {
    if (!currentSequence) return null;
    
    return (
      <div className="key-sequence-display">
        {currentSequence.map((keyItem, index) => {
          let stateClass = '';
          if (index < currentKeyIndex) stateClass = 'completed';
          else if (index === currentKeyIndex) stateClass = status === 'playing' ? 'active' : '';
          
          return (
            <div key={index} className={`keycap ${stateClass} ${showFeedback === 'miss' && index === currentKeyIndex ? 'shake' : ''}`}>
              <span className="key-char">{keyItem.displayKey}</span>
              {index < currentKeyIndex && <span className="checkmark">✓</span>}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="qte-minigame-container">
      
      {/* 2) Challenge Description Bar */}
      <div className="challenge-desc-bar">
        <div className="desc-content">
          <h3>街机搓招挑战</h3>
          <p>
            在限定时间内完成连招输入。本关连招为 
            <span 
              className="konami-trigger"
              ref={triggerRef}
              onMouseEnter={handleMouseEnterTooltip}
              onMouseLeave={handleMouseLeaveTooltip}
            >
              科乐美秘技
            </span>
            {showKonamiTooltip && createPortal(
              <div 
                className="pixel-tooltip-portal"
                style={{
                  top: tooltipPos.top,
                  left: tooltipPos.left,
                }}
              >
                <div className="pixel-tooltip">
                  <div className="tooltip-header">
                    <span className="title">科乐美秘技</span>
                    <span className="tag">秘籍 / 彩蛋</span>
                  </div>
                  <div className="tooltip-body">
                    <p className="def">电子游戏史上最著名的作弊代码，最早出现于《格拉迪乌斯》。</p>
                    <p className="input">常见输入：上上↓↓←→←→BA</p>
                    <div className="tags">
                      <span>FC</span><span>街机</span><span>魂斗罗</span>
                    </div>
                  </div>
                  <div className="tooltip-arrow"></div>
                </div>
              </div>,
              document.body
            )}
            ：
            <span className="code-preview">↑ ↑ ↓ ↓ ← → ← → B A</span>
          </p>
        </div>
      </div>

      {/* 3) Core Challenge Area */}
      <div className={`core-challenge-area ${status === 'playing' ? 'active-mode' : ''}`}>
        
        {/* Timer & Progress (Only in playing) */}
        {status === 'playing' && (
          <div className="game-hud">
            <div className="timer-section">
              <div className="timer-bar-bg">
                <div 
                  className={`timer-bar-fill ${showFeedback === 'miss' ? 'flash-red' : ''}`} 
                  style={{ width: `${(timeLeft / maxTime) * 100}%` }}
                ></div>
              </div>
              <span className="timer-text">剩余 {(timeLeft / 1000).toFixed(1)}s</span>
            </div>
            <div className="progress-text">
              步骤 {currentKeyIndex + 1} / {currentSequence.length}
            </div>
          </div>
        )}

        {/* Visual Sequence */}
        {status === 'ready' || status === 'playing' ? (
          <div className="sequence-stage">
            {renderKeySequence()}
          </div>
        ) : null}

        {/* Feedback Overlay */}
        {status === 'playing' && showFeedback === 'hit' && combo > 1 && (
          <div className="combo-feedback">
            <span className="count">{combo}</span>
            <span className="label">COMBO!</span>
          </div>
        )}

        {/* Controls */}
        <div className="controls-area">
          {status === 'ready' && (
            <div className="start-actions">
              <button className="coin-btn" onClick={startGame}>
                <div className="coin-slot">
                  <Coins size={18} />
                </div>
                <span>投币开始</span>
              </button>
              <p className="control-hint">提示：键盘方向键 + B/A</p>
            </div>
          )}

          {status === 'playing' && (
             <div className="playing-actions">
               <button className="reset-btn" onClick={startGame}>
                 <RotateCcw size={14} /> 重试
               </button>
             </div>
          )}

          {status === 'success' && (
            <div className="success-feedback">
               <div className="success-text">COMBO FINISHED!</div>
               <div className="drop-notification">
                 <span>获得：时间碎片 #1</span>
               </div>
               <button className="continue-btn" onClick={onComplete}>
                 领取奖励
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
