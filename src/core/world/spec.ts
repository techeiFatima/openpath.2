import type { Problem } from '../assessment/types';
import type { StandardRef } from '../curriculum/types';

/**
 * World and lesson specifications: the reusable contract between curriculum content,
 * simulations and the renderer. A world owns an environment type and one or more lessons;
 * a lesson walks through the seven instructional stages.
 */

export type EnvironmentKind = 'r3f-3d' | 'canvas-2d' | 'molecular' | 'dialogue' | 'text';

export type StageKind = 'discover' | 'explore' | 'understand' | 'practice' | 'apply' | 'demonstrate' | 'review';

export const STAGE_ORDER: StageKind[] = ['discover', 'explore', 'understand', 'practice', 'apply', 'demonstrate', 'review'];

export const STAGE_LABELS: Record<StageKind, string> = {
  discover: 'Discover',
  explore: 'Explore',
  understand: 'Understand',
  practice: 'Practice',
  apply: 'Apply',
  demonstrate: 'Demonstrate',
  review: 'Review',
};

/** Content blocks. Text supports $inline$ and $$display$$ LaTeX and **bold**. */
export type Block =
  | { type: 'text'; md: string }
  | { type: 'equation'; latex: string; caption?: string }
  | { type: 'callout'; tone: 'note' | 'assumption' | 'warning'; md: string }
  | {
      type: 'prediction';
      id: string;
      question: string;
      options: { id: string; text: string }[];
      /** The id of the option the simulation will confirm. */
      correctId: string;
      /** Which simulation preset to run to reveal the answer. */
      revealPreset: string;
      explanation: string;
    }
  | {
      type: 'sim-task';
      /** Preset id understood by the world's simulation adapter. */
      preset: string;
      instructions: string;
      /** Things the learner should observe/record; shown as a checklist. */
      observe: string[];
    }
  | { type: 'problem'; problemId: string }
  | { type: 'summary'; points: string[] };

export interface Stage {
  kind: StageKind;
  title: string;
  blocks: Block[];
  /** Sim presets that should be active while this stage is open (first is default). */
  presets?: string[];
}

export interface MasteryRequirement {
  objectiveId: string;
  /** Minimum level the Demonstrate stage asks for before suggesting moving on. */
  level: 'proficient' | 'mastered';
}

export interface LessonSpec {
  id: string;
  worldId: string;
  title: string;
  subtitle: string;
  /** Rough learner time in minutes. */
  minutes: number;
  objectiveIds: string[];
  prerequisiteObjectiveIds: string[];
  standardRefs: StandardRef[];
  stages: Stage[];
  problems: Problem[];
  mastery: MasteryRequirement[];
  /** Plain-language description of what the sim shows for learners who cannot use the visual. */
  accessibilitySummary: string;
  /** Names of automated tests that validate this lesson's model (for coverage reporting). */
  validationTests: string[];
}

export interface WorldSpec {
  id: string;
  subjectId: string;
  name: string;
  tagline: string;
  environment: EnvironmentKind;
  /** Order matters: suggested path through the world. */
  lessonIds: string[];
  status: 'available' | 'in-design' | 'planned';
}

/** Structural validation; content problems should fail tests, not surprise learners. */
export function validateLesson(lesson: LessonSpec): string[] {
  const issues: string[] = [];
  const problemIds = new Set(lesson.problems.map((p) => p.id));
  if (problemIds.size !== lesson.problems.length) issues.push(`${lesson.id}: duplicate problem ids`);
  const kinds = lesson.stages.map((s) => s.kind);
  for (const k of STAGE_ORDER) if (!kinds.includes(k)) issues.push(`${lesson.id}: missing stage ${k}`);
  const referenced = new Set<string>();
  for (const s of lesson.stages) {
    for (const b of s.blocks) {
      if (b.type === 'problem') {
        referenced.add(b.problemId);
        if (!problemIds.has(b.problemId)) issues.push(`${lesson.id}/${s.kind}: unknown problem ${b.problemId}`);
      }
      if (b.type === 'prediction' && !b.options.some((o) => o.id === b.correctId)) issues.push(`${lesson.id}/${s.kind}: prediction ${b.id} correctId not in options`);
    }
  }
  for (const p of lesson.problems) {
    if (!referenced.has(p.id)) issues.push(`${lesson.id}: problem ${p.id} is never used`);
    for (const o of p.objectiveIds) if (!lesson.objectiveIds.includes(o)) issues.push(`${lesson.id}: problem ${p.id} targets objective ${o} outside the lesson`);
    if (p.kind === 'multiple-choice' && !p.options.some((o) => o.id === p.correctId)) issues.push(`${lesson.id}: ${p.id} correctId missing`);
    if (p.hints.length === 0 && p.kind !== 'written') issues.push(`${lesson.id}: ${p.id} has no hints`);
    if (p.kind === 'short-text' && p.accepted.length === 0) issues.push(`${lesson.id}: ${p.id} has no accepted answers`);
  }
  const categories = new Set(lesson.problems.filter((p) => !p.lowStakes).map((p) => p.category));
  if (!categories.has('transfer') && !categories.has('application')) issues.push(`${lesson.id}: no transfer/application problem, mastery cannot be demonstrated`);
  if (![...categories].some((c) => c === 'explanation' || c === 'conceptual')) issues.push(`${lesson.id}: no conceptual or explanation problem`);
  for (const m of lesson.mastery) if (!lesson.objectiveIds.includes(m.objectiveId)) issues.push(`${lesson.id}: mastery requirement for foreign objective ${m.objectiveId}`);
  return issues;
}
