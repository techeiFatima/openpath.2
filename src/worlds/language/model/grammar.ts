/**
 * Small deterministic grammar helpers used by scenario feedback and tests.
 *
 * These are rule-based checks over a normalised, lower-case reply. They cover a handful
 * of A1 patterns (articles before singular countable nouns, the verb "be" after "I",
 * question inversion after "How much"/"Where", plurals after a number, "please").
 * They are deliberately limited and are labelled as such in the lessons: a check that
 * does not fire is not proof that a sentence is correct.
 */

/** Singular countable nouns that need a determiner in A1 sentences. Fixed list; no inflection rules. */
export const COUNTABLE_NOUNS: readonly string[] = [
  'apple', 'banana', 'orange', 'potato', 'onion', 'egg', 'bag', 'bottle', 'kilo', 'shirt', 'book',
  'library', 'bank', 'shop', 'market', 'street', 'school', 'station', 'hospital', 'park', 'cafe',
  'neighbour', 'friend', 'brother', 'sister', 'student', 'teacher', 'house', 'flat', 'bus', 'ticket', 'pen', 'cup', 'map',
];

const PLURALS = new Map<string, string>(
  COUNTABLE_NOUNS.map((n) => [n === 'potato' ? 'potatoes' : n.endsWith('y') ? `${n.slice(0, -1)}ies` : n.endsWith('s') ? `${n}es` : `${n}s`, n]),
);

/** Words that may stand directly before a singular countable noun. */
const DETERMINERS = new Set([
  'a', 'an', 'the', 'this', 'that', 'my', 'your', 'his', 'her', 'our', 'their', 'one', 'every', 'each', 'any', 'no', 'which', 'what', 'another', 'next', 'first',
]);

export const NUMBER_WORDS: readonly string[] = [
  'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty',
];

const PLURAL_NUMBERS = new Set(NUMBER_WORDS.slice(2));

const BE_FORMS = new Set(['am', 'is', 'are']);
/** Verbs/auxiliaries that may legitimately follow "I" without "am". */
const AFTER_I_OK = new Set([
  'am', 'have', 'like', 'would', 'can', 'could', 'do', 'did', 'will', 'live', 'come', 'speak', 'want', 'need', 'think', 'know', 'work', 'study',
  'go', 'see', 'understand', 'love', 'hope', 'take', 'buy', 'play', 'eat', 'drink', 'read', 'write', 'learn', 'cannot', 'was', 'had', 'said', 'got', 'also', 'only', 'really', 'always', 'usually', 'often', 'sometimes', 'never', 'just', 'too',
]);
/** Words after "I" that strongly suggest a missing "am" (complements, not verbs). */
const NEEDS_BE_AFTER_I = new Set(['from', 'fine', 'okay', 'good', 'well', 'new', 'here', 'very', 'not', 'a', 'an', 'the', 'happy', 'sorry', 'tired', 'hungry', 'late', 'ready', 'in', 'at', 'twenty', 'eighteen', 'nineteen', 'thirty']);

const QUESTION_WORDS = ['how much', 'how many', 'where', 'what', 'who', 'when', 'how old', 'how'];
const AUXILIARIES = new Set(['is', 'are', 'am', 'do', 'does', 'can', 'could', 'was', 'were', 'did', 'will', 'would', 'have', 'has']);

