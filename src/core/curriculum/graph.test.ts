import { describe, expect, it } from 'vitest';
import { findCycle, missingPrerequisites, topologicalOrder, transitivePrerequisites, validateGraph } from './graph';
import type { CurriculumGraph, LearningObjective } from './types';

const obj = (id: string, prereqs: string[] = []): LearningObjective => ({
  id,
  conceptId: 'c1',
  statement: id,
  cognitiveLevel: 'apply',
  prerequisiteIds: prereqs,
  standardRefs: [],
});

describe('prerequisite graph', () => {
  it('orders prerequisites before dependents', () => {
    const order = topologicalOrder([obj('c', ['b']), obj('b', ['a']), obj('a')]);
    expect(order.indexOf('a')).toBeLessThan(order.indexOf('b'));
    expect(order.indexOf('b')).toBeLessThan(order.indexOf('c'));
  });

  it('detects cycles', () => {
    expect(findCycle([obj('a', ['b']), obj('b', ['a'])])).not.toBeNull();
    expect(findCycle([obj('a'), obj('b', ['a'])])).toBeNull();
    expect(() => topologicalOrder([obj('a', ['b']), obj('b', ['a'])])).toThrow();
  });

  it('computes transitive prerequisites', () => {
    const set = transitivePrerequisites('c', [obj('c', ['b']), obj('b', ['a']), obj('a'), obj('z')]);
    expect([...set].sort()).toEqual(['a', 'b']);
  });

  it('lists unmastered direct prerequisites', () => {
    const objectives = [obj('c', ['a', 'b']), obj('b'), obj('a')];
    expect(missingPrerequisites('c', objectives, (id) => id === 'a')).toEqual(['b']);
  });

  it('validates referential integrity', () => {
    const g: CurriculumGraph = {
      subjects: [{ id: 'physics', name: 'Physics', tagline: '' }],
      levels: [{ id: 'l', subjectId: 'physics', name: 'HS', kind: 'grade-band', order: 1 }],
      courses: [{ id: 'co', levelId: 'l', name: 'x', description: '' }],
      units: [{ id: 'u', courseId: 'co', name: 'x' }],
      topics: [{ id: 't', unitId: 'u', name: 'x' }],
      concepts: [{ id: 'c1', topicId: 't', name: 'x', summary: '' }],
      objectives: [obj('a'), obj('b', ['missing'])],
      coverage: [{ objectiveId: 'nope', planned: true, authored: false, implemented: false, scientificallyReviewed: false, learnerTested: false }],
    };
    const problems = validateGraph(g);
    expect(problems.some((p) => p.includes('missing prerequisite missing'))).toBe(true);
    expect(problems.some((p) => p.includes('missing objective nope'))).toBe(true);
  });
});
