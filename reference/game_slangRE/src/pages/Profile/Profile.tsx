import React from 'react';
import { Panel } from '@/components/Panel/Panel';
import { Button } from '@/components/Button/Button';
import { Icon } from '@/components/Icon/Icon';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '@/context/PlayerContext';
import { ACHIEVEMENTS } from '@/data/achievements';
import './Profile.scss';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { state } = usePlayer();

  const completedCount = state.completedChapters.length;
  const achievementCount = state.achievements.length;
  const totalAchievements = ACHIEVEMENTS.length;
  const questCount = state.completedQuests.length;

  // 根据进度计算称号
  const getTitle = () => {
    if (achievementCount === totalAchievements) return '传说级数据大师';
    if (state.level >= 5) return '精英玩家';
    if (state.level >= 3) return '冒险家';
    return '萌新';
  };

  const getNextObjective = () => {
    if (completedCount < 6) {
      // Find first missing chapter
      for (let i = 1; i <= 6; i++) {
        if (!state.completedChapters.includes(i)) {
          return {
            text: `完成第 ${i} 章`,
            subtext: '在世界地图继续你的旅程',
            action: () => navigate('/world-map')
          };
        }
      }
    }
    if (achievementCount < totalAchievements) {
      return {
        text: '解锁所有成就',
        subtext: '在成就页面查看提示',
        action: () => navigate('/achievements')
      };
    }
    return {
      text: '所有内容已完成！',
      subtext: '你是真正的数据新闻大师。',
      action: null
    };
  };

  const nextObj = getNextObjective();

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2 className="pixel-title">玩家档案</h2>
        <Button size="sm" variant="secondary" onClick={() => navigate('/world-map')}>返回</Button>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <div className="avatar-section">
            <div className="avatar-placeholder">
               <img src="https://api.dicebear.com/7.x/pixel-art/svg?seed=Felix" alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
            </div>
            <div className="player-title">{getTitle()}</div>
            <div className="player-level">等级 {state.level}</div>
          </div>
          
          <div className="stats-grid">
            <div className="stat-box">
              <span className="stat-val">{state.currentExp}</span>
              <span className="stat-label">总经验值</span>
            </div>
            <div className="stat-box">
              <span className="stat-val">{completedCount} / 6</span>
              <span className="stat-label">已完成章节</span>
            </div>
            <div className="stat-box">
              <span className="stat-val">{achievementCount} / {totalAchievements}</span>
              <span className="stat-label">已获成就</span>
            </div>
            <div className="stat-box">
              <span className="stat-val">{questCount}</span>
              <span className="stat-label">已完成任务</span>
            </div>
          </div>

          <div className="next-objective">
            <h3>下一目标</h3>
            <div className="objective-box" onClick={nextObj.action ? nextObj.action : undefined} style={{ cursor: nextObj.action ? 'pointer' : 'default' }}>
              <div className="obj-text">{nextObj.text}</div>
              <div className="obj-sub">{nextObj.subtext}</div>
              {nextObj.action && <Icon name="arrow-right" size="sm" />}
            </div>
          </div>
        </div>

        <Panel className="profile-history">
          <h3>冒险日志</h3>
          <div className="history-list">
            {state.completedChapters.length > 0 ? (
              state.completedChapters.map(ch => (
                <div key={ch} className="history-item">
                  <Icon name="flag" size="sm" />
                  <span>完成了第 {ch} 章</span>
                </div>
              ))
            ) : (
              <div className="empty-log">暂无记录。去探索吧！</div>
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
};

export default Profile;
