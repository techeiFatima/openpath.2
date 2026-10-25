import type { Concept, CoverageStatus, LearningObjective, StandardRef, Topic, Unit } from '@/core/curriculum/types';

const ccss = (code: string, summary: string): StandardRef => ({ framework: 'CCSS-M', code, summary, url: 'https://corestandards.org/mathematics-standards/', verified: false, verificationNote: 'Code and paraphrase from memory; official page unreachable from the build environment on 2026-10-25.' });
const calc = (summary: string): StandardRef => ({ framework: 'other', code: 'Calculus I (single-variable)', summary, verified: false });

export const MATH_UNITS: Unit[] = [
  { id: 'math.ms.geom.coordinates', courseId: 'math.ms.geometry', name: 'The Coordinate Plane' },
  { id: 'math.alg1.linear-functions', courseId: 'math.hs.algebra-1', name: 'Linear Functions' },
  { id: 'math.alg2.quadratics', courseId: 'math.hs.algebra-2', name: 'Quadratic Functions and Transformations' },
  { id: 'math.calc.derivatives', courseId: 'math.hs.calculus', name: 'Limits and Derivatives' },
  { id: 'math.calc.integrals', courseId: 'math.hs.calculus', name: 'Accumulation and Integrals' },
];

export const MATH_TOPICS: Topic[] = [
  { id: 'math.ms.coordinates', unitId: 'math.ms.geom.coordinates', name: 'Plotting Points' },
  { id: 'math.alg.lines', unitId: 'math.alg1.linear-functions', name: 'Slope and Linear Equations' },
  { id: 'math.alg.quadratic-forms', unitId: 'math.alg2.quadratics', name: 'Standard, Vertex and Factored Forms' },
  { id: 'math.alg.transformations', unitId: 'math.alg2.quadratics', name: 'Graph Transformations' },
  { id: 'math.calc.rate-of-change', unitId: 'math.calc.derivatives', name: 'Rates of Change and Tangent Lines' },
  { id: 'math.calc.derivative-rules', unitId: 'math.calc.derivatives', name: 'The Derivative and Basic Rules' },
  { id: 'math.calc.riemann', unitId: 'math.calc.integrals', name: 'Riemann Sums and the Definite Integral' },
];

export const MATH_CONCEPTS: Concept[] = [
  { id: 'math.ms.coordinate-plane', topicId: 'math.ms.coordinates', name: 'Coordinates', summary: 'A point is an ordered pair (x, y).' },
  { id: 'math.alg.linear-function', topicId: 'math.alg.lines', name: 'Linear functions', summary: 'y = mx + b; slope is a constant rate of change.' },
  { id: 'math.alg.quadratic-function', topicId: 'math.alg.quadratic-forms', name: 'Quadratic functions', summary: 'Parabolas; vertex, roots, and the three forms.' },
  { id: 'math.alg.transformation', topicId: 'math.alg.transformations', name: 'Transformations', summary: 'y = a·f(b(x − h)) + k shifts, stretches and reflects a graph.' },
  { id: 'math.calc.instantaneous-rate', topicId: 'math.calc.rate-of-change', name: 'Secant to tangent', summary: 'The tangent slope is the limit of secant slopes.' },
  { id: 'math.calc.derivative', topicId: 'math.calc.derivative-rules', name: 'The derivative', summary: 'f′(x) as a function; power rule and linearity.' },
  { id: 'math.calc.definite-integral', topicId: 'math.calc.riemann', name: 'The definite integral', summary: 'Limit of Riemann sums; the fundamental theorem.' },
];

