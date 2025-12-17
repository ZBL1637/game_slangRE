// ============================================================================
// BattleEffects - 战斗特效组件
// ============================================================================

import React from 'react';
import './BattleEffects.scss';

interface BattleEffectsProps {
  animation: string | null;
}

const BattleEffects: React.FC<BattleEffectsProps> = ({ animation }) => {
  if (!animation) return null;

  const renderEffect = () => {
    switch (animation) {
      case 'player_attack':
        return (
          <div className="effect attack-effect">
            <div className="slash-lines">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="slash" style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          </div>
        );

      case 'skill_time_freeze':
        return (
          <div className="effect time-freeze-effect">
            <div className="freeze-overlay" />
            <div className="clock-icon">⏱️</div>
            <div className="freeze-particles">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="ice-particle"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 0.5}s`
                  }}
                />
              ))}
            </div>
          </div>
        );

      case 'skill_resonance':
        return (
          <div className="effect resonance-effect">
            <div className="sound-waves">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="wave" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
            <div className="resonance-icon">🔊</div>
          </div>
        );

      case 'skill_weakness':
        return (
          <div className="effect weakness-effect">
            <div className="scan-lines">
              <div className="scan-line horizontal" />
              <div className="scan-line vertical" />
            </div>
            <div className="target-icon">🎯</div>
            <div className="data-points">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="data-point"
                  style={{
                    transform: `rotate(${i * 45}deg) translateY(-80px)`
                  }}
                />
              ))}
            </div>
          </div>
        );

      case 'skill_logos':
        return (
          <div className="effect logos-effect">
            <div className="magic-circle">
              <div className="circle-outer" />
              <div className="circle-inner" />
              <div className="runes">
                {['☯', '✦', '◈', '⬡', '✧', '◇'].map((rune, i) => (
                  <span
                    key={i}
                    className="rune"
                    style={{ transform: `rotate(${i * 60}deg) translateY(-60px)` }}
                  >
                    {rune}
                  </span>
                ))}
              </div>
            </div>
            <div className="logos-icon">🔮</div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="battle-effects-layer">
      {renderEffect()}
    </div>
  );
};

export default BattleEffects;
