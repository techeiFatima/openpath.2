import type { LessonSpec, WorldSpec } from '@/core/world/spec';
import { doubleHelix } from './lessons/double-helix';
import { geneToProtein } from './lessons/gene-to-protein';
import { powersOfTen } from './lessons/powers-of-ten';

export const BIOLOGY_LESSONS: LessonSpec[] = [powersOfTen, doubleHelix, geneToProtein];

export const BIOLOGY_WORLD: WorldSpec = {
  id: 'cell',
  subjectId: 'biology',
  name: 'Inside the Cell',
  tagline: 'Zoom from a person to an atom, then read the molecule that builds you.',
  environment: 'canvas-2d',
  lessonIds: BIOLOGY_LESSONS.map((l) => l.id),
  status: 'available',
};
