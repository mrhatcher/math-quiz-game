import { getWordToNumberMap } from './numberWords';

export function parseAnswer(transcript: string): number | null {
  if (!transcript || !transcript.trim()) return null;

  const text = transcript.toLowerCase().trim();
  const found: { index: number; value: number }[] = [];

  // Find digit sequences
  const digitRegex = /\d+/g;
  let match: RegExpExecArray | null;
  while ((match = digitRegex.exec(text)) !== null) {
    found.push({ index: match.index, value: parseInt(match[0], 10) });
  }

  // Find word numbers (including homophones)
  const wordMap = getWordToNumberMap();
  for (const [word, value] of Object.entries(wordMap)) {
    const wordRegex = new RegExp(`\\b${word}\\b`, 'gi');
    while ((match = wordRegex.exec(text)) !== null) {
      found.push({ index: match.index, value });
    }
  }

  if (found.length === 0) return null;

  // Take the last number found (child repeats question, answer is last)
  found.sort((a, b) => a.index - b.index);
  return found[found.length - 1].value;
}

export function checkAnswer(parsed: number | null, correct: number): boolean {
  return parsed !== null && parsed === correct;
}
