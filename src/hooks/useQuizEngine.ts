import { useCallback, useRef, useState } from 'react';
import type { QuizState, Question } from '../types/quiz';
import { generateQuestion } from '../utils/questionGenerator';
import { parseAnswer, checkAnswer } from '../utils/answerParser';
import { useSpeakQuestion } from './useSpeakQuestion';
import { useAnswerRecognition } from './useAnswerRecognition';

const initialState: QuizState = {
  phase: 'start',
  currentQuestion: null,
  correct: 0,
  total: 0,
  lastAnswerCorrect: null,
};

export function useQuizEngine() {
  const [state, setState] = useState<QuizState>(initialState);
  const { speak, speakText, isSpeaking, voicesReady } = useSpeakQuestion();
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const askQuestion = useCallback(async (question: Question) => {
    setState(prev => ({ ...prev, phase: 'asking', currentQuestion: question }));
    await speak(question);
    setState(prev => ({ ...prev, phase: 'listening' }));
  }, [speak]);

  const handleAnswer = useCallback((rawText: string) => {
    setState(prev => {
      if (!prev.currentQuestion || prev.phase !== 'listening') return prev;

      const parsed = parseAnswer(rawText);
      const isCorrect = checkAnswer(parsed, prev.currentQuestion.correctAnswer);

      if (isCorrect) {
        speakText('Correct! Great job!');
      } else {
        speakText(`Not quite. The answer is ${prev.currentQuestion.correctAnswer}.`);
      }

      return {
        ...prev,
        phase: 'feedback',
        correct: prev.correct + (isCorrect ? 1 : 0),
        total: prev.total + 1,
        lastAnswerCorrect: isCorrect,
      };
    });
  }, [speakText]);

  const handleTypedAnswer = useCallback((value: string) => {
    handleAnswer(value);
  }, [handleAnswer]);

  const recognition = useAnswerRecognition(handleAnswer);

  const startQuiz = useCallback(() => {
    const question = generateQuestion();
    askQuestion(question);
  }, [askQuestion]);

  const nextQuestion = useCallback(() => {
    if (feedbackTimerRef.current) {
      clearTimeout(feedbackTimerRef.current);
      feedbackTimerRef.current = null;
    }
    recognition.reset();
    const question = generateQuestion();
    askQuestion(question);
  }, [askQuestion, recognition]);

  const replayQuestion = useCallback(() => {
    if (state.currentQuestion && state.phase === 'listening') {
      speak(state.currentQuestion).then(() => {
        setState(prev => ({ ...prev, phase: 'listening' }));
      });
      setState(prev => ({ ...prev, phase: 'asking' }));
    }
  }, [state.currentQuestion, state.phase, speak]);

  return {
    state,
    startQuiz,
    nextQuestion,
    replayQuestion,
    handleTypedAnswer,
    recognition,
    isSpeaking,
    voicesReady,
  };
}
