import { TimelineEra, DialogueOption, QTESequence, RoleCard, CardSlot, GachaResult } from './types';

// ==================== 文案脚本 ====================
export const SCRIPT: Record<string, string> = {
  // 章节标题
  ch2_title_main: "战斗本体平原",
  ch2_title_sub: "时光档案馆：黑话的起源与演变",
  ch2_title_chapter_index: "CHAPTER 2",

  // 入场旁白
  ch2_intro_narration_1: "你离开了黑话新手村，踏上了一片广袤的平原。",
  ch2_intro_narration_2: "一条名为「时间之路」的古道贯穿其中，两侧散落着不同时代的遗迹。",
  ch2_intro_narration_3: "从80年代的街机厅废墟，到现代的直播间全息投影……",
  ch2_intro_narration_4: "这里记录着游戏黑话从诞生到破圈的完整历程。",

  // NPC - 时之守护者
  ch2_npc_name: "时之守护者 · 克洛诺斯",
  ch2_npc_intro_1: "旅行者，欢迎来到时光档案馆。",
  ch2_npc_intro_2: "我是这片平原的守护者，见证了游戏黑话数十年的演变。",
  ch2_npc_task: "沿着时间之路前进，探索四个时代的遗迹，收集「时间碎片」。当你集齐四块碎片，我将授予你掌控时间的力量。",

  // 街机时代
  ch2_era_arcade_name: "街机时代",
  ch2_era_arcade_period: "1980-1990年代",
  ch2_era_arcade_desc: "游戏厅文化的黄金时代，黑话具有强烈的地域特色和社交属性。街机厅成为青少年社交中心，独特黑话是融入圈子的必备技能。",
  ch2_era_arcade_minigame_title: "街机搓招挑战",
  ch2_era_arcade_minigame_desc: "在限定时间内完成经典格斗游戏的搓招指令，解锁古早黑话的起源故事。",

  // PC网游时代
  ch2_era_pc_name: "PC网游时代",
  ch2_era_pc_period: "2000-2009年",
  ch2_era_pc_desc: "MMORPG兴起，黑话开始标准化和制度化，大规模破圈。公会管理、副本挑战等核心玩法建立了标准化表达词汇。",
  ch2_era_pc_minigame_title: "团队开荒模拟",
  ch2_era_pc_minigame_desc: "将「坦克」「奶妈」「DPS」等角色卡牌放置到正确的位置，模拟一次副本开荒。",

  // 手游时代
  ch2_era_mobile_name: "手游时代",
  ch2_era_mobile_period: "2010-2019年",
  ch2_era_mobile_desc: "移动互联网普及，付费文化兴起，抽卡玄学体系形成。「氪金」与「肝」成为玩家状态的核心描述词。",
  ch2_era_mobile_minigame_title: "命运抽卡体验",
  ch2_era_mobile_minigame_desc: "亲身体验「欧皇」与「非酋」的悲欢，理解抽卡文化相关的黑话。",

  // 泛娱乐时代
  ch2_era_modern_name: "泛娱乐时代",
  ch2_era_modern_period: "2020年至今",
  ch2_era_modern_desc: "直播、短视频兴起，黑话全面破圈并反向影响主流文化。电竞赛事和主播成为流行语的重要发源地。",
  ch2_era_modern_minigame_title: "弹幕捕捉挑战",
  ch2_era_modern_minigame_desc: "在模拟直播场景中，捕捉并点击快速飞过的「YYDS」「破防了」等弹幕。",

  // 技能获取
  ch2_skill_name: "时之凝固",
  ch2_skill_desc: "冻结时间，使Boss在接下来的2个回合内无法行动。",
  ch2_skill_unlock_text: "你已集齐四块时间碎片，时之罗盘在你手中成形。作为奖励，我将「时之凝固」的力量授予你。",

  // 成就
  ch2_achievement_title: "🏆 成就解锁：时光旅行者",
  ch2_achievement_body: "你已经完整探索了游戏黑话的演变历程。",
  ch2_achievement_reward: "EXP +300，获得技能「时之凝固」",

  // 结尾旁白
  ch2_outro_narration_1: "当你走完时间之路，那些曾经陌生的词汇已经不再只是符号。",
  ch2_outro_narration_2: "从街机厅的「放雷」「勾死了」，到网游时代的「开荒」「OT」，再到手游时代的「氪金」「欧皇」……",
  ch2_outro_narration_3: "每一个黑话背后，都是一代玩家的青春记忆。",
  ch2_outro_narration_4: "但黑话的故事还没有结束。在下一站——玩家生态城镇，你将发现黑话如何定义玩家的身份与归属。",
};

