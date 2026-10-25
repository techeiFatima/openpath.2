import type { LessonSpec } from '@/core/world/spec';

/**
 * Lesson 3 — From gene to protein.
 * Reference values (computed with model/dna.ts; input = coding strand 5'→3'):
 *   gene 5'-ATGGCCAAGTGGTAA-3' → mRNA AUGGCCAAGUGGUAA → AUG GCC AAG UGG UAA → Met-Ala-Lys-Trp-Stop (MAKW)
 *   frame +1 of the same mRNA: UGG CCA AGU GGU → Trp-Pro-Ser-Gly
 *   position 6 C→T: GCC→GCT (GCU) still Ala → silent
 *   position 5 C→A: GCC→GAC Ala→Asp → missense
 *   position 11 G→A: TGG→TAG (UAG) Trp→stop → nonsense
 *   delete position 4: ATG CCA AGT GGT AA → Met-Pro-Ser-Gly → frameshift
 *   5'-ATGTTTGGCTGA-3' → AUG UUU GGC UGA → Met-Phe-Gly-Stop
 *   mRNA AUGAAACCCUAG → Met-Lys-Pro-Stop
 *   300 nt coding (no stop) → 100 amino acids;  153 amino acids + stop → 462 nt
 */
export const geneToProtein: LessonSpec = {
  id: 'cell.gene-to-protein',
  worldId: 'cell',
  title: 'From gene to protein',
  subtitle: 'Transcribe, read in threes, translate, and see what one wrong letter does',
  minutes: 50,
  objectiveIds: ['bio.gene.transcription', 'bio.gene.translation', 'bio.gene.mutations'],
  prerequisiteObjectiveIds: ['bio.dna.base-pairing'],
  standardRefs: [],
  accessibilitySummary:
    'The DNA workbench shows a coding strand you type, its template strand, the mRNA transcript, the mRNA divided into codons from the start, and the amino acid (three-letter code) under each codon up to the stop codon. A mutation tool substitutes, inserts or deletes one base and lists the mutated sequence, its protein and the classification (silent, missense, nonsense or frameshift). Text mode presents the same sequences and classification as text.',
  validationTests: ['dna.test.ts: genetic code table (64 codons, 3 stops, AUG = Met)', 'dna.test.ts: translation', 'dna.test.ts: mutation classification'],
  mastery: [
    { objectiveId: 'bio.gene.translation', level: 'mastered' },
    { objectiveId: 'bio.gene.transcription', level: 'proficient' },
    { objectiveId: 'bio.gene.mutations', level: 'proficient' },
  ],
  stages: [
    {
      kind: 'discover',
      title: 'One letter',
      presets: ['dna:example'],
      blocks: [
        { type: 'text', md: 'Sickle-cell disease is caused by a change of a **single base** in the gene for a blood protein. Yet other single-base changes in the same gene have no effect at all. How can one letter matter so much, or so little?' },
        {
          type: 'prediction',
          id: 'pred-single-base',
          question: 'In the example gene (15 bases, protein Met-Ala-Lys-Trp) one base is swapped for another. What is the most that can change in the protein?',
          options: [
            { id: 'one', text: 'At most one amino acid changes, or translation stops early' },
            { id: 'all', text: 'Every amino acid after that point changes' },
            { id: 'none', text: 'Nothing: one base out of fifteen is too small to matter' },
          ],
          correctId: 'one',
          revealPreset: 'dna:mutation-missense',
          explanation: 'A substitution changes only the codon it sits in, so at most one amino acid changes (missense), or that codon becomes a stop (nonsense), or nothing changes (silent). The workbench shows position 5 C→A turning Ala into Asp while the rest of the chain stays the same.',
        },
        {
          type: 'prediction',
          id: 'pred-deletion',
          question: 'Now one base is **deleted** instead. What happens to the protein?',
          options: [
            { id: 'one', text: 'At most one amino acid changes, as before' },
            { id: 'shift', text: 'Every codon after the deletion is read differently' },
            { id: 'shorter', text: 'The protein is exactly one amino acid shorter' },
          ],
          correctId: 'shift',
          revealPreset: 'dna:frameshift',
          explanation: 'The ribosome reads in groups of three with no punctuation. Removing one base shifts the grouping of every codon downstream: Met-Ala-Lys-Trp becomes Met-Pro-Ser-Gly and the stop codon disappears. This is a frameshift.',
        },
      ],
    },
    {
      kind: 'explore',
      title: 'Edit a gene',
      presets: ['dna:free', 'dna:example'],
      blocks: [
        {
          type: 'sim-task',
          preset: 'dna:example',
          instructions: 'Use the **mutation tool**. Substitute each of the three bases of codon 2 (positions 4, 5, 6) in turn with every other base, and read the classification each time. Then try inserting and deleting a base at a few positions.',
          observe: [
            'Which position of the codon can usually be changed without changing the amino acid (silent)',
            'A substitution that produces a stop codon (nonsense), and how long the protein becomes',
            'What happens to the protein after an insertion or deletion, and whether the stop codon survives',
            'Whether any substitution of a single base ever changes more than one amino acid',
          ],
        },
        { type: 'callout', tone: 'assumption', md: 'Simplifications: the workbench treats your sequence as the **coding strand** of a gene and starts translating at its first base, which it assumes is AUG. Real genes have promoters, untranslated regions and (in eukaryotes) introns that are removed before translation; the ribosome finds the start codon by scanning, and translation actually uses the template strand to make the mRNA. The genetic code shown is the standard one; mitochondria and a few organisms use slight variants.' },
        { type: 'text', md: 'Finally, type a sequence that does **not** start with ATG and watch where the protein begins. Then type one whose length is not a multiple of three: what happens to the leftover bases?' },
      ],
    },
    {
      kind: 'understand',
      title: 'The code',
      presets: ['dna:example'],
      blocks: [
        { type: 'text', md: '**Transcription.** An enzyme (RNA polymerase) reads the template strand and builds a messenger RNA. Because the mRNA is complementary to the template, it has the same sequence as the **coding strand**, with uracil (U) in place of thymine (T):' },
        { type: 'equation', latex: "\\text{coding DNA } 5'\\text{-ATGGCCAAGTGGTAA-}3' \;\\longrightarrow\; \\text{mRNA } 5'\\text{-AUGGCCAAGUGGUAA-}3'", caption: 'Same letters as the coding strand; T → U. If you are given the template strand instead, complement it first.' },
        { type: 'text', md: '**Codons.** The ribosome reads the mRNA in non-overlapping triplets called codons, starting at the start codon **AUG** (methionine). There are 4³ = 64 codons for 20 amino acids plus three **stop** signals (UAA, UAG, UGA), so most amino acids have several codons: the code is **degenerate**. Often the third base of a codon can change without changing the amino acid.' },
        { type: 'equation', latex: '\\underbrace{\\text{AUG}}_{\\text{Met}}\;\\underbrace{\\text{GCC}}_{\\text{Ala}}\;\\underbrace{\\text{AAG}}_{\\text{Lys}}\;\\underbrace{\\text{UGG}}_{\\text{Trp}}\;\\underbrace{\\text{UAA}}_{\\text{stop}}', caption: 'Reading frame: the grouping into threes is fixed by where AUG is. Starting one base late reads UGG CCA AGU GGU: a completely different protein.' },
        { type: 'text', md: '**Translation.** Transfer RNAs match each codon to its amino acid; the ribosome joins them into a chain. A protein of $n$ amino acids needs $3n$ coding bases plus 3 for the stop codon.' },
        { type: 'text', md: '**Mutations.** A single-base **substitution** changes one codon: **silent** if the new codon gives the same amino acid, **missense** if it gives a different one, **nonsense** if it gives a stop. A single-base **insertion or deletion** shifts the reading frame: every codon downstream changes and the original stop is usually lost. These **frameshift** mutations are usually far more damaging than substitutions.' },
        { type: 'summary', points: ['mRNA = coding strand with U for T.', 'Read codons in threes from AUG; UAA, UAG, UGA stop; 64 codons, 20 amino acids: degenerate code.', 'Protein length = (coding bases − 3) / 3.', 'Substitution: silent, missense or nonsense. Insertion/deletion of one base: frameshift.'] },
      ],
    },
    {
      kind: 'practice',
      title: 'Practice',
      presets: ['dna:example'],
      blocks: [
        { type: 'text', md: 'Use the example gene 5′-ATGGCCAAGTGGTAA-3′ and the genetic code table in the workbench. Type sequences as letters and amino acids as three-letter codes separated by hyphens (`Met-Ala`).' },
        { type: 'problem', problemId: 'l3-transcribe' },
        { type: 'problem', problemId: 'l3-third-codon' },
        { type: 'problem', problemId: 'l3-translate' },
        { type: 'problem', problemId: 'l3-degenerate' },
        { type: 'problem', problemId: 'l3-aa-count' },
        { type: 'problem', problemId: 'l3-classify-silent' },
        { type: 'problem', problemId: 'l3-new-codon' },
        { type: 'problem', problemId: 'l3-frameshift-error' },
      ],
    },
    {
      kind: 'apply',
      title: 'Apply',
      presets: ['dna:free'],
      blocks: [
        { type: 'text', md: 'A gene you have not seen. Type it into the workbench only after you have an answer.' },
        { type: 'problem', problemId: 'l3-new-gene' },
        { type: 'problem', problemId: 'l3-explain-frameshift' },
      ],
    },
    {
      kind: 'demonstrate',
      title: 'Show what you know',
      blocks: [
        { type: 'text', md: 'Workbench hidden. You may use a printed genetic code table.' },
        { type: 'problem', problemId: 'l3-demo-length' },
        { type: 'problem', problemId: 'l3-demo-translate' },
      ],
    },
    {
      kind: 'review',
      title: 'Review',
      blocks: [
        { type: 'summary', points: ['Coding strand → mRNA: T becomes U, nothing else.', 'Find AUG, then read in threes; stop at UAA, UAG or UGA.', 'Substitutions touch one codon; insertions and deletions shift everything after them.'] },
        { type: 'text', md: 'If reading frames felt slippery, go back to the workbench and insert a base at position 3, then at position 6, then at position 9, and watch how far the damage reaches each time.' },
      ],
    },
  ],
  problems: [
    {
      id: 'l3-transcribe', kind: 'short-text', objectiveIds: ['bio.gene.transcription'], category: 'procedural', difficulty: 1,
      prompt: 'Write the mRNA transcribed from the coding strand 5′-ATGGCCAAGTGGTAA-3′ (5′→3′, letters only).',
      accepted: ['AUGGCCAAGUGGUAA', "5'-AUGGCCAAGUGGUAA-3'", '5′-AUGGCCAAGUGGUAA-3′'],
      placeholder: 'e.g. AUGGCC',
      misconceptions: [
        { id: 'no-uracil', accepted: ['ATGGCCAAGTGGTAA'], feedback: 'RNA has no thymine. Replace every T with U.' },
        { id: 'complemented-coding', accepted: ['UACCGGUUCACCAUU'], feedback: 'You complemented the strand. The mRNA is complementary to the TEMPLATE strand, so it matches the CODING strand you were given, with U for T. (If you had been given the template strand, complementing would be right.)' },
        { id: 'reverse-complement', accepted: ['UUACCACUUGGCCAU'], feedback: 'That is the reverse complement in RNA letters. The mRNA has the same sequence and direction as the coding strand, with U for T.' },
      ],
      hints: ['The coding strand has the same sequence as the mRNA except for one letter.', 'Replace T with U; keep everything else.'],
      solution: 'ATGGCCAAGTGGTAA → AUGGCCAAGUGGUAA.',
    },
    {
      id: 'l3-third-codon', kind: 'short-text', objectiveIds: ['bio.gene.transcription'], category: 'procedural', difficulty: 2,
      prompt: 'Divide the mRNA AUGGCCAAGUGGUAA into codons starting at the start codon. What is the **third** codon?',
      accepted: ['AAG'],
      placeholder: 'e.g. AUG',
      misconceptions: [
        { id: 'wrong-frame', accepted: ['AGU', 'GUG'], feedback: 'You started the frame one or two bases late. Codons begin at the AUG: AUG | GCC | AAG | …' },
        { id: 'off-by-one', accepted: ['GCC', 'UGG'], feedback: 'Count again: AUG is codon 1, GCC codon 2, so the third codon is AAG.' },
      ],
      hints: ['Mark off groups of three from the first base: AUG | GCC | …', 'The third group starts at base 7.'],
      solution: 'AUG GCC AAG UGG UAA: the third codon is AAG (lysine).',
    },
    {
      id: 'l3-translate', kind: 'short-text', objectiveIds: ['bio.gene.translation'], category: 'procedural', difficulty: 2,
      prompt: 'Translate AUGGCCAAGUGGUAA. Give the amino acids as three-letter codes separated by hyphens (or the one-letter string).',
      accepted: ['Met-Ala-Lys-Trp', 'Met-Ala-Lys-Trp-Stop', 'Met Ala Lys Trp', 'Met Ala Lys Trp Stop', 'MAKW', 'MAKW*'],
      placeholder: 'e.g. Met-Ala',
      misconceptions: [
        { id: 'wrong-frame', accepted: ['Trp-Pro-Ser-Gly', 'Trp Pro Ser Gly', 'WPSG'], feedback: 'That is the protein from the wrong reading frame (starting at base 2). Start at the AUG.' },
        { id: 'stop-as-amino-acid', accepted: ['Met-Ala-Lys-Trp-Tyr', 'MAKWY'], feedback: 'UAA is a stop codon, not tyrosine (UAU/UAC). Translation ends there and no amino acid is added.' },
      ],
      hints: ['Codons: AUG GCC AAG UGG UAA.', 'Look each codon up: AUG Met, GCC Ala, AAG Lys, UGG Trp, UAA stop.'],
      solution: 'AUG = Met, GCC = Ala, AAG = Lys, UGG = Trp, UAA = stop. Protein: Met-Ala-Lys-Trp (MAKW).',
    },
    {
      id: 'l3-degenerate', kind: 'multiple-choice', objectiveIds: ['bio.gene.translation'], category: 'conceptual', difficulty: 2,
      prompt: 'Why can several different codons specify the same amino acid?',
      options: [
        { id: 'count', text: 'There are 64 possible three-base codons but only 20 amino acids (plus stop), so most amino acids are encoded by more than one codon.', feedback: 'Correct: the code is degenerate. Often the third base can vary without changing the amino acid.' },
        { id: 'ambiguous', text: 'Because each codon can code for several amino acids depending on the cell.', feedback: 'The reverse: each codon specifies exactly one amino acid (or stop). Degenerate, not ambiguous.' },
        { id: 'two-letter', text: 'Because codons are really two bases long and the third base is ignored.', feedback: 'The third base often matters (for example AUG = Met but AUA = Ile, and UGG = Trp but UGA = stop).' },
      ],
      correctId: 'count',
      hints: ['How many three-letter words can you make from four letters? How many amino acids are there?'],
      solution: '4 × 4 × 4 = 64 codons; 61 code for 20 amino acids and 3 are stops. 61 > 20, so some amino acids (for example Leu, Ser, Arg with six codons each) have several codons.',
    },
    {
      id: 'l3-aa-count', kind: 'numeric', objectiveIds: ['bio.gene.translation'], category: 'computation', difficulty: 2,
      prompt: 'An mRNA has 300 bases from the first base of the AUG up to (but not including) the stop codon. How many amino acids does the protein have?',
      answer: { value: 100, absTol: 0.5 },
      misconceptions: [
        { id: 'one-per-base', value: 300, relTol: 0.001, feedback: 'Each amino acid is specified by three bases, not one.' },
        { id: 'pairs', value: 150, relTol: 0.001, feedback: 'Codons are triplets, not pairs. Divide by 3.' },
        { id: 'subtracted-stop-twice', value: 99, relTol: 0.001, feedback: 'The stop codon was already excluded from the 300 bases, so do not subtract it again.' },
      ],
      hints: ['One codon = 3 bases = 1 amino acid.'],
      solution: '300 / 3 = 100 amino acids. (Including the stop codon the coding region would be 303 bases.)',
    },
    {
      id: 'l3-classify-silent', kind: 'multiple-choice', objectiveIds: ['bio.gene.mutations'], category: 'application', difficulty: 2,
      prompt: 'In 5′-ATGGCCAAGTGGTAA-3′, base 6 changes from C to T. Classify the mutation.',
      options: [
        { id: 'silent', text: 'Silent: GCC → GCT (GCU in mRNA), both alanine.', feedback: 'Correct. The third base of the codon changed, and all four GCN codons code for Ala.' },
        { id: 'missense', text: 'Missense: the second amino acid changes.', feedback: 'Look up GCU: it is still alanine.' },
        { id: 'nonsense', text: 'Nonsense: a stop codon is created.', feedback: 'GCU is not a stop codon (UAA, UAG, UGA).' },
        { id: 'frameshift', text: 'Frameshift: all later codons change.', feedback: 'A substitution keeps the number of bases the same, so the frame is unchanged.' },
      ],
      correctId: 'silent',
      hints: ['Which codon contains base 6? Write it before and after the change.', 'Look both codons up in the table.'],
      solution: 'Base 6 is the last base of codon 2 (GCC). GCC → GCT; in mRNA GCU. Both are alanine, so the protein is unchanged: silent.',
    },
    {
      id: 'l3-new-codon', kind: 'short-text', objectiveIds: ['bio.gene.mutations', 'bio.gene.transcription'], category: 'multi-step', difficulty: 3,
      prompt: 'In 5′-ATGGCCAAGTGGTAA-3′, base 11 changes from G to A. Write the new **fourth mRNA codon**, then decide what kind of mutation this is. Enter the codon only.',
      accepted: ['UAG'],
      placeholder: 'e.g. UGG',
      misconceptions: [
        { id: 'dna-letters', accepted: ['TAG'], feedback: 'TAG is the DNA codon. In mRNA it is UAG, which is a stop codon: this is a nonsense mutation.' },
        { id: 'wrong-position', accepted: ['UGA', 'AGG', 'UGG'], feedback: 'Count carefully: codon 4 covers bases 10, 11, 12 (T G G). Base 11 is its middle base.' },
        { id: 'complement', accepted: ['AUC'], feedback: 'You complemented. The mRNA matches the coding strand with U for T.' },
      ],
      hints: ['Codon 4 is bases 10–12: TGG.', 'Change the middle base to A and convert T → U.'],
      solution: 'TGG → TAG → mRNA UAG, a stop codon. Trp is replaced by a premature stop: a nonsense mutation. The protein shrinks to Met-Ala-Lys.',
    },
    {
      id: 'l3-frameshift-error', kind: 'multiple-choice', objectiveIds: ['bio.gene.mutations'], category: 'error-identification', difficulty: 3,
      prompt: 'A student says: "Deleting one base is silent if it is the third base of a codon, because third-position changes usually do not matter." What is wrong?',
      options: [
        { id: 'right', text: 'Nothing: third-position changes are usually silent.', feedback: 'That is true for substitutions, which keep the frame. A deletion does not.' },
        { id: 'shift', text: 'A deletion removes a base, so every codon after it is regrouped: the reading frame shifts regardless of which position was deleted.', feedback: 'Correct. Third-position tolerance applies only to substitutions.' },
        { id: 'first', text: 'Deletions are only silent in the first position of a codon.', feedback: 'No position is safe: any single deletion shifts the frame.' },
      ],
      correctId: 'shift',
      hints: ['Write ATG GCC AAG TGG TAA, delete the C at position 6, and regroup in threes.'],
      solution: 'ATGGCAAGTGGTAA regroups as ATG GCA AGT GGT AA: Met-Ala-Ser-Gly, with no stop. Deleting the third base still shifted everything after it.',
    },
    {
      id: 'l3-new-gene', kind: 'short-text', objectiveIds: ['bio.gene.translation', 'bio.gene.transcription'], category: 'transfer', difficulty: 3,
      prompt: 'A gene’s coding strand reads 5′-ATGTTTGGCTGA-3′. Transcribe and translate it. Give the amino acids (three-letter codes with hyphens, or one-letter codes).',
      accepted: ['Met-Phe-Gly', 'Met-Phe-Gly-Stop', 'Met Phe Gly', 'Met Phe Gly Stop', 'MFG', 'MFG*'],
      placeholder: 'e.g. Met-Ala',
      misconceptions: [
        { id: 'wrong-frame', accepted: ['Cys-Leu-Ala', 'Cys Leu Ala', 'CLA'], feedback: 'That is the frame starting at base 2. Start at the AUG.' },
        { id: 'complemented-coding', accepted: ['Tyr-Lys-Pro-Thr', 'Tyr Lys Pro Thr', 'YKPT'], feedback: 'You complemented the coding strand before translating. The mRNA has the same sequence as the coding strand (T → U).' },
        { id: 'stop-as-amino-acid', accepted: ['Met-Phe-Gly-Trp', 'MFGW'], feedback: 'UGA is a stop codon (UGG is Trp). Translation ends after Gly.' },
      ],
      hints: ['mRNA: AUGUUUGGCUGA.', 'Codons: AUG UUU GGC UGA.'],
      solution: 'mRNA AUG UUU GGC UGA → Met-Phe-Gly-stop. Protein: Met-Phe-Gly (MFG).',
    },
    {
      id: 'l3-explain-frameshift', kind: 'written', objectiveIds: ['bio.gene.mutations'], category: 'explanation', difficulty: 3,
      prompt: 'Explain why inserting a single base into a gene usually damages the protein far more than substituting a single base.',
      modelAnswer: 'The ribosome reads mRNA in consecutive, non-overlapping triplets with no punctuation between codons. A substitution keeps the number of bases the same, so only the one codon containing the change is affected: at worst one amino acid changes or a stop appears early. An insertion adds a base, so every codon after it is regrouped (the reading frame shifts). From that point on the amino acids are essentially random, and the original stop codon is no longer in frame, so the protein is usually both wrong and the wrong length, and often non-functional.',
      rubric: ['States that codons are read in consecutive triplets from a fixed start', 'Explains that a substitution affects only one codon', 'Explains that an insertion shifts the frame for all downstream codons', 'Mentions loss or relocation of the stop codon or that the downstream sequence becomes essentially random'],
      hints: ['Think about what "reading frame" means and what fixes it.'],
      solution: 'See model answer.',
    },
    {
      id: 'l3-demo-length', kind: 'numeric', objectiveIds: ['bio.gene.translation'], category: 'application', difficulty: 3,
      prompt: 'Myoglobin has 153 amino acids. What is the minimum number of mRNA bases needed to code for it, including the stop codon?',
      answer: { value: 462, absTol: 0.5 },
      misconceptions: [
        { id: 'forgot-stop', value: 459, relTol: 0.001, feedback: '153 × 3 = 459 covers the amino acids; the stop codon adds three more bases.' },
        { id: 'no-triplet', value: 153, relTol: 0.001, feedback: 'Each amino acid needs three bases.' },
        { id: 'divided', value: 51, relTol: 0.001, feedback: 'You divided by 3. Going from amino acids to bases, multiply.' },
      ],
      hints: ['Three bases per amino acid, plus one stop codon.'],
      solution: '153 × 3 = 459 bases for the amino acids, plus 3 for the stop codon = 462 bases.',
    },
    {
      id: 'l3-demo-translate', kind: 'short-text', objectiveIds: ['bio.gene.translation', 'bio.gene.transcription'], category: 'transfer', difficulty: 4,
      prompt: 'Translate the mRNA 5′-AUGAAACCCUAG-3′. Give three-letter codes with hyphens (or one-letter codes).',
      accepted: ['Met-Lys-Pro', 'Met-Lys-Pro-Stop', 'Met Lys Pro', 'Met Lys Pro Stop', 'MKP', 'MKP*'],
      placeholder: 'e.g. Met-Ala',
      misconceptions: [
        { id: 'wrong-frame', accepted: ['Glu-Thr-Leu', 'Glu Thr Leu', 'ETL'], feedback: 'That is the frame starting at base 3. Begin at the AUG.' },
        { id: 'frame-plus-one', accepted: ['Stop', 'none', 'no protein', 'nothing'], feedback: 'Starting at base 2 gives UGA, a stop, immediately. Start at the AUG instead.' },
        { id: 'stop-as-amino-acid', accepted: ['Met-Lys-Pro-Tyr', 'MKPY'], feedback: 'UAG is a stop codon, not tyrosine.' },
      ],
      hints: ['AUG AAA CCC UAG.'],
      solution: 'AUG Met, AAA Lys, CCC Pro, UAG stop → Met-Lys-Pro (MKP).',
    },
  ],
};
