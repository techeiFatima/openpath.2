import { describe, expect, it } from 'vitest';
import { grade, gradeExpression, gradeNumeric } from './grade';
import type { ExpressionProblem, NumericProblem, WrittenProblem } from './types';
import { parseQuantity } from './units';

const base = { objectiveIds: ['o'], category: 'computation' as const, difficulty: 2 as const, prompt: '', hints: [], solution: '' };

const issSpeed: NumericProblem = {
  ...base,
  id: 'iss',
  kind: 'numeric',
  answer: { value: 7672, unit: 'm/s', relTol: 0.01 },
  misconceptions: [
    { id: 'no-sqrt', value: 5.887e7, feedback: 'Forgot the square root.' },
    { id: 'escape', value: 10850, feedback: 'That is escape speed, not orbital speed.' },
  ],
};

describe('parseQuantity', () => {
  it('reads plain, comma, scientific and ×10^ notations', () => {
    expect(parseQuantity('7672')).toEqual({ value: 7672 });
    expect(parseQuantity('7,672 m/s')).toEqual({ value: 7672, unit: 'm/s' });
    expect(parseQuantity('3.986e14 m^3/s^2')).toEqual({ value: 3.986e14, unit: 'm^3/s^2' });
    expect(parseQuantity('3.986 × 10^14')).toEqual({ value: 3.986e14 });
    expect(parseQuantity('3.986 x 10^(14) km')).toEqual({ value: 3.986e14, unit: 'km' });
    expect(parseQuantity('-2.5 km/s')).toEqual({ value: -2.5, unit: 'km/s' });
    expect(parseQuantity('abc')).toBeNull();
    expect(parseQuantity('')).toBeNull();
  });
});

describe('gradeNumeric', () => {
  it('accepts equivalent units and bare numbers in the expected unit', () => {
    expect(gradeNumeric(issSpeed, '7.67 km/s').status).toBe('correct');
    expect(gradeNumeric(issSpeed, '7672 m/s').status).toBe('correct');
    expect(gradeNumeric(issSpeed, '7700').status).toBe('correct');
    expect(gradeNumeric(issSpeed, '27600 km/h').status).toBe('correct');
  });
  it('rejects wrong magnitude and explains dimension mismatches', () => {
    expect(gradeNumeric(issSpeed, '9000 m/s').status).toBe('incorrect');
    const r = gradeNumeric(issSpeed, '7672 m');
    expect(r.status).toBe('incorrect');
    expect(r.feedback).toMatch(/units of length/);
  });
  it('names known misconceptions', () => {
    expect(gradeNumeric(issSpeed, '5.887e7').misconceptionId).toBe('no-sqrt');
    expect(gradeNumeric(issSpeed, '10.85 km/s').misconceptionId).toBe('escape');
  });
  it('spots factor-of-ten unit slips', () => {
    const r = gradeNumeric(issSpeed, '7.672 m/s');
    expect(r.status).toBe('incorrect');
    expect(r.feedback).toMatch(/10\^-3/);
  });
  it('flags unparseable and unknown units as invalid', () => {
    expect(gradeNumeric(issSpeed, 'fast').status).toBe('invalid');
    expect(gradeNumeric(issSpeed, '7 furlongs').status).toBe('invalid');
  });
  it('uses absolute tolerance when provided', () => {
    const p: NumericProblem = { ...base, id: 'e', kind: 'numeric', answer: { value: 0, absTol: 0.05 } };
    expect(gradeNumeric(p, '0.04').status).toBe('correct');
    expect(gradeNumeric(p, '0.2').status).toBe('incorrect');
  });
});

const vOrbit: ExpressionProblem = {
  ...base,
  id: 'v',
  kind: 'expression',
  answer: 'sqrt(G*M/r)',
  variables: [
    { name: 'G', min: 1e-11, max: 1e-10 },
    { name: 'M', min: 1e22, max: 1e31 },
    { name: 'r', min: 1e6, max: 1e13 },
  ],
  misconceptions: [
    { id: 'no-sqrt', expression: 'G*M/r', feedback: 'Take the square root.' },
    { id: 'escape', expression: 'sqrt(2*G*M/r)', feedback: 'That is escape speed.' },
  ],
};

describe('gradeExpression', () => {
  it('accepts algebraically equivalent forms', () => {
    for (const s of ['sqrt(GM/r)', '(G M / r)^(1/2)', '(G*M)^0.5 / sqrt(r)', '√(GM/r)', 'sqrt(G)*sqrt(M)/sqrt(r)']) {
      expect(gradeExpression(vOrbit, s).status, s).toBe('correct');
    }
  });
  it('rejects wrong forms and names misconceptions', () => {
    expect(gradeExpression(vOrbit, 'G*M/r').misconceptionId).toBe('no-sqrt');
    expect(gradeExpression(vOrbit, 'sqrt(2GM/r)').misconceptionId).toBe('escape');
    expect(gradeExpression(vOrbit, 'G*M/r^2').status).toBe('incorrect');
  });
  it('reports unreadable input as invalid, not incorrect', () => {
    expect(gradeExpression(vOrbit, 'sqrt(GM/').status).toBe('invalid');
    expect(gradeExpression(vOrbit, 'sqrt(GM/q)').status).toBe('invalid');
    expect(gradeExpression(vOrbit, '').status).toBe('invalid');
  });
  it('handles unary minus, precedence and right-assoc powers', () => {
    const p: ExpressionProblem = { ...base, id: 'p', kind: 'expression', answer: '-x^2 + 2^3^2', variables: [{ name: 'x', min: -5, max: 5 }] };
    expect(gradeExpression(p, '512 - x*x').status).toBe('correct');
    expect(gradeExpression(p, '(-x)^2 + 512').status).toBe('incorrect');
  });
});

describe('written problems', () => {
  it('are never marked correct automatically', () => {
    const p: WrittenProblem = { ...base, id: 'w', kind: 'written', category: 'explanation', modelAnswer: 'x', rubric: ['a'] };
    const r = grade(p, 'The satellite keeps falling toward Earth but its sideways speed carries it past the horizon.');
    expect(r.status).toBe('ungraded');
    expect(r.confidence).toBe('none');
  });
});
