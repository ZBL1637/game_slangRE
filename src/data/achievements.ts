import { IconName } from '@/components/Icon/Icon';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: IconName;
  hidden?: boolean; // 隐藏成就：未解锁时显示为 "???"
  conditionHint?: string; // 解锁提示
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_step',
    name: '初出茅庐',
    description: '完成新手村的引导并开始游戏。',
    icon: 'flag',
    conditionHint: '开始游戏'
  },
  {
    id: 'explorer',
    name: '探索者',
    description: '解锁并访问所有六个区域。',
    icon: 'star',
    conditionHint: '访问所有区域'
  },
  {
    id: 'bookworm',
    name: '博学者',
    description: '在术语图鉴中查看超过 10 个词条。',
    icon: 'check',
    conditionHint: '查看图鉴详情'
  },
  {
    id: 'speed_runner',
    name: '速通玩家',
    description: '在 1 分钟内完成一个章节的阅读（快速跳过）。',
    icon: 'exp',
    hidden: true
  },
  {
    id: 'completionist',
    name: '全收集',
    description: '完成所有主线任务。',
    icon: 'star',
    hidden: true
  },
  {
    id: 'secret_finder',
    name: '数据挖掘者',
    description: '发现并点击了隐藏在界面中的彩蛋。',
    icon: 'lock',
    hidden: true
  },
  {
    id: 'perfect_clear',
    name: '一命通关',
    description: '在新手村测验中一次答对。',
    icon: 'star',
    hidden: true
  },
  {
    id: 'first_wipe',
    name: '第一次团灭',
    description: '在新手村测验中答错。',
    icon: 'skull',
    hidden: true
  }
];
