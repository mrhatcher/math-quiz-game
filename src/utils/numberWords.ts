const wordToNumber: Record<string, number> = {
  zero: 0, oh: 0,
  one: 1, won: 1,
  two: 2, to: 2, too: 2,
  three: 3, tree: 3,
  four: 4, for: 4,
  five: 5,
  six: 6, sicks: 6,
  seven: 7,
  eight: 8, ate: 8,
  nine: 9,
  ten: 10, tin: 10,
  eleven: 11,
  twelve: 12,
  thirteen: 13,
  fourteen: 14,
  fifteen: 15,
  sixteen: 16,
  seventeen: 17,
  eighteen: 18,
  nineteen: 19,
  twenty: 20,
};

export function getWordToNumberMap(): Record<string, number> {
  return wordToNumber;
}

export function numberToSpoken(n: number): string {
  const spoken = Object.entries(wordToNumber).find(
    ([key, val]) => val === n && !['oh', 'won', 'to', 'too', 'tree', 'for', 'sicks', 'ate', 'tin'].includes(key)
  );
  return spoken ? spoken[0] : String(n);
}