export function tokens(text: string): string[] {
  return text.toLowerCase().replace(/[^a-z0-9' ]+/g, ' ').trim().split(/\s+/).filter(Boolean);
}

/**
 * Returns the first singular countable noun (from the fixed list) that has no determiner
 * directly before it, or null. "i would like apple" → "apple"; "i would like an apple" → null.
 */
export function missingArticle(text: string): string | null {
  const t = tokens(text);
  for (let i = 0; i < t.length; i++) {
    const w = t[i]!;
    if (!COUNTABLE_NOUNS.includes(w)) continue;
    const prev = t[i - 1];
    if (prev && (DETERMINERS.has(prev) || prev.endsWith("'s"))) continue;
    // "kilo of apples": the thing counted is "kilo"; "of" before a noun is fine ("kilo of rice"/"bottle of milk" are handled by the noun before "of").
    if (prev === 'of') continue;
    return w;
  }
  return null;
}

/** Returns the plural noun whose singular is on the list (used to tell plural from singular). */
export function singularOf(word: string): string | undefined {
  return PLURALS.get(word);
}

export type BeCheck = { ok: true } | { ok: false; issue: 'missing-be' | 'wrong-be-form'; found: string };

/**
 * Checks the verb "be" after the subject pronoun "I" (and the obvious agreement slips
 * "i is", "he am", "you is", "they is"). "i from kabul" → missing-be; "i is fine" → wrong-be-form.
 */
export function checkBe(text: string): BeCheck {
  const t = tokens(text);
  for (let i = 0; i < t.length - 1; i++) {
    const w = t[i]!;
    const next = t[i + 1]!;
    if (w === 'i' && (next === 'is' || next === 'are')) return { ok: false, issue: 'wrong-be-form', found: `i ${next}` };
    if ((w === 'he' || w === 'she' || w === 'it') && (next === 'am' || next === 'are')) return { ok: false, issue: 'wrong-be-form', found: `${w} ${next}` };
    if ((w === 'you' || w === 'we' || w === 'they') && (next === 'am' || next === 'is')) return { ok: false, issue: 'wrong-be-form', found: `${w} ${next}` };
    if (w === 'i' && !AFTER_I_OK.has(next) && NEEDS_BE_AFTER_I.has(next)) return { ok: false, issue: 'missing-be', found: `i ${next}` };
  }
  return { ok: true };
}

/** Convenience: does the text use "I am" or "I'm"? */
export function usesIAm(text: string): boolean {
  return /\bi am\b|\bi'm\b/i.test(text);
}

export type InversionCheck = { ok: true } | { ok: false; issue: 'missing-verb' | 'not-inverted'; questionWord: string };

/**
 * For a direct question starting with a question word, the auxiliary/be must come straight
 * after it: "how much are the apples" ✓, "how much the apples cost" ✗ (not-inverted),
 * "how much apples" ✗ (missing-verb). Embedded questions ("do you know where the library is")
 * are correct English but are reported as not-inverted; callers only use this on failed replies.
 */
export function checkQuestionInversion(text: string): InversionCheck {
  const t = tokens(text);
  const joined = t.join(' ');
  for (const q of QUESTION_WORDS) {
    const idx = joined.indexOf(q);
    if (idx < 0) continue;
    const start = joined.slice(0, idx).split(' ').filter(Boolean).length;
    const qLen = q.split(' ').length;
    const next = t[start + qLen];
    if (!next) return { ok: false, issue: 'missing-verb', questionWord: q };
    if (AUXILIARIES.has(next)) return { ok: true };
    const laterAux = t.slice(start + qLen + 1).some((w) => AUXILIARIES.has(w));
    return { ok: false, issue: laterAux ? 'not-inverted' : 'missing-verb', questionWord: q };
  }
  return { ok: true };
}

/**
 * "two kilo", "six egg", "3 apple" → the singular noun that should be plural, else null.
 */
export function missingPluralAfterNumber(text: string): string | null {
  const t = tokens(text);
  for (let i = 0; i < t.length - 1; i++) {
    const w = t[i]!;
    const next = t[i + 1]!;
    const isPluralNumber = PLURAL_NUMBERS.has(w) || (/^\d+$/.test(w) && Number(w) >= 2);
    if (isPluralNumber && COUNTABLE_NOUNS.includes(next)) return next;
  }
  return null;
}

/** True when the reply contains a politeness marker. */
export function hasPoliteness(text: string): boolean {
  const joined = ` ${tokens(text).join(' ')} `;
  return joined.includes(' please ') || joined.includes(' thank you ') || joined.includes(' thanks ');
}

export function usesBeForm(text: string): boolean {
  return tokens(text).some((w) => BE_FORMS.has(w));
}

/** Convert a small integer written as digits (0–20) to its word; other tokens unchanged. */
export function digitsToWords(text: string): string {
  return text.replace(/\b(\d{1,2})\b/g, (m) => {
    const n = Number(m);
    return n >= 0 && n <= 20 ? NUMBER_WORDS[n]! : m;
  });
}

export type GrammarRule = 'missing-article' | 'missing-be' | 'wrong-be-form' | 'question-inversion' | 'plural-after-number' | 'missing-please';

/**
 * Runs one named rule over a reply. Returns the offending fragment when the rule fires,
 * otherwise null. Used by the scenario engine's feedback table.
 */
export function runRule(rule: GrammarRule, text: string): string | null {
  switch (rule) {
    case 'missing-article': return missingArticle(text);
    case 'missing-be': { const r = checkBe(text); return !r.ok && r.issue === 'missing-be' ? r.found : null; }
    case 'wrong-be-form': { const r = checkBe(text); return !r.ok && r.issue === 'wrong-be-form' ? r.found : null; }
    case 'question-inversion': { const r = checkQuestionInversion(text); return r.ok ? null : r.questionWord; }
    case 'plural-after-number': return missingPluralAfterNumber(text);
    case 'missing-please': return hasPoliteness(text) ? null : 'please';
  }
}
