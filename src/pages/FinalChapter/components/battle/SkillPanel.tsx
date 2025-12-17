// ============================================================================
// SkillPanel - 技能面板组件
// ============================================================================

import React, { useState } from 'react';
import { PlayerSkill, BossSkillId } from '../../types';
import { BASIC_ATTACK } from '../../data';
import './SkillPanel.scss';

interface SkillPanelProps {
  skills: PlayerSkill[];
  isPlayerTurn: boolean;
  isAnimating: boolean;
  onAttack: () => void;
  onUseSkill: (skill: PlayerSkill) => void;
  lastBossSkill: BossSkillId | null;
}

const SkillPanel: React.FC<SkillPanelProps> = ({
  skills,
  isPlayerTurn,
  isAnimating,
  onAttack,
  onUseSkill,
  lastBossSkill
}) => {
  const [selectedSkill, setSelectedSkill] = useState<PlayerSkill | null>(null);
  const [showSkillInfo, setShowSkillInfo] = useState(false);

  const canAct = isPlayerTurn && !isAnimating;

  const handleSkillClick = (skill: PlayerSkill) => {
    if (!canAct) return;
    if (skill.currentCooldown > 0 || skill.isDisabled) {
      // 显示技能信息
      setSelectedSkill(skill);
      setShowSkillInfo(true);
      return;
    }
    
    setSelectedSkill(skill);
    setShowSkillInfo(true);
  };

  const handleUseSkill = () => {
    if (selectedSkill && selectedSkill.currentCooldown === 0 && !selectedSkill.isDisabled) {
      onUseSkill(selectedSkill);
      setSelectedSkill(null);
      setShowSkillInfo(false);
    }
  };

  const getSkillStatus = (skill: PlayerSkill) => {
    if (skill.isDisabled) return 'disabled';
    if (skill.currentCooldown > 0) return 'cooldown';
    return 'ready';
  };

  return (
    <div className="skill-panel">
      {/* 行动提示 */}
      <div className="action-prompt">
        {canAct ? (
          <span className="prompt-text">选择你的行动</span>
        ) : (
          <span className="prompt-text waiting">等待中...</span>
        )}
      </div>

      {/* 普通攻击按钮 */}
      <div className="attack-section">
        <button
          className={`attack-btn ${canAct ? 'active' : 'inactive'}`}
          onClick={onAttack}
          disabled={!canAct}
        >
          <span className="attack-icon">{BASIC_ATTACK.icon}</span>
          <span className="attack-name">{BASIC_ATTACK.name}</span>
          <span className="attack-damage">伤害: {BASIC_ATTACK.baseDamage}</span>
        </button>
      </div>

      {/* 技能列表 */}
      <div className="skills-section">
        <div className="skills-label">技能</div>
        <div className="skills-grid">
          {skills.map(skill => {
            const status = getSkillStatus(skill);
            return (
              <button
                key={skill.id}
                className={`skill-btn ${status} ${selectedSkill?.id === skill.id ? 'selected' : ''}`}
                onClick={() => handleSkillClick(skill)}
                disabled={!canAct}
              >
                <div className="skill-icon-wrapper">
                  <span className="skill-icon">{skill.icon}</span>
                  {status === 'cooldown' && (
                    <span className="cooldown-overlay">{skill.currentCooldown}</span>
                  )}
                  {status === 'disabled' && (
                    <span className="disabled-overlay">⛓️</span>
                  )}
                </div>
                <span className="skill-name">{skill.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 技能详情弹窗 */}
      {showSkillInfo && selectedSkill && (
        <div className="skill-info-modal">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setShowSkillInfo(false)}>×</button>
            
            <div className="skill-header">
              <span className="skill-icon-large">{selectedSkill.icon}</span>
              <div className="skill-titles">
                <h3>{selectedSkill.name}</h3>
                <span className="skill-english">{selectedSkill.englishName}</span>
              </div>
            </div>

            <div className="skill-body">
              <p className="skill-desc">{selectedSkill.description}</p>
              
              <div className="skill-stats">
                <div className="stat-item">
                  <span className="stat-label">冷却时间</span>
                  <span className="stat-value">{selectedSkill.cooldown} 回合</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">来源</span>
                  <span className="stat-value">{selectedSkill.chapterSource}</span>
                </div>
                {selectedSkill.currentCooldown > 0 && (
                  <div className="stat-item cooldown">
                    <span className="stat-label">剩余冷却</span>
                    <span className="stat-value">{selectedSkill.currentCooldown} 回合</span>
                  </div>
                )}
                {selectedSkill.isDisabled && (
                  <div className="stat-item disabled">
                    <span className="stat-label">被禁用</span>
                    <span className="stat-value">{selectedSkill.disabledTurns} 回合</span>
                  </div>
                )}
              </div>

              {/* 共鸣之声特殊提示 */}
              {selectedSkill.id === 'resonance' && (
                <div className="special-note">
                  <span className="note-icon">💡</span>
                  <span className="note-text">
                    {lastBossSkill 
                      ? `可复制Boss上回合使用的技能` 
                      : 'Boss尚未使用技能，无法复制'}
                  </span>
                </div>
              )}
            </div>

            <div className="skill-actions">
              {selectedSkill.currentCooldown === 0 && !selectedSkill.isDisabled ? (
                <button className="use-skill-btn" onClick={handleUseSkill}>
                  使用技能
                </button>
              ) : (
                <button className="use-skill-btn disabled" disabled>
                  {selectedSkill.isDisabled ? '技能被禁用' : '冷却中'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillPanel;
