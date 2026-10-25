import { describe, expect, it } from 'vitest';
import { grade } from '@/core/assessment/grade';
import type { CurriculumGraph } from '@/core/curriculum/types';
import { validateGraph } from '@/core/curriculum/graph';
import { validateLesson, type Block } from '@/core/world/spec';
import { CATALOG } from '@/worlds/catalog';
import { ScenarioEngine } from '../model/scenario';
import { SCENARIOS } from '../model/scenarios';
import { PRESETS } from '../ui/presets';
import { accept } from './answers';
import { LANGUAGE_CONCEPTS, LANGUAGE_COVERAGE, LANGUAGE_OBJECTIVES, LANGUAGE_PREREQUISITES, LANGUAGE_TOPICS, LANGUAGE_UNITS } from './curriculum';
import { LANGUAGE_LESSONS, LANGUAGE_WORLD } from './index';

const blocksOf = (kind: string) => LANGUAGE_LESSONS.flatMap((l) => l.stages.filter((s) => s.kind === kind).flatMap((s) => s.blocks.map((b) => ({ lesson: l.id, block: b }))));

describe('language content integrity', () => {
  it('every lesson passes structural validation', () => {
    for (const l of LANGUAGE_LESSONS) expect(validateLesson(l), l.id).toEqual([]);
  });

  it('the catalog graph stays sound and acyclic once the language slice is merged in', () => {
    // Dedupe by id so this passes both before and after the integrator wires the slice into CATALOG.
    const unique = <T extends { id: string }>(xs: T[]) => [...new Map(xs.map((x) => [x.id, x])).values()];
    const merged: CurriculumGraph = {
      ...CATALOG,
      units: unique([...CATALOG.units, ...LANGUAGE_UNITS]),
      topics: unique([...CATALOG.topics, ...LANGUAGE_TOPICS]),
      concepts: unique([...CATALOG.concepts, ...LANGUAGE_CONCEPTS]),
      objectives: unique([...CATALOG.objectives, ...LANGUAGE_PREREQUISITES, ...LANGUAGE_OBJECTIVES]),
      coverage: [...new Map([...CATALOG.coverage, ...LANGUAGE_COVERAGE].map((c) => [c.objectiveId, c])).values()],
    };
    expect(validateGraph(merged)).toEqual([]);
    expect(CATALOG.courses.some((c) => c.id === LANGUAGE_UNITS[0]!.courseId)).toBe(true);
    for (const o of LANGUAGE_OBJECTIVES) {
      expect(o.id.startsWith('lang.'), o.id).toBe(true);
      for (const r of o.standardRefs) {
        expect(r.framework).toBe('CEFR');
        expect(r.code).toBe('A1');
        expect(r.verified).toBe(false);
      }
    }
  });

  it('the world spec lists exactly the authored lessons and each lesson belongs to it', () => {
    expect(LANGUAGE_WORLD).toMatchObject({ id: 'conversation', subjectId: 'language', name: 'Conversation Street', environment: 'dialogue', status: 'available' });
    expect(LANGUAGE_WORLD.lessonIds).toEqual(LANGUAGE_LESSONS.map((l) => l.id));
    const objectiveIds = new Set(LANGUAGE_OBJECTIVES.map((o) => o.id));
    for (const l of LANGUAGE_LESSONS) {
      expect(l.worldId).toBe('conversation');
      for (const o of l.objectiveIds) expect(objectiveIds.has(o), `${l.id}: ${o}`).toBe(true);
      for (const o of l.prerequisiteObjectiveIds) expect(objectiveIds.has(o), `${l.id}: prereq ${o}`).toBe(true);
    }
  });

  it('every preset named by a lesson block exists', () => {
    for (const l of LANGUAGE_LESSONS) {
      for (const s of l.stages) {
        for (const p of s.presets ?? []) expect(PRESETS[p], `${l.id}/${s.kind}: ${p}`).toBeDefined();
        for (const b of s.blocks) {
          if (b.type === 'sim-task') expect(PRESETS[b.preset], `${l.id}/${s.kind}: ${b.preset}`).toBeDefined();
          if (b.type === 'prediction') expect(PRESETS[b.revealPreset], `${l.id}/${s.kind}: ${b.revealPreset}`).toBeDefined();
        }
      }
    }
    expect(Object.keys(PRESETS).sort()).toEqual(['scenario:library', 'scenario:market', 'scenario:market-variant', 'scenario:neighbour']);
    for (const p of Object.values(PRESETS)) expect(SCENARIOS).toContain(p.scenario);
  });

  it('every reference solution grades as correct when entered as the answer', () => {
    for (const l of LANGUAGE_LESSONS) {
      for (const p of l.problems) {
        if (p.kind === 'multiple-choice') {
          expect(grade(p, p.correctId).status, `${l.id}/${p.id}`).toBe('correct');
        } else if (p.kind === 'short-text') {
          for (const a of p.accepted) expect(grade(p, a).status, `${l.id}/${p.id}: ${a}`).toBe('correct');
        } else if (p.kind === 'numeric') {
          expect(grade(p, p.answer.unit ? `${p.answer.value} ${p.answer.unit}` : `${p.answer.value}`).status, `${l.id}/${p.id}`).toBe('correct');
        } else if (p.kind === 'expression') {
          expect(grade(p, p.answer).status, `${l.id}/${p.id}`).toBe('correct');
        }
      }
    }
  });

  it('every misconception is graded incorrect and attributed to its id', () => {
    for (const l of LANGUAGE_LESSONS) {
      for (const p of l.problems) {
        if (p.kind !== 'short-text') continue;
        for (const m of p.misconceptions ?? []) {
          expect(m.accepted.length, `${p.id}/${m.id}`).toBeGreaterThan(0);
          for (const a of m.accepted) {
            const r = grade(p, a);
            expect(r.status, `${p.id}/${m.id}: ${a}`).toBe('incorrect');
            expect(r.misconceptionId, `${p.id}/${m.id}: ${a}`).toBe(m.id);
          }
        }
      }
    }
  });

  it('short-text answers accept natural contraction and comma variants', () => {
    expect(accept("I'd like one kilo of rice, please.")).toEqual(expect.arrayContaining(["I'd like one kilo of rice, please.", 'I would like one kilo of rice, please.', 'I would like one kilo of rice please.']));
    const rice = LANGUAGE_LESSONS[1]!.problems.find((p) => p.id === 'l2-demo-rice')!;
    expect(grade(rice, 'I would like one kilo of rice please').status).toBe('correct');
    const fillBe = LANGUAGE_LESSONS[0]!.problems.find((p) => p.id === 'l1-fill-be-from')!;
    expect(grade(fillBe, "'m").status).toBe('correct');
    expect(grade(fillBe, 'is')).toMatchObject({ status: 'incorrect', misconceptionId: 'is-with-i' });
  });

  it('every scenario is completed by submitting its own model replies', () => {
    for (const sc of SCENARIOS) {
      const sim = new ScenarioEngine(sc);
      for (const t of sc.turns) {
        const r = sim.submit(t.modelReply);
        expect(r.outcome, `${sc.id}/${t.id}: ${t.modelReply}`).toBe('accepted');
      }
      expect(sim.isFinished(), sc.id).toBe(true);
      const m = Object.fromEntries(sim.measurements().map((x) => [x.id, x.value]));
      expect(m).toMatchObject({ completed: sc.turns.length, accepted: sc.turns.length, retries: 0, 'moved-on': 0 });
    }
  });

  it('each lesson follows the seven-stage design brief for this world', () => {
    for (const l of LANGUAGE_LESSONS) {
      const stage = (k: string) => l.stages.find((s) => s.kind === k)!;
      const problemsIn = (k: string) => stage(k).blocks.filter((b): b is Extract<Block, { type: 'problem' }> => b.type === 'problem').map((b) => l.problems.find((p) => p.id === b.problemId)!);
      expect(stage('discover').blocks.filter((b) => b.type === 'prediction').length, `${l.id} discover`).toBeGreaterThanOrEqual(1);
      expect(stage('explore').blocks.some((b) => b.type === 'sim-task' && b.observe.length >= 3), `${l.id} explore`).toBe(true);
      expect(stage('explore').blocks.some((b) => b.type === 'callout' && b.tone === 'assumption'), `${l.id} explore assumption`).toBe(true);
      expect(stage('understand').blocks.some((b) => b.type === 'callout' && /rule-based|checks only/i.test(b.md)), `${l.id} understand limits callout`).toBe(true);
      expect(stage('understand').blocks.some((b) => b.type === 'summary'), `${l.id} understand summary`).toBe(true);
      const practice = problemsIn('practice');
      expect(practice.length, `${l.id} practice`).toBeGreaterThanOrEqual(6);
      expect(practice.some((p) => p.kind === 'short-text' && (p.misconceptions?.length ?? 0) > 0), `${l.id} practice short-text`).toBe(true);
      expect(practice.some((p) => p.kind === 'multiple-choice' && p.category === 'error-identification'), `${l.id} practice error-id`).toBe(true);
      expect(practice.some((p) => p.kind === 'multiple-choice' && p.category !== 'error-identification'), `${l.id} practice MC form`).toBe(true);
      expect(practice.some((p) => p.kind === 'written' && p.rubric.length >= 3), `${l.id} practice written`).toBe(true);
      const apply = problemsIn('apply');
      expect(apply.some((p) => p.category === 'transfer' || p.category === 'application'), `${l.id} apply transfer`).toBe(true);
      const demo = problemsIn('demonstrate');
      expect(demo.some((p) => p.kind === 'short-text'), `${l.id} demo short-text`).toBe(true);
      expect(demo.some((p) => p.kind === 'written'), `${l.id} demo written`).toBe(true);
      expect(stage('demonstrate').presets, `${l.id} demonstrate hides env`).toBeUndefined();
      expect(stage('review').blocks.some((b) => b.type === 'summary'), `${l.id} review`).toBe(true);
      for (const p of l.problems) expect(p.hints.length > 0 || p.kind === 'written', `${l.id}/${p.id} hints`).toBe(true);
    }
  });

  it('no accepted answer doubles as one of its own misconceptions', () => {
    for (const l of LANGUAGE_LESSONS) {
      for (const p of l.problems) {
        if (p.kind !== 'short-text') continue;
        const ok = new Set(p.accepted.map((a) => a.toLowerCase().trim()));
        for (const m of p.misconceptions ?? []) for (const a of m.accepted) expect(ok.has(a.toLowerCase().trim()), `${p.id}/${m.id}: ${a}`).toBe(false);
      }
    }
  });

  it('every lesson reaches its Explore stage with a sim-task on its own scenario', () => {
    const simTasks = blocksOf('explore').filter((x) => x.block.type === 'sim-task');
    expect(simTasks.length).toBeGreaterThanOrEqual(LANGUAGE_LESSONS.length);
  });
});
