// ============================================================================
// 第五章：译语通天塔 (Tower of Translation) - 数据文件
// ============================================================================

import {
  KeywordItem,
  StyleItem,
  MetaphorItem,
  Challenge,
  Merchant,
  NPCDialogue,
  CharacterNameNote,
  FinalTranslationTask
} from './types';

// NPC对话脚本
export const NPC_DIALOGUES: Record<string, NPCDialogue[]> = {
  intro: [
    {
      id: 'intro_1',
      speaker: '译言大师',
      text: '欢迎来到译语通天塔，年轻的旅者。',
      emotion: 'neutral'
    },
    {
      id: 'intro_2',
      speaker: '译言大师',
      text: '这座塔连接着无数语言与文化，是沟通的桥梁，也是误解的迷宫。',
      emotion: 'neutral'
    },
    {
      id: 'intro_3',
      speaker: '译言大师',
      text: '看看塔下的集市吧——那里来了一群波斯商人，他们想与本地玩家交流，却因语言不通而陷入困境。',
      emotion: 'confused'
    },
    {
      id: 'intro_4',
      speaker: '译言大师',
      text: '一位商人想买"神装"，却被带到了服装店；另一位想找人"开黑"，结果被带到了漆黑的仓库...',
      emotion: 'confused'
    },
    {
      id: 'intro_5',
      speaker: '译言大师',
      text: '我需要你的帮助。学习翻译之道，化解这些文化冲突。',
      emotion: 'excited'
    },
    {
      id: 'intro_6',
      speaker: '译言大师',
      text: '塔内有三座"翻译圣坛"，分别代表翻译的三重境界：词义、风格与文化。',
      emotion: 'neutral'
    },
    {
      id: 'intro_7',
      speaker: '译言大师',
      text: '完成所有挑战后，你将获得真正的翻译之力——言灵·转化。',
      emotion: 'excited'
    }
  ],
  challenge_complete: [
    {
      id: 'complete_1',
      speaker: '译言大师',
      text: '很好！你已经掌握了这一层的翻译技艺。',
      emotion: 'happy'
    },
    {
      id: 'complete_2',
      speaker: '译言大师',
      text: '继续前进吧，更高的挑战在等着你。',
      emotion: 'neutral'
    }
  ],
  all_complete: [
    {
      id: 'all_1',
      speaker: '译言大师',
      text: '出色！你已经完成了所有翻译圣坛的试炼！',
      emotion: 'excited'
    },
    {
      id: 'all_2',
      speaker: '译言大师',
      text: '现在，是时候将所学付诸实践了。',
      emotion: 'neutral'
    },
    {
      id: 'all_3',
      speaker: '译言大师',
      text: '回到集市，帮助那位波斯商人理解本地玩家的黑话吧。',
      emotion: 'neutral'
    }
  ],
  final_success: [
    {
      id: 'final_1',
      speaker: '译言大师',
      text: '完美！你成功地架起了文化的桥梁！',
      emotion: 'excited'
    },
    {
      id: 'final_2',
      speaker: '译言大师',
      text: '波斯商人终于理解了本地玩家的意思，他们现在可以愉快地组队冒险了。',
      emotion: 'happy'
    },
    {
      id: 'final_3',
      speaker: '译言大师',
      text: '作为奖励，我将"言灵·转化"之力赠予你。',
      emotion: 'excited'
    },
    {
      id: 'final_4',
      speaker: '译言大师',
      text: '这份力量能够转化事物的本质，就像翻译能够转化语言的意义一样。',
      emotion: 'neutral'
    }
  ]
};

// 挑战列表
export const CHALLENGES: Challenge[] = [
  {
    id: 'keyword',
    name: '关键词对对碰',
    description: '从多个英文选项中选择最合适的翻译，理解直译与意译的区别',
    icon: '🔤',
    status: 'available',
    reward: '词义洞察'
  },
  {
    id: 'style',
    name: '风格转换器',
    description: '在"异化"与"归化"两种翻译风格间做出选择，观察对理解度的影响',
    icon: '🔄',
    status: 'locked',
    reward: '风格掌控'
  },
  {
    id: 'metaphor',
    name: '文化隐喻连连看',
    description: '将文化源点与游戏元素正确连接，理解黑话背后的深层文化内涵',
    icon: '🔗',
    status: 'locked',
    reward: '文化感知'
  }
];

