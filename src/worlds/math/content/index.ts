import type { LessonSpec, WorldSpec } from '@/core/world/spec';
import { curves } from './lessons/curves';
import { derivatives } from './lessons/derivatives';
import { integrals } from './lessons/integrals';
import { lines } from './lessons/lines';

export const MATH_LESSONS: LessonSpec[] = [lines, curves, derivatives, integrals];

export const MATH_WORLD: WorldSpec = {
  id: 'functions-calculus',
  subjectId: 'mathematics',
  name: 'Functions & Calculus',
  tagline: 'Bend a curve, chase a tangent, measure the area it sweeps.',
  environment: 'canvas-2d',
  lessonIds: MATH_LESSONS.map((l) => l.id),
  status: 'available',
};
