import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BULLET_COMMENTS_POOL } from '../../data';
import './BulletCatchMinigame.scss';

interface BulletCatchMinigameProps {
  onComplete: () => void;
}

interface ActiveBullet {
  id: number;
  text: string;
  x: number;
  y: number;
  speed: number;
  isTarget: boolean;
  caught: boolean;
}

export const BulletCatchMinigame: React.FC<BulletCatchMinigameProps> = ({ onComplete }) => {
  const [gameStatus, setGameStatus] = useState<'ready' | 'playing' | 'ended'>('ready');
  const [bullets, setBullets] = useState<ActiveBullet[]>([]);
  const [score, setScore] = useState(0);
  const [targetsCaught, setTargetsCaught] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [combo, setCombo] = useState(0);
  
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const bulletIdRef = useRef(0);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastSpawnTimeRef = useRef(0);

  // 目标弹幕列表
  const targetTerms = ['YYDS', '破防了', '芜湖起飞', '绝绝子'];

  // 生成新弹幕
  const spawnBullet = useCallback(() => {
    const pool = BULLET_COMMENTS_POOL;
    const randomItem = pool[Math.floor(Math.random() * pool.length)];
    
    const newBullet: ActiveBullet = {
      id: bulletIdRef.current++,
      text: randomItem.text,
      x: gameAreaRef.current?.clientWidth || 800,
      y: Math.random() * ((gameAreaRef.current?.clientHeight || 400) - 40) + 20,
      speed: 2 + Math.random() * 3,
      isTarget: randomItem.isTarget,
      caught: false
    };
    
    setBullets(prev => [...prev, newBullet]);
  }, []);

  // 游戏主循环
  useEffect(() => {
    if (gameStatus !== 'playing') return;

    const gameLoop = (timestamp: number) => {
      // 生成新弹幕
      if (timestamp - lastSpawnTimeRef.current > 500) {
        spawnBullet();
        lastSpawnTimeRef.current = timestamp;
      }

      // 更新弹幕位置
      setBullets(prev => 
        prev
          .map(bullet => ({
            ...bullet,
            x: bullet.x - bullet.speed
          }))
          .filter(bullet => bullet.x > -200 && !bullet.caught)
      );

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameStatus, spawnBullet]);

  // 倒计时
  useEffect(() => {
    if (gameStatus !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameStatus('ended');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStatus]);

  // 点击弹幕
  const handleBulletClick = (bullet: ActiveBullet) => {
    if (bullet.caught) return;

    // 标记为已捕获
    setBullets(prev => 
      prev.map(b => b.id === bullet.id ? { ...b, caught: true } : b)
    );

    if (bullet.isTarget) {
      // 捕获目标弹幕
      setScore(prev => prev + 100 + combo * 20);
      setCombo(prev => prev + 1);
      
      if (!targetsCaught.includes(bullet.text)) {
        setTargetsCaught(prev => [...prev, bullet.text]);
      }
    } else {
      // 点击了非目标弹幕
      setScore(prev => Math.max(0, prev - 50));
      setCombo(0);
    }
  };

  // 开始游戏
  const startGame = () => {
    setGameStatus('playing');
    setBullets([]);
    setScore(0);
    setTargetsCaught([]);
    setTimeLeft(30);
    setCombo(0);
    bulletIdRef.current = 0;
    lastSpawnTimeRef.current = 0;
  };

  // 检查是否收集完所有目标
  const allTargetsCaught = targetTerms.every(term => targetsCaught.includes(term));

  return (
    <div className="bullet-catch-minigame">
      {/* 准备状态 */}
      {gameStatus === 'ready' && (
        <div className="ready-screen">
          <div className="stream-preview">
            <div className="stream-header">
              <span className="live-badge">🔴 LIVE</span>
              <span className="viewer-count">👁 12.3万</span>
            </div>
            <div className="stream-content">
              <h3>🎮 弹幕捕捉挑战</h3>
              <p>在模拟直播间中，点击捕捉目标弹幕！</p>
              <div className="target-list">
                <p>目标弹幕：</p>
                <div className="targets">
                  {targetTerms.map((term, i) => (
                    <span key={i} className="target-term">{term}</span>
                  ))}
                </div>
              </div>
              <p className="warning">⚠️ 注意：点击非目标弹幕会扣分！</p>
            </div>
          </div>
          <button className="start-btn" onClick={startGame}>
            开始捕捉
          </button>
        </div>
      )}

      {/* 游戏中 */}
      {gameStatus === 'playing' && (
        <div className="playing-screen">
          {/* 游戏HUD */}
          <div className="game-hud">
            <div className="hud-left">
              <span className="live-badge">🔴 LIVE</span>
              <span className="time">⏱ {timeLeft}s</span>
            </div>
            <div className="hud-center">
              <span className="score">SCORE: {score}</span>
              {combo > 1 && <span className="combo">{combo} COMBO!</span>}
            </div>
            <div className="hud-right">
              <span className="progress">
                {targetsCaught.length}/{targetTerms.length} 目标
              </span>
            </div>
          </div>

          {/* 弹幕区域 */}
          <div className="game-area" ref={gameAreaRef}>
            {/* 模拟直播画面 */}
            <div className="stream-bg">
              <div className="streamer-avatar">🎮</div>
              <div className="chat-overlay">
                <p>主播: 来看看大家的弹幕~</p>
              </div>
            </div>

            {/* 弹幕 */}
            {bullets.map(bullet => (
              <div
                key={bullet.id}
                className={`bullet ${bullet.isTarget ? 'target' : 'normal'} ${bullet.caught ? 'caught' : ''}`}
                style={{
                  left: bullet.x,
                  top: bullet.y
                }}
                onClick={() => handleBulletClick(bullet)}
              >
                {bullet.text}
              </div>
            ))}
          </div>

          {/* 已捕获的目标 */}
          <div className="caught-targets">
            <span>已捕获：</span>
            {targetTerms.map((term, i) => (
              <span 
                key={i} 
                className={`target-chip ${targetsCaught.includes(term) ? 'caught' : ''}`}
              >
                {targetsCaught.includes(term) ? '✓' : '○'} {term}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 游戏结束 */}
      {gameStatus === 'ended' && (
        <div className="ended-screen">
          <div className="result-header">
            <span className="result-icon">{allTargetsCaught ? '🎉' : '⏰'}</span>
            <h3>{allTargetsCaught ? '完美捕获！' : '时间到！'}</h3>
          </div>

          <div className="result-stats">
            <div className="stat-item">
              <span className="label">最终得分</span>
              <span className="value">{score}</span>
            </div>
            <div className="stat-item">
              <span className="label">捕获目标</span>
              <span className="value">{targetsCaught.length}/{targetTerms.length}</span>
            </div>
          </div>

          <div className="caught-summary">
            <p>捕获的弹幕：</p>
            <div className="caught-list">
              {targetsCaught.map((term, i) => (
                <span key={i} className="caught-term">{term}</span>
              ))}
            </div>
          </div>

          <div className="unlocked-terms">
            <p>解锁黑话：</p>
            <div className="term-list">
              <span className="term">YYDS</span>
              <span className="term">破防</span>
              <span className="term">芜湖</span>
              <span className="term">绝绝子</span>
            </div>
          </div>

          {targetsCaught.length >= 2 ? (
            <button className="continue-btn" onClick={onComplete}>
              获取碎片 →
            </button>
          ) : (
            <button className="retry-btn" onClick={startGame}>
              再试一次
            </button>
          )}
        </div>
      )}
    </div>
  );
};
