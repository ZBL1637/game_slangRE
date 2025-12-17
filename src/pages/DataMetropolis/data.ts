// ============================================================================
// 第四章：数据洪流之都 - 数据文件
// ============================================================================

import { 
  DataNode, 
  TermDistributionData, 
  SentimentData, 
  CategorySentimentData
} from './types';

// NPC对话脚本
export const SCRIPT = {
  // 章节信息
  ch4_title: '数据洪流之都',
  ch4_subtitle: 'Metropolis of Data Streams',
  
  // 入场叙述
  ch4_intro_narration_1: '你踏入了一座由纯粹数据构成的未来都市...',
  ch4_intro_narration_2: '这里的建筑是跳动的柱状图，河流是实时变化的情感曲线，天空则是由词云构成的星辰。',
  
  // NPC对话
  ch4_npc_name: '数据织者',
  ch4_npc_title: '数据之城的守护者',
  ch4_npc_greeting: '欢迎来到数据洪流之都，年轻的探索者。这座城市由无数玩家的行为数据汇聚而成，而黑话就是解读这些数据的密钥。',
  ch4_npc_task: '我需要你完成四个数据节点的解谜挑战，证明你有能力理解数据的力量。每个节点都隐藏着关于玩家行为和语言的秘密。',
  ch4_npc_node1_intro: '第一个节点：玩家光谱分析。这张图表展示了不同游戏中术语的分类分布。仔细观察，找出其中的规律。',
  ch4_npc_node2_intro: '第二个节点：情感极性透视。每款游戏的黑话都承载着玩家的情感。看看哪款游戏的正面情感最为突出？',
  ch4_npc_node3_intro: '第三个节点：术语类别情感分布。不同类型的术语有着不同的情感倾向。哪类术语最容易产生负面情感？',
  ch4_npc_node4_intro: '最后一个节点：多游戏术语分布。每款游戏都有自己独特的术语"指纹"。找出它们的共性与差异。',
  ch4_npc_complete: '出色的数据洞察力！你已经证明了自己理解数据的能力。作为奖励，我将授予你一项强大的技能。',
  
  // 技能信息
  ch4_skill_name: '弱点分析',
  ch4_skill_english: 'Weakness Analysis',
  ch4_skill_desc: '通过数据分析洞察敌人的弱点',
  ch4_skill_effect: '使用后，接下来3回合内所有攻击的暴击率提升50%',
  ch4_skill_unlock_text: '你通过数据分析，找到了直击敌人要害的方法...',
  
  // 结尾叙述
  ch4_outro_narration_1: '数据不会说谎，但需要有人去解读。',
  ch4_outro_narration_2: '你已经掌握了数据分析的力量，这将成为你对抗最终Boss的重要武器。'
};

