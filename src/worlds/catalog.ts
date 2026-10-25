import type { Concept, Course, CurriculumGraph, Level, Subject, Topic, Unit } from '@/core/curriculum/types';
import { GRAVITY_COVERAGE, GRAVITY_OBJECTIVES, GRAVITY_PREREQUISITES } from './gravity/content/curriculum';
import { MATH_CONCEPTS, MATH_COVERAGE, MATH_OBJECTIVES, MATH_PREREQUISITES, MATH_TOPICS, MATH_UNITS } from './math/content/curriculum';

/**
 * The OpenPath curriculum catalog.
 *
 * Status legend for honesty about coverage:
 *  - Subjects, levels and courses below are the PLANNED framework (see docs/02-curriculum-framework.md).
 *  - Units/topics/concepts/objectives exist only where content has been authored.
 *  - CoverageStatus rows say what is implemented, reviewed and learner-tested per objective.
 * Nothing here should be read as "covered" unless its coverage row says implemented.
 */

export const SUBJECTS: Subject[] = [
  { id: 'mathematics', name: 'Mathematics', tagline: 'An infinite canvas for numbers, shapes, functions and proof.' },
  { id: 'physics', name: 'Physics', tagline: 'A universe you can push, pull and measure.' },
  { id: 'chemistry', name: 'Chemistry', tagline: 'Build atoms and molecules; test what really bonds.' },
  { id: 'biology', name: 'Biology', tagline: 'Travel from molecules to ecosystems.' },
  { id: 'language', name: 'Language', tagline: 'Talk your way through real situations.' },
];

const L = (id: string, subjectId: Subject['id'], name: string, kind: Level['kind'], order: number): Level => ({ id, subjectId, name, kind, order });

export const LEVELS: Level[] = [
  L('math.prek', 'mathematics', 'Pre-K and Kindergarten', 'early-childhood', 0),
  L('math.elementary', 'mathematics', 'Elementary (Grades 1–5)', 'grade-band', 1),
  L('math.middle', 'mathematics', 'Middle School (Grades 6–8)', 'grade-band', 2),
  L('math.high', 'mathematics', 'High School (Grades 9–12)', 'grade-band', 3),
  L('math.university', 'mathematics', 'University', 'university', 4),
  L('phys.middle', 'physics', 'Middle School Physical Science', 'grade-band', 2),
  L('phys.high', 'physics', 'High School Physics', 'grade-band', 3),
  L('phys.university', 'physics', 'University Physics', 'university', 4),
  L('chem.middle', 'chemistry', 'Middle School Matter & Chemistry', 'grade-band', 2),
  L('chem.high', 'chemistry', 'High School Chemistry', 'grade-band', 3),
  L('chem.university', 'chemistry', 'University Chemistry', 'university', 4),
  L('bio.middle', 'biology', 'Middle School Life Science', 'grade-band', 2),
  L('bio.high', 'biology', 'High School Biology', 'grade-band', 3),
  L('bio.university', 'biology', 'University Life Sciences', 'university', 4),
  L('lang.pre-a1', 'language', 'Pre-A1 (first words)', 'proficiency', 0),
  L('lang.a1', 'language', 'A1 Beginner', 'proficiency', 1),
  L('lang.a2', 'language', 'A2 Elementary', 'proficiency', 2),
  L('lang.b1', 'language', 'B1 Intermediate', 'proficiency', 3),
  L('lang.b2', 'language', 'B2 Upper-intermediate', 'proficiency', 4),
  L('lang.c1', 'language', 'C1 Advanced', 'proficiency', 5),
  L('lang.c2', 'language', 'C2 Proficient', 'proficiency', 6),
];

const C = (id: string, levelId: string, name: string, description = ''): Course => ({ id, levelId, name, description });

