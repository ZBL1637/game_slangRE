export interface ScriptItem {
  id: string;
  text: string;
}

export interface DialogueOption {
  id: string;
  text: string;
  response: string;
}

export interface SlangNode {
  name: string;
  description?: string;
  children?: SlangNode[];
  value?: number;
}

export interface SlangTerm {
  term: string;
  count: number;
  examples: string[];
}

export interface NetworkNode {
  id: string;
  group: number; // 1: DPS, 2: Tank, 3: Healer/Misc
  radius: number;
}

export interface NetworkLink {
  source: string;
  target: string;
  value: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: { id: string; text: string; isCorrect: boolean }[];
  correctFeedback: string;
  wrongFeedback: string;
}

export interface LogSnippet {
  id: string;
  text: string;
  order: number; // Correct order
}
