import { DialogueOption, LogSnippet, NetworkLink, NetworkNode, QuizQuestion, ScriptItem, SlangNode, SlangTerm } from './types';

export const SCRIPT: Record<string, string> = {
  // Title
  ch2_title_main: "战斗本体平原",
  ch2_title_sub: "数值与冷却时间的语言",
  ch2_title_chapter_index: "CHAPTER 2",
  
  // Scene 0
  ch2_scene0_leave_village: "你离开了黑话新手村，踏上真正的战斗本体。",
  
  // Intro Narration
  ch2_intro_narration_1: "离开了新手村，你终于走进了“游戏本体”。",
  ch2_intro_narration_2: "在这里，怪物有仇恨条，技能有冷却时间，伤害被写进密密麻麻的公式里。",
  ch2_intro_narration_3: "但大多数玩家不会打开源码，他们只会说四个字：",
  ch2_intro_narration_4: "——“稳住 DPS。”",

  // NPC
  ch2_npc_captain_name: "团长 · 不讲武德",
  ch2_dialog_captain_intro_1: "新人？装备随便，先把这几个词搞明白——",
  ch2_dialog_captain_intro_2: "“拉仇恨、OT、稳 DPS。”",
  
  // Skill Tree Intro
  ch2_skilltree_intro_1: "如果说新手村里的黑话是“你是谁”“你属于哪一派”，",
  ch2_skilltree_intro_2: "那战斗本体平原上的黑话，就是“你到底会不会打本”。",
  ch2_skilltree_intro_3: "我们从数千条术语中，只抽出与“战斗系统”直接相关的一小片，",
  ch2_skilltree_intro_4: "就已经能画出一棵密不透风的“技能树”。",
  
  // Skill Tree Caption
  ch2_skilltree_caption_main: "在这棵“技能树”里，每一个术语都不是孤立存在。",
  ch2_skilltree_caption_detail_1: "“仇恨”和“拉怪”把你和怪物绑定在一起；",
  ch2_skilltree_caption_detail_2: "“CD”和“手法”写在你的指尖肌肉记忆里；",
  ch2_skilltree_caption_detail_3: "“DPS”和“秒伤”则被分享到攻略站、直播间，用来评判一个人的贡献值。",
  ch2_skilltree_caption_footer: "对老玩家来说，这些词只是“常识”；对刚踏上战斗本体平原的新手来说，这是一份需要背下来的“行前说明书”。",

  // Frequency Intro
  ch2_freq_intro_1: "当战斗进入关键阶段，聊天室里不会说“请合理分配仇恨值”“注意技能释放时机”。",
  ch2_freq_intro_2: "玩家会说：",
  ch2_freq_caption_footer: "每一个缩写，都代表着一段已经被内化的“战斗教程”。",

  // Network Intro
  ch2_network_intro_1: "把战斗黑话放进网络图，我们会发现玩家并不是“随机说词”。",
  ch2_network_intro_2: "他们在讨论的是一整套“分工协作”：",
  ch2_network_case_1: "当【DPS】出现时，旁边常常跟着【循环】【木桩】——这是在追求极限输出手法。",
  ch2_network_case_2: "当【仇恨】与【OT】挤在一起时，基本上不是什么好消息——通常几秒钟之后弹幕里会出现【团灭】。",
  ch2_network_footer: "对新手来说，这些词像一串串密码；对老玩家来说，这是他们对战斗系统的“速记本”。",

  // Quizzes
  ch2_quiz1_title: "任务：把黑话翻译成人话",
  ch2_quiz1_question: "团长说：“等会第二阶段注意拉仇恨，别 OT 了。”下面哪一句是最接近的“人话翻译”？",
  
  ch2_quiz2_title: "任务：用战斗黑话复盘一次团灭",
  ch2_quiz2_instruction: "下面是一场团灭前后出现的几句聊天记录，请按“事件发生的顺序”依次点击它们进行排序。",
  ch2_quiz2_result_explanation_title: "这一次团灭的真实原因：",
  ch2_quiz2_result_footer: "在战斗本体平原，黑话是一本文字极简的“事故复盘记录”。",
  ch2_quiz2_result_explanation_1: "起因：DPS 在开场爆发期交掉了所有技能（CD 全交），造成瞬间伤害过高。",
  ch2_quiz2_result_explanation_2: "经过：坦克（T）没有预估到爆发伤害，嘲讽技能处于冷却或反应不及，导致仇恨失控（OT）。",
  ch2_quiz2_result_explanation_3: "转折：Boss 仇恨目标改变，转身攻击 DPS，同时触发了场地机制（红圈），场面混乱。",
  ch2_quiz2_result_explanation_4: "结果：核心输出减员，复活不及时，最终导致团队覆灭（团灭）。",

  // Achievement
  ch2_achievement_title: "🏆 成就解锁：第一次团灭复盘",
  ch2_achievement_body: "你已经学会用术语还原一场失败的战斗。",
  ch2_achievement_reward: "EXP +200，战斗理解 +1。",

  // Outro
  ch2_outro_narration_1: "当你在战斗本体平原逛了一圈，“拉仇恨”“稳 DPS”“看机制”这些词，已经不再只是冰冷的术语。",
  ch2_outro_narration_2: "它们背后，是策划写下的数值、是团长画的站位图、也是无数次团灭之后玩家在弹幕里吵出来的共识。",
  ch2_outro_narration_3: "但战斗并不会只发生在怪物面前。",
  ch2_outro_narration_4: "当一次失败被归咎于“划水”“混分”“不会打本”的时候，黑话开始离开技能树，走向另一个地方——",
  ch2_outro_narration_5: "玩家生态城镇：一个用词就能给人贴上标签的世界。",
};

