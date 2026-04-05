import { useState, type FormEvent } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import './NameEntry.css';

interface NameEntryProps {
  onConfirm: (name: string) => void;
}

export function NameEntry({ onConfirm }: NameEntryProps) {
  const [typed, setTyped] = useState('');
  const [heardName, setHeardName] = useState('');
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    finalTranscript,
  } = useSpeechRecognition();

  // When final transcript arrives, store it as the heard name
  const [lastProcessed, setLastProcessed] = useState('');
  if (finalTranscript && finalTranscript !== lastProcessed) {
    setLastProcessed(finalTranscript);
    // Take the first word as the name (strip trailing punctuation)
    const name = finalTranscript.trim().split(/\s+/)[0].replace(/[^a-zA-Z]/g, '');
    if (name) setHeardName(name.charAt(0).toUpperCase() + name.slice(1).toLowerCase());
  }

  const handleMicClick = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      setHeardName('');
      resetTranscript();
      SpeechRecognition.startListening({ continuous: false, language: 'en-US' });
    }
  };

  const handleConfirmVoice = () => {
    if (heardName) onConfirm(heardName);
  };

  const handleTryAgain = () => {
    setHeardName('');
    resetTranscript();
  };

  const handleSubmitTyped = (e: FormEvent) => {
    e.preventDefault();
    const name = typed.trim();
    if (name) {
      onConfirm(name.charAt(0).toUpperCase() + name.slice(1).toLowerCase());
      setTyped('');
    }
  };

  return (
    <div className="name-entry">
      <h2 className="name-title">What's your name?</h2>

      {browserSupportsSpeechRecognition && (
        <div className="name-mic-section">
          <button
            className={`mic-button ${listening ? 'mic-listening' : ''}`}
            onClick={handleMicClick}
            aria-label={listening ? 'Stop listening' : 'Say your name'}
          >
            <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5z" />
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
            </svg>
          </button>

          {listening && (
            <p className="name-mic-status">Listening... say your name!</p>
          )}

          {transcript && listening && (
            <p className="name-transcript">"{transcript}"</p>
          )}

          {heardName && !listening && (
            <div className="name-confirm-section">
              <p className="name-heard">
                Hi, <strong>{heardName}</strong>!
              </p>
              <p className="name-confirm-prompt">Is that right?</p>
              <div className="name-confirm-buttons">
                <button className="confirm-yes" onClick={handleConfirmVoice}>
                  Yes, that's me!
                </button>
                <button className="confirm-retry" onClick={handleTryAgain}>
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="divider-text">
        {browserSupportsSpeechRecognition ? 'or type your name' : 'Type your name'}
      </div>

      <form className="name-text-section" onSubmit={handleSubmitTyped}>
        <input
          type="text"
          className="name-text-input"
          value={typed}
          onChange={e => setTyped(e.target.value)}
          placeholder="Your name"
          maxLength={30}
          autoComplete="off"
        />
        <button
          type="submit"
          className="submit-button"
          disabled={!typed.trim()}
        >
          Go!
        </button>
      </form>
    </div>
  );
}
