import type { LessonSpec, WorldSpec } from '@/core/world/spec';
import { atTheMarket } from './lessons/at-the-market';
import { findingTheLibrary } from './lessons/finding-the-library';
import { meetingANeighbour } from './lessons/meeting-a-neighbour';

export const LANGUAGE_LESSONS: LessonSpec[] = [meetingANeighbour, atTheMarket, findingTheLibrary];

export const LANGUAGE_WORLD: WorldSpec = {
  id: 'conversation',
  subjectId: 'language',
  name: 'Conversation Street',
  tagline: 'Meet a neighbour, buy your shopping, find the library: real conversations, one line at a time.',
  environment: 'dialogue',
  lessonIds: LANGUAGE_LESSONS.map((l) => l.id),
  status: 'available',
};
