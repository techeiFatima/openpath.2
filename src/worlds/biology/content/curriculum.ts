import type { Concept, CoverageStatus, LearningObjective, StandardRef, Topic, Unit } from '@/core/curriculum/types';

/**
 * Curriculum slice implemented by Inside the Cell. Standard codes are cited with a short
 * paraphrase only (see docs/03-resource-registry.md). The official NGSS pages were not
 * reachable from the build environment, so `verified` is false for every reference.
 *
 * Unit `courseId`s refer to courses that already exist in src/worlds/catalog.ts
 * (bio.ms.life, bio.hs.cells, bio.hs.genetics-evolution). The integrator appends
 * BIOLOGY_UNITS / TOPICS / CONCEPTS / OBJECTIVES / COVERAGE to the catalog.
 */
const NGSS_MS_LS1_1: StandardRef = {
  framework: 'NGSS',
  code: 'MS-LS1-1',
  summary: 'Conduct an investigation to provide evidence that living things are made of cells, either one cell or many different numbers and types of cells.',
  url: 'https://www.nextgenscience.org/pe/ms-ls1-1-molecules-organisms-structures-and-processes',
  verified: false,
  verificationNote: 'Paraphrased from memory of the performance expectation on 2026-10-25; official page not reachable from the build environment.',
};
const NGSS_HS_LS1_1: StandardRef = {
  framework: 'NGSS',
  code: 'HS-LS1-1',
  summary: 'Construct an explanation based on evidence for how the structure of DNA determines the structure of proteins, which carry out the essential functions of life through systems of specialized cells.',
  url: 'https://www.nextgenscience.org/pe/hs-ls1-1-molecules-organisms-structures-and-processes',
  verified: false,
  verificationNote: 'Paraphrased from memory of the performance expectation on 2026-10-25; official page not reachable from the build environment.',
};

export const BIOLOGY_UNITS: Unit[] = [
  { id: 'bio.ms.life.cells', courseId: 'bio.ms.life', name: 'Cells: the units of life' },
  { id: 'bio.hs.cells.scale', courseId: 'bio.hs.cells', name: 'Scale and the tools of biology' },
  { id: 'bio.hs.cells.dna', courseId: 'bio.hs.cells', name: 'DNA structure and gene expression' },
  { id: 'bio.hs.gen.mutation', courseId: 'bio.hs.genetics-evolution', name: 'Mutation and variation' },
];

export const BIOLOGY_TOPICS: Topic[] = [
  { id: 'bio.cell.theory', unitId: 'bio.ms.life.cells', name: 'Cell theory' },
  { id: 'bio.scale.sizes', unitId: 'bio.hs.cells.scale', name: 'Sizes from organism to atom' },
  { id: 'bio.scale.microscopy', unitId: 'bio.hs.cells.scale', name: 'Microscopes and resolution' },
  { id: 'bio.dna.structure', unitId: 'bio.hs.cells.dna', name: 'The double helix' },
  { id: 'bio.dna.replication', unitId: 'bio.hs.cells.dna', name: 'DNA replication' },
  { id: 'bio.gene.expression', unitId: 'bio.hs.cells.dna', name: 'From gene to protein' },
  { id: 'bio.gene.mutation', unitId: 'bio.hs.gen.mutation', name: 'Point mutations' },
];

export const BIOLOGY_CONCEPTS: Concept[] = [
  { id: 'bio.cell.cell-theory', topicId: 'bio.cell.theory', name: 'Cells are the units of life', summary: 'All living things are made of one or more cells; cells contain organelles and molecules.' },
  { id: 'bio.scale.orders-of-magnitude', topicId: 'bio.scale.sizes', name: 'Orders of magnitude', summary: 'Compare sizes by ratios and powers of ten using SI prefixes (m, mm, µm, nm).' },
  { id: 'bio.scale.resolution', topicId: 'bio.scale.microscopy', name: 'Resolution limits', summary: 'Rule of thumb: naked eye ≳ 0.1 mm, light microscope ≳ 200 nm, electron microscope below.' },
  { id: 'bio.dna.double-helix', topicId: 'bio.dna.structure', name: 'Complementary base pairing', summary: 'Two antiparallel strands held by A–T and G–C pairs; Chargaff: %A = %T and %G = %C.' },
  { id: 'bio.dna.semi-conservative', topicId: 'bio.dna.replication', name: 'Semi-conservative replication', summary: 'Each daughter helix keeps one parental strand and gains one new strand.' },
  { id: 'bio.gene.transcription', topicId: 'bio.gene.expression', name: 'Transcription', summary: 'An mRNA copy of the gene is made; it matches the coding strand with U for T.' },
  { id: 'bio.gene.genetic-code', topicId: 'bio.gene.expression', name: 'The genetic code and translation', summary: '64 codons specify 20 amino acids and stop; AUG starts, UAA/UAG/UGA stop.' },
  { id: 'bio.gene.mutation-types', topicId: 'bio.gene.mutation', name: 'Effects of point mutations', summary: 'Substitutions can be silent, missense or nonsense; single insertions/deletions shift the frame.' },
];

