/**
 * Assessment layer: HOW demonstrated understanding is evaluated.
 * Problems reference learning objectives; graders are deterministic where possible and
 * honest about confidence where not.
 */

export type ProblemCategory =
  | 'conceptual'
  | 'computation'
  | 'procedural'
  | 'multi-step'
  | 'word-problem'
  | 'graph-interpretation'
  | 'modeling'
  | 'application'
  | 'error-identification'
  | 'explanation'
  | 'proof'
  | 'transfer';

export interface NumericAnswer {
  /** Expected value in SI base units for the given `unit` (e.g. m/s). */
  value: number;
  /** SI unit the expected value is expressed in; undefined for dimensionless. */
  unit?: string;
  /** Relative tolerance (default 0.02 = 2%). */
  relTol?: number;
  /** Absolute tolerance in SI, used instead of relTol when given. */
  absTol?: number;
  /** When the learner omits a unit, assume this unit (default: `unit`). Set false to reject bare numbers. */
  assumeUnit?: string | false;
}

export interface NumericMisconception {
  id: string;
  /** Value (in SI) that this misconception typically produces. */
  value: number;
  relTol?: number;
  feedback: string;
}

interface ProblemBase {
  id: string;
  objectiveIds: string[];
  category: ProblemCategory;
  /** 1 (routine) … 5 (challenge). */
  difficulty: 1 | 2 | 3 | 4 | 5;
  /** Markdown-lite with $…$ inline and $$…$$ display math. */
  prompt: string;
  /** Progressive hints, least to most specific. */
  hints: string[];
  /** Full worked solution shown after a correct answer or after the attempt budget is used. */
  solution: string;
  /** If true this problem may be solved with the simulation open; otherwise the sim is hidden. */
  allowSimulation?: boolean;
  /** Problems marked as prediction are low-stakes and never count toward mastery. */
  lowStakes?: boolean;
}

export interface NumericProblem extends ProblemBase {
  kind: 'numeric';
  answer: NumericAnswer;
  misconceptions?: NumericMisconception[];
}

export interface ExpressionProblem extends ProblemBase {
  kind: 'expression';
  /** Reference expression using the declared variables. */
  answer: string;
  variables: { name: string; min: number; max: number; description?: string }[];
  /** Named wrong expressions with targeted feedback. */
  misconceptions?: { id: string; expression: string; feedback: string }[];
}

export interface MultipleChoiceProblem extends ProblemBase {
  kind: 'multiple-choice';
  options: { id: string; text: string; feedback?: string }[];
  correctId: string;
}

export interface WrittenProblem extends ProblemBase {
  kind: 'written';
  modelAnswer: string;
  /** Rubric items the learner (or a future reviewer) checks off. */
  rubric: string[];
}

export type Problem = NumericProblem | ExpressionProblem | MultipleChoiceProblem | WrittenProblem;

export type GradeStatus = 'correct' | 'incorrect' | 'ungraded' | 'invalid';

/** How much trust to place in the verdict. */
export type GradeConfidence = 'deterministic' | 'heuristic' | 'none';

export interface GradeResult {
  status: GradeStatus;
  confidence: GradeConfidence;
  feedback: string;
  /** Set when a known misconception matched. */
  misconceptionId?: string;
  detail?: Record<string, unknown>;
}
