import type { LessonSpec } from '@/core/world/spec';

/**
 * Lesson 2 — Kepler's third law and weighing the Sun.
 * Reference values: Mars a = 1.524 au → T = 1.881 yr. Sun mass from Earth's orbit:
 *   M = 4π²a³/(GT²) with a = 1.496e11 m, T = 3.156e7 s → 1.99e30 kg.
 *   Io: a = 4.217e8 m, T = 1.769 d → M_Jupiter = 1.90e27 kg.
 *   Geostationary: T = 86 164 s → r = 4.216e7 m → altitude ≈ 35 800 km.
 */
export const keplersThirdLaw: LessonSpec = {
  id: 'gravity.keplers-third-law',
  worldId: 'gravity',
  title: 'Kepler’s third law',
  subtitle: 'Weighing the Sun with a stopwatch',
  minutes: 40,
  objectiveIds: ['phys.orbit.kepler3', 'phys.grav.law'],
  prerequisiteObjectiveIds: ['phys.orbit.circular-speed', 'math.alg.rearrange-formula', 'math.alg.powers-roots'],
  standardRefs: [],
  accessibilitySummary:
    'The simulation shows the Sun with the eight planets moving on their orbits (distances compressed for display). A table lists each planet’s distance and period so the pattern T² ∝ a³ can be examined numerically.',
  validationTests: ['gravity.test.ts: planetary data obey Kepler’s third law', 'gravity.test.ts: solar system preset reproduces Earth’s year'],
  mastery: [{ objectiveId: 'phys.orbit.kepler3', level: 'mastered' }, { objectiveId: 'phys.grav.law', level: 'proficient' }],
  stages: [
    {
      kind: 'discover',
      title: 'Slow giants, quick dwarfs',
      presets: ['solar-system'],
      blocks: [
        { type: 'text', md: 'Here is the solar system running at thousands of times real speed. Mercury races around the Sun; Neptune crawls.' },
        { type: 'callout', tone: 'warning', md: 'Distances and planet sizes are **compressed for display**: on a true scale Neptune would be 30 times farther out than Earth and the planets would be invisible dots. The motion itself is computed from real masses and distances.' },
        {
          type: 'prediction',
          id: 'pred-double-distance',
          question: 'A planet twice as far from the Sun as Earth: how long is its year?',
          options: [
            { id: 'two', text: 'Twice as long: 2 years' },
            { id: 'between', text: 'Between 2 and 4 years' },
            { id: 'four', text: 'Four times as long: 4 years' },
          ],
          correctId: 'between',
          revealPreset: 'solar-system',
          explanation: 'Mars is 1.52 times farther than Earth and takes 1.88 years. Jupiter is 5.2 times farther and takes 11.9 years. A planet at twice Earth’s distance takes 2^1.5 ≈ 2.83 years: the path is twice as long and the planet also moves more slowly.',
        },
      ],
    },
    {
      kind: 'explore',
      title: 'Find the pattern',
      presets: ['solar-system'],
      blocks: [
        {
          type: 'sim-task',
          preset: 'solar-system',
          instructions: 'Use the data table under the simulation. For each planet compute $a^3$ and $T^2$ (with $a$ in astronomical units and $T$ in years).',
          observe: ['How a³ and T² compare for Earth (a = 1, T = 1)', 'How they compare for Mars and for Jupiter', 'Whether the ratio T²/a³ is the same for every planet'],
        },
        { type: 'text', md: 'Now select **Earth** as the focus body in the panel and compare the predicted period in the measurements with the year you see elapse.' },
      ],
    },
    {
      kind: 'understand',
      title: 'From Newton to Kepler',
      presets: ['solar-system'],
      blocks: [
        { type: 'text', md: 'In the last lesson you derived the period of a circular orbit:' },
        { type: 'equation', latex: 'T = 2\\pi\\sqrt{\\frac{a^3}{GM}}\\quad\\Longrightarrow\\quad T^2 = \\frac{4\\pi^2}{GM}\\,a^3' },
        { type: 'text', md: 'The factor $4\\pi^2/GM$ depends only on the central body. So for every object orbiting the same body, $T^2/a^3$ is the **same constant**. This is Kepler’s third law, found from observations in 1619; Newton later showed *why* it is true. It also holds for elliptical orbits if $a$ is the semi-major axis.' },
        { type: 'text', md: 'Turn it around and the law becomes a scale for weighing planets and stars: measure $a$ and $T$ for anything orbiting a body and you get its mass:' },
        { type: 'equation', latex: 'M = \\frac{4\\pi^2 a^3}{G\\,T^2}' },
        { type: 'callout', tone: 'note', md: 'This is how we know the mass of the Sun, of Jupiter (from its moons), and of distant stars with planets. In astronomical units and years, orbits around the Sun satisfy simply $T^2 = a^3$.' },
        { type: 'summary', points: ['T²/a³ is constant for all orbits around the same primary.', 'T² = (4π²/GM) a³ follows from Newton’s laws.', 'Measure a and T of any orbiting body → mass of the primary.'] },
      ],
    },
    {
      kind: 'practice',
      title: 'Practice',
      presets: ['solar-system'],
      blocks: [
        { type: 'problem', problemId: 'l2-fastest' },
        { type: 'problem', problemId: 'l2-mars-year' },
        { type: 'problem', problemId: 'l2-derive-mass' },
        { type: 'problem', problemId: 'l2-weigh-sun' },
        { type: 'problem', problemId: 'l2-force-compare' },
      ],
    },
    {
      kind: 'apply',
      title: 'Apply it elsewhere',
      presets: ['solar-system'],
      blocks: [
        { type: 'problem', problemId: 'l2-jupiter-mass' },
        { type: 'problem', problemId: 'l2-why-same' },
      ],
    },
    {
      kind: 'demonstrate',
      title: 'Show what you know',
      blocks: [
        { type: 'text', md: 'Simulation hidden. Solve independently.' },
        { type: 'problem', problemId: 'l2-demo-geostationary' },
        { type: 'problem', problemId: 'l2-demo-exoplanet' },
      ],
    },
    {
      kind: 'review',
      title: 'Review',
      blocks: [
        { type: 'summary', points: ['Kepler’s third law: T² ∝ a³ for one primary.', 'M = 4π²a³/(GT²).', 'In au and years, T² = a³ for the Sun.'] },
      ],
    },
  ],
  problems: [
    {
      id: 'l2-fastest', kind: 'multiple-choice', objectiveIds: ['phys.orbit.kepler3'], category: 'conceptual', difficulty: 1,
      prompt: 'Which planet moves fastest along its orbit, and why?',
      options: [
        { id: 'a', text: 'Jupiter, because it is the most massive planet.', feedback: 'A planet’s own mass does not appear in v = √(GM/r); M is the Sun’s mass.' },
        { id: 'b', text: 'Mercury, because it is closest to the Sun, where gravity is strongest and the required orbital speed is highest.', feedback: 'Correct: v = √(GM_sun / r) is largest for the smallest r.' },
        { id: 'c', text: 'Neptune, because it has the longest path to cover.', feedback: 'A longer path does not mean a higher speed; Neptune moves slowest, which is one reason its year is so long.' },
      ],
      correctId: 'b',
      hints: ['Think about v = √(GM/r). Which quantity differs between planets?'],
      solution: 'Speed depends only on the Sun’s mass and the distance r. Mercury has the smallest r, so the largest speed (about 47 km/s versus Earth’s 30 km/s).',
    },
    {
      id: 'l2-mars-year', kind: 'numeric', objectiveIds: ['phys.orbit.kepler3'], category: 'computation', difficulty: 2,
      prompt: 'Mars orbits at 1.524 au. Using Kepler’s third law in au and years, how long is a Martian year (in Earth years)?',
      answer: { value: 1.881 * 365.25 * 86400, unit: 's', relTol: 0.02, assumeUnit: 'years' },
      misconceptions: [
        { id: 'linear', value: 1.524 * 365.25 * 86400, feedback: 'You assumed the period scales linearly with distance. T² = a³, so T = a^1.5.' },
        { id: 'cubed', value: 3.54 * 365.25 * 86400, feedback: 'You computed a³ = T², which is the square of the period. Take the square root.' },
        { id: 'squared', value: 2.32 * 365.25 * 86400, feedback: 'You squared the distance. The law is T² = a³, so T = a^1.5 = a√a.' },
      ],
      hints: ['T² = a³ when a is in au and T in years.', 'a³ = 1.524³ ≈ 3.54. Then T = √3.54.'],
      solution: 'T = √(1.524³) = √3.54 ≈ 1.88 years (687 days).',
    },
    {
      id: 'l2-derive-mass', kind: 'expression', objectiveIds: ['phys.orbit.kepler3'], category: 'procedural', difficulty: 2,
      prompt: 'Starting from $T^2 = \\dfrac{4\\pi^2}{GM}a^3$, solve for the mass $M$ of the central body. Use the symbols G, T, a and pi.',
      answer: '4*pi^2*a^3/(G*T^2)',
      variables: [
        { name: 'G', min: 1e-11, max: 1e-10 },
        { name: 'T', min: 1e3, max: 1e9 },
        { name: 'a', min: 1e6, max: 1e13 },
      ],
      misconceptions: [
        { id: 'no-constants', expression: 'a^3/(G*T^2)', feedback: 'You dropped the 4π². It came from T = 2π√(a³/GM): squaring gives 4π².' },
        { id: 'inverted', expression: 'G*T^2/(4*pi^2*a^3)', feedback: 'That is 1/M. Check which side M ends up on.' },
      ],
      hints: ['Multiply both sides by GM.', 'Divide both sides by T².'],
      solution: 'T²·GM = 4π²a³ ⇒ M = 4π²a³ / (G T²).',
    },
    {
      id: 'l2-weigh-sun', kind: 'numeric', objectiveIds: ['phys.orbit.kepler3'], category: 'multi-step', difficulty: 3,
      prompt: 'Earth orbits the Sun at $a = 1.496\\times10^{11}$ m with a period of 365.25 days. Use this to compute the mass of the Sun in kilograms.',
      answer: { value: 1.99e30, unit: 'kg', relTol: 0.03 },
      misconceptions: [
        { id: 'days-not-seconds', value: 1.99e30 * 86400 * 86400, relTol: 0.05, feedback: 'The period must be in seconds. 365.25 days × 86,400 s/day = 3.156×10⁷ s.' },
      ],
      hints: ['M = 4π²a³/(GT²). Convert T to seconds first.', 'T = 365.25 × 86,400 = 3.156×10⁷ s; a³ = (1.496×10¹¹)³ = 3.35×10³³ m³.', 'M = 39.48 × 3.35×10³³ / (6.674×10⁻¹¹ × 9.96×10¹⁴).'],
      solution: 'M = 4π²(1.496×10¹¹)³ / (6.674×10⁻¹¹ × (3.156×10⁷)²) = 1.32×10³⁵ / 6.65×10⁴ ≈ 1.99×10³⁰ kg.',
    },
    {
      id: 'l2-force-compare', kind: 'numeric', objectiveIds: ['phys.grav.law'], category: 'conceptual', difficulty: 2,
      prompt: 'Two asteroids attract each other with a gravitational force $F$. If the distance between them is tripled and the mass of one asteroid is doubled, the new force is what multiple of $F$? Enter a number.',
      answer: { value: 2 / 9, relTol: 0.01 },
      misconceptions: [
        { id: 'inverse-linear', value: 2 / 3, feedback: 'Gravity falls off as 1/r², not 1/r. Tripling the distance divides the force by 9.' },
        { id: 'forgot-mass', value: 1 / 9, feedback: 'You accounted for the distance but not the doubled mass.' },
      ],
      hints: ['F = G m₁ m₂ / r². What happens to the denominator when r → 3r?', 'Multiply the effect of doubling a mass by the effect of tripling the distance.'],
      solution: 'Doubling a mass doubles F; tripling r divides F by 3² = 9. New force = 2F/9 ≈ 0.222 F.',
    },
    {
      id: 'l2-jupiter-mass', kind: 'numeric', objectiveIds: ['phys.orbit.kepler3'], category: 'transfer', difficulty: 4,
      prompt: 'Jupiter’s moon Io orbits at 421,700 km from Jupiter’s centre with a period of 1.769 days. What is the mass of Jupiter?',
      answer: { value: 1.90e27, unit: 'kg', relTol: 0.03 },
      hints: ['Which body’s mass does Io’s orbit measure?', 'M = 4π²a³/(GT²), with a in metres and T in seconds: a = 4.217×10⁸ m, T = 1.769 × 86,400 s.'],
      solution: 'T = 1.528×10⁵ s. M = 39.48 × (4.217×10⁸)³ / (6.674×10⁻¹¹ × (1.528×10⁵)²) = 2.96×10²⁷ / 1.558 ≈ 1.90×10²⁷ kg, about 318 Earth masses.',
    },
    {
      id: 'l2-why-same', kind: 'written', objectiveIds: ['phys.orbit.kepler3'], category: 'explanation', difficulty: 3,
      prompt: 'The ratio $T^2/a^3$ is the same for all eight planets, but Jupiter’s moons give a different value of $T^2/a^3$ from the planets. Explain why, using the formula.',
      modelAnswer: 'T²/a³ = 4π²/(GM), where M is the mass of the body being orbited. All planets orbit the Sun, so they share the Sun’s M and therefore the same ratio. Jupiter’s moons orbit Jupiter, whose mass is about 1000 times smaller than the Sun’s, so their T²/a³ is about 1000 times larger.',
      rubric: ['Identifies that M in 4π²/(GM) is the mass of the central body', 'States that all planets share the Sun as the central body', 'Explains that Jupiter’s smaller mass gives a larger (different) ratio for its moons'],
      hints: ['Write out what the constant T²/a³ equals in terms of G and M.'],
      solution: 'See model answer.',
    },
    {
      id: 'l2-demo-geostationary', kind: 'numeric', objectiveIds: ['phys.orbit.kepler3'], category: 'application', difficulty: 4,
      prompt: 'A geostationary satellite orbits Earth once per sidereal day (86,164 s) so that it stays above one point on the equator. How high above Earth’s surface is it? (Earth: M = 5.97×10²⁴ kg, R = 6371 km.) Answer in km.',
      answer: { value: 3.58e7, unit: 'm', relTol: 0.02, assumeUnit: 'km' },
      misconceptions: [
        { id: 'radius-not-altitude', value: 4.216e7, relTol: 0.015, feedback: 'That is the orbital radius measured from Earth’s centre. Subtract Earth’s radius to get the altitude.' },
      ],
      hints: ['Rearrange T² = 4π²a³/(GM) for a: a = ∛(GMT²/4π²).', 'GM T²/(4π²) = 3.98×10¹⁴ × 7.42×10⁹ / 39.48 ≈ 7.49×10²².', 'Cube root gives the orbital radius; subtract 6371 km.'],
      solution: 'a = ∛(3.98×10¹⁴ × (86,164)² / 4π²) = ∛(7.49×10²²) ≈ 4.216×10⁷ m = 42,160 km. Altitude = 42,160 − 6371 ≈ 35,800 km.',
    },
    {
      id: 'l2-demo-exoplanet', kind: 'numeric', objectiveIds: ['phys.orbit.kepler3'], category: 'transfer', difficulty: 4,
      prompt: 'An exoplanet orbits its star every 3.52 days at a distance of 0.047 au (1 au = 1.496×10¹¹ m). Estimate the mass of the star in units of the Sun’s mass (1.99×10³⁰ kg). Enter a number.',
      answer: { value: 1.11, relTol: 0.04 },
      hints: ['Use M = 4π²a³/(GT²) in SI, then divide by 1.99×10³⁰.', 'a = 0.047 × 1.496×10¹¹ = 7.03×10⁹ m; T = 3.52 × 86,400 = 3.04×10⁵ s.'],
      solution: 'M = 39.48 × (7.03×10⁹)³ / (6.674×10⁻¹¹ × (3.04×10⁵)²) ≈ 1.37×10³⁰ / 6.17 ≈ 2.2×10³⁰ kg ≈ 1.1 solar masses.',
    },
  ],
};
