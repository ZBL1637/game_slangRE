// ============================================================================
// 第五章：译语通天塔 (Tower of Translation) - 类型定义
// ============================================================================

// 翻译挑战类型
export type ChallengeType = 'keyword' | 'style' | 'metaphor';

// 翻译风格
export type TranslationStyle = 'foreignization' | 'domestication';

// 挑战状态
export type ChallengeStatus = 'locked' | 'available' | 'completed';

// 关键词翻译项
export interface KeywordItem {
  id: string;
  chinese: string;
  pinyin: string;
  correctAnswer: string;
  options: string[];
  explanation: string;
  culturalNote: string;
}

// 风格翻译项
export interface StyleItem {
  id: string;
  chinese: string;
  context: string;
  foreignization: {
    translation: string;
    explanation: string;
    culturalPreservation: number; // 0-100
    accessibility: number; // 0-100
  };
  domestication: {
    translation: string;
    explanation: string;
    culturalPreservation: number;
    accessibility: number;
  };
}

// 文化隐喻项
export interface MetaphorItem {
  id: string;
  source: string;
  sourceType: 'buddhism' | 'taoism' | 'poetry' | 'idiom';
  gameElement: string;
  connection: string;
  explanation: string;
}

// 挑战数据
export interface Challenge {
  id: ChallengeType;
  name: string;
  description: string;
  icon: string;
  status: ChallengeStatus;
  reward: string;
}

// 商人角色
export interface Merchant {
  id: string;
  name: string;
  origin: string;
  avatar: string;
  dialogues: {
    greeting: string;
    confused: string;
    understanding: string;
    thanks: string;
  };
}

// 最终翻译任务
export interface FinalTranslationTask {
  originalText: string;
  context: string;
  targetMerchant: string;
  hints: string[];
  correctTranslation: string;
  playerTranslation?: string;
}

// 游戏状态
export interface Chapter5State {
  currentPhase: 'intro' | 'tower' | 'challenges' | 'final' | 'skill' | 'outro';
  completedChallenges: ChallengeType[];
  unlockedSkills: string[];
  merchantUnderstanding: number; // 0-100
  currentChallenge: ChallengeType | null;
}

// NPC对话
export interface NPCDialogue {
  id: string;
  speaker: string;
  text: string;
  emotion?: 'neutral' | 'happy' | 'confused' | 'excited';
}

// 角色译名注解
export interface CharacterNameNote {
  id: string;
  chinese: string;
  english: string;
  pinyin: string;
  strategy: TranslationStyle;
  reason: string;
  culturalBackground: string;
}
