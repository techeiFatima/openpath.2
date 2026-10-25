import type { Concept, CoverageStatus, LearningObjective, StandardRef, Topic, Unit } from '@/core/curriculum/types';

/**
 * Curriculum slice implemented by Atoms & Molecules. NGSS codes are cited with a short
 * paraphrase only (see docs/03-resource-registry.md). The official NGSS pages could not be
 * reached from the build environment, so every ref carries `verified: false`.
 *
 * Units attach to existing catalog courses (`chem.hs.atoms`, `chem.hs.bonding`). Units,
 * topics and concepts are exported so the integrator can append them to the catalog arrays;
 * the content test validates the combined graph.
 */
const NOTE = 'Paraphrased from memory of the NGSS performance expectation on 2026-10-25; official page unreachable from the build environment.';

export const NGSS_HS_PS1_1: StandardRef = {
  framework: 'NGSS',
  code: 'HS-PS1-1',
  summary: 'Use the periodic table as a model to predict the relative properties of elements from the patterns of electrons in their outermost shell.',
  url: 'https://www.nextgenscience.org/pe/hs-ps1-1-matter-and-its-interactions',
  verified: false,
  verificationNote: NOTE,
};
export const NGSS_HS_PS1_2: StandardRef = {
  framework: 'NGSS',
  code: 'HS-PS1-2',
  summary: 'Construct and revise an explanation for the outcome of a simple chemical reaction from the outer-electron states of atoms, periodic trends and knowledge of chemical properties.',
  url: 'https://www.nextgenscience.org/pe/hs-ps1-2-matter-and-its-interactions',
  verified: false,
  verificationNote: NOTE,
};
export const NGSS_HS_PS1_3: StandardRef = {
  framework: 'NGSS',
  code: 'HS-PS1-3',
  summary: 'Plan and carry out an investigation to gather evidence that relates the bulk properties of substances to the strength of electrical forces between particles.',
  url: 'https://www.nextgenscience.org/pe/hs-ps1-3-matter-and-its-interactions',
  verified: false,
  verificationNote: NOTE,
};

export const CHEMISTRY_UNITS: Unit[] = [
  { id: 'chem.hs.atoms.structure', courseId: 'chem.hs.atoms', name: 'Atomic Structure' },
  { id: 'chem.hs.atoms.electrons', courseId: 'chem.hs.atoms', name: 'Electrons and the Periodic Table' },
  { id: 'chem.hs.bonding.bonds', courseId: 'chem.hs.bonding', name: 'Chemical Bonds and Molecular Shape' },
];

export const CHEMISTRY_TOPICS: Topic[] = [
  { id: 'chem.atom.subatomic', unitId: 'chem.hs.atoms.structure', name: 'Subatomic Particles, Isotopes and Ions' },
  { id: 'chem.atom.configuration', unitId: 'chem.hs.atoms.electrons', name: 'Electron Configuration' },
  { id: 'chem.atom.periodicity', unitId: 'chem.hs.atoms.electrons', name: 'Periodic Trends' },
  { id: 'chem.bond.types', unitId: 'chem.hs.bonding.bonds', name: 'Ionic and Covalent Bonding' },
  { id: 'chem.bond.geometry', unitId: 'chem.hs.bonding.bonds', name: 'Lewis Structures and Molecular Geometry' },
];

export const CHEMISTRY_CONCEPTS: Concept[] = [
  { id: 'chem.atom.particles', topicId: 'chem.atom.subatomic', name: 'Protons, neutrons and electrons', summary: 'Proton number fixes the element; A = Z + N; charge = protons − electrons.' },
  { id: 'chem.atom.isotopes-ions', topicId: 'chem.atom.subatomic', name: 'Isotopes and ions', summary: 'Isotopes differ in neutrons; ions differ in electrons; the tabulated atomic mass is an abundance-weighted average.' },
  { id: 'chem.atom.shells', topicId: 'chem.atom.configuration', name: 'Shells and subshells', summary: 'Shell n holds 2n² electrons split into s, p, d, f subshells of 2, 6, 10, 14.' },
  { id: 'chem.atom.aufbau', topicId: 'chem.atom.configuration', name: 'Electron configurations', summary: 'Fill subshells in order of increasing energy (Aufbau), two per orbital (Pauli), singly first (Hund); a few elements are exceptions.' },
  { id: 'chem.atom.table-structure', topicId: 'chem.atom.configuration', name: 'Periodic table structure', summary: 'Period = highest occupied shell; block = subshell being filled; group ↔ outer-electron pattern.' },
  { id: 'chem.atom.trends', topicId: 'chem.atom.periodicity', name: 'Atomic radius and electronegativity trends', summary: 'Radius shrinks across a period and grows down a group; electronegativity does the opposite.' },
  { id: 'chem.atom.valence-reactivity', topicId: 'chem.atom.periodicity', name: 'Valence electrons and reactivity', summary: 'Elements in a group share an outer-electron count and so share reactions and ion charges.' },
  { id: 'chem.bond.ionic-covalent', topicId: 'chem.bond.types', name: 'Ionic vs covalent bonding', summary: 'Electron transfer between metal and nonmetal vs sharing between nonmetals; ΔEN as a rough guide.' },
  { id: 'chem.bond.lewis', topicId: 'chem.bond.geometry', name: 'Lewis structures', summary: 'Count valence electrons, place bonds and lone pairs so most atoms reach an octet (hydrogen a duet).' },
  { id: 'chem.bond.vsepr', topicId: 'chem.bond.geometry', name: 'VSEPR shapes and polarity', summary: 'Electron domains repel; their number and the lone-pair count set the molecular shape and bond angles.' },
];

