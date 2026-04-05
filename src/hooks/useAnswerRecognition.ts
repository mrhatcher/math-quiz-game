import { useCallback, useEffect, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

interface UseAnswerRecognitionReturn {
  startListening: () => void;
  stopListening: () => void;
  transcript: string;
  isListening: boolean;
  isSupported: boolean;
  reset: () => void;
}

export function useAnswerRecognition(
  onResult: (transcript: string) => void
): UseAnswerRecognitionReturn {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    finalTranscript,
  } = useSpeechRecognition();

  const onResultRef = useRef(onResult);
  onResultRef.current = onResult;
  const submittedRef = useRef(false);

  useEffect(() => {
    if (finalTranscript && !submittedRef.current) {
      submittedRef.current = true;
      onResultRef.current(finalTranscript);
    }
  }, [finalTranscript]);

  const startListening = useCallback(() => {
    submittedRef.current = false;
    resetTranscript();
    SpeechRecognition.startListening({ continuous: false, language: 'en-US' });
  }, [resetTranscript]);

  const stopListening = useCallback(() => {
    SpeechRecognition.stopListening();
  }, []);

  const reset = useCallback(() => {
    submittedRef.current = false;
    resetTranscript();
  }, [resetTranscript]);

  return {
    startListening,
    stopListening,
    transcript,
    isListening: listening,
    isSupported: browserSupportsSpeechRecognition,
    reset,
  };
}
