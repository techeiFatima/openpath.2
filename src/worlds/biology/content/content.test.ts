import { describe, expect, it } from 'vitest';
import { grade } from '@/core/assessment/grade';
import { validateGraph } from '@/core/curriculum/graph';
import { validateLesson } from '@/core/world/spec';
import { CATALOG } from '@/worlds/catalog';
import { BIOLOGY_OBJECTIVES, BIOLOGY_PREREQUISITES, BIOLOGY_UNITS } from './curriculum';
import { BIOLOGY_LESSONS, BIOLOGY_WORLD } from './index';

/** The catalog as it will look once the integrator appends the biology slice. */
const MERGED = CATALOG; // the biology slice is merged into the catalog by the integrator
const OBJECTIVE_IDS = new Set(MERGED.objectives.map((o) => o.id));

describe('biology content integrity', () => {
  it('every lesson passes structural validation', () => {
    for (const l of BIOLOGY_LESSONS) expect(validateLesson(l), l.id).toEqual([]);
  });

  it('the world spec lists exactly the authored lessons', () => {
    expect(BIOLOGY_WORLD.id).toBe('cell');
    expect(BIOLOGY_WORLD.environment).toBe('canvas-2d');
    expect(BIOLOGY_WORLD.lessonIds).toEqual(BIOLOGY_LESSONS.map((l) => l.id));
    for (const l of BIOLOGY_LESSONS) expect(l.worldId).toBe('cell');
  });

  it('the merged curriculum graph is referentially sound and acyclic', () => {
    expect(validateGraph(MERGED)).toEqual([]);
    const existingCourses = new Set(CATALOG.courses.map((c) => c.id));
    for (const u of BIOLOGY_UNITS) expect(existingCourses.has(u.courseId), u.id).toBe(true);
    for (const o of BIOLOGY_OBJECTIVES) expect(o.id.startsWith('bio.'), o.id).toBe(true);
    for (const o of [...BIOLOGY_OBJECTIVES, ...BIOLOGY_PREREQUISITES]) for (const s of o.standardRefs) expect(s.verified, `${o.id}/${s.code}`).toBe(false);
  });

  it('lesson objectives and prerequisites exist in the merged catalog', () => {
    for (const l of BIOLOGY_LESSONS) {
      for (const id of l.objectiveIds) expect(OBJECTIVE_IDS.has(id), `${l.id}: ${id}`).toBe(true);
      for (const id of l.prerequisiteObjectiveIds) expect(OBJECTIVE_IDS.has(id), `${l.id}: ${id}`).toBe(true);
    }
  });

  it('every lesson has the required stage ingredients and problem variety', () => {
    for (const l of BIOLOGY_LESSONS) {
      const stage = (k: string) => l.stages.find((s) => s.kind === k)!;
      expect(stage('discover').blocks.some((b) => b.type === 'prediction'), `${l.id} prediction`).toBe(true);
      expect(stage('explore').blocks.some((b) => b.type === 'sim-task' && b.observe.length > 0), `${l.id} sim-task`).toBe(true);
      expect(l.stages.some((s) => s.blocks.some((b) => b.type === 'callout' && b.tone === 'assumption')), `${l.id} assumption`).toBe(true);
      expect(l.problems.length, `${l.id} problem count`).toBeGreaterThanOrEqual(6);
      const categories = new Set(l.problems.map((p) => p.category));
      expect(categories.size, `${l.id} categories`).toBeGreaterThanOrEqual(5);
      expect(l.problems.some((p) => p.category === 'error-identification'), `${l.id} error-identification`).toBe(true);
      expect(l.problems.some((p) => p.category === 'explanation'), `${l.id} explanation`).toBe(true);
      expect(stage('demonstrate').blocks.filter((b) => b.type === 'problem').length, `${l.id} demonstrate`).toBeGreaterThanOrEqual(2);
    }
  });

  it('every preset named in a lesson exists in the world UI', async () => {
    const { PRESETS } = await import('@/worlds/biology/ui/presets');
    for (const l of BIOLOGY_LESSONS) {
      for (const s of l.stages) {
        for (const p of s.presets ?? []) expect(PRESETS[p], `${l.id}/${s.kind}: ${p}`).toBeDefined();
        for (const b of s.blocks) {
          if (b.type === 'prediction') expect(PRESETS[b.revealPreset], `${l.id}/${b.id}`).toBeDefined();
          if (b.type === 'sim-task') expect(PRESETS[b.preset], `${l.id}/${s.kind}`).toBeDefined();
        }
      }
    }
  });

  it('every reference solution grades as correct when entered as the answer', () => {
    for (const l of BIOLOGY_LESSONS) {
      for (const p of l.problems) {
        if (p.kind === 'numeric') {
          const input = p.answer.unit ? `${p.answer.value} ${p.answer.unit}` : `${p.answer.value}`;
          expect(grade(p, input).status, `${l.id}/${p.id}`).toBe('correct');
        } else if (p.kind === 'expression') {
          expect(grade(p, p.answer).status, `${l.id}/${p.id}`).toBe('correct');
        } else if (p.kind === 'multiple-choice') {
          expect(grade(p, p.correctId).status, `${l.id}/${p.id}`).toBe('correct');
        } else if (p.kind === 'short-text') {
          for (const a of p.accepted) expect(grade(p, a).status, `${l.id}/${p.id}: ${a}`).toBe('correct');
        }
      }
    }
  });

  it('every misconception value is graded incorrect and attributed', () => {
    for (const l of BIOLOGY_LESSONS) {
      for (const p of l.problems) {
        if (p.kind === 'numeric') {
          for (const m of p.misconceptions ?? []) {
            const r = grade(p, p.answer.unit ? `${m.value} ${p.answer.unit}` : `${m.value}`);
            expect(r.status, `${p.id}/${m.id}`).toBe('incorrect');
            expect(r.misconceptionId, `${p.id}/${m.id}`).toBe(m.id);
          }
        }
        if (p.kind === 'short-text') {
          for (const m of p.misconceptions ?? []) {
            for (const a of m.accepted) {
              const r = grade(p, a);
              expect(r.status, `${p.id}/${m.id}: ${a}`).toBe('incorrect');
              expect(r.misconceptionId, `${p.id}/${m.id}: ${a}`).toBe(m.id);
            }
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

  it('numeric answers agree with the scale model within 1%', async () => {
    const { ordersOfMagnitude, scaleObject, sizeRatio } = await import('@/worlds/biology/model/scale');
    const byId = new Map(BIOLOGY_LESSONS.flatMap((l) => l.problems).map((p) => [p.id, p]));
    const expectNumeric = (id: string, value: number) => {
      const p = byId.get(id)!;
      if (p.kind !== 'numeric') throw new Error(id);
      expect(Math.abs(p.answer.value / value - 1), id).toBeLessThan(0.01);
    };
    expectNumeric('l1-ratio-human-rbc', sizeRatio(scaleObject('human'), scaleObject('red-blood-cell')));
    expectNumeric('l1-orders-hand-ecoli', Math.round(ordersOfMagnitude(scaleObject('hand'), scaleObject('e-coli'))));
    expectNumeric('l1-scale-bar', scaleObject('red-blood-cell').size);
    expectNumeric('l1-demo-dna-hydrogen', sizeRatio(scaleObject('dna'), scaleObject('hydrogen')));
    expectNumeric('l1-pollen-ant', scaleObject('ant').size / 30e-6);
  });

  it('sequence answers agree with the DNA model', async () => {
    const { classifyMutation, complement, gcContent, reverseComplement, transcribe, translate } = await import('@/worlds/biology/model/dna');
    const { EXAMPLE_GENE, EXAMPLE_STRAND, PRESETS } = await import('@/worlds/biology/ui/presets');
    const byId = new Map(BIOLOGY_LESSONS.flatMap((l) => l.problems).map((p) => [p.id, p]));
    const firstAccepted = (id: string) => {
      const p = byId.get(id)!;
      if (p.kind !== 'short-text') throw new Error(id);
      return p.accepted[0]!;
    };
    const numeric = (id: string) => {
      const p = byId.get(id)!;
      if (p.kind !== 'numeric') throw new Error(id);
      return p.answer.value;
    };
    // Lesson 2
    expect(firstAccepted('l2-complement-aligned')).toBe(complement(EXAMPLE_STRAND));
    expect(firstAccepted('l2-reverse-complement')).toBe(reverseComplement(EXAMPLE_STRAND));
    expect(firstAccepted('l2-demo-palindrome')).toBe(reverseComplement('GGATCC'));
    expect(numeric('l2-gc-content')).toBe(gcContent(EXAMPLE_STRAND));
    expect(numeric('l2-demo-count')).toBe((2 * 1000 - 2 * 400) / 2);
    // Lesson 3
    const mrna = transcribe(EXAMPLE_GENE);
    expect(firstAccepted('l3-transcribe')).toBe(mrna);
    expect(firstAccepted('l3-third-codon')).toBe(mrna.slice(6, 9));
    expect(firstAccepted('l3-translate')).toBe(translate(mrna).threeLetter.replace(/-Stop$/, ''));
    expect(firstAccepted('l3-new-gene')).toBe(translate(transcribe('ATGTTTGGCTGA')).threeLetter.replace(/-Stop$/, ''));
    expect(firstAccepted('l3-demo-translate')).toBe(translate('AUGAAACCCUAG').threeLetter.replace(/-Stop$/, ''));
    expect(firstAccepted('l3-new-codon')).toBe(transcribe(classifyMutation(EXAMPLE_GENE, { type: 'substitute', position: 11, base: 'A' }).mutated).slice(9, 12));
    expect(classifyMutation(EXAMPLE_GENE, { type: 'substitute', position: 11, base: 'A' }).effect).toBe('nonsense');
    expect(classifyMutation(EXAMPLE_GENE, { type: 'substitute', position: 6, base: 'T' }).effect).toBe('silent');
    expect(numeric('l3-aa-count')).toBe(300 / 3);
    expect(numeric('l3-demo-length')).toBe((153 + 1) * 3);
    // Presets describe what the model actually does
    expect(classifyMutation(EXAMPLE_GENE, PRESETS['dna:mutation']!.mutation!).effect).toBe('silent');
    expect(classifyMutation(EXAMPLE_GENE, PRESETS['dna:mutation-missense']!.mutation!).effect).toBe('missense');
    expect(classifyMutation(EXAMPLE_GENE, PRESETS['dna:mutation-nonsense']!.mutation!).effect).toBe('nonsense');
    expect(classifyMutation(EXAMPLE_GENE, PRESETS['dna:frameshift']!.mutation!).effect).toBe('frameshift');
    // Wrong-frame misconceptions really are the other frames
    expect(translate(mrna, { frame: 1 }).threeLetter).toBe('Trp-Pro-Ser-Gly');
    expect(translate('AUGUUUGGCUGA', { frame: 1 }).threeLetter).toBe('Cys-Leu-Ala');
    expect(translate('AUGAAACCCUAG', { frame: 2 }).threeLetter).toBe('Glu-Thr-Leu');
    expect(translate(transcribe(complement('ATGTTTGGCTGA'))).threeLetter).toBe('Tyr-Lys-Pro-Thr');
    expect(misconceptionAnswer('l3-transcribe', 'complemented-coding')).toBe(transcribe(complement(EXAMPLE_GENE)));
    expect(misconceptionAnswer('l3-transcribe', 'reverse-complement')).toBe(transcribe(reverseComplement(EXAMPLE_GENE)));
    function misconceptionAnswer(id: string, mid: string): string {
      const p = byId.get(id)!;
      if (p.kind !== 'short-text') throw new Error(id);
      return p.misconceptions!.find((m) => m.id === mid)!.accepted[0]!;
    }
  });
});