// 四个数据节点
export const DATA_NODES: DataNode[] = [
  {
    id: 'node_1',
    name: '玩家光谱分析',
    description: '探索不同游戏中术语的分类分布',
    icon: '📊',
    color: '#7F0056',
    completed: false,
    question: {
      question: '根据图表，哪款游戏的"行为类"术语占比最高？',
      hint: '观察堆叠柱状图中紫色部分的高度',
      options: [
        { label: 'CSGO', value: 'csgo' },
        { label: '文明6', value: 'civ6' },
        { label: '英雄联盟', value: 'lol' },
        { label: '原神', value: 'genshin' }
      ],
      correctIndex: 1,
      explanation: '文明6的"行为类"术语占比高达79.6%，远超其他游戏。这是因为文明6作为策略游戏，玩家交流主要围绕各种操作行为展开。'
    }
  },
  {
    id: 'node_2',
    name: '情感极性透视',
    description: '分析各游戏黑话的情感分布',
    icon: '😊',
    color: '#A6006B',
    completed: false,
    question: {
      question: '哪款游戏的黑话中"正面情感"占比最高？',
      hint: '观察各游戏的情感分布饼图',
      options: [
        { label: '最终幻想14', value: 'ff14' },
        { label: '原神', value: 'genshin' },
        { label: '王者荣耀', value: 'kog' },
        { label: '绝地求生', value: 'pubg' }
      ],
      correctIndex: 1,
      explanation: '原神的正面情感占比高达67.63%！这可能与其二次元风格和角色养成玩法有关，玩家更倾向于使用正面词汇来表达对角色的喜爱。'
    }
  },
  {
    id: 'node_3',
    name: '术语类别情感分布',
    description: '探索不同术语类别的情感倾向',
    icon: '🎭',
    color: '#5A003D',
    completed: false,
    question: {
      question: '哪类术语的"负面情感"占比最高？',
      hint: '观察雷达图中深紫色区域的分布',
      options: [
        { label: '交流/指挥类', value: 'communication' },
        { label: '机制类', value: 'mechanism' },
        { label: '社交类/梗类', value: 'social' },
        { label: '经济交易类', value: 'economy' }
      ],
      correctIndex: 1,
      explanation: '"机制类"术语的负面情感占比最高（约30.5%）。这是因为机制类术语常涉及游戏中的困难挑战、失败体验，如"被秒"、"暴毙"等。'
    }
  },
  {
    id: 'node_4',
    name: '多游戏术语分布',
    description: '比较各游戏的术语"指纹"',
    icon: '🎮',
    color: '#D946EF',
    completed: false,
    question: {
      question: '哪款游戏的"跨游戏通用语"占比最高？',
      hint: '观察各游戏雷达图中"跨游戏通用语"维度的数值',
      options: [
        { label: '英雄联盟', value: 'lol' },
        { label: '三角洲行动', value: 'delta' },
        { label: '鸣潮', value: 'wuwa' },
        { label: '最终幻想14', value: 'ff14' }
      ],
      correctIndex: 1,
      explanation: '三角洲行动的"跨游戏通用语"占比高达30.8%！作为一款新兴FPS游戏，它大量借用了其他射击游戏的通用术语，如"架枪"、"拉枪"等。'
    }
  }
];