/** Prerequisite objectives that live outside this world (math.alg.powers-roots is defined by Gravity Lab). */
export const BIOLOGY_PREREQUISITES: LearningObjective[] = [
  {
    id: 'bio.cell.basics',
    conceptId: 'bio.cell.cell-theory',
    statement: 'State that all living things are made of cells and that cells contain smaller structures (organelles) built from molecules.',
    cognitiveLevel: 'remember',
    prerequisiteIds: [],
    standardRefs: [NGSS_MS_LS1_1],
  },
];

export const BIOLOGY_OBJECTIVES: LearningObjective[] = [
  {
    id: 'bio.scale.powers-of-ten',
    conceptId: 'bio.scale.orders-of-magnitude',
    statement: 'Compare the sizes of organisms, cells, organelles, viruses and molecules as ratios and orders of magnitude, converting between SI prefixes.',
    cognitiveLevel: 'apply',
    prerequisiteIds: ['math.alg.powers-roots', 'bio.cell.basics'],
    standardRefs: [NGSS_MS_LS1_1],
  },
  {
    id: 'bio.scale.microscopy',
    conceptId: 'bio.scale.resolution',
    statement: 'Decide, from an object’s size, whether the naked eye, a light microscope or an electron microscope is needed to see it, using the stated rule of thumb.',
    cognitiveLevel: 'apply',
    prerequisiteIds: ['bio.scale.powers-of-ten'],
    standardRefs: [NGSS_MS_LS1_1],
  },
  {
    id: 'bio.dna.base-pairing',
    conceptId: 'bio.dna.double-helix',
    statement: 'Write the complementary strand of a DNA sequence using A–T and G–C pairing and antiparallel orientation, and use Chargaff’s rules to predict base composition.',
    cognitiveLevel: 'apply',
    prerequisiteIds: ['bio.cell.basics'],
    standardRefs: [NGSS_HS_LS1_1],
  },
  {
    id: 'bio.dna.replication',
    conceptId: 'bio.dna.semi-conservative',
    statement: 'Explain why base pairing lets each strand act as a template and predict the outcome of semi-conservative replication (as in the Meselson–Stahl experiment).',
    cognitiveLevel: 'understand',
    prerequisiteIds: ['bio.dna.base-pairing'],
    standardRefs: [NGSS_HS_LS1_1],
  },
  {
    id: 'bio.gene.transcription',
    conceptId: 'bio.gene.transcription',
    statement: 'Transcribe a coding-strand DNA sequence into mRNA (T → U) and divide it into codons in the correct reading frame from the start codon.',
    cognitiveLevel: 'apply',
    prerequisiteIds: ['bio.dna.base-pairing'],
    standardRefs: [NGSS_HS_LS1_1],
  },
  {
    id: 'bio.gene.translation',
    conceptId: 'bio.gene.genetic-code',
    statement: 'Use the standard genetic code table to translate an mRNA into an amino-acid sequence from AUG to a stop codon, and relate mRNA length to protein length.',
    cognitiveLevel: 'apply',
    prerequisiteIds: ['bio.gene.transcription'],
    standardRefs: [NGSS_HS_LS1_1],
  },
  {
    id: 'bio.gene.mutations',
    conceptId: 'bio.gene.mutation-types',
    statement: 'Classify a single-base substitution, insertion or deletion as silent, missense, nonsense or frameshift by working out its effect on the protein.',
    cognitiveLevel: 'analyze',
    prerequisiteIds: ['bio.gene.translation'],
    standardRefs: [NGSS_HS_LS1_1],
  },
];

export const BIOLOGY_COVERAGE: CoverageStatus[] = [
  ...BIOLOGY_OBJECTIVES.map((o) => ({
    objectiveId: o.id,
    planned: true,
    authored: true,
    implemented: true,
    scientificallyReviewed: false,
    learnerTested: false,
    notes: 'Model (genetic code, strand rules, size table) validated by automated tests; typical sizes are textbook order-of-magnitude values; content not yet reviewed by a second biologist or tested with learners.',
  })),
  ...BIOLOGY_PREREQUISITES.map((o) => ({
    objectiveId: o.id,
    planned: true,
    authored: false,
    implemented: false,
    scientificallyReviewed: false,
    learnerTested: false,
    notes: 'Prerequisite referenced by Inside the Cell; no lesson yet.',
  })),
];
