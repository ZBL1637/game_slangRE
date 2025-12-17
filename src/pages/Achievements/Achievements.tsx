import React from 'react';
import { Panel } from '@/components/Panel/Panel';
import { Button } from '@/components/Button/Button';
import { Icon } from '@/components/Icon/Icon';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '@/context/PlayerContext';
import { ACHIEVEMENTS } from '@/data/achievements';
import './Achievements.scss';

const Achievements: React.FC = () => {
  const navigate = useNavigate();
  const { state } = usePlayer();

  return (
    <div className="achievements-container">
      <div className="achv-header">
        <h2 className="pixel-title">Achievements</h2>
        <Button size="sm" variant="secondary" onClick={() => navigate(-1)}>Back</Button>
      </div>

      <div className="achv-content">
        <div className="achv-grid">
          {ACHIEVEMENTS.map(achv => {
            const isUnlocked = state.achievements.includes(achv.id);
            const isHidden = achv.hidden && !isUnlocked;

            return (
              <Panel key={achv.id} className={`achv-card ${isUnlocked ? 'unlocked' : 'locked'}`}>
                <div className="achv-icon">
                   {isUnlocked ? <Icon name={achv.icon} size="lg" /> : <Icon name="lock" size="lg" />}
                </div>
                <div className="achv-info">
                  <h3 className="achv-name">
                    {isHidden ? '???' : achv.name}
                  </h3>
                  <p className="achv-desc">
                    {isHidden ? '此成就是隐藏的。' : achv.description}
                  </p>
                  {!isUnlocked && !isHidden && achv.conditionHint && (
                    <p className="achv-hint">Hint: {achv.conditionHint}</p>
                  )}
                  {isUnlocked && <span className="achv-status">UNLOCKED</span>}
                </div>
              </Panel>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Achievements;
