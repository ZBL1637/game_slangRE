import React from 'react';
import { Building2, BookOpen, Lock } from 'lucide-react';
import { BUILDINGS, SCRIPT } from '../../data';
import './TownMap.scss';

interface TownMapProps {
  dnaCompleted: boolean;
  queriedCount: number;
  onEnterDNATest: () => void;
  onEnterArchive: () => void;
}

export const TownMap: React.FC<TownMapProps> = ({
  dnaCompleted,
  queriedCount,
  onEnterDNATest,
  onEnterArchive
}) => {
  // 档案馆在完成DNA测试后解锁
  const archiveUnlocked = dnaCompleted;

  return (
    <div className="town-map-section">
      {/* 城镇标题 */}
      <div className="section-header">
        <h2>{SCRIPT.ch3_title}</h2>
        <p>{SCRIPT.ch3_subtitle}</p>
      </div>

      {/* 城镇地图 */}
      <div className="town-container">
        {/* 赛博朋克背景 */}
        <div className="cyberpunk-bg">
          <div className="neon-grid"></div>
          <div className="floating-ads">
            <span className="ad-text">YYDS</span>
            <span className="ad-text">666</span>
            <span className="ad-text">GG</span>
          </div>
        </div>

        {/* 建筑物 */}
        <div className="buildings-container">
          {/* 身份认证中心 */}
          <div 
            className={`building identity-center ${dnaCompleted ? 'completed' : 'active'}`}
            onClick={onEnterDNATest}
          >
            <div className="building-glow"></div>
            <div className="building-icon">
              <span className="icon-emoji">🧬</span>
            </div>
            <div className="building-info">
              <h3>认证中心</h3>
              <p>进行黑话DNA测试</p>
              {dnaCompleted ? (
                <span className="status completed">✓ 已完成</span>
              ) : (
                <button className="enter-btn">进入</button>
              )}
            </div>
            <div className="hologram-sign">
              <span>DNA TEST</span>
            </div>
          </div>

          {/* 真言档案馆 */}
          <div 
            className={`building archive-hall ${archiveUnlocked ? 'active' : 'locked'}`}
            onClick={archiveUnlocked ? onEnterArchive : undefined}
          >
            <div className="building-glow"></div>
            <div className="building-icon">
              {archiveUnlocked ? (
                <span className="icon-emoji">📚</span>
              ) : (
                <Lock size={32} className="lock-icon" />
              )}
            </div>
            <div className="building-info">
              <h3>真言档案馆</h3>
              <p>AI智能查询系统</p>
              {archiveUnlocked ? (
                <button className="enter-btn">进入</button>
              ) : (
                <span className="status locked">完成DNA测试后解锁</span>
              )}
            </div>
            <div className="hologram-sign">
              <span>AI QUERY</span>
            </div>
          </div>
        </div>

        {/* NPC群众 */}
        <div className="npcs-container">
          <div className="npc" style={{ left: '15%', bottom: '20%' }}>
            <span className="npc-avatar">👤</span>
            <div className="chat-bubble">GG!</div>
          </div>
          <div className="npc" style={{ left: '45%', bottom: '15%' }}>
            <span className="npc-avatar">👥</span>
            <div className="chat-bubble">YYDS</div>
          </div>
          <div className="npc" style={{ left: '75%', bottom: '25%' }}>
            <span className="npc-avatar">👤</span>
            <div className="chat-bubble">666</div>
          </div>
        </div>

      </div>

      {/* 通关指引 */}
      <div className="quest-hint">
        <div className="quest-content">
          <span className="quest-icon">📋</span>
          <div className="quest-text">
            <h4>通关指引</h4>
            <p>
              {!dnaCompleted 
                ? '步骤1：前往认证中心完成黑话DNA测试' 
                : queriedCount < 10 
                  ? `步骤2：点击漂浮词条或在档案馆查询，累计达到 10 个 (${queriedCount}/10)`
                  : '步骤3：领取技能并完成本章！'
              }
            </p>
          </div>
        </div>
      </div>

      {/* 探索提示 */}
      <div className="exploration-hint">
        <p>💡 完成DNA测试后，可点击任意漂浮词条弹出解释，也可在“真言档案馆”进行AI查询；累计 10 个即可通关。</p>
      </div>
    </div>
  );
};
