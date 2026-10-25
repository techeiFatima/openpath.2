import type { LessonSpec } from '@/core/world/spec';

/**
 * Lesson 4 — Adding up the pieces.
 * Reference values: left sum n=3 of x² on [0,3] = (0 + 1 + 4)·1 = 5; ∫₀³ x² = 9;
 * antiderivative of 6x = 3x²; ∫₁² (2x+1) = 4; ∫₀² 3t² = 8; ∫₀² x³ = 4;
 * midpoint sum n=2 of x² on [0,2] = (0.25 + 2.25)·1 = 2.5.
 */
export const integrals: LessonSpec = {
  id: 'math.integrals',
  worldId: 'functions-calculus',
  title: 'Adding up the pieces',
  subtitle: 'Area, accumulation and the integral',
  minutes: 45,
  objectiveIds: ['math.calc.integral'],
  prerequisiteObjectiveIds: ['math.calc.derivative'],
  standardRefs: [],
  accessibilitySummary: 'A graph shows a curve with rectangles under it between two x-values. The readouts list the rectangle total, the exact area from the antiderivative, and the difference between them, which shrinks as the number of rectangles grows.',
  validationTests: ['math.test.ts: Riemann sums converge', 'math.test.ts: integrates exactly'],
  mastery: [{ objectiveId: 'math.calc.integral', level: 'mastered' }],
  stages: [
    {
      kind: 'discover', title: 'Area under a curve', presets: ['riemann:parabola'],
      blocks: [
        { type: 'text', md: 'What is the area between $y = x^2$ and the x-axis from $x = 0$ to $x = 3$? No formula from geometry fits a curved edge.' },
        { type: 'prediction', id: 'pred-area', question: 'The triangle with the same corners (0,0), (3,0), (3,9) has area 13.5. The area under the parabola is…',
          options: [{ id: 'less', text: 'Less than 13.5, maybe around 9' }, { id: 'same', text: 'Exactly 13.5' }, { id: 'more', text: 'More than 13.5' }],
          correctId: 'less', revealPreset: 'riemann:parabola',
          explanation: 'The parabola sags below the straight line from (0,0) to (3,9), so the region is smaller than the triangle. Increase n and watch the estimate settle at 9.' },
      ],
    },
    {
      kind: 'explore', title: 'More rectangles', presets: ['riemann:parabola'],
      blocks: [
        { type: 'sim-task', preset: 'riemann:parabola', instructions: 'Use left endpoints. Set n = 3, 6, 30 and 200 and record the sum. Then switch to right endpoints and to midpoints.', observe: ['The left sums for n = 3, 6, 30, 200', 'Whether left sums are under- or over-estimates for this increasing function, and why', 'How fast the midpoint error shrinks compared with left endpoints'] },
        { type: 'callout', tone: 'note', md: 'The "exact" readout uses the antiderivative formula shown next to it; the rectangles are only estimates of that number.' },
      ],
    },
    {
      kind: 'understand', title: 'The definite integral', presets: ['riemann:parabola'],
      blocks: [
        { type: 'text', md: 'Cut $[a, b]$ into $n$ pieces of width $\\Delta x = (b-a)/n$ and add up rectangle areas:' },
        { type: 'equation', latex: '\\sum_{i=1}^{n} f(x_i)\\,\\Delta x \;\\xrightarrow{n \\to \\infty}\; \\int_a^b f(x)\\,dx', caption: 'A Riemann sum, and its limit: the definite integral.' },
        { type: 'text', md: 'Computing that limit directly is painful. The **fundamental theorem of calculus** says it equals a change in an antiderivative $F$ (a function whose derivative is $f$):' },
        { type: 'equation', latex: "\\int_a^b f(x)\\,dx = F(b) - F(a), \\qquad F' = f" },
        { type: 'text', md: 'Reversing the power rule gives antiderivatives of powers:' },
        { type: 'equation', latex: '\\int x^n\\,dx = \\frac{x^{n+1}}{n+1} + C \\quad (n \\neq -1)', caption: 'So ∫₀³ x² dx = [x³/3]₀³ = 9 − 0 = 9.' },
        { type: 'text', md: 'If $f$ is a velocity, the area under it is the **distance travelled**: accumulation of a rate gives a total.' },
        { type: 'summary', points: ['Riemann sums estimate area; the integral is their limit.', 'FTC: ∫ₐᵇ f = F(b) − F(a).', 'Area under a rate = accumulated total (velocity → distance).'] },
      ],
    },
    {
      kind: 'practice', title: 'Practice', presets: ['riemann:parabola'],
      blocks: [
        { type: 'problem', problemId: 'l4-left-sum' },
        { type: 'problem', problemId: 'l4-exact' },
        { type: 'problem', problemId: 'l4-antiderivative' },
        { type: 'problem', problemId: 'l4-over-under' },
        { type: 'problem', problemId: 'l4-linear-integral' },
        { type: 'problem', problemId: 'l4-error' },
        { type: 'problem', problemId: 'l4-why-more' },
      ],
    },
    {
      kind: 'apply', title: 'Velocity to distance', presets: ['riemann:velocity'],
      blocks: [
        { type: 'text', md: 'A rocket sled has velocity $v(t) = 3t^2$ m/s.' },
        { type: 'problem', problemId: 'l4-distance' },
        { type: 'problem', problemId: 'l4-distance-expr' },
      ],
    },
    {
      kind: 'demonstrate', title: 'Show what you know',
      blocks: [
        { type: 'text', md: 'Graph hidden.' },
        { type: 'problem', problemId: 'l4-demo-cubic' },
        { type: 'problem', problemId: 'l4-demo-midpoint' },
      ],
    },
    { kind: 'review', title: 'Review', blocks: [{ type: 'summary', points: ['Riemann sum → integral.', 'FTC turns area into F(b) − F(a).', '∫ xⁿ = xⁿ⁺¹/(n+1).'] }] },
  ],
  problems: [
    { id: 'l4-left-sum', kind: 'numeric', objectiveIds: ['math.calc.integral'], category: 'computation', difficulty: 2, prompt: 'Estimate $\\int_0^3 x^2\\,dx$ with a left-endpoint Riemann sum using $n = 3$ rectangles.', answer: { value: 5, relTol: 0.001 },
      misconceptions: [{ id: 'right', value: 14, feedback: 'That is the right-endpoint sum (1 + 4 + 9). Left endpoints use x = 0, 1, 2.' }, { id: 'exact', value: 9, feedback: 'That is the exact area. The question asks for the 3-rectangle estimate.' }],
      hints: ['Δx = 1; left endpoints are x = 0, 1, 2.', 'Sum f(0) + f(1) + f(2) times Δx.'], solution: '(0 + 1 + 4)·1 = 5.' },
    { id: 'l4-exact', kind: 'numeric', objectiveIds: ['math.calc.integral'], category: 'computation', difficulty: 2, prompt: 'Evaluate $\\int_0^3 x^2\\,dx$ exactly.', answer: { value: 9, relTol: 0.001 },
      misconceptions: [{ id: 'no-divide', value: 27, feedback: 'The antiderivative of x² is x³/3, not x³.' }],
      hints: ['F(x) = x³/3.', 'F(3) − F(0).'], solution: '27/3 − 0 = 9.' },
    { id: 'l4-antiderivative', kind: 'expression', objectiveIds: ['math.calc.integral'], category: 'procedural', difficulty: 2, prompt: 'Give an antiderivative of $6x$ (take the constant to be 0).', answer: '3*x^2', variables: [{ name: 'x', min: -5, max: 5 }],
      misconceptions: [{ id: 'derivative', expression: '6', feedback: 'That is the derivative. Go the other way: raise the power and divide.' }, { id: 'no-divide', expression: '6*x^2', feedback: 'Divide by the new exponent: 6x²/2 = 3x².' }],
      hints: ['∫ xⁿ = xⁿ⁺¹/(n+1).', 'Check by differentiating your answer.'], solution: '3x², since d/dx 3x² = 6x.' },
    { id: 'l4-over-under', kind: 'multiple-choice', objectiveIds: ['math.calc.integral'], category: 'conceptual', difficulty: 2, prompt: 'For an increasing function, a right-endpoint Riemann sum is…',
      options: [{ id: 'a', text: 'An overestimate, because each rectangle reaches the curve’s highest point on its piece', feedback: 'Correct.' }, { id: 'b', text: 'An underestimate', feedback: 'That is the left-endpoint sum for an increasing function.' }, { id: 'c', text: 'Exact', feedback: 'Only the limit is exact.' }],
      correctId: 'a', hints: ['Where is f largest on each piece if f is increasing?'], solution: 'Right endpoints take the largest value on each piece, so the sum exceeds the area.' },
    { id: 'l4-linear-integral', kind: 'numeric', objectiveIds: ['math.calc.integral'], category: 'multi-step', difficulty: 2, prompt: 'Evaluate $\\int_1^2 (2x + 1)\\,dx$.', answer: { value: 4, relTol: 0.001 },
      misconceptions: [{ id: 'plus', value: 8, feedback: 'The theorem says F(b) − F(a), not F(b) + F(a).' }, { id: 'no-lower', value: 6, feedback: 'Subtract F(1): you used F(2) alone.' }],
      hints: ['F(x) = x² + x.', 'F(2) − F(1).'], solution: '(4 + 2) − (1 + 1) = 4.' },
    { id: 'l4-error', kind: 'multiple-choice', objectiveIds: ['math.calc.integral'], category: 'error-identification', difficulty: 2, prompt: 'A student computes $\\int_0^2 x\\,dx = [x^2/2]_0^2 = 2 + 0 = 2$. Is the method right?',
      options: [{ id: 'a', text: 'Yes, and the answer is right', feedback: 'The answer happens to be right because F(0) = 0, but writing + instead of − is a method error that fails whenever F(a) ≠ 0.' }, { id: 'b', text: 'The method is wrong: it should be F(2) − F(0); here it gives the same number only because F(0) = 0', feedback: 'Correct.' }, { id: 'c', text: 'The antiderivative should be x', feedback: 'd/dx (x²/2) = x, so x²/2 is right.' }],
      correctId: 'b', hints: ['What does the fundamental theorem say to do with F(a)?'], solution: 'Always subtract F(a).' },
    { id: 'l4-why-more', kind: 'written', objectiveIds: ['math.calc.integral'], category: 'explanation', difficulty: 3, prompt: 'Explain why using more rectangles gives a better estimate of the area, and why it can never be made exact with a finite number of rectangles for a curved graph.',
      modelAnswer: 'Each rectangle replaces the curve by a flat top over its piece; the error is the sliver between the flat top and the curve. Narrower pieces make each sliver smaller and the slivers’ total shrinks. But as long as a piece has positive width the curve still bends across it, so some sliver remains; only the limit as the width goes to zero removes the error entirely.',
      rubric: ['Identifies the error as the gap between the flat top and the curve on each piece', 'Explains that narrower pieces shrink the gaps', 'States that any finite width leaves some gap, so only the limit is exact'], hints: ['Look at one rectangle and the curve above it.'], solution: 'See model answer.' },
    { id: 'l4-distance', kind: 'numeric', objectiveIds: ['math.calc.integral'], category: 'application', difficulty: 3, prompt: 'How far does the sled travel between $t = 0$ and $t = 2$ s? Give metres.', answer: { value: 8, unit: 'm', relTol: 0.001 },
      misconceptions: [{ id: 'velocity', value: 12, feedback: 'v(2) = 12 m/s is the final speed, not the distance. Integrate.' }],
      hints: ['Distance = ∫₀² 3t² dt.', 'Antiderivative of 3t² is t³.'], solution: '[t³]₀² = 8 m.' },
    { id: 'l4-distance-expr', kind: 'expression', objectiveIds: ['math.calc.integral'], category: 'transfer', difficulty: 3, prompt: 'Write the distance travelled from $t = 0$ to a general time $T$ as an expression in T.', answer: 'T^3', variables: [{ name: 'T', min: 0, max: 5 }],
      misconceptions: [{ id: 'velocity', expression: '3*T^2', feedback: 'That is the velocity at T. Distance is the accumulated area: integrate.' }],
      hints: ['∫₀ᵀ 3t² dt = [t³]₀ᵀ.'], solution: 'T³.' },
    { id: 'l4-demo-cubic', kind: 'numeric', objectiveIds: ['math.calc.integral'], category: 'application', difficulty: 3, prompt: 'Evaluate $\\int_0^2 x^3\\,dx$.', answer: { value: 4, relTol: 0.001 },
      misconceptions: [{ id: 'no-divide', value: 16, feedback: 'The antiderivative of x³ is x⁴/4.' }],
      hints: ['F(x) = x⁴/4.'], solution: '16/4 − 0 = 4.' },
    { id: 'l4-demo-midpoint', kind: 'numeric', objectiveIds: ['math.calc.integral'], category: 'transfer', difficulty: 3, prompt: 'Estimate $\\int_0^2 x^2\\,dx$ with a midpoint Riemann sum using $n = 2$.', answer: { value: 2.5, relTol: 0.001 },
      misconceptions: [{ id: 'left', value: 1, feedback: 'That is the left sum (0 + 1). Midpoints are x = 0.5 and 1.5.' }, { id: 'exact', value: 8 / 3, relTol: 0.005, feedback: 'That is the exact value. The question asks for the two-rectangle midpoint estimate.' }],
      hints: ['Δx = 1; midpoints 0.5 and 1.5.', 'f(0.5) + f(1.5) times Δx.'], solution: '(0.25 + 2.25)·1 = 2.5.' },
  ],
};
