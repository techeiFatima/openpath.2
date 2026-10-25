import type { LessonSpec, WorldSpec } from '@/core/world/spec';
import { GRAVITY_LESSONS, GRAVITY_WORLD } from './gravity/content';
import { MATH_LESSONS, MATH_WORLD } from './math/content';
import { BIOLOGY_LESSONS, BIOLOGY_WORLD } from './biology/content';
import { LANGUAGE_LESSONS, LANGUAGE_WORLD } from './language/content';

/** Worlds the shell knows about. Only `available` worlds can be entered. */
export const WORLDS: WorldSpec[] = [
  GRAVITY_WORLD,
  MATH_WORLD,
  { id: 'atoms-molecules', subjectId: 'chemistry', name: 'Atoms & Molecules', tagline: 'Fill electron shells, test which atoms bond, build real molecules.', environment: 'molecular', lessonIds: [], status: 'in-design' },
  BIOLOGY_WORLD,
  LANGUAGE_WORLD,
];

export const LESSONS: LessonSpec[] = [...GRAVITY_LESSONS, ...MATH_LESSONS, ...BIOLOGY_LESSONS, ...LANGUAGE_LESSONS];
export const LESSONS_BY_ID = new Map(LESSONS.map((l) => [l.id, l]));
export const WORLDS_BY_ID = new Map(WORLDS.map((w) => [w.id, w]));
