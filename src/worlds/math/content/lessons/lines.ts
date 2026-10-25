import type { LessonSpec } from '@/core/world/spec';

/**
 * Lesson 1 — Lines and rate of change.
 * Reference values: slope (1,4)→(3,10) = 3; line slope −2 through (0,5): y = −2x + 5;
 * (2,7),(5,16): m = 3, b = 1; phone plan 15 + 0.1m = 27 → m = 120;
 * (−2,3),(4,−9): m = −2; (1,2),(3,8): y = 3x − 1.
 */
export const lines: LessonSpec = {
  id: 'math.lines',
  worldId: 'functions-calculus',
  title: 'Lines and rate of change',
  subtitle: 'Why a straight line is the same everywhere',
  minutes: 35,
  objectiveIds: ['math.func.linear'],
  prerequisiteObjectiveIds: ['math.ms.plot-points', 'math.alg.solve-linear'],
  standardRefs: [],
  accessibilitySummary: 'A graph shows a straight line with a movable point and a second point a distance h away. The readouts list the two y-values and the rate of change between them, which stays the same wherever the points are.',
  validationTests: ['math.test.ts: Polynomial evaluates', 'math.test.ts: secant slopes'],
  mastery: [{ objectiveId: 'math.func.linear', level: 'mastered' }],
  stages: [
    {
      kind: 'discover', title: 'A taxi ride', presets: ['graph:taxi'],
      blocks: [
        { type: 'text', md: 'A taxi charges **$3** to get in and **$2 for every kilometre**. We want a picture of the fare for any distance.' },
        {
          type: 'prediction', id: 'pred-taxi', question: 'What will the graph of fare against distance look like?',
          options: [{ id: 'origin', text: 'A straight line through the origin (0, 0)' }, { id: 'three', text: 'A straight line that starts at 3 on the fare axis' }, { id: 'curve', text: 'A curve that bends upward' }],
          correctId: 'three', revealPreset: 'graph:taxi',
          explanation: 'The fare is 3 before you move, so the line starts at (0, 3). Every extra kilometre adds the same $2, so it climbs steadily: a straight line.',
        },
        { type: 'text', md: 'Drag the blue point along the line. Watch the readout called **average rate of change**. Does it ever change?' },
      ],
    },
    {
      kind: 'explore', title: 'Measure the steepness', presets: ['graph:linear', 'graph:taxi'],
      blocks: [
        { type: 'sim-task', preset: 'graph:linear', instructions: 'For $y = 2x + 1$, drag the point to several places and change the step **h**.', observe: ['The rate of change (rise ÷ run) at a = 0, a = 2 and a = −3', 'Whether the rate changes when h is 1, 0.5 or 0.1', 'The y-value where the line crosses the y-axis'] },
        { type: 'text', md: 'Now load **Taxi fare** and read the rate of change. Which number in the taxi’s pricing is it?' },
        { type: 'callout', tone: 'note', md: 'The graph samples the line at many points and draws them; the numbers in the readouts are computed from the formula, not read off the pixels.' },
      ],
    },
    {
      kind: 'understand', title: 'Slope', presets: ['graph:linear'],
      blocks: [
        { type: 'text', md: 'The **slope** of a line is how much $y$ changes for each unit change in $x$:' },
        { type: 'equation', latex: 'm = \\frac{\\Delta y}{\\Delta x} = \\frac{y_2 - y_1}{x_2 - x_1}', caption: 'Rise over run between any two points on the line.' },
        { type: 'text', md: 'On a straight line this ratio is the same for *any* two points, which is exactly what you saw: the rate of change never moved. Every line can be written as' },
        { type: 'equation', latex: 'y = mx + b', caption: 'm = slope, b = y-intercept (the value of y when x = 0).' },
        { type: 'text', md: 'To find a line from two points: compute $m$ from the two points, then substitute one point into $y = mx + b$ to find $b$.' },
        { type: 'summary', points: ['Slope = rise ÷ run, constant along a line.', 'y = mx + b: m is the rate of change, b is the starting value.', 'Two points determine m, then one point gives b.'] },
      ],
    },
    {
      kind: 'practice', title: 'Practice', presets: ['graph:linear'],
      blocks: [
        { type: 'problem', problemId: 'l1-slope-two-points' },
        { type: 'problem', problemId: 'l1-equation' },
        { type: 'problem', problemId: 'l1-interpret' },
        { type: 'problem', problemId: 'l1-intercept' },
        { type: 'problem', problemId: 'l1-error' },
        { type: 'problem', problemId: 'l1-why-constant' },
      ],
    },
    {
      kind: 'apply', title: 'A new situation', presets: ['graph:linear'],
      blocks: [
        { type: 'text', md: 'A phone plan costs **$15 per month plus $0.10 per minute** of calls.' },
        { type: 'problem', problemId: 'l1-plan-expression' },
        { type: 'problem', problemId: 'l1-plan-minutes' },
      ],
    },
    {
      kind: 'demonstrate', title: 'Show what you know',
      blocks: [
        { type: 'text', md: 'Graph hidden. Work on paper.' },
        { type: 'problem', problemId: 'l1-demo-slope' },
        { type: 'problem', problemId: 'l1-demo-line' },
      ],
    },
    { kind: 'review', title: 'Review', blocks: [{ type: 'summary', points: ['m = Δy/Δx', 'y = mx + b', 'Slope is a rate: units of y per unit of x.'] }] },
  ],
  problems: [
    { id: 'l1-slope-two-points', kind: 'numeric', objectiveIds: ['math.func.linear'], category: 'computation', difficulty: 1, prompt: 'Find the slope of the line through $(1, 4)$ and $(3, 10)$.', answer: { value: 3, relTol: 0.001 },
      misconceptions: [{ id: 'run-over-rise', value: 1 / 3, feedback: 'You divided Δx by Δy. Slope is rise over run: Δy ÷ Δx.' }, { id: 'sum', value: 6, feedback: 'That is Δy alone. Divide by Δx = 2.' }],
      hints: ['Δy = 10 − 4, Δx = 3 − 1.', 'm = Δy / Δx.'], solution: 'm = (10 − 4)/(3 − 1) = 6/2 = 3.' },
    { id: 'l1-equation', kind: 'expression', objectiveIds: ['math.func.linear'], category: 'procedural', difficulty: 2, prompt: 'Write the equation of the line with slope $-2$ that crosses the y-axis at $5$. Give the right-hand side in terms of x.', answer: '-2*x + 5', variables: [{ name: 'x', min: -10, max: 10 }],
      misconceptions: [{ id: 'swapped', expression: '5*x - 2', feedback: 'The slope multiplies x; the intercept stands alone. y = mx + b with m = −2 and b = 5.' }],
      hints: ['y = mx + b.', 'm = −2, b = 5.'], solution: 'y = −2x + 5.' },
    { id: 'l1-interpret', kind: 'multiple-choice', objectiveIds: ['math.func.linear'], category: 'conceptual', difficulty: 1, prompt: 'For the taxi, fare $= 2d + 3$ (d in km). What does the 2 mean?',
      options: [{ id: 'a', text: 'The fare for a 1 km trip', feedback: 'A 1 km trip costs 2 + 3 = 5. The 2 is the extra cost of each kilometre.' }, { id: 'b', text: 'Each extra kilometre adds $2 to the fare', feedback: 'Correct: the slope is a rate, dollars per kilometre.' }, { id: 'c', text: 'The fare before the taxi moves', feedback: 'That is the 3, the intercept.' }],
      correctId: 'b', hints: ['Which number is the slope, and what are its units?'], solution: 'The slope 2 has units dollars per kilometre: the rate.' },
    { id: 'l1-intercept', kind: 'numeric', objectiveIds: ['math.func.linear'], category: 'multi-step', difficulty: 2, prompt: 'A line passes through $(2, 7)$ and $(5, 16)$. What is its y-intercept?', answer: { value: 1, relTol: 0.001 },
      misconceptions: [{ id: 'slope-as-intercept', value: 3, feedback: 'That is the slope. Substitute a point into y = 3x + b to find b.' }],
      hints: ['First find the slope: (16 − 7)/(5 − 2).', 'Then use y = mx + b with one of the points: 7 = 3·2 + b.'], solution: 'm = 9/3 = 3. Then 7 = 3(2) + b ⇒ b = 1.' },
    { id: 'l1-error', kind: 'multiple-choice', objectiveIds: ['math.func.linear'], category: 'error-identification', difficulty: 2, prompt: 'A student finds the slope through $(1, 2)$ and $(4, 11)$ as $m = \\frac{4 - 1}{11 - 2} = \\frac{1}{3}$. What went wrong?',
      options: [{ id: 'a', text: 'The points were subtracted in the wrong order', feedback: 'Order does not matter as long as it is consistent; the problem is which difference is on top.' }, { id: 'b', text: 'Δx was put over Δy instead of Δy over Δx', feedback: 'Correct: slope is Δy/Δx = 9/3 = 3.' }, { id: 'c', text: 'Nothing: 1/3 is right', feedback: 'Rise is 9, run is 3, so the slope is 3.' }],
      correctId: 'b', hints: ['Which coordinate is "rise"?'], solution: 'm = (11 − 2)/(4 − 1) = 3.' },
    { id: 'l1-why-constant', kind: 'written', objectiveIds: ['math.func.linear'], category: 'explanation', difficulty: 2, prompt: 'Explain why the average rate of change of $y = 2x + 1$ is the same between any two points, no matter how far apart they are.',
      modelAnswer: 'Between x₁ and x₂ the change in y is (2x₂ + 1) − (2x₁ + 1) = 2(x₂ − x₁). Dividing by the change in x, (x₂ − x₁), leaves 2 regardless of which points were chosen. The constant 1 cancels and the factor 2 is the slope.',
      rubric: ['Writes the difference of y-values and shows the constant term cancels', 'Shows the ratio simplifies to the slope 2 for any x₁, x₂', 'Connects the result to "straight line = constant rate"'], hints: ['Write y₂ − y₁ using the formula for both points.'], solution: 'See model answer.' },
    { id: 'l1-plan-expression', kind: 'expression', objectiveIds: ['math.func.linear'], category: 'modeling', difficulty: 2, prompt: 'Write the monthly cost $C$ in dollars as an expression in $m$, the number of call minutes.', answer: '15 + 0.1*m', variables: [{ name: 'm', min: 0, max: 1000 }],
      misconceptions: [{ id: 'swapped', expression: '15*m + 0.1', feedback: 'The per-minute rate multiplies m; the fixed fee stands alone.' }],
      hints: ['Fixed part + rate × minutes.'], solution: 'C = 15 + 0.1m.' },
    { id: 'l1-plan-minutes', kind: 'numeric', objectiveIds: ['math.func.linear'], category: 'transfer', difficulty: 3, prompt: 'A bill was $27. How many minutes of calls were made?', answer: { value: 120, relTol: 0.001 },
      misconceptions: [{ id: 'no-fee', value: 270, feedback: 'You forgot to subtract the $15 fixed fee first.' }],
      hints: ['Set 15 + 0.1m = 27.', 'Subtract 15, then divide by 0.1.'], solution: '0.1m = 12 ⇒ m = 120 minutes.' },
    { id: 'l1-demo-slope', kind: 'numeric', objectiveIds: ['math.func.linear'], category: 'application', difficulty: 2, prompt: 'Find the slope of the line through $(-2, 3)$ and $(4, -9)$.', answer: { value: -2, relTol: 0.001 },
      misconceptions: [{ id: 'sign', value: 2, feedback: 'Check the signs: y goes down by 12 while x goes up by 6.' }],
      hints: ['Δy = −9 − 3; Δx = 4 − (−2).'], solution: 'm = (−12)/(6) = −2.' },
    { id: 'l1-demo-line', kind: 'expression', objectiveIds: ['math.func.linear'], category: 'transfer', difficulty: 3, prompt: 'Write the equation of the line through $(1, 2)$ and $(3, 8)$. Give the right-hand side in terms of x.', answer: '3*x - 1', variables: [{ name: 'x', min: -10, max: 10 }],
      misconceptions: [{ id: 'intercept-from-point', expression: '3*x + 2', feedback: 'The y-intercept is not the y-value of the given point unless x = 0. Substitute (1, 2) into y = 3x + b.' }],
      hints: ['m = (8 − 2)/(3 − 1).', '2 = 3·1 + b.'], solution: 'm = 3; 2 = 3 + b ⇒ b = −1. y = 3x − 1.' },
  ],
};