export const COURSES: Course[] = [
  // Mathematics
  C('math.prek.numbers', 'math.prek', 'Counting, Quantity and Comparison'),
  C('math.prek.shapes', 'math.prek', 'Shapes, Space and Patterns'),
  C('math.prek.operations', 'math.prek', 'Early Addition, Subtraction and Measurement'),
  C('math.el.number', 'math.elementary', 'Place Value and the Four Operations'),
  C('math.el.fractions', 'math.elementary', 'Fractions and Decimals'),
  C('math.el.geometry', 'math.elementary', 'Geometry, Measurement, Area and Volume'),
  C('math.el.data', 'math.elementary', 'Data, Statistics and Word Problems'),
  C('math.ms.ratios', 'math.middle', 'Ratios, Rates and Proportions'),
  C('math.ms.number', 'math.middle', 'Integers and Rational Numbers'),
  C('math.ms.algebra', 'math.middle', 'Expressions, Equations, Inequalities and Functions'),
  C('math.ms.geometry', 'math.middle', 'Coordinate Geometry and Transformations'),
  C('math.ms.stats', 'math.middle', 'Probability and Statistics'),
  C('math.hs.algebra-1', 'math.high', 'Algebra I'),
  C('math.hs.geometry', 'math.high', 'Geometry: Constructions and Proof'),
  C('math.hs.algebra-2', 'math.high', 'Algebra II: Polynomials, Exponentials, Logarithms'),
  C('math.hs.trig-precalc', 'math.high', 'Trigonometry, Complex Numbers and Precalculus'),
  C('math.hs.stats', 'math.high', 'Probability, Statistics and Modeling'),
  C('math.hs.calculus', 'math.high', 'Introductory Calculus'),
  C('math.uni.calc-1', 'math.university', 'Single-Variable Calculus'),
  C('math.uni.calc-3', 'math.university', 'Multivariable Calculus'),
  C('math.uni.linear-algebra', 'math.university', 'Linear Algebra'),
  C('math.uni.diff-eq', 'math.university', 'Differential Equations'),
  C('math.uni.discrete', 'math.university', 'Discrete Mathematics, Logic and Proofs'),
  C('math.uni.probability', 'math.university', 'Probability Theory and Mathematical Statistics'),
  C('math.uni.optimization', 'math.university', 'Optimization and Numerical Analysis'),
  C('math.uni.analysis', 'math.university', 'Real Analysis'),
  C('math.uni.algebra', 'math.university', 'Abstract Algebra and Number Theory'),
  C('math.uni.complex-topology', 'math.university', 'Complex Analysis, Topology and Combinatorics'),
  // Physics
  C('phys.ms.physical-science', 'phys.middle', 'Forces, Motion, Energy and Waves'),
  C('phys.hs.mechanics', 'phys.high', 'Mechanics: Motion, Forces, Gravity, Energy and Momentum', 'Newtonian mechanics including gravitation and orbital motion.'),
  C('phys.hs.waves-optics', 'phys.high', 'Waves, Sound, Light and Optics'),
  C('phys.hs.em', 'phys.high', 'Electricity and Magnetism'),
  C('phys.hs.thermo-fluids', 'phys.high', 'Thermodynamics and Fluids'),
  C('phys.uni.mechanics', 'phys.university', 'Classical Mechanics and Oscillations'),
  C('phys.uni.em', 'phys.university', 'Electromagnetism'),
  C('phys.uni.modern', 'phys.university', 'Relativity and Quantum Mechanics'),
  C('phys.uni.stat-thermo', 'phys.university', 'Thermodynamics and Statistical Physics'),
  // Chemistry
  C('chem.ms.matter', 'chem.middle', 'Matter, Its Properties and Changes'),
  C('chem.hs.atoms', 'chem.high', 'Atomic Structure, Periodic Table and Electron Configurations'),
  C('chem.hs.bonding', 'chem.high', 'Bonding, Molecular Geometry, Formulas and Naming'),
  C('chem.hs.reactions', 'chem.high', 'Reactions, Stoichiometry, Gases and Solutions'),
  C('chem.hs.equilibrium', 'chem.high', 'Acids and Bases, Equilibrium, Kinetics, Thermochemistry'),
  C('chem.uni.general', 'chem.university', 'General Chemistry and Electrochemistry'),
  C('chem.uni.organic', 'chem.university', 'Organic Chemistry'),
  C('chem.uni.biochem', 'chem.university', 'Biochemistry and Advanced Topics'),
  // Biology
  C('bio.ms.life', 'bio.middle', 'Cells, Organisms, Heredity and Ecosystems'),
  C('bio.hs.cells', 'bio.high', 'Cells, Biomolecules, DNA and Gene Expression'),
  C('bio.hs.genetics-evolution', 'bio.high', 'Genetics, Inheritance and Evolution'),
  C('bio.hs.physiology-ecology', 'bio.high', 'Anatomy, Physiology and Ecology'),
  C('bio.uni.molecular', 'bio.university', 'Molecular Biology, Microbiology and Immunology'),
  C('bio.uni.advanced', 'bio.university', 'Advanced Life Sciences'),
  // Language (English first; designed for Dari and Pashto support)
  C('lang.pre-a1.english', 'lang.pre-a1', 'English: First Words and Sounds'),
  C('lang.a1.english', 'lang.a1', 'English A1: Everyday Survival Communication'),
  C('lang.a2.english', 'lang.a2', 'English A2: Routine Exchanges'),
  C('lang.b1.english', 'lang.b1', 'English B1: Independent Communication'),
  C('lang.b2.english', 'lang.b2', 'English B2: Academic and Professional Language'),
  C('lang.c1.english', 'lang.c1', 'English C1: Nuanced Expression'),
  C('lang.c2.english', 'lang.c2', 'English C2: Mastery'),
];