// 游戏术语分类分布数据 (chart1)
export const TERM_DISTRIBUTION_DATA: TermDistributionData[] = [
  {
    game: 'CSGO',
    categories: {
      '交流/指挥类': 0.0206,
      '地图/副本类': 0.0722,
      '机制类': 0.0103,
      '物品/装备类': 0.0206,
      '玩家/群体标签': 0.0206,
      '社交类/梗类': 0.0,
      '经济交易类': 0.0,
      '职业类': 0.0515,
      '行为类': 0.7938,
      '跨游戏通用语': 0.0103
    }
  },
  {
    game: '英雄联盟',
    categories: {
      '交流/指挥类': 0.0,
      '地图/副本类': 0.03,
      '机制类': 0.11,
      '物品/装备类': 0.07,
      '玩家/群体标签': 0.02,
      '社交类/梗类': 0.0,
      '经济交易类': 0.0,
      '职业类': 0.14,
      '行为类': 0.59,
      '跨游戏通用语': 0.04
    }
  },
  {
    game: '最终幻想14',
    categories: {
      '交流/指挥类': 0.0119,
      '地图/副本类': 0.0158,
      '机制类': 0.2134,
      '物品/装备类': 0.0474,
      '玩家/群体标签': 0.1542,
      '社交类/梗类': 0.0079,
      '经济交易类': 0.0316,
      '职业类': 0.2846,
      '行为类': 0.1779,
      '跨游戏通用语': 0.0553
    }
  },
  {
    game: '三角洲行动',
    categories: {
      '交流/指挥类': 0.0127,
      '地图/副本类': 0.0549,
      '机制类': 0.0253,
      '物品/装备类': 0.0169,
      '玩家/群体标签': 0.1477,
      '社交类/梗类': 0.0042,
      '经济交易类': 0.0,
      '职业类': 0.0169,
      '行为类': 0.4135,
      '跨游戏通用语': 0.3080
    }
  },
  {
    game: '原神',
    categories: {
      '交流/指挥类': 0.0,
      '地图/副本类': 0.0289,
      '机制类': 0.0809,
      '物品/装备类': 0.0347,
      '玩家/群体标签': 0.0867,
      '社交类/梗类': 0.0,
      '经济交易类': 0.0058,
      '职业类': 0.4335,
      '行为类': 0.2775,
      '跨游戏通用语': 0.0520
    }
  },
  {
    game: '怪物猎人',
    categories: {
      '交流/指挥类': 0.0,
      '地图/副本类': 0.0043,
      '机制类': 0.1826,
      '物品/装备类': 0.0783,
      '玩家/群体标签': 0.0609,
      '社交类/梗类': 0.0043,
      '经济交易类': 0.0,
      '职业类': 0.0478,
      '行为类': 0.5696,
      '跨游戏通用语': 0.0522
    }
  },
  {
    game: '文明6',
    categories: {
      '交流/指挥类': 0.0,
      '地图/副本类': 0.1156,
      '机制类': 0.0340,
      '物品/装备类': 0.0,
      '玩家/群体标签': 0.0204,
      '社交类/梗类': 0.0,
      '经济交易类': 0.0272,
      '职业类': 0.0068,
      '行为类': 0.7959,
      '跨游戏通用语': 0.0
    }
  },
  {
    game: '无畏契约',
    categories: {
      '交流/指挥类': 0.0,
      '地图/副本类': 0.0439,
      '机制类': 0.1491,
      '物品/装备类': 0.0614,
      '玩家/群体标签': 0.0526,
      '社交类/梗类': 0.0,
      '经济交易类': 0.0088,
      '职业类': 0.0088,
      '行为类': 0.6754,
      '跨游戏通用语': 0.0
    }
  },
  {
    game: '永劫无间',
    categories: {
      '交流/指挥类': 0.0054,
      '地图/副本类': 0.0432,
      '机制类': 0.1514,
      '物品/装备类': 0.0865,
      '玩家/群体标签': 0.0919,
      '社交类/梗类': 0.0,
      '经济交易类': 0.0162,
      '职业类': 0.0865,
      '行为类': 0.4919,
      '跨游戏通用语': 0.0270
    }
  },
  {
    game: '王者荣耀',
    categories: {
      '交流/指挥类': 0.0,
      '地图/副本类': 0.0241,
      '机制类': 0.0783,
      '物品/装备类': 0.0241,
      '玩家/群体标签': 0.0904,
      '社交类/梗类': 0.0120,
      '经济交易类': 0.0361,
      '职业类': 0.1265,
      '行为类': 0.5783,
      '跨游戏通用语': 0.0301
    }
  },
  {
    game: '绝地求生',
    categories: {
      '交流/指挥类': 0.0045,
      '地图/副本类': 0.0407,
      '机制类': 0.0181,
      '物品/装备类': 0.0317,
      '玩家/群体标签': 0.1176,
      '社交类/梗类': 0.0814,
      '经济交易类': 0.0,
      '职业类': 0.0452,
      '行为类': 0.6063,
      '跨游戏通用语': 0.0543
    }
  },
  {
    game: '艾尔登法环',
    categories: {
      '交流/指挥类': 0.0,
      '地图/副本类': 0.0746,
      '机制类': 0.2313,
      '物品/装备类': 0.0896,
      '玩家/群体标签': 0.0448,
      '社交类/梗类': 0.0,
      '经济交易类': 0.0075,
      '职业类': 0.0896,
      '行为类': 0.4552,
      '跨游戏通用语': 0.0075
    }
  },
  {
    game: '魔兽世界',
    categories: {
      '交流/指挥类': 0.0,
      '地图/副本类': 0.0183,
      '机制类': 0.1829,
      '物品/装备类': 0.0976,
      '玩家/群体标签': 0.0610,
      '社交类/梗类': 0.0,
      '经济交易类': 0.0244,
      '职业类': 0.2988,
      '行为类': 0.2744,
      '跨游戏通用语': 0.0427
    }
  },
  {
    game: '鸣潮',
    categories: {
      '交流/指挥类': 0.0059,
      '地图/副本类': 0.0177,
      '机制类': 0.1062,
      '物品/装备类': 0.0472,
      '玩家/群体标签': 0.0826,
      '社交类/梗类': 0.0324,
      '经济交易类': 0.0118,
      '职业类': 0.3628,
      '行为类': 0.2330,
      '跨游戏通用语': 0.1003
    }
  }
];

