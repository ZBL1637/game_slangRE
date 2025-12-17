// ============================================================================
// 终章：魔王城 (The Overlord's Citadel) - 数据文件
// ============================================================================

import {
  PlayerSkill,
  BossSkill,
  NPCDialogue,
  BossState,
  PlayerState,
  MinionState
} from './types';

// 玩家技能数据
export const PLAYER_SKILLS: PlayerSkill[] = [
  {
    id: 'time_freeze',
    name: '时之凝固',
    englishName: 'Time Freeze',
    icon: '⏱️',
    description: '冻结时间，使Boss在接下来的2个回合内无法行动。可打断Boss的充能技能。',
    effectType: 'stun',
    cooldown: 5,
    currentCooldown: 0,
    isDisabled: false,
    disabledTurns: 0,
    chapterSource: '第二章：战斗本体平原',
    effectValue: 2,
    duration: 2
  },
  {
    id: 'resonance',
    name: '共鸣之声',
    englishName: 'Voice of Resonance',
    icon: '🔊',
    description: '复制Boss上一个回合使用的技能，并以50%的效果释放。',
    effectType: 'copy_skill',
    cooldown: 4,
    currentCooldown: 0,
    isDisabled: false,
    disabledTurns: 0,
    chapterSource: '第三章：玩家生态城镇',
    effectValue: 50,
    duration: 1
  },
  {
    id: 'weakness',
    name: '弱点分析',
    englishName: 'Weakness Analysis',
    icon: '🎯',
    description: '洞察Boss的弱点，接下来3个回合内所有攻击的暴击率提升50%。',
    effectType: 'crit_boost',
    cooldown: 5,
    currentCooldown: 0,
    isDisabled: false,
    disabledTurns: 0,
    chapterSource: '第四章：数据洪流之都',
    effectValue: 50,
    duration: 3
  },
  {
    id: 'logos',
    name: '言灵·转化',
    englishName: 'Logos Conversion',
    icon: '🔮',
    description: '将Boss下一次攻击的伤害类型随机转化，30%几率将伤害转化为治疗效果。',
    effectType: 'damage_convert',
    cooldown: 4,
    currentCooldown: 0,
    isDisabled: false,
    disabledTurns: 0,
    chapterSource: '第五章：译语通天塔',
    effectValue: 30,
    duration: 1
  }
];

// Boss技能数据
export const BOSS_SKILLS: BossSkill[] = [
  {
    id: 'cocoon',
    name: '信息茧房',
    englishName: 'Information Cocoon',
    icon: '🛡️',
    description: '为自身创建一个吸收伤害的护盾，持续2回合。护盾存在期间，受到的所有伤害降低10%。',
    effectType: 'shield',
    cooldown: 4,
    currentCooldown: 0,
    isDisabled: false,
    disabledTurns: 0,
    shieldValue: 10
  },
  {
    id: 'traffic',
    name: '流量操纵',
    englishName: 'Traffic Manipulation',
    icon: '💥',
    description: '对玩家发动一次强力单体攻击，造成中等伤害。',
    effectType: 'damage',
    cooldown: 2,
    currentCooldown: 0,
    isDisabled: false,
    disabledTurns: 0,
    damage: 20
  },
  {
    id: 'decay',
    name: '语义退化',
    englishName: 'Semantic Decay',
    icon: '⛓️',
    description: '释放一道数据流，随机禁用玩家的一个技能，持续2回合。',
    effectType: 'disable_skill',
    cooldown: 3,
    currentCooldown: 0,
    isDisabled: false,
    disabledTurns: 0
  },
  {
    id: 'barrier',
    name: '圈层壁垒',
    englishName: 'Community Barrier',
    icon: '🧱',
    description: '召唤两个"守门人"小怪。在小怪被消灭前，玩家的所有单体攻击都会被强制转移到小怪身上。',
    effectType: 'summon',
    cooldown: 6,
    currentCooldown: 0,
    isDisabled: false,
    disabledTurns: 0
  },
  {
    id: 'filter',
    name: '终极过滤',
    englishName: 'The Great Filter',
    icon: '🌀',
    description: '花费3个回合进行充能，充能完成后释放一次全屏攻击，秒杀玩家。必须打断！',
    effectType: 'charge',
    cooldown: 8,
    currentCooldown: 0,
    isDisabled: false,
    disabledTurns: 0,
    chargeTime: 3,
    damage: 999
  }
];

// Boss初始状态
export const INITIAL_BOSS_STATE: BossState = {
  name: '算法霸主',
  maxHp: 100,
  currentHp: 100,
  shield: 0,
  statusEffects: [],
  skills: BOSS_SKILLS,
  isCharging: false,
  chargeProgress: 0,
  isStunned: false,
  stunnedTurns: 0
};

