export type Operator = '+' | '-';

export type QuizPhase = 'start' | 'asking' | 'listening' | 'feedback';

export interface Question {
  a: number;
  b: number;
  operator: Operator;
  correctAnswer: number;
}

export interface QuizState {
  phase: QuizPhase;
  currentQuestion: Question | null;
  correct: number;
  total: number;
  lastAnswerCorrect: boolean | null;
}
