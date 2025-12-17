// ============================================================================
// 第四章：数据洪流之都 - 类型定义
// ============================================================================

// 游戏阶段
export type GamePhase = 
  | 'intro'           // 入场动画
  | 'city_overview'   // 城市概览
  | 'node_1'          // 节点一：玩家光谱分析
  | 'node_2'          // 节点二：情感极性透视
  | 'node_3'          // 节点三：术语类别情感分布
  | 'node_4'          // 节点四：多游戏术语分布
  | 'skill_unlock'    // 技能解锁
  | 'outro';          // 结束

// 数据节点
export interface DataNode {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  completed: boolean;
  question: NodeQuestion;
}

// 节点问题
export interface NodeQuestion {
  question: string;
  hint: string;
  options: QuestionOption[];
  correctIndex: number;
  explanation: string;
}

// 问题选项
export interface QuestionOption {
  label: string;
  value: string;
}

// 游戏术语分类分布数据
export interface TermDistributionData {
  game: string;
  categories: {
    [key: string]: number;
  };
}

// 情感分布数据
export interface SentimentData {
  game: string;
  neutral: number;
  positive: number;
  negative: number;
}

// 术语类别情感数据
export interface CategorySentimentData {
  category: string;
  neutral: number;
  positive: number;
  negative: number;
}

// 多游戏术语分布数据
export interface MultiGameTermData {
  game: string;
  categories: {
    [key: string]: number;
  };
}

// 图表交互状态
export interface ChartInteractionState {
  selectedGame?: string;
  selectedCategory?: string;
  timeRange?: [number, number];
  highlightedData?: string[];
}

// NPC对话
export interface NPCDialogue {
  speaker: string;
  text: string;
  emotion?: 'neutral' | 'happy' | 'thinking' | 'surprised';
}

// 技能信息
export interface SkillInfo {
  name: string;
  englishName: string;
  description: string;
  effect: string;
  cooldown: number;
}