// 玩家初始状态
export const INITIAL_PLAYER_STATE: PlayerState = {
  name: '玩家',
  maxHp: 100,
  currentHp: 100,
  shield: 0,
  statusEffects: [],
  skills: PLAYER_SKILLS,
  critBoost: 0,
  damageConvert: false
};

// 小怪数据
export const MINION_TEMPLATE: Omit<MinionState, 'id'> = {
  name: '守门人',
  maxHp: 30,
  currentHp: 30,
  isAlive: true
};

// NPC对话脚本
export const NPC_DIALOGUES: Record<string, NPCDialogue[]> = {
  intro: [
    {
      id: 'intro_1',
      speaker: '系统',
      text: '你踏入了魔王城的王座大厅...',
      emotion: 'neutral'
    },
    {
      id: 'intro_2',
      speaker: '算法霸主',
      text: '又一个试图挑战秩序的愚者...',
      emotion: 'menacing'
    },
    {
      id: 'intro_3',
      speaker: '算法霸主',
      text: '我是数据的主宰，信息的编织者。你以为学会了几个黑话，就能理解这个世界的真相？',
      emotion: 'menacing'
    },
    {
      id: 'intro_4',
      speaker: '算法霸主',
      text: '让我来展示给你看，什么是真正的"信息过载"！',
      emotion: 'menacing'
    }
  ],
  charging: [
    {
      id: 'charge_1',
      speaker: '算法霸主',
      text: '终极过滤...启动！',
      emotion: 'menacing'
    },
    {
      id: 'charge_2',
      speaker: '系统',
      text: '警告：Boss正在充能终极技能！必须在3回合内打断！',
      emotion: 'neutral'
    }
  ],
  stunned: [
    {
      id: 'stun_1',
      speaker: '算法霸主',
      text: '什...什么？时间...被冻结了？',
      emotion: 'defeated'
    }
  ],
  low_hp: [
    {
      id: 'low_1',
      speaker: '算法霸主',
      text: '不可能...我是完美的算法，怎么会被你这样的人类击败...',
      emotion: 'defeated'
    }
  ],
  victory: [
    {
      id: 'victory_1',
      speaker: '系统',
      text: '算法霸主被击败了！',
      emotion: 'neutral'
    },
    {
      id: 'victory_2',
      speaker: '算法霸主',
      text: '你...赢了...但记住...算法永远不会消失...它只会...进化...',
      emotion: 'defeated'
    }
  ],
  defeat: [
    {
      id: 'defeat_1',
      speaker: '算法霸主',
      text: '哈哈哈...信息过载协议...启动！',
      emotion: 'menacing'
    },
    {
      id: 'defeat_2',
      speaker: '系统',
      text: '世界正在被重置...游戏失败。',
      emotion: 'neutral'
    }
  ]
};

// 战斗提示
export const BATTLE_TIPS = {
  time_freeze: '提示：时之凝固可以打断Boss的"终极过滤"充能！',
  resonance: '提示：共鸣之声可以复制Boss的护盾或攻击技能！',
  weakness: '提示：在Boss护盾消失后使用弱点分析，可以最大化伤害输出！',
  logos: '提示：言灵·转化有30%几率将Boss的攻击转化为治疗！',
  minions: '提示：必须先消灭守门人小怪，才能攻击Boss本体！',
  charging: '警告：Boss正在充能终极技能！使用时之凝固打断它！'
};

// 游戏结局文本
export const ENDING_TEXT = {
  victory: `你击败了算法的化身，但真正的挑战存在于屏幕之外。

黑话，是玩家的创造，是社群的联结，也是文化的密码。
当它被理解时，便成为桥梁；当它被滥用时，则筑起高墙。

如何使用我们手中的语言，如何看待算法背后的世界，
这场游戏的终点，或许只是你思考的起点。`,
  
  defeat: `信息过载协议已启动，世界被重置...

但这不是终点。每一次失败都是学习的机会。
重新审视你的策略，合理运用每个技能，
你一定能够战胜算法霸主！`
};

// 叙述文本
export const NARRATION_TEXTS = {
  intro: '在黑话大陆的最深处，矗立着一座悬浮在数据风暴中的黑色城堡——魔王城。塔身被流动的代码和算法节点环绕，充满了扭曲的数据结构和破碎的信息碎片...',
  battle_start: '最终的王座大厅位于塔顶，背景是庞大的数据宇宙。在这里，你将面对象征着算法操纵、信息茧房和圈层壁垒的最终Boss——算法霸主。',
  victory: '魔王城的数据风暴逐渐平息，城堡开始消散，露出背后清朗的数字星空。你成功击败了算法霸主，但这只是思考的开始...',
  defeat: '数据风暴愈发猛烈，信息过载协议被触发。世界开始崩塌，一切都将被重置...'
};

// 基础攻击数据
export const BASIC_ATTACK = {
  name: '普通攻击',
  icon: '⚔️',
  baseDamage: 15,
  critMultiplier: 2
};
