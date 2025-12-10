export type TermSource = 'encyclopedia' | 'scraped' | 'mixed';

export interface TermCategory {
  l1: string; // 一级分类
  l2: string; // 二级分类
  l3?: string | null; // 三级分类
}

export interface Term {
  id: string; // 唯一标识符 (通常使用 term/title)
  term: string; // 术语名称
  definition: string; // 定义/摘要
  games: string[]; // 相关游戏列表
  category: TermCategory; // 分类信息
  source: TermSource; // 数据来源
  tags: string[]; // 标签 (如: 萌新, 肝帝, etc.)
  relatedTerms?: string[]; // 相关术语 ID
}

// 索引结构接口
export interface GameIndex {
  [gameName: string]: string[]; // 游戏名 -> 术语ID列表
}

export interface CategoryIndex {
  [l1: string]: {
    [l2: string]: string[]; // 二级分类 -> 术语ID列表
  };
}

// 图表统计数据接口
export interface ChartData {
  sunburstData: any; // 旭日图数据结构
  gameRadarData: any; // 雷达图数据结构
  wordCloudData: { name: string; value: number }[]; // 词云数据
}

export interface QuizItem {
  id: string;
  question: string;
  options: string[];
  answer: string;
  relatedTermId: string;
}
