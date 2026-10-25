import type { CoverageStatus, LearningObjective, StandardRef } from '@/core/curriculum/types';

/**
 * Curriculum slice implemented by Gravity Lab. Standard codes are cited with a short
 * paraphrase only (see docs/03-resource-registry.md on NGSS reuse terms). The wording was
 * checked on 2026-10-25 against sources quoting the official NGSS page; the official page
 * itself was unreachable from the build environment, so `verified` is false.
 */
const NGSS_HS_PS2_4: StandardRef = {
  framework: 'NGSS',
  code: 'HS-PS2-4',
  summary: 'Use mathematical representations of Newton’s Law of Gravitation (and Coulomb’s Law) to describe and predict forces between objects; assessment limited to two-object systems.',
  url: 'https://www.nextgenscience.org/pe/hs-ps2-4-motion-and-stability-forces-and-interactions',
  verified: false,
  verificationNote: 'Wording cross-checked via secondary sources on 2026-10-25; official page blocked from build environment.',
};
const NGSS_HS_ESS1_4: StandardRef = {
  framework: 'NGSS',
  code: 'HS-ESS1-4',
  summary: 'Use mathematical or computational representations to predict the motion of orbiting objects in the solar system; Newtonian gravity incl. human-made satellites; two bodies, no calculus.',
  url: 'https://www.nextgenscience.org/pe/hs-ess1-4-earths-place-universe',
  verified: false,
  verificationNote: 'Wording cross-checked via secondary sources on 2026-10-25; official page blocked from build environment.',
};

/** Prerequisite objectives that live in other (not yet implemented) parts of the catalog. */
export const GRAVITY_PREREQUISITES: LearningObjective[] = [
  { id: 'math.alg.rearrange-formula', conceptId: 'math.alg.literal-equations', statement: 'Rearrange a formula to isolate a chosen variable, including variables under a square root or squared.', cognitiveLevel: 'apply', prerequisiteIds: [], standardRefs: [{ framework: 'CCSS-M', code: 'HSA-CED.A.4', summary: 'Rearrange formulas to highlight a quantity of interest.', verified: false }] },
  { id: 'math.alg.powers-roots', conceptId: 'math.alg.exponents', statement: 'Evaluate expressions with squares, cubes, square roots and cube roots, including scientific notation.', cognitiveLevel: 'apply', prerequisiteIds: [], standardRefs: [] },
  { id: 'phys.mech.newton2', conceptId: 'phys.mech.forces', statement: 'Relate net force, mass and acceleration with F = ma and identify the forces acting on an object.', cognitiveLevel: 'apply', prerequisiteIds: [], standardRefs: [{ framework: 'NGSS', code: 'HS-PS2-1', summary: 'Analyze data to support the claim that F = ma.', verified: false }] },
  { id: 'phys.mech.centripetal', conceptId: 'phys.mech.circular-motion', statement: 'Explain that uniform circular motion requires a centre-directed acceleration a = v²/r.', cognitiveLevel: 'understand', prerequisiteIds: ['phys.mech.newton2'], standardRefs: [] },
];

export const GRAVITY_OBJECTIVES: LearningObjective[] = [
  {
    id: 'phys.grav.law',
    conceptId: 'phys.grav.universal-gravitation',
    statement: 'Use F = G m₁m₂ / r² to compute and compare gravitational forces, and explain how force changes with mass and distance.',
    cognitiveLevel: 'apply',
    prerequisiteIds: ['math.alg.powers-roots', 'phys.mech.newton2'],
    standardRefs: [NGSS_HS_PS2_4],
  },
  {
    id: 'phys.grav.field',
    conceptId: 'phys.grav.universal-gravitation',
    statement: 'Compute the gravitational acceleration g = GM / r² at any distance from a body and explain why astronauts in low orbit are not weightless because gravity is absent.',
    cognitiveLevel: 'apply',
    prerequisiteIds: ['phys.grav.law'],
    standardRefs: [NGSS_HS_PS2_4],
  },
  {
    id: 'phys.orbit.falling',
    conceptId: 'phys.orbit.orbital-motion',
    statement: 'Explain an orbit as continuous free fall combined with sideways motion, and predict qualitatively what happens when the sideways speed is too small or too large.',
    cognitiveLevel: 'understand',
    prerequisiteIds: ['phys.grav.field', 'phys.mech.centripetal'],
    standardRefs: [NGSS_HS_ESS1_4],
  },
  {
    id: 'phys.orbit.circular-speed',
    conceptId: 'phys.orbit.orbital-motion',
    statement: 'Derive v = √(GM/r) and T = 2π√(r³/GM) for a circular orbit from Newton’s second law and apply them to satellites and moons.',
    cognitiveLevel: 'apply',
    prerequisiteIds: ['phys.orbit.falling', 'math.alg.rearrange-formula'],
    standardRefs: [NGSS_HS_ESS1_4],
  },
  {
    id: 'phys.orbit.kepler3',
    conceptId: 'phys.orbit.kepler-laws',
    statement: 'Use Kepler’s third law T² ∝ a³ to relate period and distance for bodies orbiting the same primary, and infer the mass of the primary from an orbit.',
    cognitiveLevel: 'analyze',
    prerequisiteIds: ['phys.orbit.circular-speed'],
    standardRefs: [NGSS_HS_ESS1_4],
  },
  {
    id: 'phys.orbit.energy',
    conceptId: 'phys.orbit.energy-and-escape',
    statement: 'Use specific orbital energy ε = v²/2 − GM/r to decide whether an object is bound, and derive and apply the escape speed v = √(2GM/r).',
    cognitiveLevel: 'analyze',
    prerequisiteIds: ['phys.orbit.circular-speed'],
    standardRefs: [NGSS_HS_ESS1_4],
  },
];

export const GRAVITY_COVERAGE: CoverageStatus[] = GRAVITY_OBJECTIVES.map((o) => ({
  objectiveId: o.id,
  planned: true,
  authored: true,
  implemented: true,
  scientificallyReviewed: false,
  learnerTested: false,
  notes: 'Model validated by automated tests; content not yet reviewed by a second physicist or tested with learners.',
}));
