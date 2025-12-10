import React from 'react';
import { Shield, Zap, Sword, Skull } from 'lucide-react';
import './HUD.scss';

export const HUD: React.FC = () => {
  return (
    <div className="battle-hud">
      {/* Top Status Bars */}
      <div className="status-bars">
        {/* Player Status */}
        <div className="status-group player">
          <div className="label">
            <span>HP 100%</span>
            <span>LV.10</span>
          </div>
          <div className="bar-container hp">
            <div className="bar" style={{ width: '100%' }}></div>
          </div>
          <div className="label mp">
            <span>MP 85%</span>
          </div>
          <div className="bar-container mp">
             <div className="bar" style={{ width: '85%' }}></div>
          </div>
        </div>

        {/* Target Status */}
        <div className="status-group target">
           <div className="label">
            <Skull size={14} />
            <span>BOSS: TRAINING DUMMY</span>
            <span>99.9%</span>
          </div>
          <div className="bar-container hp">
            <div className="bar" style={{ width: '99%' }}></div>
          </div>
          <div className="label threat">
            <span>THREAT</span>
          </div>
           <div className="bar-container threat">
             <div className="bar" style={{ width: '40%' }}></div>
          </div>
        </div>
      </div>

      {/* Skill Bar (Decorative) */}
      <div className="skill-bar">
        {['Q', 'W', 'E', 'R'].map((key, i) => (
          <div key={key} className="skill-slot">
            <div className="slot-box">
               {i === 0 && <Sword size={20} />}
               {i === 1 && <Shield size={20} />}
               {i === 2 && <Zap size={20} />}
               {i === 3 && <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>!</span>}
               {/* CD Overlay simulation */}
               {i === 3 && <div className="cd-overlay">5s</div>}
            </div>
            <div className="key-hint">
              {key}
            </div>
          </div>
        ))}
      </div>
      
      {/* AOE Warning (Decorative) */}
      <div className="aoe-warning">
        <div className="inner-circle">
            <span>躲圈!</span>
        </div>
      </div>
    </div>
  );
};
