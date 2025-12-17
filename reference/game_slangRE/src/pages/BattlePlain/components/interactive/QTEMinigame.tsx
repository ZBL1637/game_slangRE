import React, { useState, useEffect, useCallback } from 'react';
import { QTE_SEQUENCES } from '../../data';
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
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [showFeedback, setShowFeedback] = useState<'hit' | 'miss' | null>(null);
  const [attempts, setAttempts] = useState(0);

  const currentSequence = QTE_SEQUENCES[currentSequenceIndex];
  const currentKey = currentSequence?.[currentKeyIndex];

  // 开始游戏
  const startGame = () => {
    setStatus('playing');
    setCurrentSequenceIndex(0);
    setCurrentKeyIndex(0);
    setScore(0);
    setCombo(0);
    setTimeLeft(currentSequence[0].timing);
  };

  // 重置当前按键的计时器
  useEffect(() => {
    if (status !== 'playing' || !currentKey) return;
    
    setTimeLeft(currentKey.timing);
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          // 时间耗尽，按键失败
          handleMiss();
          return 0;
        }
        return prev - 50;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [status, currentKeyIndex, currentSequenceIndex]);

  // 处理按键失败
  const handleMiss = useCallback(() => {
    setShowFeedback('miss');
    setCombo(0);
    setTimeout(() => setShowFeedback(null), 300);
    
    setAttempts(prev => prev + 1);
    if (attempts >= 2) {
      // 3次失败后仍然让玩家通过（降低难度）
      setStatus('success');
    } else {
      // 重置当前序列
      setCurrentKeyIndex(0);
    }
  }, [attempts]);

  // 处理键盘输入
  useEffect(() => {
    if (status !== 'playing') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!currentKey) return;
      
      // 检查按键是否正确
      const isCorrect = e.code === currentKey.key || 
        (currentKey.key === 'ArrowRight' && e.key === 'ArrowRight') ||
        (currentKey.key === 'ArrowDown' && e.key === 'ArrowDown') ||
        (currentKey.key === 'ArrowLeft' && e.key === 'ArrowLeft') ||
        (currentKey.key === 'ArrowUp' && e.key === 'ArrowUp');

      if (isCorrect) {
        // 按键成功
        setShowFeedback('hit');
        setScore(prev => prev + 100 + combo * 10);
        setCombo(prev => prev + 1);
        setTimeout(() => setShowFeedback(null), 200);

        // 进入下一个按键
        if (currentKeyIndex < currentSequence.length - 1) {
          setCurrentKeyIndex(prev => prev + 1);
        } else {
          // 当前序列完成
          if (currentSequenceIndex < QTE_SEQUENCES.length - 1) {
            setCurrentSequenceIndex(prev => prev + 1);
            setCurrentKeyIndex(0);
          } else {
            // 所有序列完成
            setStatus('success');
          }
        }
      } else {
        // 按键错误
        handleMiss();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, currentKey, currentKeyIndex, currentSequence, currentSequenceIndex, combo, handleMiss]);

  // 渲染按键序列
  const renderKeySequence = () => {
    if (!currentSequence) return null;
    
    return (
      <div className="key-sequence">
        {currentSequence.map((key, index) => (
          <div 
            key={index}
            className={`key-box ${
              index < currentKeyIndex ? 'completed' : 
              index === currentKeyIndex ? 'active' : ''
            }`}
          >
            <span className="key-display">{key.displayKey}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="qte-minigame">
      {/* 准备状态 */}
      {status === 'ready' && (
        <div className="ready-screen">
          <div className="arcade-frame">
            <h3>🕹️ 街机搓招挑战</h3>
            <p>按照屏幕提示，在限定时间内按下正确的方向键！</p>
            <div className="key-hint">
              <span>使用键盘方向键 ↑↓←→ 和 Z 键</span>
            </div>
            <button className="start-btn" onClick={startGame}>
              投币开始
            </button>
          </div>
        </div>
      )}

      {/* 游戏中 */}
      {status === 'playing' && (
        <div className="playing-screen">
          {/* 招式名称 */}
          <div className="move-name">
            {currentSequenceIndex === 0 ? '波动拳' : '升龙拳'}
          </div>
          
          {/* 按键序列 */}
          {renderKeySequence()}
          
          {/* 当前按键提示 */}
          <div className={`current-key ${showFeedback}`}>
            <span className="key-prompt">{currentKey?.displayKey}</span>
            <div className="timing-bar">
              <div 
                className="timing-fill"
                style={{ width: `${(timeLeft / (currentKey?.timing || 1000)) * 100}%` }}
              ></div>
            </div>
          </div>
          
          {/* 反馈效果 */}
          {showFeedback === 'hit' && (
            <div className="feedback hit">PERFECT!</div>
          )}
          {showFeedback === 'miss' && (
            <div className="feedback miss">MISS!</div>
          )}
          
          {/* 分数和连击 */}
          <div className="score-display">
            <span className="score">SCORE: {score}</span>
            {combo > 1 && <span className="combo">{combo} COMBO!</span>}
          </div>
        </div>
      )}

      {/* 成功 */}
      {status === 'success' && (
        <div className="success-screen">
          <div className="success-animation">
            <span className="success-icon">🎮</span>
            <h3>挑战完成！</h3>
            <p className="final-score">最终得分: {score}</p>
            <div className="unlocked-terms">
              <p>解锁黑话：</p>
              <div className="term-list">
                <span className="term">放雷</span>
                <span className="term">勾死了</span>
                <span className="term">搓招</span>
              </div>
            </div>
            <button className="continue-btn" onClick={onComplete}>
              获取碎片 →
            </button>
          </div>
        </div>
      )}

      {/* 失败（实际上不会触发，因为我们降低了难度） */}
      {status === 'failed' && (
        <div className="failed-screen">
          <h3>💀 挑战失败</h3>
          <button onClick={startGame}>再试一次</button>
        </div>
      )}
    </div>
  );
};
