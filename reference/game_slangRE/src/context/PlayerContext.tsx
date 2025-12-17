import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { QUESTS } from '@/data/quests';
import { ACHIEVEMENTS, Achievement } from '@/data/achievements';
import { DialogBox } from '@/components/DialogBox/DialogBox'; // 复用 DialogBox 做成就弹窗
import { Icon } from '@/components/Icon/Icon';

// 1. 定义玩家状态接口
export interface PlayerState {
  level: number;
  currentExp: number;
  expToNext: number;
  unlockedChapters: number[]; // 存储章节 ID
  completedChapters: number[];
  achievements: string[]; // 成就 ID
  completedQuests: string[]; // 已完成的任务 ID
  activeQuests: string[]; // 已激活的任务 ID (当前简化逻辑：未完成即视为 active)
  newPlayerMode: boolean; // 新手模式开关
}

// 默认初始状态
const INITIAL_STATE: PlayerState = {
  level: 1,
  currentExp: 0,
  expToNext: 100, // 初始升级所需经验
  unlockedChapters: [1], // 默认解锁第一章
  completedChapters: [],
  achievements: [],
  completedQuests: [],
  activeQuests: ['main_ch1', 'side_visit_dict'], // 初始激活任务
  newPlayerMode: true
};

// 2. Context Value 接口
interface PlayerContextType {
  state: PlayerState;
  addExp: (amount: number) => void;
  unlockChapter: (chapterId: number) => void;
  completeChapter: (chapterId: number) => void;
  unlockAchievement: (achievementId: string) => void;
  completeQuest: (questId: string) => void;
  toggleNewPlayerMode: () => void;
  resetProgress: () => void;
  getQuestStatus: (questId: string) => 'active' | 'completed' | 'locked';
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

// 3. Provider 组件
export const PlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<PlayerState>(() => {
    // 初始化时尝试从 localStorage 读取
    const saved = localStorage.getItem('datanews_player_save');
    return saved ? JSON.parse(saved) : INITIAL_STATE;
  });

  const [notification, setNotification] = useState<{ type: 'achievement', data: Achievement } | null>(null);

  // 每次状态更新时保存到 localStorage
  useEffect(() => {
    localStorage.setItem('datanews_player_save', JSON.stringify(state));
  }, [state]);

  // 经验值增加逻辑
  const addExp = (amount: number) => {
    setState(prev => {
      let newExp = prev.currentExp + amount;
      let newLevel = prev.level;
      let newExpToNext = prev.expToNext;

      // 简单的升级逻辑：经验溢出则升级
      while (newExp >= newExpToNext) {
        newExp -= newExpToNext;
        newLevel++;
        newExpToNext = Math.floor(newExpToNext * 1.5); // 每一级所需经验增加 50%
        // 这里可以触发升级音效或弹窗（通过 useEffect 或 callback）
        // alert(`LEVEL UP! You are now Level ${newLevel}!`); // 暂时注释，避免频繁弹窗
      }

      return {
        ...prev,
        level: newLevel,
        currentExp: newExp,
        expToNext: newExpToNext
      };
    });
  };

  const unlockChapter = (chapterId: number) => {
    setState(prev => {
      if (prev.unlockedChapters.includes(chapterId)) return prev;
      return { ...prev, unlockedChapters: [...prev.unlockedChapters, chapterId] };
    });
  };

  const completeQuest = (questId: string) => {
    setState(prev => {
      if (prev.completedQuests.includes(questId)) return prev;
      
      const quest = QUESTS.find(q => q.id === questId);
      if (quest) {
        // 自动发放任务经验奖励
        let newExp = prev.currentExp + quest.expReward;
        let newLevel = prev.level;
        let newExpToNext = prev.expToNext;

        while (newExp >= newExpToNext) {
          newExp -= newExpToNext;
          newLevel++;
          newExpToNext = Math.floor(newExpToNext * 1.5);
        }

        return {
           ...prev,
           completedQuests: [...prev.completedQuests, questId],
           level: newLevel,
           currentExp: newExp,
           expToNext: newExpToNext
        };
      }
      
      return { ...prev, completedQuests: [...prev.completedQuests, questId] };
    });
  };

  const completeChapter = (chapterId: number) => {
    setState(prev => {
      if (prev.completedChapters.includes(chapterId)) return prev;
      
      let newState = { ...prev, completedChapters: [...prev.completedChapters, chapterId] };
      
      // 解锁下一章
      const nextChapterId = chapterId + 1;
      if (nextChapterId <= 6 && !newState.unlockedChapters.includes(nextChapterId)) {
        newState.unlockedChapters = [...newState.unlockedChapters, nextChapterId];
        // 激活下一章的主线任务
        const nextQuest = QUESTS.find(q => q.chapterId === nextChapterId && q.type === 'main');
        if (nextQuest && !newState.activeQuests.includes(nextQuest.id)) {
          newState.activeQuests = [...newState.activeQuests, nextQuest.id];
        }
      }

      return newState;
    });

    // 如果有任务，异步触发完成
    const relatedQuest = QUESTS.find(q => q.chapterId === chapterId && q.type === 'main');
    if (relatedQuest) {
      setTimeout(() => completeQuest(relatedQuest.id), 0);
    }
  };

  const unlockAchievement = (achievementId: string) => {
    setState(prev => {
      if (prev.achievements.includes(achievementId)) return prev;
      
      const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
      if (achievement) {
        setNotification({ type: 'achievement', data: achievement });
        // 3秒后自动关闭通知
        setTimeout(() => setNotification(null), 3000);
      }
      
      return { ...prev, achievements: [...prev.achievements, achievementId] };
    });
  };

  const toggleNewPlayerMode = () => {
    setState(prev => ({ ...prev, newPlayerMode: !prev.newPlayerMode }));
  };

  const resetProgress = () => {
    setState(INITIAL_STATE);
    localStorage.removeItem('datanews_player_save');
  };

  const getQuestStatus = (questId: string) => {
    if (state.completedQuests.includes(questId)) return 'completed';
    if (state.activeQuests.includes(questId)) return 'active';
    return 'locked';
  };

  return (
    <PlayerContext.Provider value={{ 
      state, 
      addExp, 
      unlockChapter, 
      completeChapter, 
      unlockAchievement,
      completeQuest,
      toggleNewPlayerMode,
      resetProgress,
      getQuestStatus
    }}>
      {children}
      
      {/* 全局成就通知 */}
      {notification && notification.type === 'achievement' && (
        <div style={{ 
          position: 'fixed', 
          bottom: '20px', 
          right: '20px', 
          zIndex: 9999,
          width: '300px',
          animation: 'slideIn 0.5s ease-out'
        }}>
          <DialogBox 
            text={`Unlocked: ${notification.data.name}`}
            speaker="ACHIEVEMENT"
            avatar={<Icon name={notification.data.icon} size="lg" />}
            speed={50}
          />
        </div>
      )}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </PlayerContext.Provider>
  );
};

// 4. Custom Hook
export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