// 关键词翻译数据（来自《黑神话：悟空》）
export const KEYWORD_DATA: KeywordItem[] = [
  {
    id: 'wukong',
    chinese: '悟空',
    pinyin: 'Wù Kōng',
    correctAnswer: 'Wukong',
    options: ['Wukong', 'Monkey King', 'Enlightened One', 'Sky Walker'],
    explanation: '采用音译保留原名，因为"悟空"作为专有名词已在全球有一定知名度。',
    culturalNote: '"悟空"意为"领悟空性"，蕴含深刻的佛教哲学，但音译能保持其作为角色名的独特性。'
  },
  {
    id: 'loong',
    chinese: '龙',
    pinyin: 'Lóng',
    correctAnswer: 'Loong',
    options: ['Dragon', 'Loong', 'Serpent', 'Divine Beast'],
    explanation: '使用"Loong"而非"Dragon"，是为了区分中国龙与西方龙的文化差异。',
    culturalNote: '中国龙象征吉祥、权威，与西方恶龙形象截然不同。"Loong"的使用是文化自信的体现。'
  },
  {
    id: 'jingubang',
    chinese: '金箍棒',
    pinyin: 'Jīn Gū Bàng',
    correctAnswer: 'Jin Gu Bang',
    options: ['Jin Gu Bang', 'Golden Staff', 'Magic Stick', 'Ruyi Jingu Bang'],
    explanation: '采用拼音音译，保留了这件神器的独特文化身份。',
    culturalNote: '金箍棒是《西游记》中孙悟空的标志性武器，重一万三千五百斤，可随心意变化大小。'
  },
  {
    id: 'pigsy',
    chinese: '猪八戒',
    pinyin: 'Zhū Bā Jiè',
    correctAnswer: 'Pigsy',
    options: ['Pigsy', 'Zhu Bajie', 'Pig Monster', 'Eight Precepts'],
    explanation: '采用归化翻译"Pigsy"，使西方玩家更容易理解和记忆这个角色。',
    culturalNote: '"八戒"指佛教八条戒律，但角色形象更突出其猪的特征，故采用意译。'
  },
  {
    id: 'yaoguai',
    chinese: '妖怪',
    pinyin: 'Yāo Guài',
    correctAnswer: 'Yaoguai',
    options: ['Yaoguai', 'Monster', 'Demon', 'Evil Spirit'],
    explanation: '保留音译"Yaoguai"，因为它已成为中国神话游戏中的标志性词汇。',
    culturalNote: '妖怪在中国文化中并非纯粹的邪恶存在，有些甚至可以修炼成仙，这与西方"demon"概念不同。'
  },
  {
    id: 'dingshenfa',
    chinese: '定身法',
    pinyin: 'Dìng Shēn Fǎ',
    correctAnswer: 'Immobilize',
    options: ['Immobilize', 'Body Freeze', 'Ding Shen Fa', 'Paralysis Spell'],
    explanation: '采用功能性翻译"Immobilize"，让玩家直观理解技能效果。',
    culturalNote: '定身法是道教法术之一，在《西游记》中被广泛使用，能使目标无法动弹。'
  }
];

