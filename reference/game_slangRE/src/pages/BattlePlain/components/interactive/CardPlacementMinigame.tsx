import React, { useState } from 'react';
import { ROLE_CARDS, CARD_SLOTS } from '../../data';
import { RoleCard } from '../../types';
import './CardPlacementMinigame.scss';

interface CardPlacementMinigameProps {
  onComplete: () => void;
}

interface PlacedCard {
  slotId: string;
  card: RoleCard | null;
}

export const CardPlacementMinigame: React.FC<CardPlacementMinigameProps> = ({ onComplete }) => {
  const [availableCards, setAvailableCards] = useState<RoleCard[]>([...ROLE_CARDS]);
  const [placedCards, setPlacedCards] = useState<PlacedCard[]>(
    CARD_SLOTS.map(slot => ({ slotId: slot.id, card: null }))
  );
  const [selectedCard, setSelectedCard] = useState<RoleCard | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [feedback, setFeedback] = useState<string[]>([]);

  // 选择卡牌
  const handleSelectCard = (card: RoleCard) => {
    setSelectedCard(card);
  };

  // 放置卡牌到槽位
  const handlePlaceCard = (slotId: string) => {
    if (!selectedCard) return;

    // 检查槽位是否已有卡牌
    const existingPlacement = placedCards.find(p => p.slotId === slotId);
    if (existingPlacement?.card) {
      // 将原卡牌放回可用列表
      setAvailableCards(prev => [...prev, existingPlacement.card!]);
    }

    // 放置新卡牌
    setPlacedCards(prev => prev.map(p => 
      p.slotId === slotId ? { ...p, card: selectedCard } : p
    ));

    // 从可用列表移除
    setAvailableCards(prev => prev.filter(c => c.id !== selectedCard.id));
    setSelectedCard(null);
  };

  // 从槽位移除卡牌
  const handleRemoveCard = (slotId: string) => {
    const placement = placedCards.find(p => p.slotId === slotId);
    if (placement?.card) {
      setAvailableCards(prev => [...prev, placement.card!]);
      setPlacedCards(prev => prev.map(p => 
        p.slotId === slotId ? { ...p, card: null } : p
      ));
    }
  };

  // 检查答案
  const handleCheckAnswer = () => {
    const feedbackList: string[] = [];
    let allCorrect = true;

    placedCards.forEach(placement => {
      const slot = CARD_SLOTS.find(s => s.id === placement.slotId);
      if (!placement.card) {
        feedbackList.push(`${slot?.name}：未放置卡牌`);
        allCorrect = false;
      } else if (placement.card.correctSlot !== placement.slotId) {
        // 特殊处理：DPS可以放在middle位置
        if (placement.card.role === 'dps' && placement.slotId === 'middle') {
          feedbackList.push(`${slot?.name}：✓ ${placement.card.name} 位置正确！`);
        } else {
          feedbackList.push(`${slot?.name}：✗ ${placement.card.name} 位置不对`);
          allCorrect = false;
        }
      } else {
        feedbackList.push(`${slot?.name}：✓ ${placement.card.name} 位置正确！`);
      }
    });

    // 检查是否所有槽位都有卡牌
    const allSlotsFilled = placedCards.every(p => p.card !== null);
    
    // 简化判断：只要坦克在前排、奶妈在后排就算对
    const tankCorrect = placedCards.find(p => p.slotId === 'front')?.card?.role === 'tank';
    const healerCorrect = placedCards.find(p => p.slotId === 'back')?.card?.role === 'healer';
    
    setIsCorrect(allSlotsFilled && tankCorrect && healerCorrect);
    setFeedback(feedbackList);
    setShowResult(true);
  };

  // 重置
  const handleReset = () => {
    setAvailableCards([...ROLE_CARDS]);
    setPlacedCards(CARD_SLOTS.map(slot => ({ slotId: slot.id, card: null })));
    setSelectedCard(null);
    setShowResult(false);
    setFeedback([]);
  };

  return (
    <div className="card-placement-minigame">
      {!showResult ? (
        <>
          {/* 游戏说明 */}
          <div className="game-instruction">
            <p>将角色卡牌拖放到正确的站位，完成一次副本开荒！</p>
            <p className="hint">提示：坦克抗线在前，奶妈辅助在后，DPS输出在中间</p>
          </div>

          {/* 战场布局 */}
          <div className="battlefield">
            {/* Boss区域 */}
            <div className="boss-area">
              <div className="boss-icon">👹</div>
              <span>BOSS</span>
            </div>

            {/* 站位槽 */}
            <div className="slots-container">
              {CARD_SLOTS.map(slot => {
                const placement = placedCards.find(p => p.slotId === slot.id);
                return (
                  <div 
                    key={slot.id}
                    className={`slot ${selectedCard ? 'droppable' : ''} ${placement?.card ? 'filled' : ''}`}
                    onClick={() => selectedCard && handlePlaceCard(slot.id)}
                  >
                    <div className="slot-label">{slot.name}</div>
                    {placement?.card ? (
                      <div 
                        className={`placed-card ${placement.card.role}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveCard(slot.id);
                        }}
                      >
                        <span className="card-name">{placement.card.name}</span>
                        <span className="remove-hint">点击移除</span>
                      </div>
                    ) : (
                      <div className="slot-placeholder">
                        {selectedCard ? '点击放置' : '空位'}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 可用卡牌 */}
          <div className="cards-pool">
            <h4>可用角色</h4>
            <div className="cards-list">
              {availableCards.map(card => (
                <div 
                  key={card.id}
                  className={`role-card ${card.role} ${selectedCard?.id === card.id ? 'selected' : ''}`}
                  onClick={() => handleSelectCard(card)}
                >
                  <div className="card-header">
                    <span className="role-icon">
                      {card.role === 'tank' ? '🛡️' : card.role === 'healer' ? '💚' : '⚔️'}
                    </span>
                    <span className="card-name">{card.name}</span>
                  </div>
                  <p className="card-desc">{card.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="action-buttons">
            <button className="reset-btn" onClick={handleReset}>
              重置
            </button>
            <button 
              className="check-btn"
              onClick={handleCheckAnswer}
              disabled={placedCards.some(p => !p.card)}
            >
              确认站位
            </button>
          </div>
        </>
      ) : (
        /* 结果显示 */
        <div className="result-screen">
          <div className={`result-icon ${isCorrect ? 'success' : 'failed'}`}>
            {isCorrect ? '🎉' : '💀'}
          </div>
          <h3>{isCorrect ? '开荒成功！' : '团灭了...'}</h3>
          
          <div className="feedback-list">
            {feedback.map((fb, i) => (
              <p key={i} className={fb.includes('✓') ? 'correct' : 'wrong'}>
                {fb}
              </p>
            ))}
          </div>

          {isCorrect ? (
            <>
              <div className="unlocked-terms">
                <p>解锁黑话：</p>
                <div className="term-list">
                  <span className="term">坦克</span>
                  <span className="term">奶妈</span>
                  <span className="term">DPS</span>
                  <span className="term">开荒</span>
                </div>
              </div>
              <button className="continue-btn" onClick={onComplete}>
                获取碎片 →
              </button>
            </>
          ) : (
            <button className="retry-btn" onClick={handleReset}>
              再试一次
            </button>
          )}
        </div>
      )}
    </div>
  );
};