/** Prerequisites outside chemistry: none required at this level. */
export const CHEMISTRY_PREREQUISITES: LearningObjective[] = [];

export const CHEMISTRY_OBJECTIVES: LearningObjective[] = [
  {
    id: 'chem.atom.identity',
    conceptId: 'chem.atom.particles',
    statement: 'Determine element identity, mass number and charge from counts of protons, neutrons and electrons (and vice versa), and write isotope notation.',
    cognitiveLevel: 'apply',
    prerequisiteIds: [],
    standardRefs: [NGSS_HS_PS1_1],
  },
  {
    id: 'chem.atom.isotopes',
    conceptId: 'chem.atom.isotopes-ions',
    statement: 'Explain what distinguishes isotopes of an element and compute an average atomic mass from isotopic masses and abundances.',
    cognitiveLevel: 'apply',
    prerequisiteIds: ['chem.atom.identity'],
    standardRefs: [NGSS_HS_PS1_1],
  },
  {
    id: 'chem.atom.ions',
    conceptId: 'chem.atom.isotopes-ions',
    statement: 'Relate the gain or loss of electrons to the charge of an ion and count the electrons in a given ion.',
    cognitiveLevel: 'apply',
    prerequisiteIds: ['chem.atom.identity'],
    standardRefs: [NGSS_HS_PS1_1],
  },
  {
    id: 'chem.atom.shells',
    conceptId: 'chem.atom.shells',
    statement: 'Describe electron shells and subshells, state their capacities (2n²; s 2, p 6, d 10, f 14) and read a Bohr-style shell diagram as a teaching idealisation.',
    cognitiveLevel: 'understand',
    prerequisiteIds: ['chem.atom.identity'],
    standardRefs: [NGSS_HS_PS1_1],
  },
  {
    id: 'chem.atom.configuration',
    conceptId: 'chem.atom.aufbau',
    statement: 'Write ground-state electron configurations in full and noble-gas notation for elements 1–36 and for common main-group ions, and recognise the chromium/copper exceptions.',
    cognitiveLevel: 'apply',
    prerequisiteIds: ['chem.atom.shells', 'chem.atom.ions'],
    standardRefs: [NGSS_HS_PS1_1],
  },
  {
    id: 'chem.atom.table-position',
    conceptId: 'chem.atom.table-structure',
    statement: 'Connect an electron configuration to the element’s period, block and group, and identify an element from its configuration.',
    cognitiveLevel: 'analyze',
    prerequisiteIds: ['chem.atom.configuration'],
    standardRefs: [NGSS_HS_PS1_1],
  },
  {
    id: 'chem.atom.trends',
    conceptId: 'chem.atom.trends',
    statement: 'Predict and explain the trends in atomic radius and electronegativity across a period and down a group, and read electronegativity values from data.',
    cognitiveLevel: 'analyze',
    prerequisiteIds: ['chem.atom.table-position'],
    standardRefs: [NGSS_HS_PS1_1],
  },
  {
    id: 'chem.atom.valence',
    conceptId: 'chem.atom.valence-reactivity',
    statement: 'Determine the number of valence electrons of a main-group element from its group, and use it to predict the ion it forms and its relative reactivity.',
    cognitiveLevel: 'apply',
    prerequisiteIds: ['chem.atom.table-position'],
    standardRefs: [NGSS_HS_PS1_1, NGSS_HS_PS1_2],
  },
  {
    id: 'chem.bond.type',
    conceptId: 'chem.bond.ionic-covalent',
    statement: 'Classify a bond as ionic, polar covalent or nonpolar covalent from the elements involved and their electronegativity difference, state the limits of the rule, and write the formula of a binary ionic compound from ion charges.',
    cognitiveLevel: 'apply',
    prerequisiteIds: ['chem.atom.valence', 'chem.atom.trends'],
    standardRefs: [NGSS_HS_PS1_2, NGSS_HS_PS1_3],
  },
  {
    id: 'chem.bond.lewis',
    conceptId: 'chem.bond.lewis',
    statement: 'Count valence electrons and construct or check a Lewis structure for a small molecule, identifying bonding pairs, lone pairs and octet exceptions.',
    cognitiveLevel: 'apply',
    prerequisiteIds: ['chem.atom.valence'],
    standardRefs: [NGSS_HS_PS1_2],
  },
  {
    id: 'chem.bond.vsepr',
    conceptId: 'chem.bond.vsepr',
    statement: 'Use electron-domain counting (VSEPR) to predict the shape and approximate bond angles of a small molecule and decide whether it is polar.',
    cognitiveLevel: 'analyze',
    prerequisiteIds: ['chem.bond.lewis', 'chem.bond.type'],
    standardRefs: [NGSS_HS_PS1_2, NGSS_HS_PS1_3],
  },
];

export const CHEMISTRY_COVERAGE: CoverageStatus[] = CHEMISTRY_OBJECTIVES.map((o) => ({
  objectiveId: o.id,
  planned: true,
  authored: true,
  implemented: true,
  scientificallyReviewed: false,
  learnerTested: false,
  notes: 'Element, configuration and molecule data validated by automated consistency tests, but not yet re-verified against official IUPAC/NIST tables or reviewed by a second chemist; not tested with learners.',
}));
