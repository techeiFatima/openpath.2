import type { LessonSpec } from '@/core/world/spec';

/**
 * Lesson 2 — The double helix.
 * Reference values (computed with model/dna.ts):
 *   complement('ATGCGTTA') = 'TACGCAAT' (3'→5', aligned);  reverseComplement = 'TAACGCAT' (5'→3')
 *   reverseComplement('GGATCC') = 'GGATCC' (palindromic restriction site)
 *   gcContent('ATGCGTTA') = 37.5 %
 *   Chargaff: in double-stranded DNA with 30 % A → T = 30 %, G = C = 20 %
 *   1000 bp with 400 G → 400 C, 600 A, 600 T
 *   Meselson–Stahl: after one round in ¹⁴N medium all DNA is hybrid; after two rounds, half hybrid, half light.
 */
export const doubleHelix: LessonSpec = {
  id: 'cell.double-helix',
  worldId: 'cell',
  title: 'The double helix',
  subtitle: 'Two strands that predict each other',
  minutes: 40,
  objectiveIds: ['bio.dna.base-pairing', 'bio.dna.replication'],
  prerequisiteObjectiveIds: ['bio.cell.basics', 'bio.scale.powers-of-ten'],
  standardRefs: [],
  accessibilitySummary:
    'The DNA workbench shows a coding strand you type (5′ to 3′), the complementary template strand written 3′ to 5′ directly beneath it so paired bases line up, and a table of base counts for the single strand and for the whole double helix, with GC content. Text mode presents the same strands and counts as text.',
  validationTests: ['dna.test.ts: complement and reverse complement', 'dna.test.ts: GC content', 'dna.test.ts: Chargaff duplex counts'],
  mastery: [
    { objectiveId: 'bio.dna.base-pairing', level: 'mastered' },
    { objectiveId: 'bio.dna.replication', level: 'proficient' },
  ],
  stages: [
    {
      kind: 'discover',
      title: 'A strange regularity',
      presets: ['dna:chargaff'],
      blocks: [
        { type: 'text', md: 'In the late 1940s Erwin Chargaff measured the four bases in DNA from many species. The proportions differed from species to species, yet one pattern held every time: the amount of **A** always equalled the amount of **T**, and **G** always equalled **C**.' },
        {
          type: 'prediction',
          id: 'pred-chargaff',
          question: 'A sample of double-stranded DNA is 30% adenine (A). What percentage is guanine (G)?',
          options: [
            { id: 'thirty', text: '30%: the four bases are present in equal amounts' },
            { id: 'twenty', text: '20%: T must also be 30%, leaving 40% to share between G and C' },
            { id: 'seventy', text: '70%: whatever is not A must be G' },
          ],
          correctId: 'twenty',
          revealPreset: 'dna:chargaff',
          explanation: 'If A = 30% then T = 30% (they pair), so G + C = 40% and, since G = C, each is 20%. In the workbench the single strand you type has unequal counts, but the double-helix counts always balance: every A on one strand faces a T on the other.',
        },
        {
          type: 'prediction',
          id: 'pred-complement',
          question: 'One strand reads 5′-ATGC-3′. What does the partner strand look like written directly underneath, base by base?',
          options: [
            { id: 'same', text: 'ATGC: the two strands are identical copies' },
            { id: 'pair', text: 'TACG: each base is replaced by its partner (A↔T, G↔C)' },
            { id: 'ag', text: 'GCAT: A pairs with G and T pairs with C' },
          ],
          correctId: 'pair',
          revealPreset: 'dna:example',
          explanation: 'A pairs with T (two hydrogen bonds) and G pairs with C (three). The partner strand under 5′-ATGC-3′ is 3′-TACG-5′: note that it runs in the opposite direction.',
        },
      ],
    },
    {
      kind: 'explore',
      title: 'Build the partner strand',
      presets: ['dna:free', 'dna:chargaff'],
      blocks: [
        {
          type: 'sim-task',
          preset: 'dna:chargaff',
          instructions: 'In the workbench, type a few different coding strands (try `AAAA`, `ATAT`, `GGCC`, then a random one). Watch the **template strand** line and the **base counts** table.',
          observe: [
            'Whether the single strand you typed ever has A = T and G = C on its own',
            'Whether the double-helix counts (both strands together) ever fail to have A = T and G = C',
            'What happens to the GC content when you replace an A with a G',
            'Where the 5′ and 3′ labels sit on the two strands',
          ],
        },
        { type: 'callout', tone: 'assumption', md: 'Simplifications: the workbench shows bases as letters in a straight line, not the twisted helix, and treats every sequence as perfectly paired. Real DNA is wound into a right-handed helix about 2 nm wide with roughly 10 base pairs per turn, and is packaged with proteins.' },
        { type: 'text', md: 'Load the **Palindromic site** preset. Read the template strand from right to left (its 5′ end). What do you notice? Sequences like this are where restriction enzymes cut.' },
      ],
    },
    {
      kind: 'understand',
      title: 'Base pairing and direction',
      presets: ['dna:example'],
      blocks: [
        { type: 'text', md: 'DNA is two chains of nucleotides. Each nucleotide has a sugar–phosphate backbone and one of four bases: adenine (A), thymine (T), guanine (G), cytosine (C). The two chains are held together by hydrogen bonds between **complementary** bases:' },
        { type: 'equation', latex: 'A \;\\text{pairs with}\; T \\quad (2\\ \\text{H-bonds}), \\qquad G \;\\text{pairs with}\; C \\quad (3\\ \\text{H-bonds})', caption: 'A purine (A or G) always pairs with a pyrimidine (T or C), so every rung of the ladder is the same width.' },
        { type: 'text', md: 'Each strand has a direction, named after the carbon atoms of the sugar: a **5′ end** and a **3′ end**. The two strands run in opposite directions: they are **antiparallel**. If one strand is written 5′→3′, its partner written directly beneath runs 3′→5′.' },
        { type: 'equation', latex: "5'\\text{-ATGCGTTA-}3' \\\\ 3'\\text{-TACGCAAT-}5'", caption: 'Partner written beneath (3′→5′). The same strand in the conventional 5′→3′ direction is TAACGCAT: reverse it as well as pairing it.' },
        { type: 'text', md: '**Chargaff’s rule** follows directly: in double-stranded DNA every A faces a T and every G faces a C, so A = T and G = C whatever the species. The **GC content** (fraction of bases that are G or C) does vary widely between species: bacterial genomes range from under 30% to over 70%.' },
        { type: 'text', md: 'Because each strand predicts the other, the molecule can be copied. In **replication** the strands separate and each serves as a template for a new partner. Each daughter helix therefore has one old strand and one new strand: replication is **semi-conservative**. Meselson and Stahl showed this in 1958 by labelling DNA with heavy nitrogen (¹⁵N) and following its density over generations.' },
        { type: 'summary', points: ['A–T and G–C; purine with pyrimidine.', 'Strands are antiparallel: write the partner 3′→5′ beneath, reverse it to write 5′→3′.', 'Double-stranded DNA: %A = %T, %G = %C (Chargaff). GC content varies between species.', 'Replication is semi-conservative: one old strand, one new strand in every daughter helix.'] },
      ],
    },
    {
      kind: 'practice',
      title: 'Practice',
      presets: ['dna:free'],
      blocks: [
        { type: 'text', md: 'Type sequences as plain letters (`TACG`). The workbench stays open for checking.' },
        { type: 'problem', problemId: 'l2-complement-aligned' },
        { type: 'problem', problemId: 'l2-reverse-complement' },
        { type: 'problem', problemId: 'l2-chargaff-percent' },
        { type: 'problem', problemId: 'l2-gc-content' },
        { type: 'problem', problemId: 'l2-pairing-error' },
        { type: 'problem', problemId: 'l2-semi-conservative' },
      ],
    },
    {
      kind: 'apply',
      title: 'Apply',
      presets: ['dna:palindrome'],
      blocks: [
        { type: 'problem', problemId: 'l2-meselson-stahl' },
        { type: 'problem', problemId: 'l2-explain-template' },
      ],
    },
    {
      kind: 'demonstrate',
      title: 'Show what you know',
      blocks: [
        { type: 'text', md: 'Workbench hidden. Work the sequences by hand.' },
        { type: 'problem', problemId: 'l2-demo-palindrome' },
        { type: 'problem', problemId: 'l2-demo-count' },
      ],
    },
    {
      kind: 'review',
      title: 'Review',
      blocks: [
        { type: 'summary', points: ['Pair A↔T, G↔C; never A with G.', 'Antiparallel: pairing alone gives 3′→5′; reverse to write 5′→3′.', 'Chargaff holds for the double helix, not necessarily for one strand.', 'Semi-conservative replication: Meselson–Stahl.'] },
      ],
    },
  ],
  problems: [
    {
      id: 'l2-complement-aligned', kind: 'short-text', objectiveIds: ['bio.dna.base-pairing'], category: 'procedural', difficulty: 1,
      prompt: 'One strand reads 5′-ATGCGTTA-3′. Write the complementary strand as it sits directly beneath it (that is, written 3′→5′). Letters only.',
      accepted: ['TACGCAAT', "3'-TACGCAAT-5'", '3′-TACGCAAT-5′', "3' TACGCAAT 5'", '3-TACGCAAT-5'],
      placeholder: 'e.g. TACG',
      misconceptions: [
        { id: 'copied', accepted: ['ATGCGTTA'], feedback: 'That is the same strand. The partner strand has the complementary base at every position: A↔T, G↔C.' },
        { id: 'a-with-g', accepted: ['GCATACCG'], feedback: 'You paired A with G and T with C. In DNA, A pairs with T and G pairs with C (a purine always with a pyrimidine).' },
        { id: 'reversed', accepted: ['TAACGCAT', "5'-TAACGCAT-3'", '5′-TAACGCAT-3′'], feedback: 'Those are the right bases written 5′→3′. The question asked for the strand as it lies beneath the original (3′→5′), so do not reverse it.' },
      ],
      hints: ['Replace each base with its partner: A→T, T→A, G→C, C→G.', 'Keep the order: the aligned partner strand reads 3′→5′.'],
      solution: '5′-ATGCGTTA-3′ pairs base-by-base with 3′-TACGCAAT-5′.',
    },
    {
      id: 'l2-reverse-complement', kind: 'short-text', objectiveIds: ['bio.dna.base-pairing'], category: 'procedural', difficulty: 2,
      prompt: 'Now write that same complementary strand in the conventional direction, 5′→3′. Letters only.',
      accepted: ['TAACGCAT', "5'-TAACGCAT-3'", '5′-TAACGCAT-3′', "5' TAACGCAT 3'", '5-TAACGCAT-3'],
      placeholder: 'e.g. GCAT',
      misconceptions: [
        { id: 'forgot-antiparallel', accepted: ['TACGCAAT'], feedback: 'You paired the bases but did not reverse. The partner strand runs the opposite way, so written 5′→3′ it starts from what was the right-hand end.' },
        { id: 'reversed-not-paired', accepted: ['ATTGCGTA'], feedback: 'You reversed the original without pairing it. Do both: pair each base, then write the result backwards.' },
      ],
      hints: ['Start from the aligned partner 3′-TACGCAAT-5′.', 'Read it from its 5′ end (right to left).'],
      solution: 'Aligned partner: 3′-TACGCAAT-5′. Read from the 5′ end: 5′-TAACGCAT-3′.',
    },
    {
      id: 'l2-chargaff-percent', kind: 'numeric', objectiveIds: ['bio.dna.base-pairing'], category: 'computation', difficulty: 2,
      prompt: 'Double-stranded DNA from a bacterium is 30% adenine. What percentage is cytosine? Enter a number (percent).',
      answer: { value: 20, relTol: 0.01 },
      misconceptions: [
        { id: 'equal-shares', value: 30, feedback: 'The four bases are not necessarily equal. Only the pairs are: A = T and G = C.' },
        { id: 'everything-else', value: 70, feedback: '70% is everything that is not A, but that includes T (also 30%) as well as G and C.' },
        { id: 'forgot-t', value: 35, feedback: 'You split 70% between G and C but forgot that T takes 30% first. G + C = 100 − 30 − 30 = 40%.' },
      ],
      hints: ['If A = 30%, what must T be?', 'What is left for G + C, and how is it shared?'],
      solution: 'T = A = 30%. G + C = 100% − 60% = 40%. G = C, so C = 20%.',
    },
    {
      id: 'l2-gc-content', kind: 'numeric', objectiveIds: ['bio.dna.base-pairing'], category: 'computation', difficulty: 1,
      prompt: 'What is the GC content (percentage of bases that are G or C) of the strand 5′-ATGCGTTA-3′? Enter a number (percent).',
      answer: { value: 37.5, relTol: 0.01 },
      misconceptions: [
        { id: 'at-content', value: 62.5, feedback: 'That is the AT content. Count the G and C bases.' },
        { id: 'count-not-percent', value: 3, feedback: '3 is the count of G and C bases. Divide by the total (8) and multiply by 100.' },
      ],
      hints: ['Count the G and C letters.', 'Divide by 8 and multiply by 100.'],
      solution: 'ATGCGTTA has G, C, G = 3 of 8 bases. 3/8 = 37.5%.',
    },
    {
      id: 'l2-pairing-error', kind: 'multiple-choice', objectiveIds: ['bio.dna.base-pairing'], category: 'error-identification', difficulty: 2,
      prompt: 'A student writes the strand that lies directly beneath 5′-GATTACA-3′ as "TGTAATC". Where is the mistake?',
      options: [
        { id: 'none', text: 'There is no mistake.', feedback: 'Line the two up: G over T? G pairs with C, so the first base beneath G must be C.' },
        { id: 'antiparallel', text: 'The bases are the right partners but in the wrong order: TGTAATC is the partner written 5′→3′. Beneath the original (3′→5′) it must read CTAATGT.', feedback: 'Correct. Pairing gives 3′-CTAATGT-5′; reversing that gives 5′-TGTAATC-3′. The student mixed up the two ways of writing the same strand.' },
        { id: 'ag', text: 'The student paired A with G instead of A with T.', feedback: 'Check: every T in the answer faces an A in the original, so A–T pairing was used. The problem is the direction.' },
      ],
      correctId: 'antiparallel',
      hints: ['Write the partner beneath the original one base at a time: G–C, A–T, T–A, T–A, A–T, C–G, A–T.', 'Compare your result with TGTAATC: same letters, different order?'],
      solution: 'Beneath 5′-GATTACA-3′ sits 3′-CTAATGT-5′. Written in the conventional 5′→3′ direction that strand is TGTAATC. The student wrote the 5′→3′ form but placed it as if aligned.',
    },
    {
      id: 'l2-semi-conservative', kind: 'multiple-choice', objectiveIds: ['bio.dna.replication'], category: 'conceptual', difficulty: 2,
      prompt: 'A double helix is copied once. What does each of the two daughter helices contain?',
      options: [
        { id: 'conservative', text: 'One daughter has both original strands; the other has two brand-new strands.', feedback: 'That is the "conservative" model, which the Meselson–Stahl experiment ruled out.' },
        { id: 'semi', text: 'Each daughter has one original strand and one newly made strand.', feedback: 'Correct: semi-conservative. Each old strand served as the template for its new partner.' },
        { id: 'dispersive', text: 'Each strand of each daughter is a patchwork of old and new segments.', feedback: 'That is the "dispersive" model; after two rounds it predicts no fully light DNA, which contradicts the experiment.' },
      ],
      correctId: 'semi',
      hints: ['Each strand acts as a template for a new partner strand.'],
      solution: 'The strands separate; each is used to build a new complementary strand. Every daughter helix = one old + one new strand.',
    },
    {
      id: 'l2-meselson-stahl', kind: 'numeric', objectiveIds: ['bio.dna.replication'], category: 'application', difficulty: 4,
      prompt: 'Meselson and Stahl grew bacteria so that all their DNA contained heavy nitrogen (¹⁵N), then moved them to light (¹⁴N) medium. After **two** rounds of replication, what percentage of the DNA molecules were hybrid (one heavy strand, one light strand)? Enter a number (percent).',
      answer: { value: 50, relTol: 0.01 },
      misconceptions: [
        { id: 'one-round', value: 100, feedback: '100% hybrid is the result after ONE round. In the second round each hybrid molecule splits: its heavy strand gets a light partner (hybrid), its light strand gets a light partner (fully light).' },
        { id: 'quarter', value: 25, feedback: 'Count the molecules after two rounds: 4 molecules, 2 of them hybrid. That is 50%, not 25%.' },
        { id: 'conservative', value: 0, feedback: '0% hybrid would mean the strands never mixed (the conservative model). Each new helix keeps one old strand.' },
      ],
      hints: ['After round 1 every molecule is heavy/light (hybrid). Separate each one and give each strand a new light partner.', 'Round 2 gives 4 molecules: how many still contain a heavy strand?'],
      solution: 'Round 1: 2 hybrid molecules (H/L, H/L). Round 2: each splits; the H strands get L partners (2 hybrids), the L strands get L partners (2 light). 2 of 4 = 50% hybrid.',
    },
    {
      id: 'l2-explain-template', kind: 'written', objectiveIds: ['bio.dna.replication', 'bio.dna.base-pairing'], category: 'explanation', difficulty: 3,
      prompt: 'Explain how complementary base pairing makes it possible to copy a DNA molecule accurately, and why the copy is called semi-conservative.',
      modelAnswer: 'Because A pairs only with T and G only with C, the sequence of one strand completely determines the sequence of its partner. When the two strands separate, each exposed strand acts as a template: free nucleotides pair with it one by one, so the new strand is forced to have the correct complementary sequence. Every daughter helix therefore consists of one original (conserved) strand and one new strand, which is why the process is semi-conservative: half of each molecule is kept, as Meselson and Stahl confirmed with ¹⁵N-labelled DNA.',
      rubric: ['States that each base pairs with only one partner, so one strand determines the other', 'Describes each separated strand acting as a template for a new strand', 'Explains "semi-conservative" as one old plus one new strand in every daughter helix'],
      hints: ['Start from the pairing rules; what do they let you predict about a missing strand?'],
      solution: 'See model answer.',
    },
    {
      id: 'l2-demo-palindrome', kind: 'short-text', objectiveIds: ['bio.dna.base-pairing'], category: 'transfer', difficulty: 3,
      prompt: 'The restriction enzyme BamHI cuts at 5′-GGATCC-3′. Write the complementary strand in the 5′→3′ direction. Letters only.',
      accepted: ['GGATCC', "5'-GGATCC-3'", '5′-GGATCC-3′'],
      placeholder: 'e.g. GCAT',
      misconceptions: [
        { id: 'forgot-antiparallel', accepted: ['CCTAGG', "3'-CCTAGG-5'", '3′-CCTAGG-5′'], feedback: 'CCTAGG is the partner written 3′→5′. Written 5′→3′ it is reversed: GGATCC, the same as the original. Such sequences are palindromic.' },
        { id: 'a-with-g', accepted: ['AACGTT', 'TTGCAA'], feedback: 'You paired A with G or T with C. Use A↔T and G↔C.' },
      ],
      hints: ['Pair first: 3′-CCTAGG-5′.', 'Then read it from its 5′ end.'],
      solution: 'Partner aligned: 3′-CCTAGG-5′. Reversed to 5′→3′: GGATCC, identical to the original. Many restriction sites are palindromic in this sense.',
    },
    {
      id: 'l2-demo-count', kind: 'numeric', objectiveIds: ['bio.dna.base-pairing'], category: 'multi-step', difficulty: 3,
      prompt: 'A double-stranded DNA molecule is 1000 base pairs long and contains 400 guanine bases in total. How many thymine bases does it contain?',
      answer: { value: 600, absTol: 0.5 },
      misconceptions: [
        { id: 'thousand-bases', value: 100, feedback: '1000 base PAIRS means 2000 bases. G = C = 400 leaves 1200 for A + T.' },
        { id: 't-equals-g', value: 400, feedback: 'T equals A, not G. Work out how many bases are left after G and C.' },
        { id: 'at-sum', value: 1200, feedback: '1200 is A + T together. T is half of that.' },
      ],
      hints: ['How many bases in total? Each base pair has two bases.', 'C = G = 400. A + T = total − 800, and A = T.'],
      solution: '2000 bases total. C = G = 400, so A + T = 2000 − 800 = 1200 and T = 600.',
    },
  ],
};
