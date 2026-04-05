import type { Question } from '../types/quiz';
import './FeedbackOverlay.css';

interface FeedbackOverlayProps {
  isCorrect: boolean;
  question: Question;
  onNext: () => void;
}

export function FeedbackOverlay({ isCorrect, question, onNext }: FeedbackOverlayProps) {
  return (
    <div className={`feedback-overlay ${isCorrect ? 'feedback-correct' : 'feedback-incorrect'}`}>
      <div className={`feedback-card ${isCorrect ? 'feedback-bounce' : 'feedback-shake'}`}>
        <div className="feedback-icon">{isCorrect ? '★' : '~'}</div>
        <h2 className="feedback-text">
          {isCorrect ? 'Correct!' : 'Not quite!'}
        </h2>
        <p className="feedback-answer">
          {question.a} {question.operator} {question.b} = {question.correctAnswer}
        </p>
        <button className="next-button" onClick={onNext}>
          Next Question
        </button>
      </div>
    </div>
  );
}
