// ============================================================================
// 第三章：玩家生态城镇 - 数据文件
// ============================================================================

import { 
  DNAQuestion, 
  DNATheme, 
  GameGenre, 
  FloatingTerm, 
  PlayerType,
  Building,
  Chapter3Script 
} from './types';

// 游戏流派列表
export const GENRES: GameGenre[] = ['MOBA', '二次元', '沙盒', 'FPS', '竞速', '休闲'];

// DNA测试问题
export const DNA_QUESTIONS: DNAQuestion[] = [
  {
    id: 'q1',
    title: '你最喜欢哪种游戏类型？',
    options: [
      { label: 'MOBA 团队竞技', weights: { 'MOBA': 3, 'FPS': 1 } },
      { label: '二次元抽卡养成', weights: { '二次元': 3, '休闲': 1 } },
      { label: '沙盒创造/生存', weights: { '沙盒': 3, '休闲': 1 } },
      { label: 'FPS 射击对战', weights: { 'FPS': 3, '竞速': 1 } },
      { label: '竞速/赛车', weights: { '竞速': 3, 'FPS': 1 } },
      { label: '派对/休闲', weights: { '休闲': 3, '二次元': 1 } }
    ]
  },
  {
    id: 'q2',
    title: '开黑时你最常说的一句？',
    options: [
      { label: '别送！稳住节奏', weights: { 'MOBA': 2 } },
      { label: '今晚一定出金闪闪', weights: { '二次元': 2 } },
      { label: '先把家搭好再探险', weights: { '沙盒': 2 } },
      { label: '听枪声，卡视野', weights: { 'FPS': 2 } },
      { label: '走内线，漂移！', weights: { '竞速': 2 } },
      { label: '佛系一点，开心就好', weights: { '休闲': 2 } }
    ]
  },
  {
    id: 'q3',
    title: '你在队伍里的典型定位是？',
    options: [
      { label: '指挥型：开团拉满', weights: { 'MOBA': 2, 'FPS': 1 } },
      { label: '工具人：资源管理达人', weights: { '沙盒': 2, '二次元': 1 } },
      { label: '核心 C：伤害拉满', weights: { 'FPS': 2, 'MOBA': 1 } },
      { label: '辅助奶妈：兜底护航', weights: { '二次元': 2, '休闲': 1 } },
      { label: '极限操作手：极速与激情', weights: { '竞速': 2 } }
    ]
  },
  {
    id: 'q4',
    title: '遇到连败你会？',
    options: [
      { label: '复盘节奏问题，换战术', weights: { 'MOBA': 2, 'FPS': 1 } },
      { label: '抽卡换阵容，下把转运', weights: { '二次元': 2 } },
      { label: '回家造点更强的装备', weights: { '沙盒': 2 } },
      { label: '换图/练枪，打基础', weights: { 'FPS': 2 } },
      { label: '冲几把竞速换换脑子', weights: { '竞速': 2 } },
      { label: '休息一下，明天再战', weights: { '休闲': 2 } }
    ]
  },
  {
    id: 'q5',
    title: '你最享受的游戏瞬间？',
    options: [
      { label: '一波开团翻盘全场沸腾', weights: { 'MOBA': 3 } },
      { label: '抽到心仪角色/满命', weights: { '二次元': 3 } },
      { label: '搭出复杂机关顺利运转', weights: { '沙盒': 3 } },
      { label: '极限 1v3 反杀', weights: { 'FPS': 3 } },
      { label: '终点线前反超', weights: { '竞速': 3 } },
      { label: '朋友一起哈哈大笑', weights: { '休闲': 3 } }
    ]
  },
  {
    id: 'q6',
    title: '偏爱的美术/界面风格？',
    options: [
      { label: '科幻霓虹 / 赛博 UI', weights: { 'MOBA': 2, 'FPS': 1 } },
      { label: '日系清爽 / 软萌渐变', weights: { '二次元': 2 } },
      { label: '像素/方块/自然质感', weights: { '沙盒': 2 } },
      { label: '极简战术 / HUD 信息流', weights: { 'FPS': 2 } },
      { label: '速度线 / 碳纤维纹理', weights: { '竞速': 2 } },
      { label: '糖果色 / 派对贴纸感', weights: { '休闲': 2 } }
    ]
  },
  {
    id: 'q7',
    title: '更像你的一句个性签名是？',
    options: [
      { label: '节奏是门艺术', weights: { 'MOBA': 2 } },
      { label: '命运与我签了契约', weights: { '二次元': 2 } },
      { label: '世界是我搭的乐高', weights: { '沙盒': 2 } },
      { label: '精准即浪漫', weights: { 'FPS': 2 } },
      { label: '速度即信仰', weights: { '竞速': 2 } },
      { label: '快乐至上', weights: { '休闲': 2 } }
    ]
  },
  {
    id: 'q8',
    title: '可多选：以下你也常玩？',
    subtitle: '最多选 2 个',
    multi: true,
    maxPick: 2,
    options: [
      { label: 'MOBA', weights: { 'MOBA': 1 } },
      { label: '二次元', weights: { '二次元': 1 } },
      { label: '沙盒', weights: { '沙盒': 1 } },
      { label: 'FPS', weights: { 'FPS': 1 } },
      { label: '竞速', weights: { '竞速': 1 } },
      { label: '休闲派对', weights: { '休闲': 1 } }
    ]
  }
];

