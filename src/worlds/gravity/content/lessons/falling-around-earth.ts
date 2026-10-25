import type { LessonSpec } from '@/core/world/spec';

/**
 * Lesson 1 — Falling around the Earth.
 * Reference values (SI, computed from the data in model/bodies.ts with G = 6.6743e-11):
 *   μ_Earth = 3.985e14 m³/s²;  r_ISS = 6.371e6 + 4.00e5 = 6.771e6 m
 *   g(r_ISS) = 8.69 m/s²;  v_c = 7672 m/s;  T = 5545 s = 92.4 min
 *   Phobos: r = 9.376e6 m, μ_Mars = 4.284e13 → T = 2.757e4 s = 7.66 h
 */
export const fallingAroundEarth: LessonSpec = {
  id: 'gravity.falling-around-earth',
  worldId: 'gravity',
  title: 'Falling around the Earth',
  subtitle: 'Why the Space Station never comes down',
  minutes: 45,
  objectiveIds: ['phys.grav.field', 'phys.orbit.falling', 'phys.orbit.circular-speed'],
  prerequisiteObjectiveIds: ['phys.grav.law', 'phys.mech.newton2', 'phys.mech.centripetal', 'math.alg.rearrange-formula'],
  standardRefs: [],
  accessibilitySummary:
    'The simulation shows a planet at the centre and a small probe launched sideways from a chosen height. Depending on launch speed the probe falls back to the surface, circles the planet, traces an ellipse, or escapes. A text panel lists the live distance, speed, and the computed circular and escape speeds.',
  validationTests: ['gravity.test.ts: ISS-altitude circular speed and period', 'gravity.test.ts: keeps a circular orbit circular and conserves energy', 'gravity.test.ts: a too-slow probe crashes'],
  mastery: [
    { objectiveId: 'phys.orbit.circular-speed', level: 'mastered' },
    { objectiveId: 'phys.grav.field', level: 'proficient' },
    { objectiveId: 'phys.orbit.falling', level: 'proficient' },
  ],
  stages: [
    {
      kind: 'discover',
      title: 'A strange fact',
      presets: ['orbit-lab:iss'],
      blocks: [
        { type: 'text', md: 'The International Space Station is about **400 km** above the ground. Astronauts inside float. Most people say: *"because there is no gravity up there."*' },
        { type: 'text', md: 'Here is the station in orbit. Watch it for a moment. It never gets closer to Earth, yet nothing holds it up.' },
        {
          type: 'prediction',
          id: 'pred-gravity-strength',
          question: 'How strong is Earth\u2019s gravity at the altitude of the Space Station compared with the ground?',
          options: [
            { id: 'zero', text: 'Essentially zero: that is why astronauts float' },
            { id: 'half', text: 'About half as strong' },
            { id: 'ninety', text: 'About 90% as strong' },
          ],
          correctId: 'ninety',
          revealPreset: 'orbit-lab:iss',
          explanation: 'Read the panel: gravitational acceleration at the station is about 8.7 m/s², roughly 90% of the 9.8 m/s² at the surface. Gravity is almost as strong up there. Something else must explain the floating.',
        },
        {
          type: 'prediction',
          id: 'pred-stop',
          question: 'Suppose the station suddenly stopped moving sideways (speed set to zero). What would happen?',
          options: [
            { id: 'stay', text: 'It would hang there, because there is almost no gravity' },
            { id: 'fall', text: 'It would fall straight down and hit the Earth' },
            { id: 'drift', text: 'It would slowly drift away into space' },
          ],
          correctId: 'fall',
          revealPreset: 'orbit-lab:stopped',
          explanation: 'With no sideways motion the station falls straight down, just like a dropped stone. The station is always falling. What keeps it up is not a lack of gravity but its enormous sideways speed.',
        },
      ],
    },
    {
      kind: 'explore',
      title: 'Newton\u2019s cannon',
      presets: ['orbit-lab:cannon', 'orbit-lab:free'],
      blocks: [
        { type: 'text', md: 'Newton imagined a cannon on a very tall mountain. Fire the ball slowly and it lands nearby. Fire it faster and it lands farther away. Fire it fast enough and the ground curves away as fast as the ball falls: it never lands.' },
        {
          type: 'sim-task',
          preset: 'orbit-lab:cannon',
          instructions: 'Use the **Speed** slider. Start at 4 km/s and raise the speed in steps of about 0.5 km/s, pressing Reset and Play each time.',
          observe: [
            'The lowest speed at which the probe completes a full orbit without crashing',
            'What the orbit looks like when you go a little faster than that (round or stretched?)',
            'What the panel says the "speed needed for a circular orbit" is at this height',
            'What happens when you exceed the "escape speed"',
          ],
        },
        { type: 'callout', tone: 'assumption', md: 'Simplifications: Earth is a smooth sphere with no atmosphere, and the probe is a point mass. Real low orbits decay because of air drag.' },
        { type: 'text', md: 'Now try a different world: pick the **Moon** or **Mars** as the central body. Does the speed needed for orbit go up or down? Why might that be?' },
      ],
    },
    {
      kind: 'understand',
      title: 'Why one speed gives a circle',
      presets: ['orbit-lab:iss'],
      blocks: [
        { type: 'text', md: 'Gravity pulls the probe toward the centre with acceleration' },
        { type: 'equation', latex: 'g = \\frac{GM}{r^2}', caption: 'G = 6.674 × 10⁻¹¹ N·m²/kg², M = mass of the central body, r = distance from its centre (not the altitude!).' },
        { type: 'text', md: 'Moving in a circle of radius $r$ at speed $v$ requires a centre-directed acceleration of $v^2/r$. For a circular orbit, gravity must supply exactly that:' },
        { type: 'equation', latex: '\\frac{v^2}{r} = \\frac{GM}{r^2} \\quad\\Longrightarrow\\quad v = \\sqrt{\\frac{GM}{r}}' },
        { type: 'text', md: 'There is exactly one speed for a circular orbit at each distance. Too slow and gravity wins: the path bends inward into an ellipse that dips closer to the planet (or hits it). Too fast and the path swings outward into a wider ellipse.' },
        { type: 'text', md: 'The time for one orbit is the circumference divided by the speed:' },
        { type: 'equation', latex: 'T = \\frac{2\\pi r}{v} = 2\\pi\\sqrt{\\frac{r^3}{GM}}' },
        { type: 'callout', tone: 'note', md: 'Notice what is **not** in these formulas: the mass of the satellite. A feather and a space station at the same height need the same speed. That is why astronauts float alongside their station: both are falling together.' },
        { type: 'summary', points: ['Gravity at the ISS is ~90% of surface gravity.', 'An orbit is free fall plus enough sideways speed that the ground curves away.', 'Circular orbit: v = √(GM/r), T = 2π√(r³/GM). Use the distance from the centre.'] },
      ],
    },
    {
      kind: 'practice',
      title: 'Practice',
      presets: ['orbit-lab:iss'],
      blocks: [
        { type: 'text', md: 'Work these with pen and paper. Use $G = 6.674\\times10^{-11}$, $M_{Earth} = 5.97\\times10^{24}$ kg, $R_{Earth} = 6371$ km. The simulation stays open for checking.' },
        { type: 'problem', problemId: 'l1-floating' },
        { type: 'problem', problemId: 'l1-g-at-iss' },
        { type: 'problem', problemId: 'l1-derive-v' },
        { type: 'problem', problemId: 'l1-iss-speed' },
        { type: 'problem', problemId: 'l1-iss-period' },
        { type: 'problem', problemId: 'l1-error' },
      ],
    },
    {
      kind: 'apply',
      title: 'A new situation',
      presets: ['orbit-lab:free'],
      blocks: [
        { type: 'text', md: 'Nothing here is about Earth. Decide for yourself which relationships apply.' },
        { type: 'problem', problemId: 'l1-phobos' },
        { type: 'problem', problemId: 'l1-double-radius' },
      ],
    },
    {
      kind: 'demonstrate',
      title: 'Show what you know',
      blocks: [
        { type: 'text', md: 'The simulation is hidden for this stage. Solve without hints to earn full mastery credit.' },
        { type: 'problem', problemId: 'l1-demo-geo-speed' },
        { type: 'problem', problemId: 'l1-demo-moon-of-jupiter' },
      ],
    },
    {
      kind: 'review',
      title: 'Review',
      blocks: [
        { type: 'summary', points: ['Orbit = falling + sideways speed.', 'g = GM/r² uses the distance from the centre.', 'v = √(GM/r); T = 2π√(r³/GM); neither depends on the satellite\u2019s mass.'] },
        { type: 'text', md: 'Your mastery for each objective is shown below. Objectives at *developing* get a spaced review in a few days. If the derivation felt shaky, revisit **Rearranging formulas** before the next lesson.' },
      ],
    },
  ],
  problems: [
    {
      id: 'l1-floating', kind: 'multiple-choice', objectiveIds: ['phys.orbit.falling', 'phys.grav.field'], category: 'conceptual', difficulty: 1,
      prompt: 'Astronauts on the Space Station float. Which statement is correct?',
      options: [
        { id: 'a', text: 'There is no gravity 400 km up.', feedback: 'Gravity there is about 90% of its surface value. Check the simulation panel.' },
        { id: 'b', text: 'Gravity is nearly as strong as on the ground, but the astronauts and the station are falling together, so nothing pushes them against the floor.', feedback: 'Correct. Free fall feels like weightlessness even though gravity is strong.' },
        { id: 'c', text: 'Earth\u2019s gravity is cancelled by the Moon\u2019s gravity at that height.', feedback: 'The Moon is 380,000 km away; its pull at the station is tiny compared with Earth\u2019s.' },
      ],
      correctId: 'b',
      hints: ['Look at the gravitational acceleration reading in the simulation panel.', 'What would you feel in an elevator whose cable snapped?'],
      solution: 'Gravity at 400 km is about 8.7 m/s². The station and everyone in it accelerate toward Earth at that same rate, so there is no contact force between an astronaut and the floor: they float while falling together.',
    },
    {
      id: 'l1-g-at-iss', kind: 'numeric', objectiveIds: ['phys.grav.field'], category: 'computation', difficulty: 2,
      prompt: 'Compute the gravitational acceleration at the altitude of the Space Station (400 km above the surface).',
      answer: { value: 8.69, unit: 'm/s^2', relTol: 0.02 },
      misconceptions: [
        { id: 'altitude-not-radius', value: 2.49e3, feedback: 'You used the altitude (400 km) as r. The distance in the formula is measured from the centre of the Earth: r = 6371 km + 400 km.' },
        { id: 'surface-value', value: 9.82, relTol: 0.015, feedback: 'That is g at the surface. The station is 400 km higher, so r is larger and g is smaller.' },
      ],
      hints: ['Use g = GM/r².', 'r is the distance from the centre of the Earth: 6371 km + 400 km, converted to metres.', 'GM = 6.674e-11 × 5.97e24 = 3.98e14 m³/s². Divide by (6.771e6 m)².'],
      solution: 'r = 6.371×10⁶ + 4.00×10⁵ = 6.771×10⁶ m. g = GM/r² = 3.98×10¹⁴ / (6.771×10⁶)² = 3.98×10¹⁴ / 4.585×10¹³ ≈ 8.69 m/s². About 89% of surface gravity.',
    },
    {
      id: 'l1-derive-v', kind: 'expression', objectiveIds: ['phys.orbit.circular-speed'], category: 'procedural', difficulty: 2,
      prompt: 'Set the centripetal acceleration $v^2/r$ equal to the gravitational acceleration $GM/r^2$ and solve for the circular-orbit speed $v$. Enter your expression using the symbols G, M and r.',
      answer: 'sqrt(G*M/r)',
      variables: [
        { name: 'G', min: 1e-11, max: 1e-10 },
        { name: 'M', min: 1e22, max: 1e31 },
        { name: 'r', min: 1e6, max: 1e13 },
      ],
      misconceptions: [
        { id: 'no-sqrt', expression: 'G*M/r', feedback: 'You found v², not v. Take the square root.' },
        { id: 'r-squared', expression: 'sqrt(G*M/r^2)', feedback: 'Check the algebra: v²/r = GM/r² → multiply both sides by r → v² = GM/r.' },
        { id: 'escape', expression: 'sqrt(2*G*M/r)', feedback: 'That is the escape speed. The circular speed has no factor of 2.' },
      ],
      hints: ['Write the equation v²/r = GM/r².', 'Multiply both sides by r.', 'Take the square root of both sides.'],
      solution: 'v²/r = GM/r² ⇒ v² = GM/r ⇒ v = √(GM/r).',
    },
    {
      id: 'l1-iss-speed', kind: 'numeric', objectiveIds: ['phys.orbit.circular-speed'], category: 'computation', difficulty: 2,
      prompt: 'How fast must the Space Station move to stay in a circular orbit 400 km above the surface? Give your answer in km/s or m/s.',
      answer: { value: 7672, unit: 'm/s', relTol: 0.015 },
      misconceptions: [
        { id: 'no-sqrt', value: 5.89e7, feedback: 'You computed GM/r but forgot the square root.' },
        { id: 'altitude-not-radius', value: 3.16e4, feedback: 'You used the altitude as r. Measure r from the centre of the Earth.' },
        { id: 'escape', value: 1.085e4, feedback: 'That is the escape speed (√2 times too large). A circular orbit needs √(GM/r), with no factor 2.' },
      ],
      hints: ['v = √(GM/r) with r = 6.771×10⁶ m.', 'GM/r = 3.98×10¹⁴ / 6.771×10⁶ ≈ 5.89×10⁷ m²/s².', 'Take the square root: √(5.89×10⁷) ≈ 7.67×10³ m/s.'],
      solution: 'v = √(3.98×10¹⁴ / 6.771×10⁶) = √(5.89×10⁷) ≈ 7.67 km/s, about 27,600 km/h.',
    },
    {
      id: 'l1-iss-period', kind: 'numeric', objectiveIds: ['phys.orbit.circular-speed'], category: 'multi-step', difficulty: 3,
      prompt: 'How long does the Space Station take to go once around the Earth? Answer in minutes.',
      answer: { value: 5545, unit: 's', relTol: 0.02, assumeUnit: 'min' },
      misconceptions: [
        { id: 'altitude-circumference', value: 2 * Math.PI * 4e5 / 7672, feedback: 'You used the altitude for the circumference. The orbit\u2019s radius is measured from the centre of the Earth.' },
        { id: 'seconds-as-minutes', value: 5545 * 60, feedback: 'You seem to have reported seconds as minutes. Divide by 60.' },
      ],
      hints: ['Period = distance around the orbit ÷ speed.', 'Circumference = 2πr = 2π × 6.771×10⁶ m ≈ 4.25×10⁷ m.', '4.25×10⁷ m ÷ 7672 m/s ≈ 5545 s. Convert to minutes.'],
      solution: 'T = 2πr/v = 2π(6.771×10⁶)/7672 ≈ 5545 s ≈ 92.4 minutes. Equivalently T = 2π√(r³/GM).',
    },
    {
      id: 'l1-error', kind: 'multiple-choice', objectiveIds: ['phys.orbit.circular-speed', 'phys.grav.field'], category: 'error-identification', difficulty: 2,
      prompt: 'A student computes the Space Station\u2019s speed as $v=\\sqrt{GM/h}$ with $h = 400$ km and gets 31.6 km/s. What went wrong?',
      options: [
        { id: 'a', text: 'They should have used the escape-speed formula.', feedback: 'No: the question asks for a circular orbit speed, which has no factor of 2.' },
        { id: 'b', text: 'They used the altitude instead of the distance from the centre of the Earth.', feedback: 'Correct. r = 6371 km + 400 km = 6771 km, which gives 7.67 km/s.' },
        { id: 'c', text: 'They forgot to convert G to km units.', feedback: 'G is fine in SI if everything else is in SI. The error is in r.' },
      ],
      correctId: 'b',
      hints: ['31.6 km/s is about 4 times too big. What would make GM/r about 16 times too big?', 'Compare 400 km with 6771 km.'],
      solution: 'Using r = 400 km instead of 6771 km makes r about 17 times too small and v about √17 ≈ 4 times too large.',
    },
    {
      id: 'l1-phobos', kind: 'numeric', objectiveIds: ['phys.orbit.circular-speed'], category: 'transfer', difficulty: 3,
      prompt: 'Phobos orbits Mars at a distance of 9376 km from the centre of Mars. Mars has mass $6.42\\times10^{23}$ kg. Assuming a circular orbit, how long does Phobos take to orbit Mars? Answer in hours.',
      answer: { value: 27_570, unit: 's', relTol: 0.02, assumeUnit: 'h' },
      misconceptions: [
        { id: 'earth-mass', value: 7_142, relTol: 0.03, feedback: 'You used Earth\u2019s mass. This orbit is around Mars.' },
      ],
      hints: ['Which quantities does the period depend on? T = 2π√(r³/GM).', 'GM for Mars = 6.674e-11 × 6.42e23 ≈ 4.28e13 m³/s².', 'r³ = (9.376e6)³ ≈ 8.24e20 m³. T = 2π√(8.24e20 / 4.28e13).'],
      solution: 'GM = 4.28×10¹³. r³/GM = 8.24×10²⁰ / 4.28×10¹³ = 1.93×10⁷ s². √ = 4388 s; × 2π = 27,570 s ≈ 7.66 hours. (The real value is 7.65 h: Phobos\u2019 orbit is nearly circular.)',
    },
    {
      id: 'l1-double-radius', kind: 'written', objectiveIds: ['phys.orbit.circular-speed'], category: 'explanation', difficulty: 3,
      prompt: 'A classmate says: "If you double the radius of a circular orbit, the speed halves, because v is proportional to 1/r." Explain, using the formula, by what factor the speed really changes and why.',
      modelAnswer: 'v = √(GM/r), so v is proportional to 1/√r, not 1/r. Doubling r multiplies v by 1/√2 ≈ 0.707: the speed drops by about 29%, not 50%. The reason is that gravity weakens as 1/r², but the centripetal acceleration needed also drops as the circle gets bigger (v²/r), so the required speed falls more slowly than the force does.',
      rubric: ['States that v ∝ 1/√r (or equivalent)', 'Gives the factor 1/√2 ≈ 0.71 (about 29% slower)', 'Connects the result to the formula v = √(GM/r), not just an assertion'],
      hints: ['Write v for radius r and for radius 2r and divide.'],
      solution: 'See model answer.',
    },
    {
      id: 'l1-demo-geo-speed', kind: 'numeric', objectiveIds: ['phys.orbit.circular-speed'], category: 'application', difficulty: 3,
      prompt: 'A communications satellite is in a circular orbit of radius 42,200 km around Earth. What is its orbital speed in km/s?',
      answer: { value: 3072, unit: 'm/s', relTol: 0.02 },
      misconceptions: [
        { id: 'km-not-m', value: 97_150, relTol: 0.03, feedback: 'You left r in kilometres. Convert to metres before using G in SI units.' },
      ],
      hints: ['v = √(GM/r) with r = 4.22×10⁷ m.', 'GM/r = 3.98×10¹⁴ / 4.22×10⁷ ≈ 9.44×10⁶ m²/s².'],
      solution: 'v = √(3.98×10¹⁴ / 4.22×10⁷) = √(9.44×10⁶) ≈ 3.07 km/s.',
    },
    {
      id: 'l1-demo-moon-of-jupiter', kind: 'numeric', objectiveIds: ['phys.orbit.circular-speed', 'phys.grav.field'], category: 'transfer', difficulty: 4,
      prompt: 'Jupiter\u2019s moon Europa orbits at 671,000 km from Jupiter\u2019s centre. Jupiter\u2019s mass is $1.90\\times10^{27}$ kg. Find Europa\u2019s orbital period in days (assume a circular orbit).',
      answer: { value: 306_800, unit: 's', relTol: 0.02, assumeUnit: 'days' },
      hints: ['T = 2π√(r³/GM). Convert r to metres.', 'GM = 6.674e-11 × 1.90e27 = 1.268e17 m³/s²; r³ = (6.71e8)³ ≈ 3.02e26 m³.'],
      solution: 'r³/GM = 3.02×10²⁶ / 1.268×10¹⁷ = 2.38×10⁹ s². √ = 48,800 s; × 2π ≈ 306,800 s ≈ 3.55 days. (Observed: 3.55 days.)',
    },
  ],
};
