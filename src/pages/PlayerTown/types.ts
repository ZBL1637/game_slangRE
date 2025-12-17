// ============================================================================
// 第三章：玩家生态城镇 - 类型定义
// ============================================================================

// DNA测试相关类型
export type GameGenre = 'MOBA' | '二次元' | '沙盒' | 'FPS' | '竞速' | '休闲';

export interface DNAQuestionOption {
  label: string;
  weights: Partial<Record<GameGenre, number>>;
}

export interface DNAQuestion {
  id: string;
  title: string;
  subtitle?: string;
  multi?: boolean;
  maxPick?: number;
  options: DNAQuestionOption[];
}

export interface DNAResult {
  genre: GameGenre;
  percent: number;
}

export interface DNATheme {
  bg: string;
  accent: string;
}

export interface PlayerType {
  id: string;
  name: string;
  description: string;
  traits: string[];
  icon: string;
}

// 漂浮黑话词汇相关类型
export interface FloatingTerm {
  id: string;
  term: string;
  category: string;
  definition: string;
  example: string;
  origin?: string;
  emotion?: 'positive' | 'neutral' | 'negative';
  x?: number;
  y?: number;
  speed?: number;
  delay?: number;
}

// AI查询相关类型
export interface AIQueryResult {
  term: string;
  definition: string;
  usage: string;
  emotion: string;
  origin: string;
  relatedTerms: string[];
}

// NPC对话相关类型
export interface NPCDialogue {
  id: string;
  speaker: string;
  text: string;
  choices?: DialogueChoice[];
}

export interface DialogueChoice {
  text: string;
  nextId: string;
}

// 章节进度相关类型
export type Chapter3Phase = 
  | 'intro'           // 入场
  | 'npc_greeting'    // NPC迎接
  | 'dna_test'        // DNA测试
  | 'dna_result'      // DNA结果
  | 'archive_intro'   // 档案馆介绍
  | 'ai_query'        // AI查询
  | 'exploration'     // 自由探索
  | 'skill_unlock'    // 技能解锁
  | 'outro';          // 结束

export interface Chapter3State {
  phase: Chapter3Phase;
  dnaCompleted: boolean;
  dnaResult: DNAResult[] | null;
  queriedTerms: string[];
  exploredTerms: string[];
  skillUnlocked: boolean;
}

// 建筑物类型
export interface Building {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  position: { x: number; y: number };
}

// 脚本文案类型
export interface Chapter3Script {
  ch3_title: string;
  ch3_subtitle: string;
  ch3_intro_narration_1: string;
  ch3_intro_narration_2: string;
  ch3_npc_name: string;
  ch3_npc_title: string;
  ch3_npc_greeting: string;
  ch3_npc_task: string;
  ch3_dna_intro: string;
  ch3_archive_intro: string;
  ch3_ai_intro: string;
  ch3_exploration_hint: string;
  ch3_skill_unlock_text: string;
  ch3_skill_name: string;
  ch3_skill_desc: string;
  ch3_outro_narration_1: string;
  ch3_outro_narration_2: string;
}