export const MATH_PREREQUISITES: LearningObjective[] = [
  { id: 'math.ms.plot-points', conceptId: 'math.ms.coordinate-plane', statement: 'Plot and read points (x, y) in all four quadrants.', cognitiveLevel: 'apply', prerequisiteIds: [], standardRefs: [ccss('6.NS.C.8', 'Graph points in all four quadrants.')] },
  { id: 'math.alg.solve-linear', conceptId: 'math.alg.linear-function', statement: 'Solve a linear equation in one variable.', cognitiveLevel: 'apply', prerequisiteIds: [], standardRefs: [ccss('8.EE.C.7', 'Solve linear equations in one variable.')] },
  { id: 'math.alg.factor-quadratic', conceptId: 'math.alg.quadratic-function', statement: 'Factor a quadratic trinomial and expand a squared binomial.', cognitiveLevel: 'apply', prerequisiteIds: [], standardRefs: [ccss('HSA-SSE.A.2', 'Use the structure of an expression to rewrite it.')] },
];

export const MATH_OBJECTIVES: LearningObjective[] = [
  { id: 'math.func.linear', conceptId: 'math.alg.linear-function', statement: 'Compute and interpret slope as a rate of change, and write the equation of a line from a slope and a point or from two points.', cognitiveLevel: 'apply', prerequisiteIds: ['math.ms.plot-points', 'math.alg.solve-linear'], standardRefs: [ccss('HSF-LE.A.2', 'Construct linear functions from a graph, a description, or two input-output pairs.'), ccss('HSF-IF.B.6', 'Calculate and interpret the average rate of change of a function over an interval.')] },
  { id: 'math.func.quadratic', conceptId: 'math.alg.quadratic-function', statement: 'Find the vertex and x-intercepts of a quadratic and move between standard, vertex and factored forms.', cognitiveLevel: 'apply', prerequisiteIds: ['math.func.linear', 'math.alg.factor-quadratic', 'math.alg.rearrange-formula'], standardRefs: [ccss('HSF-IF.C.8', 'Use factoring and completing the square to show zeros, extreme values and symmetry.')] },
  { id: 'math.func.transform', conceptId: 'math.alg.transformation', statement: 'Predict and explain how a, b, h and k in y = a·f(b(x − h)) + k change a graph.', cognitiveLevel: 'analyze', prerequisiteIds: ['math.func.quadratic'], standardRefs: [ccss('HSF-BF.B.3', 'Identify the effect on the graph of replacing f(x) by f(x) + k, k f(x), f(kx), and f(x + k).')] },
  { id: 'math.calc.limit-slope', conceptId: 'math.calc.instantaneous-rate', statement: 'Explain the tangent slope as the limit of secant slopes and compute it from first principles for simple polynomials.', cognitiveLevel: 'understand', prerequisiteIds: ['math.func.linear', 'math.func.quadratic', 'math.alg.powers-roots'], standardRefs: [calc('Limits and the definition of the derivative.')] },
  { id: 'math.calc.derivative', conceptId: 'math.calc.derivative', statement: 'Differentiate polynomials with the power rule and linearity, and interpret the derivative as velocity or slope.', cognitiveLevel: 'apply', prerequisiteIds: ['math.calc.limit-slope'], standardRefs: [calc('Derivative rules for polynomials; derivative as rate of change.')] },
  { id: 'math.calc.integral', conceptId: 'math.calc.definite-integral', statement: 'Estimate area with Riemann sums, explain why the estimate improves with more pieces, and evaluate definite integrals of polynomials with the fundamental theorem.', cognitiveLevel: 'apply', prerequisiteIds: ['math.calc.derivative'], standardRefs: [calc('Riemann sums, the definite integral and the fundamental theorem of calculus.')] },
];

export const MATH_COVERAGE: CoverageStatus[] = [
  ...MATH_OBJECTIVES.map((o) => ({ objectiveId: o.id, planned: true, authored: true, implemented: true, scientificallyReviewed: false, learnerTested: false, notes: 'Model validated by tests; content not yet reviewed by a second mathematician or tested with learners.' })),
  ...MATH_PREREQUISITES.map((o) => ({ objectiveId: o.id, planned: true, authored: false, implemented: false, scientificallyReviewed: false, learnerTested: false, notes: 'Prerequisite referenced by Functions & Calculus; no lesson yet.' })),
];
