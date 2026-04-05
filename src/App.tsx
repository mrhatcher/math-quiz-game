import { useQuizEngine } from './hooks/useQuizEngine';
import { StartScreen } from './components/StartScreen';
import { NameEntry } from './components/NameEntry';
import { QuestionCard } from './components/QuestionCard';
import { AnswerInput } from './components/AnswerInput';
import { FeedbackOverlay } from './components/FeedbackOverlay';
import { ScoreBar } from './components/ScoreBar';
import './App.css';

function App() {
  const {
    state,
    startQuiz,
    confirmName,
    nextQuestion,
    replayQuestion,
    handleTypedAnswer,
    recognition,
    isSpeaking,
    voicesReady,
  } = useQuizEngine();

  const { phase, currentQuestion, correct, total, lastAnswerCorrect } = state;

  return (
    <div className="app">
      {phase === 'start' && (
        <StartScreen onStart={startQuiz} ready={voicesReady} />
      )}

      {phase === 'name' && (
        <NameEntry onConfirm={confirmName} />
      )}

      {phase !== 'start' && phase !== 'name' && (
        <>
          <ScoreBar correct={correct} total={total} />

          <div className="quiz-area">
            {currentQuestion && (
              <QuestionCard
                question={currentQuestion}
                showAnswer={phase === 'feedback'}
              />
            )}

            {phase === 'asking' && (
              <p className="speaking-indicator">Speaking...</p>
            )}

            {phase === 'listening' && currentQuestion && (
              <AnswerInput
                onSubmitText={handleTypedAnswer}
                onStartListening={recognition.startListening}
                onStopListening={recognition.stopListening}
                isListening={recognition.isListening}
                transcript={recognition.transcript}
                isSupported={recognition.isSupported}
                onReplay={replayQuestion}
                disabled={isSpeaking}
              />
            )}

            {phase === 'feedback' && currentQuestion && lastAnswerCorrect !== null && (
              <FeedbackOverlay
                isCorrect={lastAnswerCorrect}
                question={currentQuestion}
                onNext={nextQuestion}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
