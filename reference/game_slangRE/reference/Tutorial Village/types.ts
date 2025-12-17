export type ScreenType = 'start' | 'tutorial' | 'world_map';

export interface PlayerStats {
  level: number;
  exp: number;
  maxExp: number;
  achievements: string[];
}

export interface Dialogue {
  id: string;
  speaker: string;
  text: string;
  action?: 'next_phase' | 'show_quiz' | 'highlight_hud' | 'highlight_menu' | 'highlight_slang' | 'end_tutorial';
}

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  correctFeedback: string;
  incorrectFeedback: string;
}

export enum TutorialPhase {
  ENTERING = 'entering', // Black screen animation
  INTRO = 'intro', // Village visible, intro dialog
  EXPLAIN_HUD = 'explain_hud', // Highlighting HUD
  EXPLAIN_MENU = 'explain_menu', // Highlighting Menu
  EXPLAIN_SLANG = 'explain_slang', // Showing tooltip demo
  PRE_QUIZ = 'pre_quiz', // Dialog before quiz
  QUIZ = 'quiz', // Taking the quiz
  POST_QUIZ = 'post_quiz', // Result dialog
  READY_TO_LEAVE = 'ready_to_leave' // Exit button available
}