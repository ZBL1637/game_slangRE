import React, { useMemo } from 'react';
import { Panel } from '@/components/Panel/Panel';
import { Button } from '@/components/Button/Button';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '@/context/PlayerContext';
import { QUESTS } from '@/data/quests';
import './Quests.scss';

const Quests: React.FC = () => {
  const navigate = useNavigate();
  const { state, getQuestStatus } = usePlayer();

  const questList = useMemo(() => {
    return QUESTS.map(q => ({
      ...q,
      status: getQuestStatus(q.id)
    })).filter(q => q.status !== 'locked'); // 仅显示已激活或已完成的任务
  }, [state.activeQuests, state.completedQuests]);

  const activeQuests = questList.filter(q => q.status === 'active');
  const completedQuests = questList.filter(q => q.status === 'completed');

  return (
    <div className="quest-log-container">
      <div className="quest-header">
        <h2 className="pixel-title">Quest Log</h2>
        <Button size="sm" variant="secondary" onClick={() => navigate('/world-map')}>Back</Button>
      </div>

      <div className="quest-content">
        <Panel className="quest-panel">
          <h3 className="section-title">Active Quests ({activeQuests.length})</h3>
          <div className="quest-list">
            {activeQuests.length > 0 ? (
              activeQuests.map(quest => (
                <div key={quest.id} className="quest-item active">
                  <div className="quest-info">
                    <h4 className="quest-title">
                      {quest.type === 'main' && <span className="tag main">MAIN</span>}
                      {quest.type === 'side' && <span className="tag side">SIDE</span>}
                      {quest.type === 'explore' && <span className="tag explore">EXPLORE</span>}
                      {quest.title}
                    </h4>
                    <p className="quest-desc">{quest.description}</p>
                  </div>
                  <div className="quest-reward">
                    <span>XP +{quest.expReward}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">No active quests. You are all caught up!</div>
            )}
          </div>
        </Panel>

        <Panel className="quest-panel">
          <h3 className="section-title">Completed Quests ({completedQuests.length})</h3>
          <div className="quest-list">
            {completedQuests.length > 0 ? (
              completedQuests.map(quest => (
                <div key={quest.id} className="quest-item completed">
                  <div className="quest-info">
                     <h4 className="quest-title">{quest.title}</h4>
                  </div>
                  <div className="quest-status">
                    <span>✅ COMPLETED</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">No completed quests yet. Get moving!</div>
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
};

export default Quests;
