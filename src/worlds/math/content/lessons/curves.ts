import type { LessonSpec } from '@/core/world/spec';

/**
 * Lesson 2 — Shaping curves.
 * Reference values: x² − 6x + 5: vertex x = 3; (x − 2)² + 1 = x² − 4x + 5; roots of x² − 3x + 2: 1, 2;
 * h(t) = −5t² + 20t + 1: max at t = 2, h = 21; x² + 4x + 7 = (x + 2)² + 3; 2x² − 8: roots ±2.
 */
export const curves: LessonSpec = {
  id: 'math.curves',
  worldId: 'functions-calculus',
  title: 'Shaping curves',
  subtitle: 'Parabolas, their vertices, and how to move them',
  minutes: 40,
  objectiveIds: ['math.func.quadratic', 'math.func.transform'],
  prerequisiteObjectiveIds: ['math.func.linear', 'math.alg.factor-quadratic', 'math.alg.rearrange-formula'],
  standardRefs: [],
  accessibilitySummary: 'A graph shows a parabola. Four sliders a, b, h and k reshape it as y = a(b(x − h))² + k. The readouts list the vertex and x-intercepts computed exactly from the formula.',
  validationTests: ['math.test.ts: quadratic roots and vertex', 'math.test.ts: transforms polynomials exactly'],
  mastery: [{ objectiveId: 'math.func.quadratic', level: 'mastered' }, { objectiveId: 'math.func.transform', level: 'proficient' }],
  stages: [
    {
      kind: 'discover', title: 'Move it', presets: ['transform:parabola'],
      blocks: [
        { type: 'text', md: 'Here is $y = x^2$. Suppose we replace $x$ by $x - 3$ to get $y = (x-3)^2$.' },
        { type: 'prediction', id: 'pred-shift', question: 'Which way does the graph move?',
          options: [{ id: 'left', text: 'Left by 3 (because of the minus sign)' }, { id: 'right', text: 'Right by 3' }, { id: 'up', text: 'Up by 3' }],
          correctId: 'right', revealPreset: 'transform:right3',
          explanation: 'The new graph has its lowest point where x − 3 = 0, that is at x = 3. Subtracting inside the brackets moves the graph to the right: the input has to be 3 bigger to produce the same output.' },
      ],
    },
    {
      kind: 'explore', title: 'Four knobs', presets: ['transform:parabola'],
      blocks: [
        { type: 'sim-task', preset: 'transform:parabola', instructions: 'Move one slider at a time and watch the vertex readout.', observe: ['What k does to the vertex', 'What h does, and in which direction', 'What a does when it is 2, 0.5 and −1', 'What b does (compare b = 2 with a = 4)'] },
        { type: 'callout', tone: 'note', md: 'The readouts compute the vertex and intercepts exactly from the expanded polynomial; the drawing is just a picture of it.' },
      ],
    },
    {
      kind: 'understand', title: 'Three forms of a quadratic', presets: ['graph:quadratic'],
      blocks: [
        { type: 'equation', latex: 'y = a(x-h)^2 + k', caption: 'Vertex form: vertex at (h, k); a sets width and direction.' },
        { type: 'equation', latex: 'y = ax^2 + bx + c', caption: 'Standard form: c is the y-intercept; vertex at x = −b/(2a).' },
        { type: 'equation', latex: 'y = a(x-r_1)(x-r_2)', caption: 'Factored form: the x-intercepts are r₁ and r₂.' },
        { type: 'text', md: 'Expanding vertex form gives standard form; factoring standard form (when possible) gives the roots. The quadratic formula always gives the roots:' },
        { type: 'equation', latex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}' },
        { type: 'text', md: 'General transformation of any graph: $y = a\\,f(b(x-h)) + k$. Outside the function ($a$, $k$) acts on $y$: stretch, then shift up. Inside ($b$, $h$) acts on $x$: squeeze by $b$, shift right by $h$. Inside changes feel "backwards".' },
        { type: 'summary', points: ['Vertex form shows the vertex; factored form shows the roots.', 'Inside the brackets: horizontal, backwards. Outside: vertical, as written.', 'a < 0 flips the parabola.'] },
      ],
    },
    {
      kind: 'practice', title: 'Practice', presets: ['graph:quadratic'],
      blocks: [
        { type: 'problem', problemId: 'l2-vertex-x' },
        { type: 'problem', problemId: 'l2-expand' },
        { type: 'problem', problemId: 'l2-which-transform' },
        { type: 'problem', problemId: 'l2-roots' },
        { type: 'problem', problemId: 'l2-error' },
        { type: 'problem', problemId: 'l2-why-flip' },
      ],
    },
    {
      kind: 'apply', title: 'A ball in the air', presets: ['transform:parabola'],
      blocks: [
        { type: 'text', md: 'A ball thrown upward has height $h(t) = -5t^2 + 20t + 1$ metres after $t$ seconds (a simplified model with g ≈ 10 m/s²).' },
        { type: 'problem', problemId: 'l2-ball-time' },
        { type: 'problem', problemId: 'l2-ball-height' },
      ],
    },
    {
      kind: 'demonstrate', title: 'Show what you know',
      blocks: [
        { type: 'text', md: 'Graph hidden.' },
        { type: 'problem', problemId: 'l2-demo-vertex-form' },
        { type: 'problem', problemId: 'l2-demo-intercepts' },
      ],
    },
    { kind: 'review', title: 'Review', blocks: [{ type: 'summary', points: ['Vertex at x = −b/(2a).', 'Complete the square to reach vertex form.', 'Inside the brackets is horizontal and backwards.'] }] },
  ],
  problems: [
    { id: 'l2-vertex-x', kind: 'numeric', objectiveIds: ['math.func.quadratic'], category: 'computation', difficulty: 1, prompt: 'Find the x-coordinate of the vertex of $y = x^2 - 6x + 5$.', answer: { value: 3, relTol: 0.001 },
      misconceptions: [{ id: 'sign', value: -3, feedback: 'x = −b/(2a) with b = −6 gives +3.' }, { id: 'no-half', value: 6, feedback: 'Divide by 2a, not by a.' }],
      hints: ['x = −b/(2a).'], solution: 'x = −(−6)/(2·1) = 3.' },
    { id: 'l2-expand', kind: 'expression', objectiveIds: ['math.func.quadratic'], category: 'procedural', difficulty: 2, prompt: 'Expand $(x - 2)^2 + 1$ into standard form.', answer: 'x^2 - 4*x + 5', variables: [{ name: 'x', min: -10, max: 10 }],
      misconceptions: [{ id: 'no-middle', expression: 'x^2 + 4 + 1', feedback: '(x − 2)² is not x² + 4: the middle term −4x is missing.' }, { id: 'sign-middle', expression: 'x^2 + 4*x + 5', feedback: 'Check the sign of the middle term: 2·x·(−2) = −4x.' }],
      hints: ['(x − 2)² = x² − 4x + 4.'], solution: 'x² − 4x + 4 + 1 = x² − 4x + 5.' },
    { id: 'l2-which-transform', kind: 'multiple-choice', objectiveIds: ['math.func.transform'], category: 'conceptual', difficulty: 2, prompt: 'Starting from $y = x^2$, which graph is $y = -2x^2$?',
      options: [{ id: 'a', text: 'Opens downward and is narrower (twice as steep)', feedback: 'Correct: a = −2 flips and stretches vertically.' }, { id: 'b', text: 'Opens downward and is wider', feedback: '|a| > 1 makes it steeper, not wider.' }, { id: 'c', text: 'Shifted down by 2', feedback: 'A shift would be −2 added, not multiplied.' }],
      correctId: 'a', hints: ['a multiplies every y-value.'], solution: 'Multiplying by −2 reflects across the x-axis and doubles every height.' },
    { id: 'l2-roots', kind: 'numeric', objectiveIds: ['math.func.quadratic'], category: 'computation', difficulty: 2, prompt: 'What is the larger x-intercept of $y = x^2 - 3x + 2$?', answer: { value: 2, relTol: 0.001 },
      misconceptions: [{ id: 'smaller', value: 1, feedback: 'That is the smaller root. The question asks for the larger one.' }],
      hints: ['Factor: (x − 1)(x − 2).'], solution: 'Roots 1 and 2; the larger is 2.' },
    { id: 'l2-error', kind: 'multiple-choice', objectiveIds: ['math.func.transform'], category: 'error-identification', difficulty: 2, prompt: 'A student says: "$y = (x+3)^2$ is $y = x^2$ shifted right by 3, because +3 is positive." Where is the mistake?',
      options: [{ id: 'a', text: 'Inside the brackets the shift is backwards: x + 3 moves the graph left by 3', feedback: 'Correct: the vertex is where x + 3 = 0, at x = −3.' }, { id: 'b', text: 'It should be a vertical shift up by 3', feedback: 'A vertical shift would be x² + 3, outside the square.' }, { id: 'c', text: 'There is no mistake', feedback: 'Check the vertex: x = −3.' }],
      correctId: 'a', hints: ['Where is the vertex of (x + 3)²?'], solution: 'The vertex is at x = −3: a shift left.' },
    { id: 'l2-why-flip', kind: 'written', objectiveIds: ['math.func.transform'], category: 'explanation', difficulty: 2, prompt: 'Explain why a negative value of $a$ makes the parabola open downward.',
      modelAnswer: 'a multiplies every output of (x − h)². Those outputs are never negative, so when a < 0 every y-value (apart from the vertex) becomes negative or smaller than k, placing the whole curve below the vertex. The vertex becomes a maximum instead of a minimum.',
      rubric: ['States that (x − h)² ≥ 0', 'Explains that multiplying by a negative number makes those values ≤ 0', 'Concludes the vertex is a maximum'], hints: ['What sign does (x − h)² have?'], solution: 'See model answer.' },
    { id: 'l2-ball-time', kind: 'numeric', objectiveIds: ['math.func.quadratic'], category: 'application', difficulty: 3, prompt: 'When is the ball highest? Give the time in seconds.', answer: { value: 2, unit: 's', relTol: 0.01 },
      misconceptions: [{ id: 'root', value: 4.05, relTol: 0.02, feedback: 'That is roughly when the ball lands (h = 0), not when it is highest.' }],
      hints: ['The highest point is the vertex: t = −b/(2a) with a = −5, b = 20.'], solution: 't = −20/(2·(−5)) = 2 s.' },
    { id: 'l2-ball-height', kind: 'numeric', objectiveIds: ['math.func.quadratic'], category: 'transfer', difficulty: 3, prompt: 'What is the maximum height in metres?', answer: { value: 21, unit: 'm', relTol: 0.01 },
      misconceptions: [{ id: 'forgot-plus-1', value: 20, feedback: 'h(2) = −20 + 40 + 1. Do not drop the starting height.' }],
      hints: ['Substitute t = 2 into h(t).'], solution: 'h(2) = −5(4) + 20(2) + 1 = 21 m.' },
    { id: 'l2-demo-vertex-form', kind: 'expression', objectiveIds: ['math.func.quadratic'], category: 'procedural', difficulty: 3, prompt: 'Write $x^2 + 4x + 7$ in vertex form $a(x-h)^2 + k$ (enter the expression).', answer: '(x+2)^2 + 3', variables: [{ name: 'x', min: -10, max: 10 }],
      misconceptions: [{ id: 'wrong-k', expression: '(x+2)^2 + 7', feedback: 'Completing the square adds 4 inside, so subtract it: k = 7 − 4 = 3.' }, { id: 'wrong-h', expression: '(x-2)^2 + 3', feedback: 'x² + 4x comes from (x + 2)², not (x − 2)².' }],
      hints: ['Half of 4 is 2; (x + 2)² = x² + 4x + 4.', 'x² + 4x + 7 = (x + 2)² − 4 + 7.'], solution: '(x + 2)² + 3.' },
    { id: 'l2-demo-intercepts', kind: 'numeric', objectiveIds: ['math.func.quadratic'], category: 'transfer', difficulty: 2, prompt: 'What is the positive x-intercept of $y = 2x^2 - 8$?', answer: { value: 2, relTol: 0.001 },
      misconceptions: [{ id: 'four', value: 4, feedback: 'Solve 2x² = 8 ⇒ x² = 4 ⇒ x = ±2, not 4.' }],
      hints: ['Set y = 0 and solve for x.'], solution: '2x² = 8 ⇒ x² = 4 ⇒ x = 2 (positive root).' },
  ],
};