// 主题配色
export const DNA_THEMES: Record<GameGenre, DNATheme> = {
  'MOBA': { bg: 'linear-gradient(135deg,#0b1222,#0e1c3a 60%,#183b8a)', accent: '#7F0056' },
  '二次元': { bg: 'linear-gradient(135deg,#271a3a,#3b2364 60%,#7045ff)', accent: '#D946EF' },
  '沙盒': { bg: 'linear-gradient(135deg,#1f1a14,#2b241a 60%,#6f5b2f)', accent: '#3B82F6' },
  'FPS': { bg: 'linear-gradient(135deg,#121212,#1b1b1b 60%,#2e2e2e)', accent: '#7F0056' },
  '竞速': { bg: 'linear-gradient(135deg,#0d1018,#0f1422 60%,#1c2e6b)', accent: '#3B82F6' },
  '休闲': { bg: 'linear-gradient(135deg,#17211a,#1d2a20 60%,#284e3a)', accent: '#D946EF' }
};

// 黑话词库（用于DNA测试结果展示）
export const JARGON_BY_GENRE: Record<GameGenre, string[]> = {
  'MOBA': ['别送！稳住节奏', '先手控一手，跟上跟上', '开团拉满，别贪线', '看资源节奏，小龙先拿'],
  '二次元': ['抽卡玄学，今天必不歪', 'UP 池满命是信仰', '肝活动也要有仪式感', '角色强度只是参考，爱才是永恒'],
  '沙盒': ['今晚继续开荒搭家', '红石电路我小有研究', '种田养老才是王道', '生存日记·第 7 天'],
  'FPS': ['拉枪线，别露头', '压枪稳住，听脚步', 'A 点无敌点清了', '烟闪火来一个'],
  '竞速': ['走内线贴弯 apex', '氮气点放别早', '刹车漂移别断流', '分段卡线，干净利落'],
  '休闲': ['开黑走起，轻松躺赢', '佛系日常，签到即快乐', '派对局快乐最重要', '好友互动加成 +100']
};

// 玩家类型标签
export const PLAYER_TYPE_TAGS: Record<GameGenre, string[]> = {
  'MOBA': ['团队协作', '策略思维', '节奏控制'],
  '二次元': ['收集癖', '颜值党', '剧情控'],
  '沙盒': ['创造力', '探索欲', '建造狂'],
  'FPS': ['反应速度', '精准操作', '战术意识'],
  '竞速': ['速度感', '操控欲', '竞技心'],
  '休闲': ['佛系玩家', '社交达人', '快乐至上']
};

