import { describe, expect, it } from 'vitest';
import { grade } from '@/core/assessment/grade';
import { validateLesson } from '@/core/world/spec';
import { Polynomial } from '../model/polynomial';
import { riemannSum, secantSlope } from '../model/functions';
import { MATH_LESSONS } from './index';

describe('math content integrity', () => {
  it('every lesson passes structural validation', () => {
    for (const l of MATH_LESSONS) expect(validateLesson(l), l.id).toEqual([]);
  });

  it('every reference answer grades correct and every misconception is attributed', () => {
    for (const l of MATH_LESSONS) {
      for (const p of l.problems) {
        if (p.kind === 'numeric') {
          expect(grade(p, p.answer.unit ? `${p.answer.value} ${p.answer.unit}` : `${p.answer.value}`).status, `${l.id}/${p.id}`).toBe('correct');
          for (const m of p.misconceptions ?? []) {
            const r = grade(p, p.answer.unit ? `${m.value} ${p.answer.unit}` : `${m.value}`);
            expect(r.status, `${p.id}/${m.id}`).toBe('incorrect');
            expect(r.misconceptionId, `${p.id}/${m.id}`).toBe(m.id);
          }
        } else if (p.kind === 'expression') {
          expect(grade(p, p.answer).status, `${l.id}/${p.id}`).toBe('correct');
          for (const m of p.misconceptions ?? []) {
            const r = grade(p, m.expression);
            expect(r.status, `${p.id}/${m.id}`).toBe('incorrect');
            expect(r.misconceptionId, `${p.id}/${m.id}`).toBe(m.id);
          }
        } else if (p.kind === 'multiple-choice') {
          expect(grade(p, p.correctId).status, `${l.id}/${p.id}`).toBe('correct');
        }
      }
    }
  });

  it('numeric answers agree with the model', () => {
    const byId = new Map(MATH_LESSONS.flatMap((l) => l.problems).map((p) => [p.id, p]));
    const num = (id: string) => { const p = byId.get(id)!; if (p.kind !== 'numeric') throw new Error(id); return p.answer.value; };
    const sq = Polynomial.of(0, 0, 1);
    expect(num('l3-secant')).toBeCloseTo(secantSlope((x) => x * x, 3, 0.5), 9);
    expect(num('l3-cube-at-2')).toBe(Polynomial.of(0, 0, 0, 1).derivative().evaluate(2));
    expect(num('l2-vertex-x')).toBe(Polynomial.of(5, -6, 1).vertex()!.x);
    expect(num('l2-ball-height')).toBe(Polynomial.of(1, 20, -5).vertex()!.y);
    expect(num('l4-left-sum')).toBeCloseTo(riemannSum((x) => x * x, 0, 3, 3, 'left').sum, 9);
    expect(num('l4-exact')).toBeCloseTo(sq.integrate(0, 3), 9);
    expect(num('l4-linear-integral')).toBeCloseTo(Polynomial.of(1, 2).integrate(1, 2), 9);
    expect(num('l4-demo-cubic')).toBeCloseTo(Polynomial.of(0, 0, 0, 1).integrate(0, 2), 9);
    expect(num('l4-demo-midpoint')).toBeCloseTo(riemannSum((x) => x * x, 0, 2, 2, 'midpoint').sum, 9);
    expect(num('l4-distance')).toBeCloseTo(Polynomial.of(0, 0, 3).integrate(0, 2), 9);
  });
});
