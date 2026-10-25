import type { LessonSpec, WorldSpec } from '@/core/world/spec';
import { GRAVITY_LESSONS, GRAVITY_WORLD } from './gravity/content';
import { MATH_LESSONS, MATH_WORLD } from './math/content';
import { BIOLOGY_LESSONS, BIOLOGY_WORLD } from './biology/content';
import { LANGUAGE_LESSONS, LANGUAGE_WORLD } from './language/content';
import { CHEMISTRY_LESSONS, CHEMISTRY_WORLD } from './chemistry/content';

/** Worlds the shell knows about. Only `available` worlds can be entered. */
export const WORLDS: WorldSpec[] = [
  GRAVITY_WORLD,
  MATH_WORLD,
  CHEMISTRY_WORLD,
  BIOLOGY_WORLD,
  LANGUAGE_WORLD,
];

export const LESSONS: LessonSpec[] = [...GRAVITY_LESSONS, ...MATH_LESSONS, ...BIOLOGY_LESSONS, ...LANGUAGE_LESSONS, ...CHEMISTRY_LESSONS];
export const LESSONS_BY_ID = new Map(LESSONS.map((l) => [l.id, l]));
export const WORLDS_BY_ID = new Map(WORLDS.map((w) => [w.id, w]));
