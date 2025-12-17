// ============================================================================
// 终章：魔王城 (The Overlord's Citadel) - 类型定义
// ============================================================================

// 战斗状态
export type BattlePhase = 'intro' | 'battle' | 'victory' | 'defeat';

// 技能类型
export type SkillType = 'player' | 'boss';

// 效果类型
export type EffectType = 
  | 'damage'           // 伤害
  | 'heal'             // 治疗
  | 'shield'           // 护盾
  | 'stun'             // 眩晕/冻结
  | 'disable_skill'    // 禁用技能
  | 'summon'           // 召唤
  | 'charge'           // 充能
  | 'crit_boost'       // 暴击提升
  | 'damage_convert'   // 伤害转化
  | 'copy_skill';      // 复制技能

// 玩家技能ID
export type PlayerSkillId = 
  | 'time_freeze'      // 时之凝固
  | 'resonance'        // 共鸣之声
  | 'weakness'         // 弱点分析
  | 'logos';           // 言灵·转化

// Boss技能ID
export type BossSkillId = 
  | 'cocoon'           // 信息茧房
  | 'traffic'          // 流量操纵
  | 'decay'            // 语义退化
  | 'barrier'          // 圈层壁垒
  | 'filter';          // 终极过滤

// 技能定义
export interface Skill {
  id: PlayerSkillId | BossSkillId;
  name: string;
  englishName: string;
  icon: string;
  description: string;
  effectType: EffectType;
  cooldown: number;
  currentCooldown: number;
  isDisabled: boolean;
  disabledTurns: number;
}

// 玩家技能（带额外属性）
export interface PlayerSkill extends Skill {
  id: PlayerSkillId;
  chapterSource: string;  // 来源章节
  effectValue: number;    // 效果数值
  duration: number;       // 持续回合
}

// Boss技能（带额外属性）
export interface BossSkill extends Skill {
  id: BossSkillId;
  damage?: number;
  chargeTime?: number;    // 充能时间
  shieldValue?: number;   // 护盾值
}

// 状态效果
export interface StatusEffect {
  id: string;
  name: string;
  icon: string;
  type: EffectType;
  value: number;
  remainingTurns: number;
  source: 'player' | 'boss';
}

// 战斗单位基础属性
export interface BattleUnit {
  name: string;
  maxHp: number;
  currentHp: number;
  shield: number;
  statusEffects: StatusEffect[];
}

// 玩家状态
export interface PlayerState extends BattleUnit {
  skills: PlayerSkill[];
  critBoost: number;      // 暴击提升
  damageConvert: boolean; // 伤害转化激活
}

// Boss状态
export interface BossState extends BattleUnit {
  skills: BossSkill[];
  isCharging: boolean;    // 是否在充能
  chargeProgress: number; // 充能进度
  isStunned: boolean;     // 是否被眩晕
  stunnedTurns: number;   // 眩晕剩余回合
}

// 小怪状态
export interface MinionState {
  id: string;
  name: string;
  maxHp: number;
  currentHp: number;
  isAlive: boolean;
}

// 战斗日志条目
export interface BattleLogEntry {
  turn: number;
  actor: 'player' | 'boss' | 'system';
  action: string;
  detail: string;
  timestamp: number;
}

// 游戏状态
export interface FinalChapterState {
  currentPhase: BattlePhase;
  currentTurn: number;
  maxTurns: number;
  isPlayerTurn: boolean;
  player: PlayerState;
  boss: BossState;
  minions: MinionState[];
  battleLog: BattleLogEntry[];
  lastBossSkill: BossSkillId | null;
  copiedSkill: BossSkill | null;
}

// NPC对话
export interface NPCDialogue {
  id: string;
  speaker: string;
  text: string;
  emotion?: 'neutral' | 'menacing' | 'defeated';
}

// 战斗动画类型
export type AnimationType = 
  | 'attack'
  | 'skill'
  | 'damage'
  | 'heal'
  | 'shield'
  | 'stun'
  | 'charge'
  | 'ultimate';

// 战斗动画
export interface BattleAnimation {
  type: AnimationType;
  target: 'player' | 'boss' | 'minion';
  value?: number;
  skillIcon?: string;
}
