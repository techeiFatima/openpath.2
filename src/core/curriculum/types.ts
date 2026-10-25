/**
 * Curriculum layer: WHAT a learner should come to understand.
 *
 * Hierarchy: Subject → Level → Course → Unit → Topic → Concept → LearningObjective.
 * Objectives form a prerequisite graph (not a rigid grade ladder) so the learner
 * model can place, remediate, accelerate and review.
 *
 * This layer knows nothing about simulations, rendering or grading.
 */

export type SubjectId = 'mathematics' | 'physics' | 'chemistry' | 'biology' | 'language';

export type LevelKind = 'early-childhood' | 'grade-band' | 'university' | 'proficiency';

export interface Subject {
  id: SubjectId;
  name: string;
  tagline: string;
}

export interface Level {
  id: string;
  subjectId: SubjectId;
  name: string;
  kind: LevelKind;
  /** Ordering within the subject, lowest first. */
  order: number;
}

export interface Course {
  id: string;
  levelId: string;
  name: string;
  description: string;
}

export interface Unit {
  id: string;
  courseId: string;
  name: string;
}

export interface Topic {
  id: string;
  unitId: string;
  name: string;
}

export interface Concept {
  id: string;
  topicId: string;
  name: string;
  summary: string;
}

export type StandardsFramework = 'NGSS' | 'CCSS-M' | 'CEFR' | 'ACTFL' | 'MAA-CUPM' | 'other';

export interface StandardRef {
  framework: StandardsFramework;
  code: string;
  /** Short paraphrase or quotation; see docs/03-resource-registry.md for reuse terms. */
  summary?: string;
  url?: string;
  /** True only when the text was checked against the official source (date in notes). */
  verified: boolean;
  verificationNote?: string;
}

/** Bloom-style verb class used to sanity-check assessment variety per objective. */
export type CognitiveLevel = 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create';

export interface LearningObjective {
  id: string;
  conceptId: string;
  /** "Learner can …" statement. */
  statement: string;
  cognitiveLevel: CognitiveLevel;
  prerequisiteIds: string[];
  standardRefs: StandardRef[];
}

/**
 * Coverage tracking. We deliberately separate these so nobody can claim a subject is
 * "covered" because an impressive demo exists.
 */
export interface CoverageStatus {
  objectiveId: string;
  planned: boolean;
  authored: boolean;
  implemented: boolean;
  scientificallyReviewed: boolean;
  learnerTested: boolean;
  notes?: string;
}

export interface CurriculumGraph {
  subjects: Subject[];
  levels: Level[];
  courses: Course[];
  units: Unit[];
  topics: Topic[];
  concepts: Concept[];
  objectives: LearningObjective[];
  coverage: CoverageStatus[];
}
