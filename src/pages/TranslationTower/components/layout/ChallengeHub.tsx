// ChallengeHub - 挑战中心
import React from 'react';
import { Challenge, ChallengeType } from '../../types';
import './ChallengeHub.scss';

interface ChallengeHubProps {
  challenges: Challenge[];
  completedChallenges: ChallengeType[];
  onStartChallenge: (challengeId: ChallengeType) => void;
}

export const ChallengeHub: React.FC<ChallengeHubProps> = ({
  challenges,
  completedChallenges,
  onStartChallenge
}) => {
  const getChallengeStatus = (challenge: Challenge, index: number) => {
    if (completedChallenges.includes(challenge.id)) {
      return 'completed';
    }
    if (index === 0 || completedChallenges.includes(challenges[index - 1].id)) {
      return 'available';
    }
    return 'locked';
  };

  return (
    <section className="challenge-hub-section">
      <div className="section-header">
        <h2>翻译圣坛</h2>
        <p>完成三重试炼，掌握翻译之道</p>
      </div>

      <div className="challenges-container">
        {/* 塔的层级视图 */}
        <div className="tower-levels">
          {challenges.map((challenge, index) => {
            const status = getChallengeStatus(challenge, index);
            const isReversed = challenges.length - 1 - index;
            
            return (
              <div
                key={challenge.id}
                className={`challenge-level level-${isReversed + 1} ${status}`}
                onClick={() => status !== 'locked' && onStartChallenge(challenge.id)}
              >
                <div className="level-connector">
                  {index < challenges.length - 1 && <div className="connector-line"></div>}
                </div>
                
                <div className="level-content">
                  <div className="level-icon">
                    {status === 'completed' ? '✅' : status === 'locked' ? '🔒' : challenge.icon}
                  </div>
                  
                  <div className="level-info">
                    <h3>{challenge.name}</h3>
                    <p>{challenge.description}</p>
                    
                    <div className="level-reward">
                      <span className="reward-label">奖励:</span>
                      <span className="reward-value">{challenge.reward}</span>
                    </div>
                  </div>

                  <div className="level-status">
                    {status === 'completed' && (
                      <span className="status-badge completed">已完成</span>
                    )}
                    {status === 'available' && (
                      <button className="start-btn">
                        开始挑战 →
                      </button>
                    )}
                    {status === 'locked' && (
                      <span className="status-badge locked">未解锁</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 进度指示器 */}
        <div className="progress-indicator">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${(completedChallenges.length / challenges.length) * 100}%` }}
            ></div>
          </div>
          <span className="progress-text">
            {completedChallenges.length}/{challenges.length} 圣坛已完成
          </span>
        </div>
      </div>

      {/* NPC提示 */}
      <div className="npc-hint">
        <span className="npc-avatar">🧙‍♂️</span>
        <div className="hint-bubble">
          {completedChallenges.length === 0 && (
            <p>从第一层"关键词对对碰"开始吧，这是翻译的基础。</p>
          )}
          {completedChallenges.length === 1 && (
            <p>很好！现在来学习如何在不同翻译风格间做出选择。</p>
          )}
          {completedChallenges.length === 2 && (
            <p>最后一关！理解文化隐喻是翻译的最高境界。</p>
          )}
          {completedChallenges.length === 3 && (
            <p>出色！你已经掌握了翻译的三重境界，准备好接受最终考验了！</p>
          )}
        </div>
      </div>
    </section>
  );
};
