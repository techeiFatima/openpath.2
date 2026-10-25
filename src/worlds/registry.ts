import type { LessonSpec, WorldSpec } from '@/core/world/spec';
import { GRAVITY_LESSONS, GRAVITY_WORLD } from './gravity/content';
import { MATH_LESSONS, MATH_WORLD } from './math/content';

/** Worlds the shell knows about. Only `available` worlds can be entered. */
export const WORLDS: WorldSpec[] = [
  GRAVITY_WORLD,
  MATH_WORLD,
  { id: 'atoms-molecules', subjectId: 'chemistry', name: 'Atoms & Molecules', tagline: 'Fill electron shells, test which atoms bond, build real molecules.', environment: 'molecular', lessonIds: [], status: 'in-design' },
  { id: 'cell', subjectId: 'biology', name: 'Inside the Cell', tagline: 'Zoom from organism to organelle to molecule.', environment: 'r3f-3d', lessonIds: [], status: 'planned' },
  { id: 'conversation', subjectId: 'language', name: 'Conversation Street', tagline: 'Order a meal, ask for directions, explain a problem.', environment: 'dialogue', lessonIds: [], status: 'planned' },
];

export const LESSONS: LessonSpec[] = [...GRAVITY_LESSONS, ...MATH_LESSONS];
export const LESSONS_BY_ID = new Map(LESSONS.map((l) => [l.id, l]));
export const WORLDS_BY_ID = new Map(WORLDS.map((w) => [w.id, w]));
