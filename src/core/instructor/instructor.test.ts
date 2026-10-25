import { describe, expect, it } from 'vitest';
import type { NumericProblem } from '../assessment/types';
import { buildGroundedPrompt, ScriptedInstructor, type InstructorContext } from './instructor';

const problem: NumericProblem = {
  id: 'p', objectiveIds: ['o'], category: 'computation', difficulty: 2, prompt: 'Find v.',
  hints: ['Hint one', 'Hint two'], solution: 'v = 7.67 km/s', kind: 'numeric', answer: { value: 7672, unit: 'm/s' },
};

const ctx = (over: Partial<InstructorContext>): InstructorContext => ({
  lessonTitle: 'L', stage: 'practice',
  objective: { id: 'o', conceptId: 'c', statement: 'S', cognitiveLevel: 'apply', prerequisiteIds: [], standardRefs: [] },
  prerequisiteMastery: [], problem, attemptsOnProblem: [], hintsGiven: 0, ...over,
});

describe('ScriptedInstructor', () => {
  const inst = new ScriptedInstructor();
  it('walks the hint ladder then reveals the solution', () => {
    expect(inst.help(ctx({ hintsGiven: 0 })).text).toBe('Hint one');
    expect(inst.help(ctx({ hintsGiven: 1 })).text).toBe('Hint two');
    const r = inst.help(ctx({ hintsGiven: 2 }));
    expect(r.grounding).toBe('solution');
    expect(r.revealsSolution).toBe(true);
  });
  it('prefers grader misconception feedback', () => {
    const r = inst.help(ctx({ lastGrade: { status: 'incorrect', confidence: 'deterministic', feedback: 'Forgot the root', misconceptionId: 'no-sqrt' } }));
    expect(r.grounding).toBe('misconception');
  });
  it('redirects to a weak prerequisite after repeated failure', () => {
    const attempts = [1, 2].map((i) => ({ id: `${i}`, problemId: 'p', objectiveIds: ['o'], category: 'computation' as const, status: 'incorrect' as const, hintsUsed: 0, usedSimulation: false, timestamp: i }));
    const r = inst.help(ctx({ attemptsOnProblem: attempts, prerequisiteMastery: [{ objectiveId: 'pre', level: 'not-started' }] }));
    expect(r.grounding).toBe('prerequisite');
  });
});

describe('buildGroundedPrompt', () => {
  it('includes the grounding rules, verdict and measurements', () => {
    const p = buildGroundedPrompt(ctx({
      lastGrade: { status: 'incorrect', confidence: 'deterministic', feedback: 'x' },
      simulation: { presetId: 'orbit', measurements: [{ id: 'v', label: 'Speed', value: 7672, unit: 'm/s', source: 'numerical' }], assumptions: ['Point masses'] },
    }));
    expect(p).toMatch(/Never compute physics/);
    expect(p).toMatch(/Grader verdict: incorrect/);
    expect(p).toMatch(/Speed=7672 m\/s/);
    expect(p).toMatch(/Point masses/);
  });
});
