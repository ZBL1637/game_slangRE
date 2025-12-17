export type QuestType = 'main' | 'side' | 'explore';
export type QuestStatus = 'active' | 'completed' | 'locked';

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: QuestType;
  expReward: number;
  chapterId?: number; // 关联的章节 ID (如果是主线)
  target?: string; // 任务目标标识 (例如 'visit_lab', 'read_term_xxx')
}

export const QUESTS: Quest[] = [
  // 主线任务
  {
    id: 'main_ch1',
    title: '初入起源之森',
    description: '完成第一章：黑话起源之森的阅读与探索。',
    type: 'main',
    expReward: 300,
    chapterId: 1
  },
  {
    id: 'main_ch2',
    title: '征服战斗平原',
    description: '完成第二章：战斗本体平原的阅读与探索。',
    type: 'main',
    expReward: 400,
    chapterId: 2
  },
  {
    id: 'main_ch3',
    title: '融入玩家城镇',
    description: '完成第三章：玩家生态城镇的阅读与探索。',
    type: 'main',
    expReward: 450,
    chapterId: 3
  },
  {
    id: 'main_ch4',
    title: '理解经济体系',
    description: '完成第四章：经济与氪金之都的阅读与探索。',
    type: 'main',
    expReward: 500,
    chapterId: 4
  },
  {
    id: 'main_ch5',
    title: '穿越弹幕峡谷',
    description: '完成第五章：弹幕大峡谷的阅读与探索。',
    type: 'main',
    expReward: 550,
    chapterId: 5
  },
  {
    id: 'main_ch6',
    title: '决战魔王城',
    description: '完成第六章：终章·魔王城的阅读与探索。',
    type: 'main',
    expReward: 1000,
    chapterId: 6
  },
  
  // 支线任务
  {
    id: 'side_visit_dict',
    title: '知识探求者',
    description: '访问一次术语图鉴页面。',
    type: 'explore',
    expReward: 50,
    target: 'visit_dictionary'
  },
  {
    id: 'side_visit_lab',
    title: '数据科学家',
    description: '访问数据实验室页面。',
    type: 'explore',
    expReward: 100,
    target: 'visit_lab'
  }
];
