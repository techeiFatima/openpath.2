import type { GradeStatus, ProblemCategory } from '../assessment/types';

/**
 * Learner model: WHICH objectives the learner appears to understand.
 *
 * Evidence is a list of attempts. Mastery is computed, never stored, so rules can
 * evolve without migrating data. The rules below are a documented starting point to be
 * calibrated against real learner data (see docs/08-data-model.md); they are not a claim
 * about learning outcomes.
 */

export interface Attempt {
  id: string;
  problemId: string;
  objectiveIds: string[];
  category: ProblemCategory;
  status: GradeStatus;
  /** Hints revealed before this submission. */
  hintsUsed: number;
  /** Simulation was open while solving. */
  usedSimulation: boolean;
  /** Written answers that the learner self-assessed as meeting the rubric. */
  selfAssessedMet?: boolean;
  lowStakes?: boolean;
  timestamp: number;
}

export type MasteryLevel = 'not-started' | 'developing' | 'proficient' | 'mastered';

export const TRANSFER_CATEGORIES: ReadonlySet<ProblemCategory> = new Set(['transfer', 'application', 'modeling', 'word-problem']);

export interface MasterySummary {
  level: MasteryLevel;
  attempts: number;
  correct: number;
  /** Correct with zero hints and no simulation. */
  independentCorrect: number;
  independentTransferCorrect: number;
  /** Distinct problems solved correctly (repeat solves of the same problem count once). */
  distinctCorrectProblems: number;
  recentStreak: number;
  nextSteps: string;
}

/** An attempt counts as independent when no hints were used and the simulation was closed. */
export function isIndependent(a: Attempt): boolean {
  return a.hintsUsed === 0 && !a.usedSimulation;
}

export function summarizeMastery(objectiveId: string, attempts: Attempt[]): MasterySummary {
  const relevant = attempts
    .filter((a) => a.objectiveIds.includes(objectiveId) && !a.lowStakes && a.status !== 'invalid')
    .sort((a, b) => a.timestamp - b.timestamp);

  // Written work is ungraded: it never counts as "correct" for mastery, but a
  // self-assessed rubric pass counts as a developing-level signal.
  const graded = relevant.filter((a) => a.status === 'correct' || a.status === 'incorrect');
  const correct = graded.filter((a) => a.status === 'correct');
  const independent = correct.filter(isIndependent);
  const independentTransfer = independent.filter((a) => TRANSFER_CATEGORIES.has(a.category));
  const distinct = new Set(correct.map((a) => a.problemId)).size;

  let streak = 0;
  for (let i = graded.length - 1; i >= 0; i--) {
    if (graded[i]!.status === 'correct') streak++;
    else break;
  }

  let level: MasteryLevel = 'not-started';
  let nextSteps = 'Start with the Discover and Explore stages.';
  if (relevant.length > 0) {
    level = 'developing';
    nextSteps = 'Keep practising. Try a problem without hints and with the simulation closed.';
  }
  if (correct.length >= 2 && distinct >= 2 && correct.every((a) => a.hintsUsed <= 1) && streak >= 2) {
    level = 'proficient';
    nextSteps = 'Solve a transfer problem (a new situation) independently to demonstrate mastery.';
  }
  if (distinct >= 3 && independent.length >= 2 && independentTransfer.length >= 1 && streak >= 2) {
    level = 'mastered';
    nextSteps = 'Mastered for now. A spaced review will be scheduled.';
  }
  return {
    level,
    attempts: relevant.length,
    correct: correct.length,
    independentCorrect: independent.length,
    independentTransferCorrect: independentTransfer.length,
    distinctCorrectProblems: distinct,
    recentStreak: streak,
    nextSteps,
  };
}

/**
 * Spaced review scheduling (simple expanding intervals). Returns the timestamp at which
 * the objective should next be reviewed, or null when there is nothing to review yet.
 * Intervals: 1, 3, 7, 14, 30 days after each successful review.
 */
const REVIEW_INTERVALS_DAYS = [1, 3, 7, 14, 30];

export function nextReviewAt(objectiveId: string, attempts: Attempt[], now = Date.now()): number | null {
  const summary = summarizeMastery(objectiveId, attempts);
  if (summary.level === 'not-started' || summary.level === 'developing') return null;
  const last = attempts.filter((a) => a.objectiveIds.includes(objectiveId) && a.status === 'correct').map((a) => a.timestamp).sort((a, b) => b - a)[0];
  if (last === undefined) return null;
  const successfulReviews = Math.max(0, summary.recentStreak - 2);
  const idx = Math.min(successfulReviews, REVIEW_INTERVALS_DAYS.length - 1);
  const due = last + REVIEW_INTERVALS_DAYS[idx]! * 86400_000;
  return Math.max(due, now - 1); // never report a time in the far past
}