// 风格翻译数据
export const STYLE_DATA: StyleItem[] = [
  {
    id: 'somersault_cloud',
    chinese: '筋斗云',
    context: '俺老孙的筋斗云，一个跟头十万八千里！',
    foreignization: {
      translation: 'Somersault Cloud',
      explanation: '直译保留了"筋斗"（翻跟头）和"云"的意象，体现中国神话的独特想象。',
      culturalPreservation: 90,
      accessibility: 60
    },
    domestication: {
      translation: 'Magic Flying Nimbus',
      explanation: '借用西方文化中熟悉的"Nimbus"（灵光、云气）概念，更易于理解。',
      culturalPreservation: 40,
      accessibility: 95
    }
  },
  {
    id: 'seventy_two',
    chinese: '七十二变',
    context: '孙悟空精通七十二变，可化身万物。',
    foreignization: {
      translation: 'Seventy-Two Transformations',
      explanation: '保留具体数字"七十二"，这在中国文化中是个吉祥数字。',
      culturalPreservation: 85,
      accessibility: 70
    },
    domestication: {
      translation: 'Infinite Transformations',
      explanation: '用"无限"替代具体数字，更符合西方对"强大变化能力"的理解。',
      culturalPreservation: 30,
      accessibility: 90
    }
  },
  {
    id: 'buddha_palm',
    chinese: '如来神掌',
    context: '如来佛祖以神掌将悟空压于五行山下。',
    foreignization: {
      translation: 'Tathagata\'s Divine Palm',
      explanation: '保留"如来"（Tathagata）这一佛教术语，尊重原文的宗教内涵。',
      culturalPreservation: 95,
      accessibility: 50
    },
    domestication: {
      translation: 'Buddha\'s Crushing Palm',
      explanation: '使用更通用的"Buddha"，并强调"crushing"的效果，便于理解。',
      culturalPreservation: 50,
      accessibility: 85
    }
  },
  {
    id: 'heavenly_court',
    chinese: '天庭',
    context: '悟空大闹天庭，惊动了玉皇大帝。',
    foreignization: {
      translation: 'Celestial Court',
      explanation: '使用"Celestial"保留了"天"的神圣感和东方色彩。',
      culturalPreservation: 80,
      accessibility: 65
    },
    domestication: {
      translation: 'Heaven',
      explanation: '简化为"Heaven"，西方读者更容易理解为神仙居住的地方。',
      culturalPreservation: 35,
      accessibility: 95
    }
  }
];

// 文化隐喻数据
export const METAPHOR_DATA: MetaphorItem[] = [
  {
    id: 'buddhism_1',
    source: '佛教教义',
    sourceType: 'buddhism',
    gameElement: '悟空的"悟"字',
    connection: '领悟空性，超脱轮回',
    explanation: '"悟空"之名源自佛教"色即是空"的教义，暗示主角需要领悟世间万物皆为虚幻的真理。'
  },
  {
    id: 'buddhism_2',
    source: '佛教教义',
    sourceType: 'buddhism',
    gameElement: '紧箍咒',
    connection: '戒律约束，心魔克制',
    explanation: '紧箍咒象征着修行者需要的自我约束，每当悟空心生恶念，紧箍便会收紧。'
  },
  {
    id: 'taoism_1',
    source: '道教文化',
    sourceType: 'taoism',
    gameElement: '七十二变',
    connection: '道法自然，变化无穷',
    explanation: '七十二变源自道教的变化之术，体现了"道"的无穷变化和自然法则。'
  },
  {
    id: 'taoism_2',
    source: '道教文化',
    sourceType: 'taoism',
    gameElement: '金丹/仙丹',
    connection: '炼丹求仙，长生不老',
    explanation: '游戏中的丹药系统源自道教炼丹术，反映了中国人对长生的追求。'
  },
  {
    id: 'poetry_1',
    source: '古典诗词',
    sourceType: 'poetry',
    gameElement: '"一棒定乾坤"',
    connection: '气吞山河的豪情',
    explanation: '这句话化用了古典诗词中的豪迈意象，展现了孙悟空的英雄气概。'
  },
  {
    id: 'poetry_2',
    source: '古典诗词',
    sourceType: 'poetry',
    gameElement: '场景中的诗句题词',
    connection: '意境营造，文化氛围',
    explanation: '游戏场景中引用的古诗词为画面增添了文化底蕴和东方美学意境。'
  },
  {
    id: 'idiom_1',
    source: '成语典故',
    sourceType: 'idiom',
    gameElement: '"大闹天宫"',
    connection: '反抗权威，追求自由',
    explanation: '这个成语已成为反抗不公、追求自由的文化符号，在游戏中得到了视觉化呈现。'
  },
  {
    id: 'idiom_2',
    source: '成语典故',
    sourceType: 'idiom',
    gameElement: '"火眼金睛"',
    connection: '洞察真相，明辨是非',
    explanation: '孙悟空在太上老君的炼丹炉中炼出火眼金睛，能识破一切妖魔鬼怪的伪装。'
  }
];

