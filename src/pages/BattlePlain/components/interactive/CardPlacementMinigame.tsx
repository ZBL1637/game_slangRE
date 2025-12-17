import React, { useState, useEffect } from 'react';
import { ROLE_CARDS, CARD_SLOTS } from '../../data';
import { RoleCard } from '../../types';
import { 
  Shield, 
  Swords, 
  Heart, 
  HelpCircle, 
  Trash2, 
  Check, 
  Lock
} from 'lucide-react';
import './CardPlacementMinigame.scss';

interface CardPlacementMinigameProps {
  onComplete: () => void;
}

interface PlacedCard {
  slotId: string;
  card: RoleCard | null;
}

// 术语字典
const TERM_DICTIONARY: Record<string, { term: string; desc: string; example: string }> = {
  tank: { 
    term: "坦克 (Tank)", 
    desc: "团队之盾，负责吸引仇恨并承受伤害。", 
    example: "例句：“倒T了！那个防骑怎么扛不住？”" 
  },
  dps: { 
    term: "DPS (输出)", 
    desc: "Damage Per Second，负责制造伤害的核心。", 
    example: "例句：“DPS不够啊，这Boss狂暴了。”" 
  },
  healer: { 
    term: "奶妈 (Healer)", 
    desc: "治疗者，负责维持团队血线与驱散状态。", 
    example: "例句：“奶妈快抬一口血，我要挂了！”" 
  }
};

