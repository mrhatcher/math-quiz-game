import './StartScreen.css';

interface StartScreenProps {
  onStart: () => void;
  ready: boolean;
}

export function StartScreen({ onStart, ready }: StartScreenProps) {
  return (
    <div className="start-screen">
      <h1 className="start-title">Math Quiz!</h1>
      <p className="start-subtitle">Practice addition and subtraction</p>
      <button
        className="start-button"
        onClick={onStart}
        disabled={!ready}
      >
        {ready ? "Let's Play!" : 'Loading...'}
      </button>
      <p className="start-hint">
        You can answer by speaking into your microphone or typing your answer.
      </p>
    </div>
  );
}