// 角色译名注解
export const CHARACTER_NOTES: CharacterNameNote[] = [
  {
    id: 'wukong',
    chinese: '悟空',
    english: 'Wukong',
    pinyin: 'Wù Kōng',
    strategy: 'foreignization',
    reason: '作为主角名，音译保持了独特性和文化辨识度，且"Wukong"已在全球游戏文化中有一定知名度。',
    culturalBackground: '"悟空"意为"领悟空性"，是唐僧为孙猴子取的法名，蕴含佛教"色即是空"的哲学思想。'
  },
  {
    id: 'bajie',
    chinese: '猪八戒',
    english: 'Pigsy',
    pinyin: 'Zhū Bā Jiè',
    strategy: 'domestication',
    reason: '采用意译+昵称化处理，"Pigsy"既点明了角色的猪形象，又带有亲切感，便于西方玩家记忆。',
    culturalBackground: '"八戒"指佛教八条戒律，但猪八戒常常犯戒，这种反差构成了角色的喜剧性。'
  },
  {
    id: 'jingubang',
    chinese: '金箍棒',
    english: 'Jin Gu Bang',
    pinyin: 'Jīn Gū Bàng',
    strategy: 'foreignization',
    reason: '作为标志性神器，音译保留了其独特的文化身份，也避免了"Golden Hoop Rod"等直译的生硬感。',
    culturalBackground: '金箍棒原是大禹治水时的定海神针，重一万三千五百斤，可随心意变化大小。'
  },
  {
    id: 'loong',
    chinese: '龙',
    english: 'Loong',
    pinyin: 'Lóng',
    strategy: 'foreignization',
    reason: '刻意区别于西方"Dragon"，因为中国龙是吉祥、权威的象征，与西方恶龙形象截然不同。',
    culturalBackground: '中国龙是四灵之首，象征皇权和祥瑞，能行云布雨，与西方喷火恶龙的形象完全相反。'
  }
];

// 波斯商人数据
export const MERCHANTS: Merchant[] = [
  {
    id: 'merchant_1',
    name: '阿里',
    origin: '波斯',
    avatar: '🧔',
    dialogues: {
      greeting: '你好，朋友！我从遥远的波斯来到这里，想要加入本地玩家的冒险队伍。',
      confused: '他们说的话我完全听不懂..."开荒"是什么？"T"和"奶"又是什么？',
      understanding: '原来如此！现在我明白了，他们是在招募队友去挑战新的副本！',
      thanks: '太感谢你了！有了你的翻译，我终于可以和他们一起冒险了！'
    }
  }
];

// 最终翻译任务
export const FINAL_TASK: FinalTranslationTask = {
  originalText: '兄弟们，今晚开荒新副本，来个T和奶，DPS要给力，别划水啊！',
  context: '一位本地玩家正在游戏频道招募队友，准备挑战新开放的高难度副本。',
  targetMerchant: 'merchant_1',
  hints: [
    '"开荒"指首次挑战新副本，类似于"探索未知领域"',
    '"T"是坦克(Tank)的缩写，负责承受伤害',
    '"奶"是治疗者(Healer)的俗称，因为治疗像"喂奶"一样维持队友生命',
    '"DPS"是伤害输出者(Damage Per Second)',
    '"划水"指不认真参与，敷衍了事'
  ],
  correctTranslation: 'Hey friends, tonight we\'re attempting a new dungeon for the first time. We need a Tank and a Healer. DPS players should bring their A-game - no slacking off!'
};

// 技能数据
export const SKILL_DATA = {
  name: '言灵·转化',
  englishName: 'Logos Conversion',
  icon: '🔮',
  description: '掌握翻译之道后获得的神秘力量，能够转化事物的本质属性。',
  effects: [
    '将Boss下一次攻击的伤害类型随机转化为另一种类型',
    '30%几率将伤害转化为治疗效果',
    '冷却时间：4回合'
  ],
  lore: '语言是思想的载体，翻译是文化的桥梁。当你真正理解了语言转化的奥秘，你便获得了改变事物本质的力量。'
};

// 章节叙述文本
export const NARRATION_TEXTS = {
  intro: '在黑话大陆的边境，矗立着一座高耸入云的古塔——译语通天塔。传说这座塔连接着世界上所有的语言，是沟通的桥梁，也是误解的迷宫...',
  tower_desc: '塔身内外流动着由不同语言文字组成的数据流。塔的底部是一个国际化的贸易集市，来自世界各地的商人在此聚集，却因语言不通而交流不畅。',
  challenge_intro: '塔内有三座翻译圣坛，分别代表翻译的三重境界：词义的精准、风格的把握、文化的传承。只有通过所有试炼，才能获得真正的翻译之力。',
  outro: '你成功地架起了文化的桥梁，让来自不同世界的人们得以相互理解。这份翻译的力量，将在最终的战斗中发挥重要作用...'
};
