import { describe, expect, it } from 'vitest';
import { ALL_VOCABULARY, findVocabulary, GLOSS_REVIEW_LABEL, VOCABULARY } from './vocabulary';
import { SCENARIOS } from './scenarios';

describe('vocabulary', () => {
  it('has at most 60 items with unique words and an example each', () => {
    expect(ALL_VOCABULARY.length).toBeLessThanOrEqual(60);
    expect(new Set(ALL_VOCABULARY.map((v) => v.word.toLowerCase())).size).toBe(ALL_VOCABULARY.length);
    for (const v of ALL_VOCABULARY) expect(v.example.trim().length, v.word).toBeGreaterThan(3);
  });
  it('carries at most 40 Dari glosses, every one unreviewed', () => {
    const glossed = ALL_VOCABULARY.filter((v) => v.gloss);
    expect(glossed.length).toBeLessThanOrEqual(40);
    expect(glossed.length).toBeGreaterThan(0);
    for (const v of ALL_VOCABULARY) expect(v.glossReviewed).toBe(false);
    for (const v of glossed) expect(v.gloss, v.word).toMatch(/\(.+\)/); // script plus romanisation
    expect(GLOSS_REVIEW_LABEL).toMatch(/awaiting native-speaker review/);
  });
  it('every vocabulary item referenced by a scenario turn exists in the phrasebook', () => {
    for (const sc of SCENARIOS) for (const t of sc.turns) for (const w of t.vocabulary) expect(findVocabulary(w), `${sc.id}/${t.id}: ${w}`).toBeDefined();
  });
  it('groups exist for each lesson', () => {
    expect(Object.keys(VOCABULARY).sort()).toEqual(['library', 'market', 'neighbour']);
  });
});
