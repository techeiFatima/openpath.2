import type { LessonSpec } from '@/core/world/spec';

/**
 * Lesson 3 — Escape.
 * Reference values: v_esc(Earth surface) = 11.19 km/s; v_esc(Moon) = 2.37 km/s;
 *   v_esc / v_circ = √2; ε(ISS orbit) = −μ/(2r) = −2.94e7 J/kg.
 */
export const escape: LessonSpec = {
  id: 'gravity.escape',
  worldId: 'gravity',
  title: 'Escape',
  subtitle: 'Energy decides who stays and who leaves',
  minutes: 40,
  objectiveIds: ['phys.orbit.energy'],
  prerequisiteObjectiveIds: ['phys.orbit.circular-speed', 'math.alg.rearrange-formula'],
  standardRefs: [],
  accessibilitySummary:
    'The simulation launches a probe from low Earth orbit at adjustable speed. Below a threshold the path is a closed ellipse; at the threshold the probe coasts away forever, slowing but never stopping. A panel reports the specific orbital energy, whose sign marks the boundary.',
  validationTests: ['gravity.test.ts: Earth surface escape speed', 'gravity.test.ts: orbit classification from launch conditions'],
  mastery: [{ objectiveId: 'phys.orbit.energy', level: 'mastered' }],
  stages: [
    {
      kind: 'discover',
      title: 'Faster and faster',
      presets: ['orbit-lab:fast'],
      blocks: [
        { type: 'text', md: 'In lesson 1 you saw that going faster than the circular speed stretches the orbit into an ellipse. Keep pushing. Is there a speed at which the probe never comes back?' },
        {
          type: 'prediction',
          id: 'pred-escape',
          question: 'Starting from the Space Station’s orbit (circular speed 7.67 km/s), roughly what launch speed makes the probe never return?',
          options: [
            { id: 'ten', text: 'About 10% faster (≈ 8.4 km/s)' },
            { id: 'root2', text: 'About 41% faster (≈ 10.8 km/s)' },
            { id: 'double', text: 'Double (≈ 15.3 km/s)' },
          ],
          correctId: 'root2',
          revealPreset: 'orbit-lab:escape',
          explanation: 'At √2 times the circular speed the probe’s kinetic energy exactly matches what gravity can take away over an infinite climb. Watch the specific-energy reading pass through zero.',
        },
      ],
    },
    {
      kind: 'explore',
      title: 'Watch the energy',
      presets: ['orbit-lab:iss', 'orbit-lab:free'],
      blocks: [
        {
          type: 'sim-task',
          preset: 'orbit-lab:iss',
          instructions: 'Increase the launch speed slowly from 7.7 km/s to 11 km/s and watch the **specific orbital energy** reading and the shape of the path.',
          observe: ['The sign of the energy when the orbit is a closed ellipse', 'The speed at which the energy reaches zero and what the path looks like then', 'Whether the farthest point (apoapsis) still exists above that speed', 'Whether the sign of the energy changes as the probe moves along one orbit'],
        },
        { type: 'text', md: 'Now switch the central body to the **Moon**. Is escaping the Moon easier or harder? Try to predict the number before you read it.' },
      ],
    },
    {
      kind: 'understand',
      title: 'Energy in a gravitational field',
      presets: ['orbit-lab:iss'],
      blocks: [
        { type: 'text', md: 'Gravitational potential energy per kilogram, with zero chosen at infinite distance, is' },
        { type: 'equation', latex: 'U = -\\frac{GM}{r}' },
        { type: 'text', md: 'It is negative everywhere and climbs toward zero as $r$ grows. Adding kinetic energy per kilogram gives the **specific orbital energy**, which is constant along any orbit because gravity does no net work around a closed path:' },
        { type: 'equation', latex: '\\varepsilon = \\tfrac{1}{2}v^2 - \\frac{GM}{r}' },
        { type: 'text', md: 'If $\\varepsilon < 0$ the object cannot reach infinity: it is **bound** and moves on an ellipse. If $\\varepsilon \\ge 0$ it can: it **escapes**. The boundary $\\varepsilon = 0$ gives the escape speed:' },
        { type: 'equation', latex: '\\tfrac{1}{2}v_{esc}^2 = \\frac{GM}{r} \\quad\\Longrightarrow\\quad v_{esc} = \\sqrt{\\frac{2GM}{r}} = \\sqrt{2}\\,v_{circ}' },
        { type: 'callout', tone: 'note', md: 'The projectile’s own mass cancels: a pebble and a spacecraft need the same escape speed. And escape speed depends on where you start: it is 11.2 km/s at Earth’s surface but only 10.8 km/s from the Space Station’s altitude.' },
        { type: 'summary', points: ['ε = v²/2 − GM/r is constant along an orbit.', 'ε < 0 bound (ellipse); ε = 0 parabola; ε > 0 hyperbola.', 'v_esc = √(2GM/r) = √2 × v_circ at the same r.'] },
      ],
    },
    {
      kind: 'practice',
      title: 'Practice',
      presets: ['orbit-lab:iss'],
      blocks: [
        { type: 'problem', problemId: 'l3-straight-up' },
        { type: 'problem', problemId: 'l3-derive-vesc' },
        { type: 'problem', problemId: 'l3-earth-vesc' },
        { type: 'problem', problemId: 'l3-ratio' },
      ],
    },
    {
      kind: 'apply',
      title: 'Apply',
      presets: ['orbit-lab:free'],
      blocks: [
        { type: 'problem', problemId: 'l3-moon-vesc' },
        { type: 'problem', problemId: 'l3-mass-independent' },
      ],
    },
    {
      kind: 'demonstrate',
      title: 'Show what you know',
      blocks: [
        { type: 'text', md: 'Simulation hidden. Solve independently.' },
        { type: 'problem', problemId: 'l3-demo-energy' },
        { type: 'problem', problemId: 'l3-demo-bound' },
      ],
    },
    {
      kind: 'review',
      title: 'Review',
      blocks: [{ type: 'summary', points: ['Sign of ε decides bound vs escape.', 'v_esc = √(2GM/r).', 'Mass of the moving object never matters.'] }],
    },
  ],
  problems: [
    {
      id: 'l3-straight-up', kind: 'multiple-choice', objectiveIds: ['phys.orbit.energy'], category: 'conceptual', difficulty: 2,
      prompt: 'A probe is fired straight up from an airless planet at exactly the escape speed. What happens?',
      options: [
        { id: 'a', text: 'It rises, stops at some height, and falls back.', feedback: 'That happens below escape speed (ε < 0).' },
        { id: 'b', text: 'It keeps rising forever, slowing down continuously, with its speed approaching zero only as its distance approaches infinity.', feedback: 'Correct: ε = 0 means kinetic energy runs out exactly at infinite distance.' },
        { id: 'c', text: 'It keeps rising at constant speed once it leaves the atmosphere.', feedback: 'Gravity keeps pulling at every distance, so the probe keeps slowing.' },
      ],
      correctId: 'b',
      hints: ['Write ε = v²/2 − GM/r = 0 and ask what v is when r is very large.'],
      solution: 'With ε = 0, v² = 2GM/r at every distance, which tends to zero as r → ∞ but is never zero at any finite r.',
    },
    {
      id: 'l3-derive-vesc', kind: 'expression', objectiveIds: ['phys.orbit.energy'], category: 'procedural', difficulty: 2,
      prompt: 'Set the specific orbital energy $\\tfrac{1}{2}v^2 - GM/r$ to zero and solve for $v$. Use the symbols G, M and r.',
      answer: 'sqrt(2*G*M/r)',
      variables: [
        { name: 'G', min: 1e-11, max: 1e-10 },
        { name: 'M', min: 1e22, max: 1e31 },
        { name: 'r', min: 1e6, max: 1e13 },
      ],
      misconceptions: [
        { id: 'circular', expression: 'sqrt(G*M/r)', feedback: 'That is the circular-orbit speed. Setting ε = 0 gives v² = 2GM/r: keep the factor 2.' },
        { id: 'no-sqrt', expression: '2*G*M/r', feedback: 'You have v². Take the square root.' },
      ],
      hints: ['½v² = GM/r.', 'Multiply by 2 and take the square root.'],
      solution: '½v² = GM/r ⇒ v² = 2GM/r ⇒ v = √(2GM/r).',
    },
    {
      id: 'l3-earth-vesc', kind: 'numeric', objectiveIds: ['phys.orbit.energy'], category: 'computation', difficulty: 2,
      prompt: 'Compute the escape speed from Earth’s surface (M = 5.97×10²⁴ kg, R = 6371 km) in km/s.',
      answer: { value: 11_186, unit: 'm/s', relTol: 0.015 },
      misconceptions: [
        { id: 'circular', value: 7_909, relTol: 0.02, feedback: 'That is the circular-orbit speed at the surface. Escape needs a factor √2 more.' },
        { id: 'no-sqrt', value: 1.251e8, feedback: 'You computed v², not v.' },
      ],
      hints: ['v = √(2GM/R).', '2GM/R = 2 × 3.98×10¹⁴ / 6.371×10⁶ ≈ 1.25×10⁸ m²/s².'],
      solution: 'v = √(1.25×10⁸) ≈ 1.12×10⁴ m/s = 11.2 km/s.',
    },
    {
      id: 'l3-ratio', kind: 'numeric', objectiveIds: ['phys.orbit.energy'], category: 'conceptual', difficulty: 2,
      prompt: 'At any distance from any body, the escape speed divided by the circular-orbit speed equals the same number. What is it? Enter a number.',
      answer: { value: Math.SQRT2, relTol: 0.01 },
      misconceptions: [{ id: 'two', value: 2, relTol: 0.01, feedback: 'The energy is doubled, so the speed is multiplied by √2, not 2.' }],
      hints: ['Divide √(2GM/r) by √(GM/r).'],
      solution: '√(2GM/r) / √(GM/r) = √2 ≈ 1.414.',
    },
    {
      id: 'l3-moon-vesc', kind: 'numeric', objectiveIds: ['phys.orbit.energy'], category: 'transfer', difficulty: 3,
      prompt: 'The Moon has mass 7.3×10²² kg and radius 1737 km. What speed must a rock leaving the Moon’s surface have to escape its gravity? Answer in km/s.',
      answer: { value: 2_369, unit: 'm/s', relTol: 0.02 },
      hints: ['Same formula, different body: v = √(2GM/R).', 'GM_moon = 6.674e-11 × 7.3e22 = 4.87×10¹² m³/s².'],
      solution: 'v = √(2 × 4.87×10¹² / 1.737×10⁶) = √(5.61×10⁶) ≈ 2.37 km/s, about a fifth of Earth’s. This is why the Apollo ascent stage could be so small.',
    },
    {
      id: 'l3-mass-independent', kind: 'written', objectiveIds: ['phys.orbit.energy'], category: 'explanation', difficulty: 3,
      prompt: 'Explain, using energy, why the escape speed does not depend on the mass of the object escaping.',
      modelAnswer: 'Kinetic energy ½mv² and gravitational potential energy −GMm/r are both proportional to the object’s mass m. Setting their sum to zero and dividing through by m removes it entirely: ½v² = GM/r. Doubling the mass doubles the energy needed but also doubles the kinetic energy available at a given speed, so the required speed is unchanged.',
      rubric: ['Writes both energy terms with the object’s mass m', 'Shows (or states) that m cancels when the total energy is set to zero', 'Gives a physical interpretation (energy needed and energy available both scale with m)'],
      hints: ['Write the total energy with the mass m in both terms, then set it to zero.'],
      solution: 'See model answer.',
    },
    {
      id: 'l3-demo-energy', kind: 'numeric', objectiveIds: ['phys.orbit.energy'], category: 'application', difficulty: 4,
      prompt: 'A satellite is in a circular orbit 400 km above Earth (r = 6.771×10⁶ m, GM = 3.98×10¹⁴ m³/s²). Compute its specific orbital energy ε in J/kg (include the sign).',
      answer: { value: -2.94e7, unit: 'J/kg', relTol: 0.02 },
      misconceptions: [
        { id: 'positive', value: 2.94e7, relTol: 0.02, feedback: 'The magnitude is right but a bound orbit has negative energy. Check the sign of the potential term.' },
        { id: 'potential-only', value: -5.88e7, relTol: 0.02, feedback: 'That is the potential energy alone. Add the kinetic term ½v².' },
      ],
      hints: ['For a circular orbit v² = GM/r, so ½v² = GM/(2r).', 'ε = GM/(2r) − GM/r = −GM/(2r).'],
      solution: 'ε = −GM/(2r) = −3.98×10¹⁴ / (2 × 6.771×10⁶) ≈ −2.94×10⁷ J/kg.',
    },
    {
      id: 'l3-demo-bound', kind: 'multiple-choice', objectiveIds: ['phys.orbit.energy'], category: 'transfer', difficulty: 4,
      prompt: 'A comet is observed 5 au from the Sun moving at 19 km/s. (GM_sun = 1.327×10²⁰ m³/s², 1 au = 1.496×10¹¹ m.) Will it return?',
      options: [
        { id: 'a', text: 'Yes: its specific energy is negative, so it is bound.', feedback: 'Compute ε: ½(19,000)² − 1.327×10²⁰/(7.48×10¹¹) = 1.81×10⁸ − 1.77×10⁸ > 0.' },
        { id: 'b', text: 'No: its specific energy is positive, so it is on a hyperbolic path and will leave the solar system.', feedback: 'Correct: ½v² = 1.81×10⁸ J/kg exceeds GM/r = 1.77×10⁸ J/kg.' },
        { id: 'c', text: 'Cannot be decided without knowing the comet’s mass.', feedback: 'The comet’s mass cancels from the energy condition.' },
      ],
      correctId: 'b',
      hints: ['Compute ½v² and GM/r separately and compare.', 'r = 5 × 1.496×10¹¹ m.'],
      solution: '½v² = 1.805×10⁸ J/kg; GM/r = 1.327×10²⁰ / 7.48×10¹¹ = 1.774×10⁸ J/kg. ε ≈ +3×10⁶ J/kg > 0: unbound (hyperbolic). The escape speed at 5 au is 18.8 km/s, just below 19 km/s.',
    },
  ],
};
