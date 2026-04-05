import './ScoreBar.css';

interface ScoreBarProps {
  correct: number;
  total: number;
}

export function ScoreBar({ correct, total }: ScoreBarProps) {
  if (total === 0) return null;

  return (
    <div className="score-bar">
      <span className="score-correct">{correct}</span>
      <span className="score-divider">out of</span>
      <span className="score-total">{total}</span>
      <span className="score-label">correct</span>
    </div>
  );
}