// 玩家类型描述
export const PLAYER_TYPES: PlayerType[] = [
  {
    id: 'social_core',
    name: '社交核心',
    description: '你是团队的灵魂人物，擅长沟通协调，让每个人都能发挥最大价值。',
    traits: ['沟通达人', '团队协作', '情绪稳定'],
    icon: '🎯'
  },
  {
    id: 'hardcore_master',
    name: '硬核高手',
    description: '追求极致的操作和策略，你是游戏中的技术流玩家。',
    traits: ['技术流', '追求极致', '不断进步'],
    icon: '⚔️'
  },
  {
    id: 'casual_player',
    name: '休闲玩家',
    description: '游戏对你来说是放松的方式，快乐最重要！',
    traits: ['佛系', '快乐至上', '轻松愉快'],
    icon: '🎮'
  },
  {
    id: 'collector',
    name: '收集狂魔',
    description: '你对收集有着执着的热爱，每个角色、每个皮肤都不能错过。',
    traits: ['收集癖', '完美主义', '仪式感'],
    icon: '💎'
  },
  {
    id: 'creator',
    name: '创造大师',
    description: '你享受创造的过程，用想象力构建属于自己的世界。',
    traits: ['创造力', '想象力', '建造狂'],
    icon: '🏗️'
  },
  {
    id: 'speedster',
    name: '速度狂人',
    description: '追求速度与激情，你总是在挑战极限。',
    traits: ['速度感', '冒险精神', '竞技心'],
    icon: '🏎️'
  }
];