export const NPC_OPTIONS: DialogueOption[] = [
  {
    id: "opt1",
    text: "我只会按普攻键，可以吗？",
    response: "只会普攻？那你刚好来对地方——这里是“技能树教程本”。"
  },
  {
    id: "opt2",
    text: "OT 是什么？欧……什么？",
    response: "OT：Over Threat，仇恨溢出了，怪扭头就咬你。懂了没？不懂等会你就懂了。"
  },
  {
    id: "opt3",
    text: "放心，我是金牌打工人，一秒拉满 DPS。",
    response: "别嘴硬，数据面板不会说谎。"
  }
];

export const SKILL_TREE_DATA: SlangNode = {
  name: "战斗本体",
  children: [
    {
      name: "战斗角色",
      children: [
        { name: "输出 (DPS)", description: "负责造成伤害的角色" },
        { name: "坦克 (Tank)", description: "负责承受伤害和吸引怪物注意" },
        { name: "治疗 (Healer)", description: "负责回复生命值" },
        { name: "工具人", description: "主要负责提供增益而非直接伤害" }
      ]
    },
    {
      name: "数值与伤害",
      children: [
        { name: "DPS", description: "Damage Per Second，秒伤" },
        { name: "暴击", description: "造成额外倍率的伤害" },
        { name: "倍率", description: "技能伤害的计算系数" },
        { name: "期望", description: "长期平均下来的理论伤害" },
        { name: "HPS", description: "Heal Per Second，秒治疗量" }
      ]
    },
    {
      name: "技能与冷却",
      children: [
        { name: "CD", description: "Cooldown，冷却时间" },
        { name: "GCD", description: "Global Cooldown，公共冷却" },
        { name: "硬直", description: "动作无法取消的僵持时间" },
        { name: "无敌帧", description: "角色完全免疫伤害的瞬间" },
        { name: "读条", description: "施法吟唱时间" }
      ]
    },
    {
      name: "机制与场地",
      children: [
        { name: "AOE", description: "Area of Effect，范围攻击" },
        { name: "仇恨 (Threat)", description: "怪物攻击目标的判定值" },
        { name: "OT", description: "Over Threat，仇恨失控" },
        { name: "Buff/Debuff", description: "增益/减益状态" },
        { name: "狂暴", description: "Boss战时间耗尽后的秒杀机制" }
      ]
    }
  ]
};

