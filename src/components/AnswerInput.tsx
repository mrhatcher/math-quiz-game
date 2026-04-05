import { useState, type FormEvent } from 'react';
import './AnswerInput.css';

interface AnswerInputProps {
  onSubmitText: (value: string) => void;
  onStartListening: () => void;
  onStopListening: () => void;
  isListening: boolean;
  transcript: string;
  isSupported: boolean;
  onReplay: () => void;
  disabled: boolean;
}

export function AnswerInput({
  onSubmitText,
  onStartListening,
  onStopListening,
  isListening,
  transcript,
  isSupported,
  onReplay,
  disabled,
}: AnswerInputProps) {
  const [typed, setTyped] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (typed.trim()) {
      onSubmitText(typed.trim());
      setTyped('');
    }
  };

  return (
    <div className="answer-input">
      {isSupported && (
        <div className="mic-section">
          <button
            className={`mic-button ${isListening ? 'mic-listening' : ''}`}
            onClick={isListening ? onStopListening : onStartListening}
            disabled={disabled}
            aria-label={isListening ? 'Stop listening' : 'Start listening'}
          >
            <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5z" />
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
            </svg>
          </button>
          {isListening && (
            <p className="mic-status">Listening... say your answer!</p>
          )}
          {transcript && !isListening && (
            <p className="mic-transcript">I heard: "{transcript}"</p>
          )}
        </div>
      )}

      <div className="divider-text">
        {isSupported ? 'or type your answer' : 'Type your answer'}
      </div>

      <form className="text-input-section" onSubmit={handleSubmit}>
        <input
          type="number"
          className="text-input"
          value={typed}
          onChange={e => setTyped(e.target.value)}
          placeholder="?"
          disabled={disabled}
          min={0}
          max={40}
        />
        <button
          type="submit"
          className="submit-button"
          disabled={disabled || !typed.trim()}
        >
          Submit
        </button>
      </form>

      <button
        className="replay-button"
        onClick={onReplay}
        disabled={disabled}
      >
        Hear Again
      </button>
    </div>
  );
}
