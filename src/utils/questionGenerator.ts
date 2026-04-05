import type { Question, Operator } from '../types/quiz';

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateQuestion(): Question {
  const operator: Operator = Math.random() < 0.5 ? '+' : '-';

  let a: number;
  let b: number;

  if (operator === '+') {
    a = randInt(0, 20);
    b = randInt(0, 20 - a);
  } else {
    a = randInt(0, 20);
    b = randInt(0, a);
  }

  const correctAnswer = operator === '+' ? a + b : a - b;

  return { a, b, operator, correctAnswer };
}