export const CardPlacementMinigame: React.FC<CardPlacementMinigameProps> = ({ onComplete }) => {
  const [availableCards, setAvailableCards] = useState<RoleCard[]>([...ROLE_CARDS]);
  const [placedCards, setPlacedCards] = useState<PlacedCard[]>(
    CARD_SLOTS.map(slot => ({ slotId: slot.id, card: null }))
  );
  const [selectedCard, setSelectedCard] = useState<RoleCard | null>(null);
  
  // 状态与反馈
  const [bossState, setBossState] = useState<'idle' | 'combat'>('idle');
  const [aggroTarget, setAggroTarget] = useState<string>('—');
  const [ruleStatus, setRuleStatus] = useState({ tank: false, dps: false, healer: false });
  const [isReady, setIsReady] = useState(false);
  const [showResult, setShowResult] = useState(false);
  
  // Tooltip
  const [hoveredTerm, setHoveredTerm] = useState<string | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  // 检查规则
  useEffect(() => {
    const tankInFront = placedCards.find(p => p.slotId === 'front')?.card?.role === 'tank';
    const dpsInMiddle = placedCards.find(p => p.slotId === 'middle')?.card?.role === 'dps';
    const healerInBack = placedCards.find(p => p.slotId === 'back')?.card?.role === 'healer';

    setRuleStatus({
      tank: tankInFront || false,
      dps: dpsInMiddle || false,
      healer: healerInBack || false
    });

    // 只要有 Tank 在前排，就显示仇恨目标
    if (tankInFront) {
      setAggroTarget('坦克(T)');
    } else {
      setAggroTarget('—');
    }

    // 检查是否全部就绪 (这里简化为只要每个位置都有人，且符合规则)
    // 实际游戏逻辑：必须 3 个规则都满足
    setIsReady(tankInFront && dpsInMiddle && healerInBack);

  }, [placedCards]);

  // Drag & Drop Handlers
  const handleDragStart = (e: React.DragEvent, card: RoleCard) => {
    e.dataTransfer.setData('cardId', card.id);
    e.dataTransfer.effectAllowed = 'move';
    setSelectedCard(card); // Also select it for visual feedback
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, slotId: string) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData('cardId');
    const card = availableCards.find(c => c.id === cardId);
    
    if (card) {
       // Manual placement logic reusing the state updates
       const existingPlacement = placedCards.find(p => p.slotId === slotId);
       let newAvailable = [...availableCards];

       if (existingPlacement?.card) {
         newAvailable.push(existingPlacement.card);
       }

       setPlacedCards(prev => prev.map(p => 
         p.slotId === slotId ? { ...p, card: card } : p
       ));

       setAvailableCards(newAvailable.filter(c => c.id !== card.id));
       setSelectedCard(null);
    }
  };

  // 处理放置
  const handlePlaceCard = (slotId: string) => {
    if (!selectedCard) return;

    // 检查槽位是否已有卡牌
    const existingPlacement = placedCards.find(p => p.slotId === slotId);
    let newAvailable = [...availableCards];

    if (existingPlacement?.card) {
      newAvailable.push(existingPlacement.card);
    }

    // 更新放置
    setPlacedCards(prev => prev.map(p => 
      p.slotId === slotId ? { ...p, card: selectedCard } : p
    ));

    // 从可用列表移除
    setAvailableCards(newAvailable.filter(c => c.id !== selectedCard.id));
    setSelectedCard(null);
  };

  const handleAutoPlace = (card: RoleCard) => {
    let targetSlot = '';
    if (card.role === 'tank') targetSlot = 'front';
    else if (card.role === 'dps') targetSlot = 'middle';
    else if (card.role === 'healer') targetSlot = 'back';

    const existing = placedCards.find(p => p.slotId === targetSlot);
    if (targetSlot && !existing?.card) {
      setPlacedCards(prev => prev.map(p => p.slotId === targetSlot ? { ...p, card } : p));
      setAvailableCards(prev => prev.filter(c => c.id !== card.id));
      setSelectedCard(null);
    }
  };

  // 移除卡牌
  const handleRemoveCard = (slotId: string) => {
    const placement = placedCards.find(p => p.slotId === slotId);
    if (placement?.card) {
      setAvailableCards(prev => [...prev, placement.card!]);
      setPlacedCards(prev => prev.map(p => 
        p.slotId === slotId ? { ...p, card: null } : p
      ));
    }
  };

  // 重置
  const handleReset = () => {
    setAvailableCards([...ROLE_CARDS]);
    setPlacedCards(CARD_SLOTS.map(slot => ({ slotId: slot.id, card: null })));
    setSelectedCard(null);
    setBossState('idle');
    setShowResult(false);
  };

  // 开始战斗
  const handleStartPull = () => {
    if (!isReady) return;
    setBossState('combat');
    setTimeout(() => {
      setShowResult(true);
    }, 1500); // 1.5s 演出
  };

  // 处理 Tooltip
  const handleMouseMove = (e: React.MouseEvent) => {
    setCursorPos({ x: e.clientX + 15, y: e.clientY + 15 });
  };

  return (
    <div className="card-placement-minigame" onMouseMove={handleMouseMove}>
      <div className="raid-prep-modal">
        {/* 顶部 Header */}
        <div className="raid-header">
          <div className="header-left">
            <span className="dungeon-icon">🏰</span>
            <span>副本：时光档案馆 (团本)</span>
          </div>
          <div className="header-center">
            目标：完成队伍站位 ({Object.values(ruleStatus).filter(Boolean).length}/3)
          </div>
          <div className="header-right">
            <button title="提示"><HelpCircle size={16} /></button>
            <button title="重置" onClick={handleReset}><Trash2 size={16} /></button>
          </div>
        </div>

        {/* 主体区域 */}
        <div className="raid-body">
          {/* 左侧战场 */}
          <div className="raid-battlefield">
            <div className="boss-hud">
              <div className="boss-hp-bar"></div>
              <div className="boss-avatar-container">
                <div className={`boss-avatar ${bossState}`}>👹</div>
                <div className={`aggro-text ${aggroTarget !== '—' ? 'active' : ''}`}>
                  仇恨目标：{aggroTarget}
                </div>
                <div className="pressure-aura"></div>
              </div>
              <div className="boss-separator"></div>
            </div>

            <div className="battle-lines">
              {/* 前排 */}
              <BattleLine 
                type="tank"
                icon={<Shield size={28} />}
                placedCard={placedCards.find(p => p.slotId === 'front')?.card}
                selectedCard={selectedCard}
                onPlace={() => handlePlaceCard('front')}
                onRemove={() => handleRemoveCard('front')}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'front')}
              />
              
              {/* 中排 */}
              <BattleLine 
                type="dps"
                icon={<Swords size={28} />}
                placedCard={placedCards.find(p => p.slotId === 'middle')?.card}
                selectedCard={selectedCard}
                onPlace={() => handlePlaceCard('middle')}
                onRemove={() => handleRemoveCard('middle')}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'middle')}
              />

              {/* 后排 */}
              <BattleLine 
                type="healer"
                icon={<Heart size={28} />}
                placedCard={placedCards.find(p => p.slotId === 'back')?.card}
                selectedCard={selectedCard}
                onPlace={() => handlePlaceCard('back')}
                onRemove={() => handleRemoveCard('back')}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'back')}
              />
            </div>
          </div>

          {/* 右侧战术板 */}
          <div className="raid-briefing">
            <h3>战术简报</h3>
            <div className="rules-list">
              <RuleCard 
                icon={<Shield />} 
                title="坦克在前" 
                desc="吸收伤害 / 稳住仇恨" 
                isMet={ruleStatus.tank} 
              />
              <RuleCard 
                icon={<Swords />} 
                title="DPS 在中" 
                desc="安全输出 / 贴合射程" 
                isMet={ruleStatus.dps} 
              />
              <RuleCard 
                icon={<Heart />} 
                title="奶妈在后" 
                desc="治疗覆盖 / 避免吃招" 
                isMet={ruleStatus.healer} 
              />
            </div>

            <button 
              className={`start-btn ${isReady ? 'ready' : ''}`}
              disabled={!isReady}
              onClick={handleStartPull}
            >
              {isReady ? '开始拉怪' : '等待就位...'}
              {isReady && <Swords size={20} />}
            </button>
          </div>
        </div>

        {/* 底部卡池 */}
        <div className="class-card-pool">
          {availableCards.map(card => (
            <div 
              key={card.id}
              className={`role-card-new ${selectedCard?.id === card.id ? 'selected' : ''}`}
              draggable
              onDragStart={(e) => handleDragStart(e, card)}
              onClick={() => setSelectedCard(card)}
              onDoubleClick={() => handleAutoPlace(card)}
              onMouseEnter={() => setHoveredTerm(card.role)}
              onMouseLeave={() => setHoveredTerm(null)}
            >
              <div className="card-top">
                <span className="card-icon">
                  {card.role === 'tank' ? <Shield size={14} /> : card.role === 'healer' ? <Heart size={14} /> : <Swords size={14} />}
                </span>
                <span className="card-title">{card.name}</span>
              </div>
              <div className="card-desc">{card.description}</div>
              <div className="card-chip">
                {card.role === 'tank' ? '前排' : card.role === 'healer' ? '后排' : '中排'}
              </div>
            </div>
          ))}
        </div>

        {/* 结算遮罩 */}
        {showResult && (
          <div className="result-overlay">
            <h2>队伍就位！</h2>
            <button className="continue-btn" onClick={onComplete}>
              领取奖励 →
            </button>
          </div>
        )}

        {/* 术语 Tooltip */}
        {hoveredTerm && TERM_DICTIONARY[hoveredTerm] && (
          <div 
            className="term-tooltip"
            style={{ top: cursorPos.y, left: cursorPos.x }}
          >
            <h4>{TERM_DICTIONARY[hoveredTerm].term}</h4>
            <p>{TERM_DICTIONARY[hoveredTerm].desc}</p>
            <p className="example">{TERM_DICTIONARY[hoveredTerm].example}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// 子组件：战线
const BattleLine: React.FC<{
  type: string;
  icon: React.ReactNode;
  placedCard: RoleCard | null | undefined;
  selectedCard: RoleCard | null;
  onPlace: () => void;
  onRemove: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}> = ({ type, icon, placedCard, selectedCard, onPlace, onRemove, onDragOver, onDrop }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragEnter = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(true);
  };

  const handleDragLeave = () => {
      setIsDragOver(false);
  };

  const handleDropWrapper = (e: React.DragEvent) => {
      setIsDragOver(false);
      onDrop(e);
  };

  return (
    <div className={`battle-line ${type}`}>
      <div className="line-icon">{icon}</div>
      <div 
        className={`card-slot ${selectedCard ? 'droppable' : ''} ${placedCard ? 'filled' : ''} ${isDragOver ? 'drag-over' : ''}`}
        onClick={onPlace}
        onDragOver={onDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDropWrapper}
      >
        {!placedCard ? (
          <span className="slot-label">{selectedCard ? '点击放置' : '空位'}</span>
        ) : (
          <div className="placed-card-mini" onClick={(e) => { e.stopPropagation(); onRemove(); }}>
            <span>{placedCard.name}</span>
            <span className="remove-hint">×</span>
          </div>
        )}
        
        {placedCard && <div className="lock-icon"><Lock size={12} /></div>}
        <div className={`ok-stamp ${placedCard ? 'visible' : ''}`}>OK</div>
      </div>
    </div>
  );
};

// 子组件：规则卡
const RuleCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  desc: string;
  isMet: boolean;
}> = ({ icon, title, desc, isMet }) => {
  return (
    <div className={`rule-card ${isMet ? 'met' : ''}`}>
      <div className="rule-icon">{icon}</div>
      <div className="rule-content">
        <span className="rule-title">{title}</span>
        <span className="rule-desc">{desc}</span>
      </div>
      <div className="check-mark"><Check size={20} /></div>
    </div>
  );
};
