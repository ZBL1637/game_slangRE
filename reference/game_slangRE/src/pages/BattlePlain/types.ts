// 第二章：战斗本体平原 - 类型定义

export interface TimelineEra {
  id: string;
  name: string;
  period: string;
  icon: string;
  description: string;
  events: TimelineEvent[];
  minigame: MinigameConfig;
  fragment: TimeFragment;
}

export interface TimelineEvent {
  year: string;
  title: string;
  details: string[];
  keywords: string[];
}

export interface MinigameConfig {
  type: 'qte' | 'card_placement' | 'gacha' | 'bullet_catch';
  title: string;
  description: string;
  instructions: string;
}

export interface TimeFragment {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  collected: boolean;
}

export interface DialogueOption {
  id: string;
  text: string;
  response: string;
}

export interface NPCDialogue {
  speaker: string;
  text: string;
  action?: string;
}

export interface GameState {
  currentEra: string | null;
  fragmentsCollected: string[];
  minigamesCompleted: string[];
  skillUnlocked: boolean;
}

// QTE小游戏类型
export interface QTESequence {
  key: string;
  displayKey: string;
  timing: number;
}

// 卡牌放置小游戏类型
export interface RoleCard {
  id: string;
  name: string;
  role: 'tank' | 'healer' | 'dps';
  description: string;
  correctSlot: string;
}

export interface CardSlot {
  id: string;
  name: string;
  acceptRole: 'tank' | 'healer' | 'dps';
}

// 抽卡小游戏类型
export interface GachaResult {
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  term: string;
  description: string;
}

// 弹幕捕捉小游戏类型
export interface BulletComment {
  id: string;
  text: string;
  speed: number;
  y: number;
  isTarget: boolean;
}
