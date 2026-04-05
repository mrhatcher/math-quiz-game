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
  playerName: '',
};

export function useQuizEngine() {
  const [state, setState] = useState<QuizState>(initialState);
  const { speak, speakText, isSpeaking, voicesReady } = useSpeakQuestion();
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const playerNameRef = useRef('');

  const askQuestion = useCallback(async (question: Question, playerName?: string) => {
    setState(prev => ({ ...prev, phase: 'asking', currentQuestion: question }));
    await speak(question, playerName);
    setState(prev => ({ ...prev, phase: 'listening' }));
  }, [speak]);

  const handleAnswer = useCallback((rawText: string) => {
    setState(prev => {
      if (!prev.currentQuestion || prev.phase !== 'listening') return prev;

      const parsed = parseAnswer(rawText);
      const isCorrect = checkAnswer(parsed, prev.currentQuestion.correctAnswer);
      const name = prev.playerName;

      if (isCorrect) {
        speakText(name ? `Correct! Great job, ${name}!` : 'Correct! Great job!');
      } else {
        speakText(name
          ? `Not quite, ${name}. The answer is ${prev.currentQuestion.correctAnswer}.`
          : `Not quite. The answer is ${prev.currentQuestion.correctAnswer}.`
        );
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
    setState(prev => ({ ...prev, phase: 'name' }));
  }, []);

  const confirmName = useCallback(async (name: string) => {
    playerNameRef.current = name;
    setState(prev => ({ ...prev, playerName: name }));
    await new Promise<void>((resolve) => {
      const synth = window.speechSynthesis;
      if (!synth) { resolve(); return; }
      synth.cancel();
      const utterance = new SpeechSynthesisUtterance(`Hi ${name}! Let's start!`);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.lang = 'en-US';
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      synth.speak(utterance);
    });
    const question = generateQuestion();
    askQuestion(question, name);
  }, [askQuestion]);

  const nextQuestion = useCallback(() => {
    if (feedbackTimerRef.current) {
      clearTimeout(feedbackTimerRef.current);
      feedbackTimerRef.current = null;
    }
    recognition.reset();
    const question = generateQuestion();
    askQuestion(question, playerNameRef.current);
  }, [askQuestion, recognition]);

  const replayQuestion = useCallback(() => {
    if (state.currentQuestion && state.phase === 'listening') {
      speak(state.currentQuestion, playerNameRef.current).then(() => {
        setState(prev => ({ ...prev, phase: 'listening' }));
      });
      setState(prev => ({ ...prev, phase: 'asking' }));
    }
  }, [state.currentQuestion, state.phase, speak]);

  return {
    state,
    startQuiz,
    confirmName,
    nextQuestion,
    replayQuestion,
    handleTypedAnswer,
    recognition,
    isSpeaking,
    voicesReady,
  };
}
