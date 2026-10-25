import { areEquivalent, compile, ExpressionError } from './expression';
import type { ExpressionProblem, GradeResult, MultipleChoiceProblem, NumericProblem, Problem, WrittenProblem } from './types';
import { dimensionOfUnit, parseQuantity, toSI } from './units';

export function gradeNumeric(problem: NumericProblem, rawInput: string): GradeResult {
  const parsed = parseQuantity(rawInput);
  if (!parsed) return { status: 'invalid', confidence: 'deterministic', feedback: 'Enter a number, optionally followed by a unit (for example 7.67 km/s).' };

  const { answer } = problem;
  const expectedDim = answer.unit ? dimensionOfUnit(answer.unit) : 'dimensionless';
  if (answer.unit && !expectedDim) throw new Error(`Problem ${problem.id}: unknown expected unit ${answer.unit}`);

  let learnerSI: number;
  if (parsed.unit === undefined) {
    const assume = answer.assumeUnit === undefined ? answer.unit : answer.assumeUnit;
    if (assume === false) return { status: 'invalid', confidence: 'deterministic', feedback: 'Include a unit with your answer.' };
    const q = toSI({ value: parsed.value, ...(assume ? { unit: assume } : {}) });
    if ('error' in q) throw new Error(q.error);
    learnerSI = q.value;
  } else {
    const q = toSI(parsed);
    if ('error' in q) return { status: 'invalid', confidence: 'deterministic', feedback: `${q.error}. Try units like m, km, s, min, h, days, m/s or km/s.` };
    if (q.dimension !== expectedDim) {
      return {
        status: 'incorrect',
        confidence: 'deterministic',
        feedback: `Your answer has units of ${q.dimension}, but this quantity is a ${expectedDim}. Check what the question asks for.`,
        detail: { learnerDimension: q.dimension, expectedDimension: expectedDim },
      };
    }
    learnerSI = q.value;
  }

  const within = (target: number, relTol: number | undefined, absTol?: number) => {
    if (absTol !== undefined) return Math.abs(learnerSI - target) <= absTol;
    const tol = relTol ?? 0.02;
    return Math.abs(learnerSI - target) <= tol * Math.abs(target);
  };

  if (within(answer.value, answer.relTol, answer.absTol)) {
    return { status: 'correct', confidence: 'deterministic', feedback: 'Correct.', detail: { learnerSI, expectedSI: answer.value } };
  }

  for (const m of problem.misconceptions ?? []) {
    if (within(m.value, m.relTol ?? 0.03)) {
      return { status: 'incorrect', confidence: 'deterministic', feedback: m.feedback, misconceptionId: m.id, detail: { learnerSI } };
    }
  }

  // Generic diagnostics: order-of-magnitude slips are usually unit conversions.
  const ratio = learnerSI / answer.value;
  if (Number.isFinite(ratio) && ratio > 0) {
    const log10 = Math.log10(ratio);
    const nearestPow = Math.round(log10);
    if (nearestPow !== 0 && Math.abs(log10 - nearestPow) < 0.02) {
      return {
        status: 'incorrect',
        confidence: 'deterministic',
        feedback: `Your value is off by a factor of 10^${nearestPow}. That usually means a unit conversion slipped (km ↔ m, or minutes ↔ seconds).`,
        detail: { learnerSI, factorOfTen: nearestPow },
      };
    }
    if (Math.abs(ratio - 0.5) < 0.01 || Math.abs(ratio - 2) < 0.02) {
      return { status: 'incorrect', confidence: 'deterministic', feedback: 'Your value is off by a factor of 2. Check whether you used a radius where a diameter was needed, or vice versa.', detail: { learnerSI } };
    }
  }
  if (Math.sign(learnerSI) !== Math.sign(answer.value) && answer.value !== 0) {
    return { status: 'incorrect', confidence: 'deterministic', feedback: 'Check the sign of your answer.', detail: { learnerSI } };
  }
  const rel = Math.abs(learnerSI - answer.value) / Math.abs(answer.value || 1);
  const closeness = rel < 0.1 ? 'Close, but not within tolerance. Re-check your arithmetic and significant figures.' : 'Not correct yet.';
  return { status: 'incorrect', confidence: 'deterministic', feedback: closeness, detail: { learnerSI, relativeError: rel } };
}

export function gradeExpression(problem: ExpressionProblem, rawInput: string): GradeResult {
  const varNames = problem.variables.map((v) => v.name);
  let learner;
  try {
    learner = compile(rawInput, varNames);
  } catch (e) {
    const msg = e instanceof ExpressionError ? e.message : 'Could not read that expression';
    return { status: 'invalid', confidence: 'deterministic', feedback: `${msg}. Use the symbols ${varNames.join(', ')}, numbers, + - * / ^, and functions like sqrt().` };
  }
  const reference = compile(problem.answer, varNames);
  const result = areEquivalent(learner, reference, problem.variables);
  if (result.equivalent) return { status: 'correct', confidence: 'deterministic', feedback: 'Correct: your expression is equivalent to the reference.', detail: { ...result } };

  for (const m of problem.misconceptions ?? []) {
    const wrong = compile(m.expression, varNames);
    if (areEquivalent(learner, wrong, problem.variables).equivalent) {
      return { status: 'incorrect', confidence: 'deterministic', feedback: m.feedback, misconceptionId: m.id };
    }
  }
  const feedback = result.reason ?? 'Your expression gives different values from the correct one. Check each step of the derivation.';
  return { status: 'incorrect', confidence: 'deterministic', feedback, detail: { ...result } };
}

export function gradeMultipleChoice(problem: MultipleChoiceProblem, optionId: string): GradeResult {
  const opt = problem.options.find((o) => o.id === optionId);
  if (!opt) return { status: 'invalid', confidence: 'deterministic', feedback: 'Choose one of the options.' };
  if (opt.id === problem.correctId) return { status: 'correct', confidence: 'deterministic', feedback: opt.feedback ?? 'Correct.' };
  return { status: 'incorrect', confidence: 'deterministic', feedback: opt.feedback ?? 'Not quite. Think about it again.' };
}

/**
 * Written explanations are not auto-graded. We return `ungraded` and surface the model
 * answer plus a rubric for self-assessment. Mastery credit for written work is limited
 * (see learner/mastery.ts) precisely because this verdict is not verified.
 */
export function gradeWritten(problem: WrittenProblem, text: string): GradeResult {
  if (text.trim().split(/\s+/).length < 8) {
    return { status: 'invalid', confidence: 'none', feedback: 'Write at least a couple of sentences before comparing with the model answer.' };
  }
  return {
    status: 'ungraded',
    confidence: 'none',
    feedback: 'Compare your explanation with the model answer and check each rubric item honestly.',
    detail: { modelAnswer: problem.modelAnswer, rubric: problem.rubric },
  };
}

export function grade(problem: Problem, input: string): GradeResult {
  switch (problem.kind) {
    case 'numeric': return gradeNumeric(problem, input);
    case 'expression': return gradeExpression(problem, input);
    case 'multiple-choice': return gradeMultipleChoice(problem, input);
    case 'written': return gradeWritten(problem, input);
  }
}
