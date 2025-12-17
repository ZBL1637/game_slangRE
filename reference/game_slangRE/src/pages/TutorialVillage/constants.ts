import { Dialogue, QuizQuestion } from './types';

export const INTRO_DIALOGUES: Dialogue[] = [
  {
    id: '1',
    speaker: '黑话村长',
    text: '哟，新人？欢迎来到黑话新手村。从你按下『开始游戏』那一刻起，就踏进了一个有点奇怪的地方——',
  },
  {
    id: '2',
    speaker: '黑话村长',
    text: '这里的人聊天，从来不说‘不错’、‘哈哈’这种正常话。他们会说：‘芜湖起飞’、‘就这？’、‘痛苦面具’。',
  },
  {
    id: '3',
    speaker: '黑话村长',
    text: '听起来像在胡说八道吧？可在他们眼里，这是最自然不过的语言。',
  },
  {
    id: '4',
    speaker: '黑话村长',
    text: '这篇‘游戏黑话’数据新闻，就是把这个世界拆开给你看：从术语百科到弹幕风暴，从萌新自嘲到大佬互怼。',
  },
  {
    id: '5',
    speaker: '黑话村长',
    text: '不过有件事要先说清楚——黑话既是密码，也是门槛。',
  },
  {
    id: '6',
    speaker: '黑话村长',
    text: '它能让老玩家一眼认出‘自己人’，也能让刚来的新人觉得：‘算了算了，我听不懂，你们玩你们的。’',
  },
  {
    id: '7',
    speaker: '黑话村长',
    text: '所以，你在这趟旅程里的主线任务，是搞清楚：玩家黑话，怎么一边拉近玩家，一边又筑起了新的墙。',
    action: 'highlight_hud'
  }
];

export const HUD_TUTORIAL_DIALOGUE: Dialogue[] = [
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