// 漂浮黑话词汇数据
export const FLOATING_TERMS: FloatingTerm[] = [
  // MOBA类
  { id: 'ft1', term: 'GG', category: 'MOBA', definition: 'Good Game的缩写，表示游戏结束，常用于认输或致敬对手', example: '对面太强了，GG', emotion: 'neutral' },
  { id: 'ft2', term: '送人头', category: 'MOBA', definition: '被敌方击杀，给对方送经验和金币', example: '别送了，稳住', emotion: 'negative' },
  { id: 'ft3', term: '开团', category: 'MOBA', definition: '发起团战', example: '大招好了，开团！', emotion: 'positive' },
  { id: 'ft4', term: 'Carry', category: 'MOBA', definition: '带领队伍获胜的核心输出位', example: '这把我来Carry', emotion: 'positive' },
  { id: 'ft5', term: 'Gank', category: 'MOBA', definition: '偷袭、抓人', example: '打野来Gank一下中路', emotion: 'neutral' },
  
  // 二次元类
  { id: 'ft6', term: '欧皇', category: '二次元', definition: '运气极好的玩家，抽卡总能出好东西', example: '单抽出金，欧皇附体', emotion: 'positive' },
  { id: 'ft7', term: '非酋', category: '二次元', definition: '运气极差的玩家，与欧皇相对', example: '保底都歪了，我是非酋', emotion: 'negative' },
  { id: 'ft8', term: '氪金', category: '二次元', definition: '在游戏中充值消费', example: '这个皮肤值得氪金', emotion: 'neutral' },
  { id: 'ft9', term: '肝', category: '二次元', definition: '长时间刷游戏，消耗精力', example: '这活动太肝了', emotion: 'negative' },
  { id: 'ft10', term: '满命', category: '二次元', definition: '角色命座/突破全部解锁', example: '满命角色伤害翻倍', emotion: 'positive' },
  
  // FPS类
  { id: 'ft11', term: '压枪', category: 'FPS', definition: '控制枪械后坐力，保持准星稳定', example: '压枪练好了吗', emotion: 'neutral' },
  { id: 'ft12', term: '架枪', category: 'FPS', definition: '在某个位置等待敌人出现', example: '我在A点架枪', emotion: 'neutral' },
  { id: 'ft13', term: '闪光', category: 'FPS', definition: '闪光弹，用于致盲敌人', example: '先闪光再进点', emotion: 'neutral' },
  { id: 'ft14', term: 'Rush', category: 'FPS', definition: '快速冲锋进攻', example: 'Rush B不要停', emotion: 'positive' },
  { id: 'ft15', term: 'ACE', category: 'FPS', definition: '一人击杀对方全部五人', example: '绝了，ACE了！', emotion: 'positive' },
  
  // 通用类
  { id: 'ft16', term: 'YYDS', category: '通用', definition: '永远的神，表示极度崇拜', example: '这操作YYDS', emotion: 'positive' },
  { id: 'ft17', term: '破防', category: '通用', definition: '心理防线被击破，情绪崩溃', example: '看到这剧情我破防了', emotion: 'negative' },
  { id: 'ft18', term: '芜湖', category: '通用', definition: '表示兴奋、起飞的感觉', example: '芜湖起飞！', emotion: 'positive' },
  { id: 'ft19', term: '绝绝子', category: '通用', definition: '表示绝了、太棒了', example: '这个设计绝绝子', emotion: 'positive' },
  { id: 'ft20', term: '666', category: '通用', definition: '表示厉害、牛逼', example: '这波操作666', emotion: 'positive' },
  
  // 沙盒类
  { id: 'ft21', term: '开荒', category: '沙盒', definition: '在新地图或新服务器开始建设', example: '今晚继续开荒', emotion: 'neutral' },
  { id: 'ft22', term: '红石', category: '沙盒', definition: 'Minecraft中的电路系统', example: '红石电路太复杂了', emotion: 'neutral' },
  { id: 'ft23', term: '种田', category: '沙盒', definition: '在游戏中进行农业活动', example: '种田养老才是王道', emotion: 'positive' },
  
  // 竞速类
  { id: 'ft24', term: '漂移', category: '竞速', definition: '车辆侧滑过弯技术', example: '漂移过弯更快', emotion: 'positive' },
  { id: 'ft25', term: '氮气', category: '竞速', definition: '加速道具', example: '氮气留着冲刺用', emotion: 'neutral' },
  
  // 更多通用类
  { id: 'ft26', term: 'AFK', category: '通用', definition: 'Away From Keyboard，暂时离开', example: '等我一下，AFK', emotion: 'neutral' },
  { id: 'ft27', term: 'BUG', category: '通用', definition: '游戏漏洞', example: '这个BUG太离谱了', emotion: 'negative' },
  { id: 'ft28', term: 'DLC', category: '通用', definition: '可下载内容，游戏扩展包', example: '新DLC什么时候出', emotion: 'neutral' },
  { id: 'ft29', term: 'NPC', category: '通用', definition: '非玩家角色', example: '这个NPC任务在哪', emotion: 'neutral' },
  { id: 'ft30', term: '白嫖', category: '通用', definition: '不花钱获得游戏内容', example: '这个活动可以白嫖', emotion: 'positive' }
];

// 城镇建筑
export const BUILDINGS: Building[] = [
  {
    id: 'identity_center',
    name: '身份认证中心',
    description: '一座充满未来科技感的建筑，进行黑话DNA测试',
    icon: '🧬',
    unlocked: true,
    position: { x: 30, y: 40 }
  },
  {
    id: 'archive_hall',
    name: '真言档案馆',
    description: '一座庄严的数字图书馆，存放着所有游戏黑话的秘密',
    icon: '📚',
    unlocked: false,
    position: { x: 70, y: 40 }
  }
];