export const FREQUENCY_DATA: SlangTerm[] = [
  { term: "DPS", count: 1240, examples: ["DPS不够快狂暴了", "这DPS是在刮痧吗", "求个强力DPS"] },
  { term: "OT", count: 850, examples: ["T拉好仇恨别OT啊", "输出太高OT了", "谁OT谁背锅"] },
  { term: "CD", count: 720, examples: ["大招CD没好", "卡CD吃药", "这波技能全交了没CD"] },
  { term: "团灭", count: 680, examples: ["又团灭了散了吧", "这机制不懂肯定团灭", "如果不躲圈就是团灭"] },
  { term: "机制", count: 550, examples: ["别只顾着输出看机制", "机制杀", "这是流程机制"] },
  { term: "奶", count: 430, examples: ["奶好T别倒", "放生那个DPS先奶T", "奶妈没蓝了"] },
];

export const NETWORK_NODES: NetworkNode[] = [
  { id: "DPS", group: 1, radius: 20 },
  { id: "手法", group: 1, radius: 12 },
  { id: "循环", group: 1, radius: 10 },
  { id: "木桩", group: 1, radius: 10 },
  { id: "爆发", group: 1, radius: 12 },
  { id: "仇恨", group: 2, radius: 20 },
  { id: "OT", group: 2, radius: 18 },
  { id: "拉怪", group: 2, radius: 15 },
  { id: "嘲讽", group: 2, radius: 12 },
  { id: "开怪", group: 2, radius: 10 },
  { id: "团灭", group: 3, radius: 18 },
  { id: "奶量", group: 3, radius: 15 },
  { id: "抬血", group: 3, radius: 12 },
  { id: "复活", group: 3, radius: 10 },
  { id: "AOE", group: 3, radius: 12 },
];

export const NETWORK_LINKS: NetworkLink[] = [
  { source: "DPS", target: "手法", value: 5 },
  { source: "DPS", target: "循环", value: 4 },
  { source: "DPS", target: "木桩", value: 3 },
  { source: "DPS", target: "爆发", value: 4 },
  { source: "DPS", target: "OT", value: 2 },
  { source: "仇恨", target: "OT", value: 8 },
  { source: "仇恨", target: "拉怪", value: 6 },
  { source: "仇恨", target: "嘲讽", value: 4 },
  { source: "拉怪", target: "开怪", value: 3 },
  { source: "OT", target: "团灭", value: 7 },
  { source: "团灭", target: "复活", value: 3 },
  { source: "奶量", target: "抬血", value: 5 },
  { source: "奶量", target: "团灭", value: 2 },
  { source: "AOE", target: "团灭", value: 4 },
  { source: "AOE", target: "抬血", value: 3 },
];

export const QUIZ_1: QuizQuestion = {
  id: "q1",
  question: SCRIPT.ch2_quiz1_question,
  options: [
    { id: "a", text: "等会第二阶段多打点伤害。", isCorrect: false },
    { id: "b", text: "等会第二阶段你少动一动。", isCorrect: false },
    { id: "c", text: "等会第二阶段让怪只打指定的人，别让它突然跑去咬别人。", isCorrect: true },
    { id: "d", text: "等会第二阶段别发弹幕了。", isCorrect: false },
  ],
  correctFeedback: "恭喜，你成功把一段高密度黑话翻译成正常语言。下一步试着自己说一句“黑话版”吧。",
  wrongFeedback: "差一点点，再想想团长真正担心的是什么——是怪会乱跑。"
};

export const QUIZ_2_LOGS: LogSnippet[] = [
  { id: "b", text: "这波 CD 全交了，下波没技能了", order: 1 },
  { id: "a", text: "T 没嘲讽住，OT 了", order: 2 },
  { id: "c", text: "机制看好啊，别站红圈", order: 3 },
  { id: "d", text: "？又团了", order: 4 },
];