// ==================== NPC对话选项 ====================
export const NPC_OPTIONS: DialogueOption[] = [
  {
    id: "opt1",
    text: "时间碎片是什么？",
    response: "每个时代都留下了独特的语言印记。收集这些碎片，你就能理解黑话是如何随着游戏产业一同演变的。"
  },
  {
    id: "opt2",
    text: "为什么要了解黑话的历史？",
    response: "语言是文化的载体。了解黑话的演变，就是了解几代玩家如何用语言构建他们的社群认同。"
  },
  {
    id: "opt3",
    text: "我准备好了，开始探索！",
    response: "很好。记住，每个时代都有一个挑战等着你。完成挑战，碎片自然会出现。祝你旅途顺利。"
  }
];

// ==================== 时代数据 ====================
export const TIMELINE_ERAS: TimelineEra[] = [
  {
    id: "arcade",
    name: "街机时代",
    period: "1980-1990年代",
    icon: "🕹️",
    description: "游戏厅文化的黄金时代，黑话具有强烈的地域特色和社交属性。街机厅成为青少年社交中心，独特黑话是融入圈子的必备技能。",
    events: [
      {
        year: "1983年",
        title: "术语地域化",
        details: [
          "受方言影响，同一游戏概念在不同城市诞生了截然不同的叫法。",
          "上海：「老鬼」=BOSS，广东：「大嘢」=BOSS，「打机」=玩游戏"
        ],
        keywords: ["老鬼", "大嘢", "打机"]
      },
      {
        year: "1987年",
        title: "暴力美学主导",
        details: [
          "动作格斗游戏盛行，催生了描述击杀特效的简短有力词汇。",
          "「放雷」「勾死了」——术语往往直接模拟动作声音或描述视觉冲击。"
        ],
        keywords: ["放雷", "勾死了", "搓招"]
      }
    ],
    minigame: {
      type: "qte",
      title: "街机搓招挑战",
      description: "完成经典格斗游戏的搓招指令",
      instructions: "按照屏幕提示，在限定时间内按下正确的方向键组合！"
    },
    fragment: {
      id: "fragment_arcade",
      name: "街机碎片",
      description: "记录了街机时代的地域黑话与格斗术语",
      keywords: ["放雷", "勾死了", "打机", "老鬼"],
      collected: false
    }
  },
  {
    id: "pc",
    name: "PC网游时代",
    period: "2000-2009年",
    icon: "💻",
    description: "MMORPG兴起，黑话开始标准化和制度化，大规模破圈。公会管理、副本挑战等核心玩法建立了标准化表达词汇。",
    events: [
      {
        year: "2000年",
        title: "MMORPG术语制度化",
        details: [
          "公会管理、副本挑战等核心玩法建立了标准化表达词汇。",
          "「工会」「PK」「刷图」「开荒」「Farm」「OT」等词精确描述了团队协作中的复杂状态和策略。"
        ],
        keywords: ["工会", "PK", "刷图", "开荒", "OT"]
      },
      {
        year: "2005年",
        title: "大规模破圈",
        details: [
          "游戏词汇因其形象生动，开始被选秀、电商等主流领域借用。",
          "《超级女声》引入「PK」为淘汰赛代称；「秒杀」进入电商领域。"
        ],
        keywords: ["PK", "秒杀", "破圈"]
      }
    ],
    minigame: {
      type: "card_placement",
      title: "团队开荒模拟",
      description: "将角色卡牌放置到正确的位置",
      instructions: "拖动「坦克」「奶妈」「DPS」卡牌到对应的站位，完成一次副本开荒！"
    },
    fragment: {
      id: "fragment_pc",
      name: "网游碎片",
      description: "记录了MMORPG时代的职业分工与团队术语",
      keywords: ["坦克", "奶妈", "DPS", "开荒", "OT"],
      collected: false
    }
  },
  {
    id: "mobile",
    name: "手游时代",
    period: "2010-2019年",
    icon: "📱",
    description: "移动互联网普及，付费文化兴起，抽卡玄学体系形成。「氪金」与「肝」成为玩家状态的核心描述词。",
    events: [
      {
        year: "2012年",
        title: "付费文化兴起",
        details: [
          "「氪金」（付费）与「肝」（投入大量时间）成为玩家状态的核心描述词。",
          "这些术语成为移动游戏中投入与消费的日常表达。"
        ],
        keywords: ["氪金", "肝", "648"]
      },
      {
        year: "2016年",
        title: "抽卡玄学体系",
        details: [
          "概率获取机制衍生出玩家自嘲和迷信性质的运气评价系统。",
          "「欧皇/非酋」「玄不救非，氪不改命」——形成了独特的「运气文化」。"
        ],
        keywords: ["欧皇", "非酋", "玄学", "保底"]
      }
    ],
    minigame: {
      type: "gacha",
      title: "命运抽卡体验",
      description: "体验抽卡的悲欢离合",
      instructions: "点击抽卡按钮，体验「欧皇」与「非酋」的命运！"
    },
    fragment: {
      id: "fragment_mobile",
      name: "手游碎片",
      description: "记录了手游时代的付费文化与抽卡玄学",
      keywords: ["氪金", "肝", "欧皇", "非酋"],
      collected: false
    }
  },
  {
    id: "modern",
    name: "泛娱乐时代",
    period: "2020年至今",
    icon: "🌐",
    description: "直播、短视频兴起，黑话全面破圈并反向影响主流文化。电竞赛事和主播成为流行语的重要发源地。",
    events: [
      {
        year: "2020年",
        title: "电竞造梗全网化",
        details: [
          "电竞赛事和主播成为流行语的重要发源地。",
          "「YYDS」「毒奶」——这些梗往往源于某个高光或下饭操作的名场面解说。"
        ],
        keywords: ["YYDS", "毒奶", "名场面"]
      },
      {
        year: "2021年",
        title: "情感符号迁移现实",
        details: [
          "游戏中的情绪表达被广泛用于描述现实遭遇。",
          "「破防」等词因其高度概括情绪爆点的能力，成为网络共情的高效表达。"
        ],
        keywords: ["破防", "芜湖", "绝绝子"]
      },
      {
        year: "2023年",
        title: "职场术语游戏化",
        details: [
          "游戏中的任务机制词汇被借用来调侃或描述枯燥重复的日常工作。",
          "「搬砖」=重复性工作、「副本」=专项任务"
        ],
        keywords: ["搬砖", "副本", "打工人"]
      }
    ],
    minigame: {
      type: "bullet_catch",
      title: "弹幕捕捉挑战",
      description: "捕捉飞过的热门弹幕",
      instructions: "点击屏幕上快速飞过的目标弹幕，收集「YYDS」「破防了」等热词！"
    },
    fragment: {
      id: "fragment_modern",
      name: "泛娱乐碎片",
      description: "记录了直播时代的弹幕文化与破圈现象",
      keywords: ["YYDS", "破防", "芜湖", "绝绝子"],
      collected: false
    }
  }
];