// 章节脚本文案
export const SCRIPT: Chapter3Script = {
  ch3_title: '玩家生态城镇',
  ch3_subtitle: '一个用词就能给人贴上标签的世界',
  
  ch3_intro_narration_1: '你来到了一座繁华的赛博朋克城镇...',
  ch3_intro_narration_2: '高耸的全息广告牌上滚动着各种游戏黑话，NPC们三两成群，头顶上不时冒出黑话组成的聊天气泡。',
  
  ch3_npc_name: '社交向导',
  ch3_npc_title: '城镇引路人',
  ch3_npc_greeting: '欢迎来到玩家生态城镇！这里是游戏玩家的社交中心，每个人都用独特的"黑话"来表达自己。',
  ch3_npc_task: '了解他人，从认识自己开始。请先前往"身份认证中心"，完成你的黑话DNA测试吧！',
  
  ch3_dna_intro: '欢迎来到身份认证中心！通过这个测试，我们将分析你的游戏语言习惯，揭示你的玩家类型。',
  
  ch3_archive_intro: '欢迎来到真言档案馆！这里存放着数字时代的语言密码。你可以使用AI智能查询系统，探索任何游戏黑话的奥秘。',
  
  ch3_ai_intro: '我是AI查询助手，你可以问我任何游戏黑话的含义、用法和文化背景。',
  
  ch3_exploration_hint: '在城镇中自由探索吧！点击漂浮的黑话词汇了解它们的含义，查询并理解超过10个新黑话即可完成任务。',
  
  ch3_skill_unlock_text: '你已经深刻理解了黑话的社群意义。这份理解将化为力量，赋予你"共鸣之声"的能力——通过沟通和理解，你可以模仿乃至影响对手。',
  
  ch3_skill_name: '共鸣之声',
  ch3_skill_desc: '复制Boss上一回合使用的技能，以50%效果释放',
  
  ch3_outro_narration_1: '在这座城镇中，你学会了用黑话与他人建立联系...',
  ch3_outro_narration_2: '语言不仅是交流的工具，更是身份认同的象征。掌握了这份力量，你已经准备好面对更大的挑战。'
};

// AI查询预设回答（用于模拟AI响应）
export const AI_RESPONSES: Record<string, {
  definition: string;
  usage: string;
  emotion: string;
  origin: string;
  relatedTerms: string[];
}> = {
  'GG': {
    definition: 'Good Game的缩写，表示"好游戏"，通常在游戏结束时使用',
    usage: '可以用于认输、致敬对手、或单纯表示游戏结束',
    emotion: '中性偏正面，带有体育精神',
    origin: '起源于早期电子竞技，是国际通用的游戏礼仪用语',
    relatedTerms: ['GG WP', 'EZ', 'GLHF']
  },
  'YYDS': {
    definition: '"永远的神"的拼音首字母缩写，表示对某人或某事的极度崇拜',
    usage: '用于表达对精彩操作、优秀作品或喜爱事物的赞美',
    emotion: '强烈正面，带有崇拜意味',
    origin: '起源于电竞圈对选手的称赞，后破圈成为网络流行语',
    relatedTerms: ['绝绝子', '666', 'GOAT']
  },
  '欧皇': {
    definition: '指运气极好的玩家，尤其是在抽卡游戏中总能抽到稀有角色',
    usage: '用于形容运气好的人或调侃自己运气好的时刻',
    emotion: '正面，带有羡慕和调侃意味',
    origin: '源自"欧洲人"的说法，因欧洲玩家被认为运气好而得名',
    relatedTerms: ['非酋', '玄学', '单抽出奇迹']
  },
  '非酋': {
    definition: '指运气极差的玩家，与"欧皇"相对',
    usage: '用于自嘲运气差或安慰运气不好的朋友',
    emotion: '负面但带有自嘲幽默',
    origin: '源自"非洲人"的说法，与"欧皇"形成对比',
    relatedTerms: ['欧皇', '保底', '歪了']
  },
  '氪金': {
    definition: '在游戏中充值消费，源自日语"課金"',
    usage: '描述在游戏中花钱购买道具、角色等行为',
    emotion: '中性，视语境可正可负',
    origin: '源自日本手游文化，"課金"即付费的意思',
    relatedTerms: ['白嫖', '月卡', '648']
  },
  '破防': {
    definition: '原指游戏中防御被击破，现多指心理防线被击破、情绪崩溃',
    usage: '表达被某事触动、感动或崩溃的状态',
    emotion: '负面或感性，视语境而定',
    origin: '从游戏术语演变为网络流行语，含义扩展到情感层面',
    relatedTerms: ['泪目', 'DNA动了', '绷不住了']
  }
};
