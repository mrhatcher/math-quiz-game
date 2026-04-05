import { useCallback, useEffect, useRef, useState } from 'react';
import type { Question } from '../types/quiz';
import { numberToSpoken } from '../utils/numberWords';

function questionToText(q: Question, playerName?: string): string {
  const a = numberToSpoken(q.a);
  const op = q.operator === '+' ? 'plus' : 'minus';
  const b = numberToSpoken(q.b);
  const suffix = playerName ? `, ${playerName}` : '';
  return `What is ${a} ${op} ${b}${suffix}?`;
}

export function useSpeakQuestion() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voicesReady, setVoicesReady] = useState(false);
  const resolveRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const synth = window.speechSynthesis;
    if (!synth) return;

    const loadVoices = () => {
      const voices = synth.getVoices();
      if (voices.length > 0) setVoicesReady(true);
    };

    loadVoices();
    synth.addEventListener('voiceschanged', loadVoices);
    return () => synth.removeEventListener('voiceschanged', loadVoices);
  }, []);

  const speak = useCallback((question: Question, playerName?: string): Promise<void> => {
    return new Promise((resolve) => {
      const synth = window.speechSynthesis;
      if (!synth) { resolve(); return; }

      // Cancel any ongoing speech
      synth.cancel();

      const text = questionToText(question, playerName);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      utterance.pitch = 1.1;
      utterance.lang = 'en-US';

      // Pick an English voice
      const voices = synth.getVoices();
      const englishVoice = voices.find(v => v.lang.startsWith('en') && v.localService);
      if (englishVoice) utterance.voice = englishVoice;

      resolveRef.current = resolve;
      setIsSpeaking(true);

      utterance.onend = () => {
        setIsSpeaking(false);
        resolveRef.current?.();
        resolveRef.current = null;
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        resolveRef.current?.();
        resolveRef.current = null;
      };

      synth.speak(utterance);
    });
  }, []);

  const speakText = useCallback((text: string): void => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.lang = 'en-US';
    const voices = synth.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith('en') && v.localService);
    if (englishVoice) utterance.voice = englishVoice;
    synth.speak(utterance);
  }, []);

  return { speak, speakText, isSpeaking, voicesReady };
}
