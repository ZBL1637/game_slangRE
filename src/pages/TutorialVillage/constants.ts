import { Dialogue, QuizQuestion } from './types';

// NV_00: 坠入动画
export const NV00_NARRATION: Dialogue[] = [
  {
    id: 'nv00_1',
    speaker: '旁白',
    text: '你从一片像素噪点里“掉”了下来。',
  },
  {
    id: 'nv00_2',
    speaker: '旁白',
    text: '脚下是土黄草地，远处的山脉被薄雾遮住——像还没加载完全的地图。',
  }
];

// NV_04: 豆芽NPC对话
export const NV04_DIALOGUE: Dialogue[] = [
  {
    id: 'nv04_1',
    speaker: '萌新',
    text: '诶？你也是刚来的？我头上这个绿色图标……他们都叫我“萌新”。',
  },
  {
    id: 'nv04_2',
    speaker: '你',
    text: '萌新？',
  },
  {
    id: 'nv04_3',
    speaker: '萌新',
    text: '就是新手啦。你一开口听不懂“黑话”，大家就知道你是萌新。',
  },
  {
    id: 'nv04_4',
    speaker: '萌新',
    text: '不过别怕——在这个世界，语言也是装备。你会越打越懂。',
  }
];

// NV_06: 村长主线对话 (REPLACES ORIGINAL INTRO)
export const INTRO_DIALOGUES: Dialogue[] = [
  {
    id: 'nv06_1',
    speaker: '黑话村长',
    text: '欢迎，旅人。你掉进来的时候，我就知道——你还没学会这里的“接头暗号”。',
  },
  {
    id: 'nv06_2',
    speaker: '你',
    text: '我只想看个数据新闻，怎么还要打怪……',
  },
  {
    id: 'nv06_3',
    speaker: '黑话村长',
    text: '这就是怪。不是哥布林，是“听不懂”。',
  },
  {
    id: 'nv06_4',
    speaker: '黑话村长',
    text: '我给你两样东西：1）一张地图：从新手村走出去，你会看到“世界地图”。 2）一本图鉴：任何黑话都能查，查多了就升级。',
  },
  {
    id: 'nv06_5',
    speaker: '黑话村长',
    text: '记住：在这里，“探索”就是把未知变成已知。',
  },
  {
    id: 'nv06_6',
    speaker: '黑话村长',
    text: '现在，去村口。雾后面，就是你的第一张大地图。',
    action: 'unlock_gate'
  }
];

// NV_07: 出村旁白
export const NV07_NARRATION: Dialogue[] = [
  {
    id: 'nv07_1',
    speaker: '旁白',
    text: '你踏进雾里。像素地形开始扩展开来——森林、平原、城镇、峡谷……',
  },
  {
    id: 'nv07_2',
    speaker: '旁白',
    text: '这不再是教学区，而是一整张“黑话世界”的地图。',
    action: 'end_tutorial'
  }
];

// Keep existing tutorials as optional or triggered later if needed, but for now they might be skipped in the new flow
// or we can integrate them. For now keeping them as export.
export const HUD_TUTORIAL_DIALOGUE: Dialogue[] = [
// ... (keep existing)

  {
    id: 'hud_1',
    speaker: '黑话村长',
    text: '先教你怎么在这世界里活下去。看看右上角——那是你的角色信息。',
  },
  {
    id: 'hud_2',
    speaker: '黑话村长',
    text: '读完一段故事、看完一张图、做完一个小测验，都会让你获得 EXP，升级变强。',
  },
  {
    id: 'hud_3',
    speaker: '黑话村长',
    text: '这里不卖月卡，不用氪金。只要肯看，你就能升到 Lv.100。',
    action: 'highlight_menu'
  }
];

export const MENU_TUTORIAL_DIALOGUE: Dialogue[] = [
  {
    id: 'menu_1',
    speaker: '黑话村长',
    text: '顶部中间这几个按钮，是你的随身道具。',
  },
  {
    id: 'menu_2',
    speaker: '黑话村长',
    text: '📜 任务列表：告诉你本章要做什么；🏅 成就：记录你翻车和高光的瞬间；📖 术语图鉴：当你看到不懂的词，可以来查。',
    action: 'highlight_slang'
  }
];

export const SLANG_TUTORIAL_DIALOGUE: Dialogue[] = [
  {
    id: 'slang_1',
    speaker: '黑话村长',
    text: '看到屏幕中间这种带底色的词了吗？那就是黑话。',
  },
  {
    id: 'slang_2',
    speaker: '黑话村长',
    text: '把鼠标移上去，或者用手指点一下，会跳出一个小窗：告诉你专业定义和“人话”翻译。',
  },
  {
    id: 'slang_3',
    speaker: '黑话村长',
    text: '听不懂没关系，点就对了。在这个世界里，乱点是被鼓励的。',
    action: 'show_quiz'
  }
];

export const PRE_QUIZ_DIALOGUE: Dialogue[] = [
  {
    id: 'quiz_intro',
    speaker: '黑话村长',
    text: '既然你已经知道这世界到处是黑话，那就先试着翻译几句常见的弹幕吧。点击右下角的问号接取任务。',
  }
];

export const POST_QUIZ_DIALOGUE: Dialogue[] = [
  {
    id: 'post_1',
    speaker: '黑话村长',
    text: '这只是热身。接下来你会看到更多，用数据画出来的黑话地图。',
  },
  {
    id: 'post_2',
    speaker: '黑话村长',
    text: '好了，新人，第一节课你已经通过了。前面有好几块地方等你去逛——',
  },
  {
    id: 'post_3',
    speaker: '黑话村长',
    text: '黑话起源之森、战斗本体平原、玩家生态城镇……每一块都对应一种不同的‘黑话生态’。',
  },
  {
    id: 'post_4',
    speaker: '黑话村长',
    text: '你现在可以离开新手村，在世界地图上选一块地方，开始真正的冒险了。',
    action: 'end_tutorial'
  }
];

export const TUTORIAL_QUIZ: QuizQuestion = {
  id: 'q1',
  question: '翻译题：别送了，再送这把就痛苦面具了',
  options: [
    { id: 'a', text: '面具时装太贵', isCorrect: false, explanation: '这可不是换装游戏。' },
    { id: 'b', text: '玩家已经精神崩溃 / 极度懊悔', isCorrect: true, explanation: '正解！源自表情包，形容极其痛苦。' },
    { id: 'c', text: '想收集面具成就', isCorrect: false, explanation: '并没有这个成就。' },
  ],
  correctFeedback: '不错不错！看样子你并不是第一次逛弹幕区嘛。EXP +20',
  incorrectFeedback: '没关系，新手第一次进团，团灭是正常的。下次再看到“痛苦面具”，你就知道那不是一件装备，而是一种表情。EXP +10'
};
