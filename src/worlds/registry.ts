import type { LessonSpec, WorldSpec } from '@/core/world/spec';
import { GRAVITY_LESSONS, GRAVITY_WORLD } from './gravity/content';
import { MATH_LESSONS, MATH_WORLD } from './math/content';
import { BIOLOGY_LESSONS, BIOLOGY_WORLD } from './biology/content';

/** Worlds the shell knows about. Only `available` worlds can be entered. */
export const WORLDS: WorldSpec[] = [
  GRAVITY_WORLD,
  MATH_WORLD,
  { id: 'atoms-molecules', subjectId: 'chemistry', name: 'Atoms & Molecules', tagline: 'Fill electron shells, test which atoms bond, build real molecules.', environment: 'molecular', lessonIds: [], status: 'in-design' },
  BIOLOGY_WORLD,
  { id: 'conversation', subjectId: 'language', name: 'Conversation Street', tagline: 'Order a meal, ask for directions, explain a problem.', environment: 'dialogue', lessonIds: [], status: 'planned' },
];

export const LESSONS: LessonSpec[] = [...GRAVITY_LESSONS, ...MATH_LESSONS, ...BIOLOGY_LESSONS];
export const LESSONS_BY_ID = new Map(LESSONS.map((l) => [l.id, l]));
export const WORLDS_BY_ID = new Map(WORLDS.map((w) => [w.id, w]));