// 游戏情感分布数据 (chart2)
export const SENTIMENT_DATA: SentimentData[] = [
  { game: 'CSGO', neutral: 93.81, positive: 2.06, negative: 4.12 },
  { game: '英雄联盟', neutral: 90.00, positive: 5.00, negative: 5.00 },
  { game: '最终幻想14', neutral: 68.77, positive: 12.25, negative: 18.97 },
  { game: '三角洲行动', neutral: 83.12, positive: 10.97, negative: 5.91 },
  { game: '原神', neutral: 30.64, positive: 67.63, negative: 1.73 },
  { game: '怪物猎人', neutral: 88.26, positive: 5.65, negative: 6.09 },
  { game: '文明6', neutral: 80.27, positive: 14.97, negative: 4.76 },
  { game: '无畏契约', neutral: 86.84, positive: 10.53, negative: 2.63 },
  { game: '永劫无间', neutral: 80.54, positive: 15.14, negative: 4.32 },
  { game: '王者荣耀', neutral: 84.34, positive: 5.42, negative: 10.24 },
  { game: '绝地求生', neutral: 89.14, positive: 9.05, negative: 1.81 },
  { game: '艾尔登法环', neutral: 82.84, positive: 7.46, negative: 9.70 },
  { game: '魔兽世界', neutral: 80.49, positive: 7.93, negative: 11.59 },
  { game: '鸣潮', neutral: 79.06, positive: 15.63, negative: 5.31 }
];

// 术语类别情感分布数据 (chart3)
export const CATEGORY_SENTIMENT_DATA: CategorySentimentData[] = [
  { category: '交流/指挥类', neutral: 0.5833, positive: 0.4167, negative: 0.0 },
  { category: '地图/副本类', neutral: 0.9474, positive: 0.0526, negative: 0.0 },
  { category: '机制类', neutral: 0.5925, positive: 0.1027, negative: 0.3048 },
  { category: '物品/装备类', neutral: 0.7953, positive: 0.1890, negative: 0.0157 },
  { category: '玩家/群体标签', neutral: 0.7569, positive: 0.1835, negative: 0.0596 },
  { category: '社交类/梗类', neutral: 0.8857, positive: 0.1143, negative: 0.0 },
  { category: '经济交易类', neutral: 0.8750, positive: 0.1250, negative: 0.0 },
  { category: '职业类', neutral: 0.7512, positive: 0.2126, negative: 0.0362 },
  { category: '行为类', neutral: 0.8402, positive: 0.1244, negative: 0.0354 },
  { category: '跨游戏通用语', neutral: 0.8079, positive: 0.0960, negative: 0.0960 }
];

// 术语类别列表
export const TERM_CATEGORIES = [
  '交流/指挥类',
  '地图/副本类',
  '机制类',
  '物品/装备类',
  '玩家/群体标签',
  '社交类/梗类',
  '经济交易类',
  '职业类',
  '行为类',
  '跨游戏通用语'
];

// 图表颜色方案
export const CHART_COLORS = {
  primary: '#7F0056',
  secondary: '#A6006B',
  tertiary: '#5A003D',
  accent: '#D946EF',
  neutral: '#7F0056',
  positive: '#A6006B',
  negative: '#5A003D',
  categories: [
    '#7F0056', '#A6006B', '#5A003D', '#D946EF', '#7F0056',
    '#A6006B', '#5A003D', '#D946EF', '#7F0056', '#A6006B'
  ]
};
