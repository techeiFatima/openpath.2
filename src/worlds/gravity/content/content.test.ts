import { describe, expect, it } from 'vitest';
import { grade } from '@/core/assessment/grade';
import { validateGraph } from '@/core/curriculum/graph';
import { validateLesson } from '@/core/world/spec';
import { CATALOG } from '@/worlds/catalog';
import { GRAVITY_LESSONS } from './index';

describe('gravity content integrity', () => {
  it('every lesson passes structural validation', () => {
    for (const l of GRAVITY_LESSONS) expect(validateLesson(l), l.id).toEqual([]);
  });

  it('the catalog graph is referentially sound and acyclic', () => {
    expect(validateGraph(CATALOG)).toEqual([]);
  });

  it('every reference solution grades as correct when entered as the answer', () => {
    for (const l of GRAVITY_LESSONS) {
      for (const p of l.problems) {
        if (p.kind === 'numeric') {
          const input = p.answer.unit ? `${p.answer.value} ${p.answer.unit}` : `${p.answer.value}`;
          expect(grade(p, input).status, `${l.id}/${p.id}`).toBe('correct');
        } else if (p.kind === 'expression') {
          expect(grade(p, p.answer).status, `${l.id}/${p.id}`).toBe('correct');
        } else if (p.kind === 'multiple-choice') {
          expect(grade(p, p.correctId).status, `${l.id}/${p.id}`).toBe('correct');
        }
      }
    }
  });

  it('every misconception value is graded incorrect and attributed', () => {
    for (const l of GRAVITY_LESSONS) {
      for (const p of l.problems) {
        if (p.kind === 'numeric') {
          for (const m of p.misconceptions ?? []) {
            const r = grade(p, p.answer.unit ? `${m.value} ${p.answer.unit}` : `${m.value}`);
            expect(r.status, `${p.id}/${m.id}`).toBe('incorrect');
            expect(r.misconceptionId, `${p.id}/${m.id}`).toBe(m.id);
          }
        }
        if (p.kind === 'expression') {
          for (const m of p.misconceptions ?? []) {
            const r = grade(p, m.expression);
            expect(r.status, `${p.id}/${m.id}`).toBe('incorrect');
            expect(r.misconceptionId, `${p.id}/${m.id}`).toBe(m.id);
          }
        }
      }
    }
  });

  it('numeric answers in lessons agree with the physics model within 1%', async () => {
    const { BODIES, mu } = await import('@/worlds/gravity/model/bodies');
    const { circularSpeed, escapeSpeed, orbitalPeriod, gravitationalAcceleration, specificEnergy } = await import('@/worlds/gravity/model/analytic');
    const earth = BODIES.earth!;
    const r = earth.radius + 400e3;
    const byId = new Map(GRAVITY_LESSONS.flatMap((l) => l.problems).map((p) => [p.id, p]));
    const expectNumeric = (id: string, value: number) => {
      const p = byId.get(id)!;
      if (p.kind !== 'numeric') throw new Error(id);
      expect(Math.abs(p.answer.value / value - 1), id).toBeLessThan(0.01);
    };
    expectNumeric('l1-g-at-iss', gravitationalAcceleration(mu(earth), r));
    expectNumeric('l1-iss-speed', circularSpeed(mu(earth), r));
    expectNumeric('l1-iss-period', orbitalPeriod(mu(earth), r));
    expectNumeric('l1-demo-geo-speed', circularSpeed(mu(earth), 4.22e7));
    expectNumeric('l3-earth-vesc', escapeSpeed(mu(earth), earth.radius));
    expectNumeric('l3-moon-vesc', escapeSpeed(mu(BODIES.moon!), BODIES.moon!.radius));
    expectNumeric('l3-demo-energy', specificEnergy(mu(earth), r, circularSpeed(mu(earth), r)));
    expectNumeric('l2-weigh-sun', BODIES.sun!.mass);
    expectNumeric('l2-jupiter-mass', BODIES.jupiter!.mass);
    expectNumeric('l2-mars-year', BODIES.mars!.period!);
  });
});
