import React from 'react';
import { TimelineEra } from '../../types';
import { Check, Lock, MapPin } from 'lucide-react';
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
  
  const isEraUnlocked = (index: number) => {
    // 第一个时代始终解锁
    if (index === 0) return true;
    // 后续时代需要前一个完成才解锁
    return completedEras.includes(eras[index - 1].id);
  };

  const isEraCompleted = (eraId: string) => {
    return completedEras.includes(eraId);
  };

  return (
    <section className="timeline-map-section">
      <div className="section-header">
        <h2>时间之路</h2>
        <p>沿着古道探索四个时代，收集时间碎片</p>
      </div>

      {/* 时间线路径 */}
      <div className="timeline-path">
        <div className="path-line"></div>
        
        {eras.map((era, index) => {
          const unlocked = isEraUnlocked(index);
          const completed = isEraCompleted(era.id);
          
          return (
            <div 
              key={era.id}
              className={`era-node ${unlocked ? 'unlocked' : 'locked'} ${completed ? 'completed' : ''}`}
            >
              {/* 连接线 */}
              {index > 0 && (
                <div className={`connector ${completedEras.includes(eras[index - 1].id) ? 'active' : ''}`}></div>
              )}
              
              {/* 时代节点 */}
              <div 
                className="node-content"
                onClick={() => unlocked && !completed && onEnterEra(era.id)}
              >
                {/* 图标 */}
                <div className="node-icon">
                  {completed ? (
                    <Check size={32} />
                  ) : unlocked ? (
                    <span className="era-emoji">{era.icon}</span>
                  ) : (
                    <Lock size={24} />
                  )}
                </div>
                
                {/* 信息 */}
                <div className="node-info">
                  <h3>{era.name}</h3>
                  <p className="period">{era.period}</p>
                  
                  {unlocked && !completed && (
                    <button className="enter-btn">
                      <MapPin size={14} />
                      进入探索
                    </button>
                  )}
                  
                  {completed && (
                    <span className="completed-badge">已完成</span>
                  )}
                  
                  {!unlocked && (
                    <span className="locked-hint">完成上一时代解锁</span>
                  )}
                </div>
              </div>
              
              {/* 时代描述卡片 */}
              {unlocked && (
                <div className="era-card">
                  <p className="description">{era.description}</p>
                  <div className="keywords">
                    {era.events.flatMap(e => e.keywords).slice(0, 4).map((keyword, i) => (
                      <span key={i} className="keyword-tag">{keyword}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 进度指示 */}
      <div className="progress-indicator">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${(completedEras.length / eras.length) * 100}%` }}
          ></div>
        </div>
        <span className="progress-text">
          探索进度: {completedEras.length} / {eras.length}
        </span>
      </div>
    </section>
  );
};
