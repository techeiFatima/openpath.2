import type { LessonSpec, WorldSpec } from '@/core/world/spec';
import { insideTheAtom } from './lessons/inside-the-atom';
import { patternsInTheTable } from './lessons/patterns-in-the-table';
import { whereElectronsLive } from './lessons/where-electrons-live';
import { whyAtomsBond } from './lessons/why-atoms-bond';

export const CHEMISTRY_LESSONS: LessonSpec[] = [insideTheAtom, whereElectronsLive, patternsInTheTable, whyAtomsBond];

export const CHEMISTRY_WORLD: WorldSpec = {
  id: 'atoms-molecules',
  subjectId: 'chemistry',
  name: 'Atoms & Molecules',
  tagline: 'Fill electron shells, test which atoms bond, build real molecules.',
  environment: 'molecular',
  lessonIds: CHEMISTRY_LESSONS.map((l) => l.id),
  status: 'available',
};
