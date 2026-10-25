import { describe, expect, it } from 'vitest';
import { summarizeMastery, type Attempt } from './mastery';

let n = 0;
const att = (over: Partial<Attempt>): Attempt => ({
  id: `a${n}`,
  problemId: `p${n++}`,
  objectiveIds: ['o1'],
  category: 'computation',
  status: 'correct',
  hintsUsed: 0,
  usedSimulation: false,
  timestamp: n,
  ...over,
});

describe('mastery rules', () => {
  it('starts at not-started and moves to developing after any attempt', () => {
    expect(summarizeMastery('o1', []).level).toBe('not-started');
    expect(summarizeMastery('o1', [att({ status: 'incorrect' })]).level).toBe('developing');
  });

  it('does not grant mastery for hint-driven correct answers', () => {
    const attempts = [att({ hintsUsed: 3 }), att({ hintsUsed: 2 }), att({ hintsUsed: 2, category: 'transfer' })];
    expect(summarizeMastery('o1', attempts).level).toBe('developing');
  });

  it('requires independent transfer for mastered', () => {
    const base = [att({}), att({}), att({ hintsUsed: 1 })];
    expect(summarizeMastery('o1', base).level).toBe('proficient');
    const withTransfer = [...base, att({ category: 'transfer' })];
    expect(summarizeMastery('o1', withTransfer).level).toBe('mastered');
  });

  it('solving the same problem repeatedly does not count as distinct evidence', () => {
    const attempts = [att({ problemId: 'same' }), att({ problemId: 'same' }), att({ problemId: 'same', category: 'transfer' })];
    expect(summarizeMastery('o1', attempts).level).toBe('developing');
  });

  it('a simulation-assisted solve is not independent', () => {
    const attempts = [att({}), att({ usedSimulation: true }), att({ category: 'transfer', usedSimulation: true })];
    expect(summarizeMastery('o1', attempts).level).toBe('proficient');
  });

  it('ignores low-stakes predictions and invalid submissions', () => {
    const attempts = [att({ lowStakes: true }), att({ status: 'invalid' })];
    expect(summarizeMastery('o1', attempts).level).toBe('not-started');
  });

  it('a recent wrong answer breaks the streak', () => {
    const attempts = [att({}), att({}), att({ category: 'transfer' }), att({ status: 'incorrect' })];
    expect(summarizeMastery('o1', attempts).level).toBe('developing');
  });
});
