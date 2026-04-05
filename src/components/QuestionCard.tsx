import type { Question } from '../types/quiz';
import './QuestionCard.css';

interface QuestionCardProps {
  question: Question;
  showAnswer?: boolean;
}

export function QuestionCard({ question, showAnswer }: QuestionCardProps) {
  return (
    <div className="question-card" key={`${question.a}-${question.operator}-${question.b}`}>
      <span className="question-number">{question.a}</span>
      <span className="question-operator">{question.operator}</span>
      <span className="question-number">{question.b}</span>
      <span className="question-equals">=</span>
      <span className="question-answer">
        {showAnswer ? question.correctAnswer : '?'}
      </span>
    </div>
  );
}
