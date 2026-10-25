import { normalizeText } from '@/core/assessment/grade';

/**
 * The short-text grader compares answers after `normalizeText`, which keeps internal
 * punctuation and apostrophes. Learners type "I'm" or "I am", "Yes, please" or "Yes please",
 * so every accepted phrase is expanded into its natural variants here. Pure and deterministic.
 */
const PAIRS: [string, string][] = [
  ["I'm", 'I am'],
  ["I'd", 'I would'],
  ["it's", 'it is'],
  ["that's", 'that is'],
  ["where's", 'where is'],
  ["he's", 'he is'],
  ["she's", 'she is'],
  ["don't", 'do not'],
  ["can't", 'cannot'],
];

function swap(phrase: string, from: string, to: string): string {
  const re = new RegExp(`\\b${from.replace(/'/g, "'")}\\b`, 'gi');
  return phrase.replace(re, (m) => (m[0] === m[0]?.toUpperCase() ? to[0]!.toUpperCase() + to.slice(1) : to[0]!.toLowerCase() + to.slice(1)));
}

export function accept(...phrases: string[]): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  const push = (p: string) => {
    const key = normalizeText(p);
    if (!key || seen.has(key)) return;
    seen.add(key);
    out.push(p);
  };
  for (const p of phrases) {
    const forms = new Set<string>([p]);
    for (const [short, long] of PAIRS) {
      for (const f of [...forms]) {
        forms.add(swap(f, short, long));
        forms.add(swap(f, long, short));
      }
    }
    for (const f of [...forms]) forms.add(f.replace(/,/g, ''));
    for (const f of forms) push(f);
  }
  return out;
}
