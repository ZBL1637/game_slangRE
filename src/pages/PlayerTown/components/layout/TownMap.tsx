import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { SCRIPT } from '../../data';
import './TownMap.scss';

// 导入NPC图片
import npcDnaScientist from '@/assets/images/npc_dna_scientist.png';
import npcAiLibrarian from '@/assets/images/npc_ai_librarian.png';
import chapter3Bg from '@/assets/images/chapter3_bg.png';

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
  
  // NPC对话状态
  const [hoveredNpc, setHoveredNpc] = useState<'dna' | 'ai' | null>(null);

  return (
    <div className="town-map-section">
      {/* 城镇标题 */}
      <div className="section-header">
        <h2>{SCRIPT.ch3_title}</h2>
        <p>{SCRIPT.ch3_subtitle}</p>
      </div>

      {/* 城镇地图 - 像素艺术风格 */}
      <div className="town-container pixel-style">
        {/* 像素艺术背景 */}
        <div className="pixel-bg">
          <img src={chapter3Bg} alt="玩家小镇" className="bg-image" />
          <div className="pixel-overlay"></div>
        </div>

        {/* NPC区域 */}
        <div className="npc-zone">
          {/* DNA测试NPC - 炼金术士 */}
          <div 
            className={`npc-wrapper dna-npc ${dnaCompleted ? 'completed' : 'active'}`}
            onClick={onEnterDNATest}
            onMouseEnter={() => setHoveredNpc('dna')}
            onMouseLeave={() => setHoveredNpc(null)}
          >
            <div className="npc-glow"></div>
            <div className="npc-sprite">
              <img src={npcDnaScientist} alt="DNA测试员" />
            </div>
            <div className="npc-marker">
              {dnaCompleted ? '✓' : '!'}
            </div>
            
            {/* NPC对话气泡 */}
            <div className={`npc-bubble ${hoveredNpc === 'dna' ? 'show' : ''}`}>
              <div className="bubble-content">
                <h4>艾琳娜 · 基因学者</h4>
                <p>{dnaCompleted 
                  ? '你的DNA测试已完成！去档案馆探索更多吧~' 
                  : '来测试一下你的游戏DNA吧！我能分析出你的玩家类型~'
                }</p>
                {!dnaCompleted && (
                  <button className="interact-btn">开始测试</button>
                )}
              </div>
              <div className="bubble-arrow"></div>
            </div>

            {/* NPC名牌 */}
            <div className="npc-nameplate">
              <span className="npc-name">艾琳娜</span>
              <span className="npc-title">基因学者</span>
            </div>
          </div>

          {/* AI查询NPC - 智者图书管理员 */}
          <div 
            className={`npc-wrapper ai-npc ${archiveUnlocked ? 'active' : 'locked'}`}
            onClick={archiveUnlocked ? onEnterArchive : undefined}
            onMouseEnter={() => setHoveredNpc('ai')}
            onMouseLeave={() => setHoveredNpc(null)}
          >
            <div className="npc-glow"></div>
            <div className="npc-sprite">
              <img src={npcAiLibrarian} alt="AI档案管理员" />
              {!archiveUnlocked && (
                <div className="lock-overlay">
                  <Lock size={32} />
                </div>
              )}
            </div>
            <div className="npc-marker">
              {archiveUnlocked ? '?' : '🔒'}
            </div>
            
            {/* NPC对话气泡 */}
            <div className={`npc-bubble ${hoveredNpc === 'ai' ? 'show' : ''}`}>
              <div className="bubble-content">
                <h4>梅林 · 真言守护者</h4>
                <p>{archiveUnlocked 
                  ? '欢迎来到真言档案馆！我可以解答任何游戏黑话的奥秘。' 
                  : '完成DNA测试后，我才能为你开启档案馆的大门...'
                }</p>
                {archiveUnlocked && (
                  <button className="interact-btn">进入档案馆</button>
                )}
              </div>
              <div className="bubble-arrow"></div>
            </div>

            {/* NPC名牌 */}
            <div className="npc-nameplate">
              <span className="npc-name">梅林</span>
              <span className="npc-title">真言守护者</span>
            </div>
          </div>
        </div>

        {/* 装饰性NPC群众 */}
        <div className="crowd-npcs">
          <div className="crowd-npc" style={{ left: '10%', bottom: '15%' }}>
            <span className="chat-bubble">GG!</span>
          </div>
          <div className="crowd-npc" style={{ left: '85%', bottom: '20%' }}>
            <span className="chat-bubble">YYDS</span>
          </div>
          <div className="crowd-npc" style={{ left: '50%', bottom: '8%' }}>
            <span className="chat-bubble">666</span>
          </div>
        </div>

        {/* 场景指示牌 */}
        <div className="scene-signs">
          <div className="sign sign-left">
            <span>认证中心 →</span>
          </div>
          <div className="sign sign-right">
            <span>← 档案馆</span>
          </div>
        </div>
      </div>

      {/* 通关指引 */}
      <div className="quest-panel">
        <div className="quest-header">
          <span className="quest-icon">📋</span>
          <span className="quest-label">当前任务</span>
        </div>
        <div className="quest-content">
          <p className="quest-text">
            {!dnaCompleted 
              ? '👉 步骤1：与艾琳娜对话，完成黑话DNA测试' 
              : queriedCount < 10 
                ? `👉 步骤2：与梅林对话或点击漂浮词条，了解黑话 (${queriedCount}/10)`
                : '🎉 步骤3：任务完成！领取技能奖励'
            }
          </p>
          <div className="quest-progress">
            <div 
              className="progress-fill" 
              style={{ 
                width: `${dnaCompleted ? (queriedCount >= 10 ? 100 : 50 + (queriedCount / 10) * 50) : 0}%` 
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* 探索提示 */}
      <div className="exploration-hint">
        <p>💡 点击NPC与他们对话，完成DNA测试后可解锁AI档案馆查询功能</p>
      </div>
    </div>
  );
};
