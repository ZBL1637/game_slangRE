// ============================================================================
// IntroSection - 入场动画和Boss对话
// ============================================================================

import React, { useState } from 'react';
import { NPC_DIALOGUES, NARRATION_TEXTS, BOSS_SKILLS } from '../../data';
import './IntroSection.scss';

interface IntroSectionProps {
  onComplete: () => void;
}

type IntroPhase = 'entrance' | 'title' | 'narration' | 'boss_dialogue' | 'ready';

const IntroSection: React.FC<IntroSectionProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<IntroPhase>('entrance');
  const [dialogueIndex, setDialogueIndex] = useState(0);

  const handleClick = () => {
    switch (phase) {
      case 'entrance':
        setPhase('title');
        break;
      case 'title':
        setPhase('narration');
        break;
      case 'narration':
        setPhase('boss_dialogue');
        break;
      case 'boss_dialogue':
        if (dialogueIndex < NPC_DIALOGUES.intro.length - 1) {
          setDialogueIndex(prev => prev + 1);
        } else {
          setPhase('ready');
        }
        break;
      case 'ready':
        onComplete();
        break;
    }
  };

  const renderContent = () => {
    switch (phase) {
      case 'entrance':
        return (
          <div className="entrance-screen">
            <div className="entrance-text">
              <p>终 章</p>
              <p>···</p>
            </div>
          </div>
        );

      case 'title':
        return (
          <div className="title-screen">
            <div className="title-content">
              <span className="chapter-index">FINAL CHAPTER</span>
              <h1>魔王城</h1>
              <p className="subtitle">The Overlord's Citadel</p>
            </div>
          </div>
        );

      case 'narration':
        return (
          <div className="narration-screen">
            <div className="narration-box">
              <p className="narration-text">{NARRATION_TEXTS.intro}</p>
            </div>
            <span className="click-hint">点击继续</span>
          </div>
        );

      case 'boss_dialogue':
        const dialogue = NPC_DIALOGUES.intro[dialogueIndex];
        return (
          <div className="dialogue-screen">
            <div className="boss-container">
              <div className="boss-visual">
                <div className="boss-silhouette">
                  <div className="data-streams">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="stream" style={{ animationDelay: `${i * 0.2}s` }} />
                    ))}
                  </div>
                  <div className="boss-face">
                    <div className="face-code">{'{ }'}</div>
                  </div>
                </div>
              </div>
              
              <div className="dialogue-box">
                <div className="dialogue-header">
                  <span className={`speaker ${dialogue.speaker === '算法霸主' ? 'boss' : 'system'}`}>
                    {dialogue.speaker}
                  </span>
                </div>
                <p className="dialogue-text">{dialogue.text}</p>
                <span className="click-hint">点击继续</span>
              </div>
            </div>
          </div>
        );

      case 'ready':
        return (
          <div className="ready-screen">
            <div className="ready-content">
              <div className="boss-icon">🌀</div>
              <h2>最终决战</h2>
              <p className="battle-info">
                在15回合内击败算法霸主<br/>
                合理运用你在旅途中获得的技能
              </p>
              <div className="skills-preview">
                <h3>你的技能</h3>
                <div className="skills-grid">
                  <div className="skill-item">
                    <span className="skill-icon">⏱️</span>
                    <span className="skill-name">时之凝固</span>
                  </div>
                  <div className="skill-item">
                    <span className="skill-icon">🔊</span>
                    <span className="skill-name">共鸣之声</span>
                  </div>
                  <div className="skill-item">
                    <span className="skill-icon">🎯</span>
                    <span className="skill-name">弱点分析</span>
                  </div>
                  <div className="skill-item">
                    <span className="skill-icon">🔮</span>
                    <span className="skill-name">言灵·转化</span>
                  </div>
                </div>
              </div>
              <div className="skills-preview" style={{ marginTop: '1.5rem' }}>
                <h3>Boss技能</h3>
                <div className="skills-grid">
                  {BOSS_SKILLS.map(s => (
                    <div key={s.id} className="skill-item">
                      <span className="skill-icon">{s.icon}</span>
                      <span className="skill-name">{s.name}</span>
                    </div>
                  ))}
                </div>
                <p className="battle-info" style={{ marginTop: '0.75rem' }}>
                  信息茧房仅降低10%伤害；每回合不回复生命；终极过滤需充能3回合。
                </p>
              </div>
              <button className="start-battle-btn" onClick={onComplete}>
                <span className="btn-icon">⚔️</span>
                <span>开始战斗</span>
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="intro-section" onClick={phase !== 'ready' ? handleClick : undefined}>
      {renderContent()}
    </div>
  );
};

export default IntroSection;
