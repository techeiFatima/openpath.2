/**
 * Optional "Listen" support through the browser's built-in speech synthesis.
 * Feature-detected; no network request is made and nothing happens when unsupported.
 */
export function canSpeak(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && typeof window.SpeechSynthesisUtterance === 'function';
}

export function speak(text: string): void {
  if (!canSpeak()) return;
  const utterance = new window.SpeechSynthesisUtterance(text);
  utterance.lang = 'en-GB';
  utterance.rate = 0.9;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}
