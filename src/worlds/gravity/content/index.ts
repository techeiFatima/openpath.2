import type { LessonSpec, WorldSpec } from '@/core/world/spec';
import { escape } from './lessons/escape';
import { fallingAroundEarth } from './lessons/falling-around-earth';
import { keplersThirdLaw } from './lessons/keplers-third-law';

export const GRAVITY_LESSONS: LessonSpec[] = [fallingAroundEarth, keplersThirdLaw, escape];

export const GRAVITY_WORLD: WorldSpec = {
  id: 'gravity',
  subjectId: 'physics',
  name: 'Gravity Lab',
  tagline: 'Fall around a planet, weigh the Sun, and find the speed that lets you leave.',
  environment: 'r3f-3d',
  lessonIds: GRAVITY_LESSONS.map((l) => l.id),
  status: 'available',
};
