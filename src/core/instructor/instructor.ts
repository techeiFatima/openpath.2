import type { GradeResult, Problem } from '../assessment/types';
import type { LearningObjective } from '../curriculum/types';
import type { Attempt, MasterySummary } from '../learner/mastery';
import type { Measurement } from '../simulation/types';
import type { StageKind } from '../world/spec';

/**
 * AI instruction layer.
 *
 * Design rule: computational truth (simulation measurements, grader verdicts, curriculum
 * text) is assembled into an InstructorContext by code. Whatever produces the words, a
 * scripted hint ladder today or an LLM later, may only explain and connect facts that are
 * present in the context. It never computes physics or decides correctness.
 */

export interface InstructorContext {
  lessonTitle: string;
  stage: StageKind;
  objective: LearningObjective;
  prerequisiteMastery: { objectiveId: string; level: MasterySummary['level'] }[];
  problem?: Problem;
  attemptsOnProblem: Attempt[];
  lastGrade?: GradeResult;
  hintsGiven: number;
  simulation?: { presetId: string; measurements: Measurement[]; assumptions: string[] };
  learnerUtterance?: string;
}

export interface InstructorReply {
  text: string;
  /** Which source grounded the reply. */
  grounding: 'hint-ladder' | 'misconception' | 'simulation' | 'solution' | 'prerequisite';
  /** True when the reply gives away the full method (counts as a heavy hint). */
  revealsSolution: boolean;
}

export interface Instructor {
  help(ctx: InstructorContext): InstructorReply;
}

/**
 * Deterministic instructor: progressive hints from the content, misconception feedback
 * from the grader, and a prerequisite redirect when the learner is repeatedly stuck.
 * Avoids endless Socratic loops: after the hint ladder is exhausted it shows the solution.
 */
export class ScriptedInstructor implements Instructor {
  help(ctx: InstructorContext): InstructorReply {
    const weakPrereq = ctx.prerequisiteMastery.find((p) => p.level === 'not-started' || p.level === 'developing');
    const wrongCount = ctx.attemptsOnProblem.filter((a) => a.status === 'incorrect').length;

    if (ctx.lastGrade?.misconceptionId && ctx.lastGrade.feedback) {
      return { text: ctx.lastGrade.feedback, grounding: 'misconception', revealsSolution: false };
    }
    if (weakPrereq && wrongCount >= 2) {
      return {
        text: `You have had a couple of tries at this. It depends on an earlier idea (${weakPrereq.objectiveId}) that you have not practised yet. Reviewing that first will make this problem easier.`,
        grounding: 'prerequisite',
        revealsSolution: false,
      };
    }
    if (ctx.problem) {
      const hints = ctx.problem.hints;
      if (ctx.hintsGiven < hints.length) {
        return { text: hints[ctx.hintsGiven]!, grounding: 'hint-ladder', revealsSolution: ctx.hintsGiven === hints.length - 1 };
      }
      return { text: `Here is the full solution so you can study it, then try a similar problem on your own.\n\n${ctx.problem.solution}`, grounding: 'solution', revealsSolution: true };
    }
    if (ctx.simulation) {
      const m = ctx.simulation.measurements.map((x) => `${x.label}: ${formatMeasurement(x)}`).join('; ');
      return { text: `Right now the simulation reads ${m}. Change one variable at a time and watch which readings move.`, grounding: 'simulation', revealsSolution: false };
    }
    return { text: 'Work through the stage on the left; ask again when you hit a problem.', grounding: 'hint-ladder', revealsSolution: false };
  }
}

export function formatMeasurement(m: Measurement): string {
  const v = m.value;
  const abs = Math.abs(v);
  const text = abs !== 0 && (abs >= 1e6 || abs < 1e-3) ? v.toExponential(3) : v.toPrecision(4);
  return `${text} ${m.unit}`.trim();
}

/**
 * Builds the grounded prompt a future LLM-backed instructor would receive. Kept as a pure
 * function so the grounding rules are testable without any API call. No LLM is called in
 * this milestone.
 */
export function buildGroundedPrompt(ctx: InstructorContext): string {
  const lines: string[] = [];
  lines.push('You are the OpenPath instructor embedded in a learning world.');
  lines.push('Rules: (1) Use only the facts below. (2) Never compute physics or mathematics yourself; quote the simulation or grader. (3) Give one step of help at a time; after two unsuccessful tries give substantive help. (4) Never state that an answer is correct unless the grader verdict says so.');
  lines.push(`Lesson: ${ctx.lessonTitle} — stage: ${ctx.stage}`);
  lines.push(`Objective: ${ctx.objective.statement}`);
  if (ctx.prerequisiteMastery.length) lines.push(`Prerequisite mastery: ${ctx.prerequisiteMastery.map((p) => `${p.objectiveId}=${p.level}`).join(', ')}`);
  if (ctx.problem) lines.push(`Problem: ${ctx.problem.prompt}`);
  if (ctx.lastGrade) lines.push(`Grader verdict: ${ctx.lastGrade.status} (${ctx.lastGrade.confidence}). Feedback: ${ctx.lastGrade.feedback}`);
  lines.push(`Hints already given: ${ctx.hintsGiven}`);
  if (ctx.problem) lines.push(`Authored hint ladder: ${ctx.problem.hints.map((h, i) => `[${i + 1}] ${h}`).join(' ')}`);
  if (ctx.simulation) {
    lines.push(`Simulation preset: ${ctx.simulation.presetId}`);
    lines.push(`Measurements: ${ctx.simulation.measurements.map((m) => `${m.label}=${formatMeasurement(m)}`).join('; ')}`);
    lines.push(`Model assumptions: ${ctx.simulation.assumptions.join(' | ')}`);
  }
  if (ctx.learnerUtterance) lines.push(`Learner says: ${ctx.learnerUtterance}`);
  return lines.join('\n');
}