export const UNITS: Unit[] = [
  { id: 'phys.hs.mech.forces', courseId: 'phys.hs.mechanics', name: 'Forces and Newton’s Laws' },
  { id: 'phys.hs.mech.gravitation', courseId: 'phys.hs.mechanics', name: 'Gravitation and Orbits' },
  { id: 'math.alg1.linear-equations', courseId: 'math.hs.algebra-1', name: 'Equations and Formulas' },
  { id: 'math.alg1.exponents', courseId: 'math.hs.algebra-1', name: 'Exponents and Radicals' },
];

export const TOPICS: Topic[] = [
  { id: 'phys.mech.newton-laws', unitId: 'phys.hs.mech.forces', name: 'Newton’s Laws' },
  { id: 'phys.mech.circular', unitId: 'phys.hs.mech.forces', name: 'Circular Motion' },
  { id: 'phys.grav.universal', unitId: 'phys.hs.mech.gravitation', name: 'Universal Gravitation' },
  { id: 'phys.orbit.motion', unitId: 'phys.hs.mech.gravitation', name: 'Orbital Motion' },
  { id: 'phys.orbit.energy', unitId: 'phys.hs.mech.gravitation', name: 'Energy in Gravitational Fields' },
  { id: 'math.alg.equations', unitId: 'math.alg1.linear-equations', name: 'Literal Equations' },
  { id: 'math.alg.exponents-radicals', unitId: 'math.alg1.exponents', name: 'Powers and Roots' },
];

export const CONCEPTS: Concept[] = [
  { id: 'phys.mech.forces', topicId: 'phys.mech.newton-laws', name: 'Force and acceleration', summary: 'Net force causes acceleration: F = ma.' },
  { id: 'phys.mech.circular-motion', topicId: 'phys.mech.circular', name: 'Centripetal acceleration', summary: 'Circular motion needs a centre-directed acceleration v²/r.' },
  { id: 'phys.grav.universal-gravitation', topicId: 'phys.grav.universal', name: 'Newton’s law of gravitation', summary: 'Every pair of masses attracts with F = Gm₁m₂/r².' },
  { id: 'phys.orbit.orbital-motion', topicId: 'phys.orbit.motion', name: 'Orbits as free fall', summary: 'An orbit is falling plus enough sideways speed; circular orbits need v = √(GM/r).' },
  { id: 'phys.orbit.kepler-laws', topicId: 'phys.orbit.motion', name: 'Kepler’s laws', summary: 'T² ∝ a³ for all bodies orbiting the same primary.' },
  { id: 'phys.orbit.energy-and-escape', topicId: 'phys.orbit.energy', name: 'Orbital energy and escape', summary: 'ε = v²/2 − GM/r decides bound vs unbound.' },
  { id: 'math.alg.literal-equations', topicId: 'math.alg.equations', name: 'Rearranging formulas', summary: 'Solve a formula for any one of its variables.' },
  { id: 'math.alg.exponents', topicId: 'math.alg.exponents-radicals', name: 'Powers, roots and scientific notation', summary: 'Evaluate and manipulate squares, cubes and their roots.' },
];

/** Each world contributes its own slice; the catalog is the union. */
const dedupe = <T extends { id: string }>(xs: T[]): T[] => [...new Map(xs.map((x) => [x.id, x])).values()];

export const CATALOG: CurriculumGraph = {
  subjects: SUBJECTS,
  levels: LEVELS,
  courses: COURSES,
  units: dedupe([...UNITS, ...MATH_UNITS]),
  topics: dedupe([...TOPICS, ...MATH_TOPICS]),
  concepts: dedupe([...CONCEPTS, ...MATH_CONCEPTS]),
  objectives: dedupe([...GRAVITY_PREREQUISITES, ...GRAVITY_OBJECTIVES, ...MATH_PREREQUISITES, ...MATH_OBJECTIVES]),
  coverage: [
    ...GRAVITY_COVERAGE,
    ...GRAVITY_PREREQUISITES.map((o) => ({ objectiveId: o.id, planned: true, authored: false, implemented: false, scientificallyReviewed: false, learnerTested: false, notes: 'Prerequisite referenced by Gravity Lab; no lesson yet.' })),
    ...MATH_COVERAGE,
  ].filter((c, i, arr) => arr.findIndex((d) => d.objectiveId === c.objectiveId) === i),
};

export const OBJECTIVES_BY_ID = new Map(CATALOG.objectives.map((o) => [o.id, o]));