// ==================== QTE小游戏数据 ====================
export const QTE_SEQUENCES: QTESequence[][] = [
  // 波动拳 ↓↘→ + 拳
  [
    { key: "ArrowDown", displayKey: "↓", timing: 1000 },
    { key: "ArrowRight", displayKey: "↘", timing: 800 },
    { key: "ArrowRight", displayKey: "→", timing: 800 },
    { key: "KeyZ", displayKey: "Z", timing: 600 }
  ],
  // 升龙拳 →↓↘ + 拳
  [
    { key: "ArrowRight", displayKey: "→", timing: 1000 },
    { key: "ArrowDown", displayKey: "↓", timing: 800 },
    { key: "ArrowRight", displayKey: "↘", timing: 800 },
    { key: "KeyZ", displayKey: "Z", timing: 600 }
  ]
];

// ==================== 卡牌放置小游戏数据 ====================
export const ROLE_CARDS: RoleCard[] = [
  { id: "tank", name: "坦克(T)", role: "tank", description: "负责承受伤害和吸引怪物注意", correctSlot: "front" },
  { id: "healer", name: "奶妈", role: "healer", description: "负责回复生命值", correctSlot: "back" },
  { id: "dps1", name: "DPS·近战", role: "dps", description: "负责近距离输出伤害", correctSlot: "middle" },
  { id: "dps2", name: "DPS·远程", role: "dps", description: "负责远距离输出伤害", correctSlot: "middle" }
];

export const CARD_SLOTS: CardSlot[] = [
  { id: "front", name: "前排·抗线位", acceptRole: "tank" },
  { id: "middle", name: "中排·输出位", acceptRole: "dps" },
  { id: "back", name: "后排·辅助位", acceptRole: "healer" }
];

// ==================== 抽卡小游戏数据 ====================
export const GACHA_POOL: GachaResult[] = [
  { rarity: "common", term: "白板", description: "最普通的结果，什么都没有" },
  { rarity: "common", term: "保底", description: "累计抽取一定次数后必得稀有物品" },
  { rarity: "rare", term: "小保底", description: "50%概率获得当期UP角色" },
  { rarity: "rare", term: "歪了", description: "小保底没中UP，抽到了常驻角色" },
  { rarity: "epic", term: "大保底", description: "连续两次小保底未中后必得UP" },
  { rarity: "epic", term: "欧皇", description: "运气极好的玩家，单抽出金" },
  { rarity: "legendary", term: "非酋", description: "运气极差的玩家，180抽才出金" },
  { rarity: "legendary", term: "天选之人", description: "传说中的存在，十连双金" }
];

// ==================== 弹幕捕捉小游戏数据 ====================
export const BULLET_COMMENTS_POOL = [
  { text: "YYDS", isTarget: true },
  { text: "破防了", isTarget: true },
  { text: "芜湖起飞", isTarget: true },
  { text: "绝绝子", isTarget: true },
  { text: "666666", isTarget: false },
  { text: "哈哈哈哈", isTarget: false },
  { text: "前方高能", isTarget: false },
  { text: "泪目了", isTarget: false },
  { text: "太强了", isTarget: false },
  { text: "笑死", isTarget: false }
];
