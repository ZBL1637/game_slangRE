import React, { useState } from 'react';
import { GACHA_POOL } from '../../data';
import { GachaResult } from '../../types';
import './GachaMinigame.scss';

interface GachaMinigameProps {
  onComplete: () => void;
}

export const GachaMinigame: React.FC<GachaMinigameProps> = ({ onComplete }) => {
  const [pulls, setPulls] = useState<GachaResult[]>([]);
  const [currentPull, setCurrentPull] = useState<GachaResult | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [pullCount, setPullCount] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [playerType, setPlayerType] = useState<'欧皇' | '非酋' | '普通玩家'>('普通玩家');

  // 计算抽卡概率
  const getRandomResult = (): GachaResult => {
    const rand = Math.random();
    let rarity: 'common' | 'rare' | 'epic' | 'legendary';
    
    if (rand < 0.6) rarity = 'common';
    else if (rand < 0.85) rarity = 'rare';
    else if (rand < 0.97) rarity = 'epic';
    else rarity = 'legendary';

    const pool = GACHA_POOL.filter(item => item.rarity === rarity);
    return pool[Math.floor(Math.random() * pool.length)];
  };

  // 单抽
  const handleSinglePull = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    const result = getRandomResult();
    
    // 抽卡动画
    setTimeout(() => {
      setCurrentPull(result);
      setPulls(prev => [...prev, result]);
      setPullCount(prev => prev + 1);
      setIsAnimating(false);
    }, 1000);
  };

  // 十连抽
  const handleTenPull = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    const results: GachaResult[] = [];
    for (let i = 0; i < 10; i++) {
      results.push(getRandomResult());
    }
    
    // 十连动画
    setTimeout(() => {
      setPulls(prev => [...prev, ...results]);
      setPullCount(prev => prev + 10);
      // 显示最高稀有度的结果
      const bestResult = results.reduce((best, curr) => {
        const rarityOrder = { legendary: 4, epic: 3, rare: 2, common: 1 };
        return rarityOrder[curr.rarity] > rarityOrder[best.rarity] ? curr : best;
      }, results[0]);
      setCurrentPull(bestResult);
      setIsAnimating(false);
    }, 1500);
  };

  // 结束抽卡，查看总结
  const handleFinish = () => {
    // 计算玩家类型
    const legendaryCount = pulls.filter(p => p.rarity === 'legendary').length;
    const epicCount = pulls.filter(p => p.rarity === 'epic').length;
    
    if (legendaryCount >= 2 || (legendaryCount >= 1 && pullCount <= 20)) {
      setPlayerType('欧皇');
    } else if (legendaryCount === 0 && epicCount <= 1 && pullCount >= 30) {
      setPlayerType('非酋');
    } else {
      setPlayerType('普通玩家');
    }
    
    setShowSummary(true);
  };

  // 获取稀有度颜色
  const _getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'gold';
      case 'epic': return 'purple';
      case 'rare': return 'blue';
      default: return 'gray';
    }
  };

  // 获取稀有度中文名
  const getRarityName = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return '传说';
      case 'epic': return '史诗';
      case 'rare': return '稀有';
      default: return '普通';
    }
  };

  return (
    <div className="gacha-minigame">
      {!showSummary ? (
        <>
          {/* 抽卡池展示 */}
          <div className="gacha-banner">
            <div className="banner-content">
              <h3>🎰 命运抽卡池</h3>
              <p>体验「欧皇」与「非酋」的悲欢</p>
              <div className="rates">
                <span className="rate gold">传说 3%</span>
                <span className="rate purple">史诗 12%</span>
                <span className="rate blue">稀有 25%</span>
                <span className="rate gray">普通 60%</span>
              </div>
            </div>
          </div>

          {/* 抽卡结果展示 */}
          <div className="pull-result-area">
            {isAnimating ? (
              <div className="animating">
                <div className="card-flip">
                  <div className="card-back">?</div>
                </div>
                <p>命运转动中...</p>
              </div>
            ) : currentPull ? (
              <div className={`result-card ${currentPull.rarity}`}>
                <div className="card-glow"></div>
                <div className="rarity-badge">{getRarityName(currentPull.rarity)}</div>
                <h4 className="term-name">{currentPull.term}</h4>
                <p className="term-desc">{currentPull.description}</p>
              </div>
            ) : (
              <div className="empty-result">
                <p>点击下方按钮开始抽卡</p>
              </div>
            )}
          </div>

          {/* 抽卡按钮 */}
          <div className="pull-buttons">
            <button 
              className="single-pull"
              onClick={handleSinglePull}
              disabled={isAnimating}
            >
              单抽 ×1
            </button>
            <button 
              className="ten-pull"
              onClick={handleTenPull}
              disabled={isAnimating}
            >
              十连 ×10
            </button>
          </div>

          {/* 抽卡统计 */}
          <div className="pull-stats">
            <span>已抽: {pullCount} 次</span>
            <span>传说: {pulls.filter(p => p.rarity === 'legendary').length}</span>
            <span>史诗: {pulls.filter(p => p.rarity === 'epic').length}</span>
          </div>

          {/* 结束按钮 */}
          {pullCount >= 10 && (
            <button className="finish-btn" onClick={handleFinish}>
              结束抽卡，查看命运 →
            </button>
          )}

          {/* 抽卡历史 */}
          {pulls.length > 0 && (
            <div className="pull-history">
              <h4>抽卡记录</h4>
              <div className="history-list">
                {pulls.slice(-20).map((pull, i) => (
                  <span 
                    key={i} 
                    className={`history-item ${pull.rarity}`}
                    title={pull.description}
                  >
                    {pull.term}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        /* 抽卡总结 */
        <div className="summary-screen">
          <div className={`player-type-reveal ${playerType === '欧皇' ? 'lucky' : playerType === '非酋' ? 'unlucky' : 'normal'}`}>
            <div className="type-icon">
              {playerType === '欧皇' ? '👑' : playerType === '非酋' ? '🥀' : '🎮'}
            </div>
            <h3>你的命运是...</h3>
            <h2 className="type-name">{playerType}</h2>
          </div>

          <div className="summary-stats">
            <div className="stat-item">
              <span className="label">总抽数</span>
              <span className="value">{pullCount}</span>
            </div>
            <div className="stat-item gold">
              <span className="label">传说</span>
              <span className="value">{pulls.filter(p => p.rarity === 'legendary').length}</span>
            </div>
            <div className="stat-item purple">
              <span className="label">史诗</span>
              <span className="value">{pulls.filter(p => p.rarity === 'epic').length}</span>
            </div>
          </div>

          <div className="unlocked-terms">
            <p>解锁黑话：</p>
            <div className="term-list">
              <span className="term">氪金</span>
              <span className="term">肝</span>
              <span className="term">欧皇</span>
              <span className="term">非酋</span>
              <span className="term">保底</span>
            </div>
          </div>

          <div className="wisdom-quote">
            <p>「玄不救非，氪不改命」</p>
            <span>—— 手游时代的至理名言</span>
          </div>

          <button className="continue-btn" onClick={onComplete}>
            获取碎片 →
          </button>
        </div>
      )}
    </div>
  );
};
