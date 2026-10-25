import type { LessonSpec } from '@/core/world/spec';

/**
 * Lesson 3 — Zooming into a curve.
 * Reference values: x² secant from 3 to 3.5: (12.25 − 9)/0.5 = 6.5; d/dx x³ at 2 = 12;
 * d/dx (3x² − 2x + 1) = 6x − 2; s = t³ − 3t: v(2) = 9, v = 0 at t = 1;
 * d/dx (x⁴ − 5x² + 2) = 4x³ − 10x; tangent slope of x² − 4x at 1 = −2.
 */
export const derivatives: LessonSpec = {
  id: 'math.derivatives',
  worldId: 'functions-calculus',
  title: 'Zooming into a curve',
  subtitle: 'From average to instantaneous rate of change',
  minutes: 45,
  objectiveIds: ['math.calc.limit-slope', 'math.calc.derivative'],
  prerequisiteObjectiveIds: ['math.func.linear', 'math.func.quadratic', 'math.alg.powers-roots'],
  standardRefs: [],
  accessibilitySummary: 'A graph shows a curve with a movable point and a second point h to the right; a line through them (the secant) is drawn. As h shrinks the secant settles onto the tangent. The readouts list the secant slope, the exact tangent slope and their difference.',
  validationTests: ['math.test.ts: secant slopes approach the tangent slope', 'math.test.ts: exact derivatives for polynomials'],
  mastery: [{ objectiveId: 'math.calc.derivative', level: 'mastered' }, { objectiveId: 'math.calc.limit-slope', level: 'proficient' }],
  stages: [
    {
      kind: 'discover', title: 'How steep is a curve?', presets: ['secant:parabola'],
      blocks: [
        { type: 'text', md: 'A straight line has one slope. A curve like $y = x^2$ is gentle near the origin and steep farther out. What is its slope *at* $x = 3$?' },
        { type: 'prediction', id: 'pred-slope', question: 'The line through (3, 9) and (4, 16) has slope 7. What slope do you expect for the line that just touches the curve at x = 3?',
          options: [{ id: 'seven', text: 'Still 7' }, { id: 'six', text: 'A bit less: 6' }, { id: 'nine', text: 'A bit more: 9' }],
          correctId: 'six', revealPreset: 'secant:parabola',
          explanation: 'Shrink h with the chips. The secant slope goes 7, 6.5, 6.1, 6.01… The tangent slope at x = 3 is exactly 6.' },
      ],
    },
    {
      kind: 'explore', title: 'Shrink h', presets: ['secant:parabola', 'secant:cubic'],
      blocks: [
        { type: 'sim-task', preset: 'secant:parabola', instructions: 'Keep a = 3. Set h to 1, 0.5, 0.1 and 0.01 and record the secant slope each time. Then tick **Show the tangent line**.', observe: ['The four secant slopes', 'The value the slopes approach', 'What the readout "secant slope − tangent slope" equals for each h (compare it with h itself)'] },
        { type: 'text', md: 'Now load the cubic $y = x^3 - 3x$. Drag the point until the tangent is flat. Where does that happen, and what is the tangent slope there?' },
        { type: 'callout', tone: 'note', md: 'For polynomials the tangent slope in the readouts is exact, computed from the derivative formula. For functions like sin x it is a numerical estimate and is labelled as such.' },
      ],
    },
    {
      kind: 'understand', title: 'The derivative', presets: ['secant:parabola'],
      blocks: [
        { type: 'text', md: 'The **average rate of change** over an interval of width $h$ is the secant slope. The **instantaneous rate of change** at $a$ is what those slopes approach as $h$ shrinks to 0:' },
        { type: 'equation', latex: "f'(a) = \\lim_{h \\to 0} \\frac{f(a+h) - f(a)}{h}", caption: 'The derivative of f at a: the slope of the tangent line.' },
        { type: 'text', md: 'For $f(x) = x^2$ we can do the limit by algebra:' },
        { type: 'equation', latex: '\\frac{(x+h)^2 - x^2}{h} = \\frac{2xh + h^2}{h} = 2x + h \;\\xrightarrow{h \\to 0}\; 2x', caption: 'This is why the secant slope at x = 3 was always 6 + h.' },
        { type: 'text', md: 'Doing this for every power gives the **power rule**, and because limits respect sums and constant multiples, derivatives do too:' },
        { type: 'equation', latex: "\\frac{d}{dx}x^n = n x^{n-1}, \\qquad (cf + g)' = c f' + g'" },
        { type: 'summary', points: ['Secant slope = average rate; tangent slope = instantaneous rate = derivative.', "f'(x) is itself a function: for x² it is 2x.", 'Power rule: bring the exponent down, reduce it by one.'] },
      ],
    },
    {
      kind: 'practice', title: 'Practice', presets: ['secant:parabola'],
      blocks: [
        { type: 'problem', problemId: 'l3-secant' },
        { type: 'problem', problemId: 'l3-cube-at-2' },
        { type: 'problem', problemId: 'l3-rule' },
        { type: 'problem', problemId: 'l3-meaning' },
        { type: 'problem', problemId: 'l3-error' },
        { type: 'problem', problemId: 'l3-avg-vs-inst' },
      ],
    },
    {
      kind: 'apply', title: 'Motion', presets: ['secant:cubic'],
      blocks: [
        { type: 'text', md: 'A cart moves along a track with position $s(t) = t^3 - 3t$ metres at time $t$ seconds. Velocity is the rate of change of position.' },
        { type: 'problem', problemId: 'l3-velocity-expr' },
        { type: 'problem', problemId: 'l3-velocity-at-2' },
        { type: 'problem', problemId: 'l3-stop' },
      ],
    },
    {
      kind: 'demonstrate', title: 'Show what you know',
      blocks: [
        { type: 'text', md: 'Graph hidden.' },
        { type: 'problem', problemId: 'l3-demo-derivative' },
        { type: 'problem', problemId: 'l3-demo-tangent' },
      ],
    },
    { kind: 'review', title: 'Review', blocks: [{ type: 'summary', points: ["f'(a) = lim (f(a+h) − f(a))/h.", 'Power rule and linearity.', 'Derivative of position is velocity.'] }] },
  ],
  problems: [
    { id: 'l3-secant', kind: 'numeric', objectiveIds: ['math.calc.limit-slope'], category: 'computation', difficulty: 1, prompt: 'For $f(x) = x^2$, find the average rate of change between $x = 3$ and $x = 3.5$.', answer: { value: 6.5, relTol: 0.001 },
      misconceptions: [{ id: 'tangent', value: 6, feedback: 'That is the tangent slope (h → 0). The average over a width of 0.5 is 6 + h = 6.5.' }],
      hints: ['(f(3.5) − f(3)) / 0.5.', 'f(3.5) = 12.25, f(3) = 9.'], solution: '(12.25 − 9)/0.5 = 6.5.' },
    { id: 'l3-cube-at-2', kind: 'numeric', objectiveIds: ['math.calc.derivative'], category: 'computation', difficulty: 2, prompt: 'Find the slope of the tangent to $y = x^3$ at $x = 2$.', answer: { value: 12, relTol: 0.001 },
      misconceptions: [{ id: 'no-power-rule', value: 8, feedback: 'That is f(2) = 8, the height, not the slope. Differentiate first: 3x².' }, { id: 'forgot-coef', value: 4, feedback: 'The derivative of x³ is 3x², not x².' }],
      hints: ['Derivative of x³ is 3x².', 'Evaluate at x = 2.'], solution: '3·2² = 12.' },
    { id: 'l3-rule', kind: 'expression', objectiveIds: ['math.calc.derivative'], category: 'procedural', difficulty: 2, prompt: 'Differentiate $f(x) = 3x^2 - 2x + 1$.', answer: '6*x - 2', variables: [{ name: 'x', min: -5, max: 5 }],
      misconceptions: [{ id: 'kept-constant', expression: '6*x - 2 + 1', feedback: 'The derivative of a constant is 0.' }, { id: 'no-coefficient', expression: '2*x - 2', feedback: 'Keep the coefficient 3: d/dx (3x²) = 3·2x = 6x.' }],
      hints: ['Differentiate term by term.', 'd/dx 3x² = 6x; d/dx (−2x) = −2; d/dx 1 = 0.'], solution: "f'(x) = 6x − 2." },
    { id: 'l3-meaning', kind: 'multiple-choice', objectiveIds: ['math.calc.limit-slope'], category: 'conceptual', difficulty: 1, prompt: "What does $f'(4) = -3$ tell you about the graph of f?",
      options: [{ id: 'a', text: 'The graph passes through (4, −3)', feedback: "f'(4) is a slope, not a height." }, { id: 'b', text: 'At x = 4 the graph is falling, with the tangent dropping 3 units for each unit to the right', feedback: 'Correct.' }, { id: 'c', text: 'The graph has a minimum at x = 4', feedback: 'A minimum would have slope 0.' }],
      correctId: 'b', hints: ['The derivative is the slope of the tangent.'], solution: 'Negative derivative means decreasing, with steepness 3.' },
    { id: 'l3-error', kind: 'multiple-choice', objectiveIds: ['math.calc.derivative'], category: 'error-identification', difficulty: 2, prompt: 'A student writes: "the derivative of $x^3$ is $3x$". What is wrong?',
      options: [{ id: 'a', text: 'The exponent must also be reduced by one: 3x²', feedback: 'Correct: n xⁿ⁻¹ with n = 3.' }, { id: 'b', text: 'It should be x³/3', feedback: 'That is an antiderivative, the opposite operation.' }, { id: 'c', text: 'Nothing is wrong', feedback: 'Check with the secant tool at x = 2: the slope is 12, and 3·2 = 6 is not 12.' }],
      correctId: 'a', hints: ['Power rule: bring the exponent down and reduce it by one.'], solution: 'd/dx x³ = 3x².' },
    { id: 'l3-avg-vs-inst', kind: 'written', objectiveIds: ['math.calc.limit-slope'], category: 'explanation', difficulty: 3, prompt: 'Explain, in your own words, the difference between the average rate of change and the instantaneous rate of change, and how one is defined from the other.',
      modelAnswer: 'The average rate of change over an interval is the slope of the secant line through the endpoints: total change in output divided by the width of the interval. The instantaneous rate at a single point is the limit of those average rates as the interval shrinks to zero width, which is the slope of the tangent line. Shrinking the interval moves the secant onto the tangent.',
      rubric: ['Describes the average rate as a secant slope over an interval', 'Describes the instantaneous rate as a tangent slope at a point', 'States that the instantaneous rate is the limit of average rates as h → 0'], hints: ['Think of what you did with the h chips.'], solution: 'See model answer.' },
    { id: 'l3-velocity-expr', kind: 'expression', objectiveIds: ['math.calc.derivative'], category: 'modeling', difficulty: 2, prompt: 'Write the velocity $v(t)$ as an expression in t.', answer: '3*t^2 - 3', variables: [{ name: 't', min: 0, max: 5 }],
      misconceptions: [{ id: 'position', expression: 't^3 - 3*t', feedback: 'That is the position. Velocity is its derivative.' }],
      hints: ['Differentiate s(t) term by term.'], solution: 'v(t) = 3t² − 3.' },
    { id: 'l3-velocity-at-2', kind: 'numeric', objectiveIds: ['math.calc.derivative'], category: 'application', difficulty: 2, prompt: 'What is the velocity at $t = 2$ s? Give m/s.', answer: { value: 9, unit: 'm/s', relTol: 0.001 },
      misconceptions: [{ id: 'position', value: 2, feedback: 's(2) = 8 − 6 = 2 m is the position, not the velocity.' }],
      hints: ['v(2) = 3·2² − 3.'], solution: 'v(2) = 12 − 3 = 9 m/s.' },
    { id: 'l3-stop', kind: 'numeric', objectiveIds: ['math.calc.derivative'], category: 'transfer', difficulty: 3, prompt: 'At what positive time is the cart momentarily at rest? Give seconds.', answer: { value: 1, unit: 's', relTol: 0.001 },
      misconceptions: [{ id: 'position-zero', value: 1.732, relTol: 0.01, feedback: 'That is when the position is 0 (t = √3), not when the velocity is 0.' }],
      hints: ['At rest means v(t) = 0.', '3t² − 3 = 0.'], solution: 't² = 1 ⇒ t = 1 s.' },
    { id: 'l3-demo-derivative', kind: 'expression', objectiveIds: ['math.calc.derivative'], category: 'procedural', difficulty: 3, prompt: 'Differentiate $x^4 - 5x^2 + 2$.', answer: '4*x^3 - 10*x', variables: [{ name: 'x', min: -3, max: 3 }],
      misconceptions: [{ id: 'kept-constant', expression: '4*x^3 - 10*x + 2', feedback: 'The constant differentiates to 0.' }],
      hints: ['Power rule on each term.'], solution: '4x³ − 10x.' },
    { id: 'l3-demo-tangent', kind: 'numeric', objectiveIds: ['math.calc.derivative', 'math.calc.limit-slope'], category: 'transfer', difficulty: 3, prompt: 'Find the slope of the tangent line to $y = x^2 - 4x$ at $x = 1$.', answer: { value: -2, relTol: 0.001 },
      misconceptions: [{ id: 'height', value: -3, feedback: 'That is y(1) = −3, the height. The slope is y′(1) = 2(1) − 4.' }],
      hints: ["y' = 2x − 4."], solution: "y'(1) = 2 − 4 = −2." },
  ],
};
