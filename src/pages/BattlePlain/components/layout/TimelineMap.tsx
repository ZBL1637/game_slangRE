import React, { useState, useEffect } from 'react';
import { TimelineEra } from '../../types';
import chip1 from '../../../../assets/images/chip1.png';
import chip2 from '../../../../assets/images/chip2.png';
import chip3 from '../../../../assets/images/chip3.png';
import chip4 from '../../../../assets/images/chip4.png';
import { 
  Check, 
  Lock, 
  MapPin, 
  Gamepad2, 
  Monitor, 
  Smartphone, 
  MessageSquare,
  Sparkles,
  Hourglass
} from 'lucide-react';
import './TimelineMap.scss';

interface TimelineMapProps {
  eras: TimelineEra[];
  completedEras: string[];
  onEnterEra: (eraId: string) => void;
}

export const TimelineMap: React.FC<TimelineMapProps> = ({ 
  eras, 
  completedEras, 
  onEnterEra 
}) => {
  // 默认选中第一个未完成的时代，或者最后一个解锁的时代
  const [selectedEraId, setSelectedEraId] = useState<string>('');

  useEffect(() => {
    if (!selectedEraId && eras.length > 0) {
      // 找到第一个未完成的解锁时代
      const firstUnfinished = eras.find((era, index) => {
        const unlocked = index === 0 || completedEras.includes(eras[index - 1].id);
        const completed = completedEras.includes(era.id);
        return unlocked && !completed;
      });

      if (firstUnfinished) {
        setSelectedEraId(firstUnfinished.id);
      } else {
        // 如果都完成了，或者没有未完成的，选中最后一个
        setSelectedEraId(eras[eras.length - 1].id);
      }
    }
  }, [eras, completedEras, selectedEraId]);

  const isEraUnlocked = (index: number) => {
    if (index === 0) return true;
    return completedEras.includes(eras[index - 1].id);
  };

  const isEraCompleted = (eraId: string) => {
    return completedEras.includes(eraId);
  };

  const getEraIcon = (eraId: string) => {
    switch (eraId) {
      case 'arcade': return <Gamepad2 size={24} />;
      case 'pc': return <Monitor size={24} />;
      case 'mobile': return <Smartphone size={24} />;
      case 'modern': return <MessageSquare size={24} />;
      default: return <Gamepad2 size={24} />;
    }
  };

  const selectedEra = eras.find(e => e.id === selectedEraId) || eras[0];
  const isSelectedUnlocked = selectedEra ? isEraUnlocked(eras.findIndex(e => e.id === selectedEra.id)) : false;
  const isSelectedCompleted = selectedEra ? isEraCompleted(selectedEra.id) : false;

  const totalFragments = eras.length;
  const chips = [chip1, chip2, chip3, chip4];

  return (
    <section className="timeline-map-section">
      <div className="dashboard-grid">
        {/* 左侧：时间之路侧边栏 */}
        <div className="left-sidebar">
          <div className="timeline-path-container">
            <div className="path-header">
              <h3>时间之路</h3>
              <span className="subtitle">CHAPTER 02 ROUTE</span>
              <div className="rune-divider"></div>
            </div>

            <div className="path-description">
              <div className="desc-title">时间之路 · 主线任务</div>
              <p>
                穿越四个时代的战斗现场，找回被时间打散的黑话线索。完成每站探索即可获得「时间碎片」，集齐 4 枚解锁本章最终对决与全景总结。
              </p>
            </div>

            <div className="timeline-road">
              {eras.map((era, index) => {
                const unlocked = isEraUnlocked(index);
                const completed = isEraCompleted(era.id);
                const isSelected = selectedEraId === era.id;
                
                let nodeState = 'locked';
                if (completed) nodeState = 'completed';
                else if (unlocked) nodeState = 'unlocked';

                return (
                  <React.Fragment key={era.id}>
                    {index > 0 && (
                      <div className={`road-segment ${isEraUnlocked(index) ? 'unlocked' : 'locked'}`}>
                        <div className="road-inner"></div>
                        <div className="road-node-connector"></div>
                      </div>
                    )}

                    <div 
                      className={`era-node ${nodeState} ${isSelected ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedEraId(era.id);
                      }}
                    >
                      <div className="node-badge-outer">
                        {isSelected && <div className="pulse-ring"></div>}
                        <div className="node-badge-inner">
                          <div className="node-icon">
                            {getEraIcon(era.id)}
                          </div>
                          <div className="badge-ticks">
                            {[...Array(4)].map((_, i) => <span key={i} className={`tick tick-${i}`} />)}
                          </div>
                        </div>
                        
                        {!unlocked && (
                          <div className="lock-overlay">
                            <Lock size={16} />
                          </div>
                        )}
                        
                        {completed && (
                          <div className="check-badge">
                            <Check size={12} />
                          </div>
                        )}
                      </div>

                      <div className="node-label">
                        <span className="name">{era.name}</span>
                        <span className="year">{era.period}</span>
                      </div>

                      {isSelected && <div className="current-indicator">▶</div>}
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>

        {/* 右侧：内容区 (详情 + HUD) */}
        <div className="right-content-column">
          
          {/* 关卡详情面板 */}
          <div className="level-info-panel">
            {selectedEra && (
              <div className={`panel-content ${!isSelectedUnlocked ? 'locked-mode' : ''}`}>
                <div className="panel-texture"></div>
                
                <div className="panel-header">
                  <div className="header-main">
                    <h2>{selectedEra.name}</h2>
                    <span className="period-badge">{selectedEra.period}</span>
                  </div>
                  {!isSelectedUnlocked && (
                    <div className="locked-banner">
                      <Lock size={14} /> 需完成上一时代解锁
                    </div>
                  )}
                </div>

                <div className="panel-body">
                  <div className="description-box">
                    <p>{selectedEra.description}</p>
                  </div>

                  <div className="rewards-section">
                    <div className="section-label">本关掉落</div>
                    <div className="reward-badge">
                      <Sparkles size={14} />
                      <span>时间碎片 #{eras.findIndex(e => e.id === selectedEra.id) + 1}</span>
                    </div>
                  </div>

                  <div className="tags-section">
                    <div className="section-label">关键黑话</div>
                    <div className="tags-grid">
                      {selectedEra.fragment.keywords.map((keyword, i) => (
                        <div key={i} className="skill-tag">
                          <span className="tag-dot"></span>
                          {keyword}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="panel-footer">
                  <button 
                    className={`start-btn ${!isSelectedUnlocked || isSelectedCompleted ? 'disabled' : ''}`}
                    disabled={!isSelectedUnlocked}
                    onClick={() => isSelectedUnlocked && !isSelectedCompleted && onEnterEra(selectedEra.id)}
                  >
                    {isSelectedCompleted ? (
                      <>
                        <Check size={18} />
                        <span>已完成探索</span>
                      </>
                    ) : !isSelectedUnlocked ? (
                      <>
                        <Lock size={18} />
                        <span>未解锁</span>
                      </>
                    ) : (
                      <>
                        <MapPin size={18} />
                        <span>进入探索</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 底部 HUD：时间碎片背包 */}
          <div className="hud-container">
            <div className="hud-header">
              <div className="hud-title">
                <Hourglass size={18} className="icon-spin" />
                <span>时间碎片</span>
              </div>
              <div className="hud-counter">
                <span className="current">{completedEras.length}</span>
                <span className="divider">/</span>
                <span className="total">{totalFragments}</span>
              </div>
            </div>
            
            <div className="fragment-slots">
              {eras.map((era, index) => {
                const unlocked = isEraUnlocked(index);
                const completed = isEraCompleted(era.id);
                let statusClass = 'locked';
                if (completed) statusClass = 'collected';
                else if (unlocked) statusClass = 'obtainable';

                return (
                  <div key={`frag-${era.id}`} className={`fragment-slot ${statusClass}`}>
                    <div className="slot-inner">
                      <div className="slot-number">{index + 1}</div>
                      <div className="slot-icon">
                        {completed && (
                          <img 
                            src={chips[index]} 
                            alt={`Fragment ${index + 1}`} 
                            className="fragment-img" 
                          />
                        )}
                      </div>
                      {statusClass === 'obtainable' && <div className="slot-alert">!</div>}
                      {statusClass === 'collected' && <div className="slot-check"><Check size={10} /></div>}
                    </div>
                    <div className="slot-label">
                      {completed ? '已收集' : (unlocked ? '可获得' : '未收集')}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="hud-tip">
              <span className="tip-icon">i</span>
              探索各个时代，完成挑战以收集碎片
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
