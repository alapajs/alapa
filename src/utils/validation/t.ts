export function startsWithVowelSound(word: string): boolean {
  const trimmedWord = word.trim().toLowerCase();

  // Words that start with consonant letters but vowel sounds
  const vowelSoundExceptions = [
    "hour",
    "honest",
    "honor",
    "heir",
    "herb", // US pronunciation
  ];

  // Words that start with vowel letters but consonant sounds
  const consonantSoundExceptions = [
    "university",
    "unicorn",
    "user",
    "europe",
    "eucalyptus",
    "one",
    "ouija",
  ];

  if (vowelSoundExceptions.some((w) => trimmedWord.startsWith(w))) {
    return true;
  }

  if (consonantSoundExceptions.some((w) => trimmedWord.startsWith(w))) {
    return false;
  }

  // Default rule: starts with vowel letter = vowel sound
  return /^[aeiou]/.test(trimmedWord);
}
