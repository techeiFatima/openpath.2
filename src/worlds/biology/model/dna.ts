/**
 * DNA workbench model: complementary strands, transcription, the standard genetic code,
 * translation, composition statistics and point-mutation classification. Pure TypeScript,
 * deterministic, no DOM.
 *
 * DIRECTION CONVENTIONS (used consistently by the lessons and the UI):
 *  - The learner's input is the CODING (sense) strand of a gene, written 5'→3'.
 *  - `complement(coding)` returns the TEMPLATE strand written 3'→5', aligned base-for-base
 *    under the input, so complement('ATGC') = 'TACG' (read as 3'-TACG-5').
 *  - `reverseComplement(coding)` is the same strand written in the conventional 5'→3'
 *    direction: reverseComplement('ATGC') = 'GCAT'.
 *  - `transcribe(coding)` returns the mRNA 5'→3'. Because RNA polymerase reads the template
 *    strand and builds a strand complementary to it, the mRNA has the SAME sequence as the
 *    coding strand with U in place of T: transcribe('ATGGCC') = 'AUGGCC'.
 *  - `transcribeFromTemplate(template3to5)` accepts the template written 3'→5' instead.
 *
 * Genetic code: NCBI translation table 1 (the standard code). AUG is the start codon (Met);
 * UAA, UAG and UGA are stop codons.
 */

export type DnaBase = 'A' | 'C' | 'G' | 'T';
export type RnaBase = 'A' | 'C' | 'G' | 'U';

const DNA_COMPLEMENT: Record<DnaBase, DnaBase> = { A: 'T', T: 'A', C: 'G', G: 'C' };

/** Upper-case and strip whitespace, hyphens and 5'/3' decorations such as "5'-ATG-3'". */
export function cleanSequence(input: string): string {
  return input
    .toUpperCase()
    .replace(/5['′]|3['′]/g, '')
    .replace(/[\s\-–—]/g, '');
}

export function isDna(seq: string): boolean {
  return /^[ACGT]*$/.test(seq);
}

export function isRna(seq: string): boolean {
  return /^[ACGU]*$/.test(seq);
}

/** Characters in `seq` that are not valid DNA bases (for error messages). */
export function invalidDnaCharacters(seq: string): string[] {
  return [...new Set([...seq].filter((c) => !'ACGT'.includes(c)))];
}

function assertDna(seq: string, what = 'sequence'): void {
  if (!isDna(seq)) throw new Error(`Invalid DNA ${what}: contains ${invalidDnaCharacters(seq).join(', ')}`);
}

/** Template strand written 3'→5', aligned under the coding strand (A↔T, G↔C). */
export function complement(coding: string): string {
  assertDna(coding);
  return [...coding].map((b) => DNA_COMPLEMENT[b as DnaBase]).join('');
}

/** The complementary strand written 5'→3' (reverse of `complement`). */
export function reverseComplement(coding: string): string {
  return [...complement(coding)].reverse().join('');
}

/** mRNA 5'→3' from the coding strand: same sequence, T → U. */
export function transcribe(coding: string): string {
  assertDna(coding, 'coding strand');
  return coding.replace(/T/g, 'U');
}

/** mRNA 5'→3' from the template strand written 3'→5' (aligned): complement, with U for A. */
export function transcribeFromTemplate(template3to5: string): string {
  return transcribe(complement(template3to5));
}

export interface AminoAcid {
  /** One-letter code; '*' for stop. */
  code1: string;
  /** Three-letter abbreviation; 'Stop' for stop. */
  code3: string;
  name: string;
}

export const AMINO_ACIDS: Record<string, AminoAcid> = {
  A: { code1: 'A', code3: 'Ala', name: 'Alanine' },
  R: { code1: 'R', code3: 'Arg', name: 'Arginine' },
  N: { code1: 'N', code3: 'Asn', name: 'Asparagine' },
  D: { code1: 'D', code3: 'Asp', name: 'Aspartic acid' },
  C: { code1: 'C', code3: 'Cys', name: 'Cysteine' },
  Q: { code1: 'Q', code3: 'Gln', name: 'Glutamine' },
  E: { code1: 'E', code3: 'Glu', name: 'Glutamic acid' },
  G: { code1: 'G', code3: 'Gly', name: 'Glycine' },
  H: { code1: 'H', code3: 'His', name: 'Histidine' },
  I: { code1: 'I', code3: 'Ile', name: 'Isoleucine' },
  L: { code1: 'L', code3: 'Leu', name: 'Leucine' },
  K: { code1: 'K', code3: 'Lys', name: 'Lysine' },
  M: { code1: 'M', code3: 'Met', name: 'Methionine' },
  F: { code1: 'F', code3: 'Phe', name: 'Phenylalanine' },
  P: { code1: 'P', code3: 'Pro', name: 'Proline' },
  S: { code1: 'S', code3: 'Ser', name: 'Serine' },
  T: { code1: 'T', code3: 'Thr', name: 'Threonine' },
  W: { code1: 'W', code3: 'Trp', name: 'Tryptophan' },
  Y: { code1: 'Y', code3: 'Tyr', name: 'Tyrosine' },
  V: { code1: 'V', code3: 'Val', name: 'Valine' },
  '*': { code1: '*', code3: 'Stop', name: 'Stop (no amino acid)' },
};

/**
 * NCBI standard genetic code (transl_table=1), laid out in the conventional UCAG order:
 * first base cycles slowest, third base fastest. Index = 16·b1 + 4·b2 + b3 with U=0,C=1,A=2,G=3.
 */
const RNA_ORDER = 'UCAG';
const STANDARD_CODE_AAS = 'FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG';

function buildGeneticCode(): Record<string, AminoAcid> {
  const table: Record<string, AminoAcid> = {};
  let i = 0;
  for (const b1 of RNA_ORDER) for (const b2 of RNA_ORDER) for (const b3 of RNA_ORDER) {
    const letter = STANDARD_CODE_AAS[i++]!;
    table[b1 + b2 + b3] = AMINO_ACIDS[letter]!;
  }
  return table;
}

/** All 64 RNA codons → amino acid (or stop). */
export const GENETIC_CODE: Readonly<Record<string, AminoAcid>> = buildGeneticCode();

export const START_CODON = 'AUG';
export const STOP_CODONS: readonly string[] = ['UAA', 'UAG', 'UGA'];

export function isStopCodon(codon: string): boolean {
  return STOP_CODONS.includes(codon);
}

/** Split an mRNA into complete triplets starting at `frame` (0, 1 or 2). Leftover bases are returned separately. */
export function codons(mrna: string, frame = 0): { codons: string[]; remainder: string } {
  const out: string[] = [];
  let i = frame;
  for (; i + 3 <= mrna.length; i += 3) out.push(mrna.slice(i, i + 3));
  return { codons: out, remainder: mrna.slice(i) };
}

export interface TranslateOptions {
  /** Reading frame offset 0, 1 or 2 (default 0). */
  frame?: number;
  /** Start translating at the first AUG instead of at the frame start (default false). */
  startAtFirstAUG?: boolean;
}

export interface Translation {
  /** Amino acids in order (stop excluded). */
  residues: AminoAcid[];
  /** Codons that were read, including the stop codon if one was reached. */
  codonsRead: string[];
  /** True when a stop codon ended translation; false when the mRNA ran out first. */
  terminated: boolean;
  /** 'Met-Ala-Lys' (a terminating stop is appended as '-Stop'). */
  threeLetter: string;
  /** 'MAK' (stop shown as '*'). */
  oneLetter: string;
  /** Index (0-based, in nucleotides) where translation began, or -1 if no AUG was found. */
  startIndex: number;
}

/** Translate an mRNA (5'→3') with the standard genetic code until a stop codon or the end. */
export function translate(mrna: string, opts: TranslateOptions = {}): Translation {
  if (!isRna(mrna)) throw new Error('translate() expects an RNA sequence (A, C, G, U)');
  const frame = opts.frame ?? 0;
  let start = frame;
  if (opts.startAtFirstAUG) {
    const idx = mrna.indexOf(START_CODON);
    if (idx < 0) return { residues: [], codonsRead: [], terminated: false, threeLetter: '', oneLetter: '', startIndex: -1 };
    start = idx;
  }
  const residues: AminoAcid[] = [];
  const codonsRead: string[] = [];
  let terminated = false;
  for (const c of codons(mrna.slice(start)).codons) {
    codonsRead.push(c);
    const aa = GENETIC_CODE[c]!;
    if (aa.code1 === '*') { terminated = true; break; }
    residues.push(aa);
  }
  const threeLetter = residues.map((r) => r.code3).join('-') + (terminated ? (residues.length ? '-Stop' : 'Stop') : '');
  const oneLetter = residues.map((r) => r.code1).join('') + (terminated ? '*' : '');
  return { residues, codonsRead, terminated, threeLetter, oneLetter, startIndex: start };
}

/** Percentage (0–100) of bases that are G or C. Empty sequence → 0. */
export function gcContent(seq: string): number {
  const s = seq.toUpperCase();
  if (s.length === 0) return 0;
  let gc = 0;
  for (const b of s) if (b === 'G' || b === 'C') gc++;
  return (100 * gc) / s.length;
}

export interface BaseCounts { A: number; C: number; G: number; T: number; total: number }

export interface ChargaffReport {
  /** Counts on the strand given. */
  strand: BaseCounts;
  /** Counts over both strands of the double helix (strand + its complement). */
  duplex: BaseCounts;
  /** In the duplex A = T and G = C always hold (Chargaff's first parity rule). */
  duplexAEqualsT: boolean;
  duplexGEqualsC: boolean;
  /** Whether the single strand given happens to satisfy A = T and G = C on its own. */
  strandAEqualsT: boolean;
  strandGEqualsC: boolean;
}

function countBases(seq: string): BaseCounts {
  const c: BaseCounts = { A: 0, C: 0, G: 0, T: 0, total: seq.length };
  for (const b of seq) if (b in c) c[b as DnaBase]++;
  return c;
}

/** Chargaff's rule check for a strand and for the double helix it belongs to. */
export function chargaffCounts(coding: string): ChargaffReport {
  assertDna(coding);
  const strand = countBases(coding);
  const duplex: BaseCounts = { A: strand.A + strand.T, T: strand.A + strand.T, G: strand.G + strand.C, C: strand.G + strand.C, total: 2 * strand.total };
  return {
    strand,
    duplex,
    duplexAEqualsT: duplex.A === duplex.T,
    duplexGEqualsC: duplex.G === duplex.C,
    strandAEqualsT: strand.A === strand.T,
    strandGEqualsC: strand.G === strand.C,
  };
}

export type MutationType = 'substitute' | 'insert' | 'delete';

export interface Mutation {
  type: MutationType;
  /** 1-based position in the coding strand. For 'insert' the new base goes AFTER this position (0 = before the first base). */
  position: number;
  /** Required for 'substitute' and 'insert'. */
  base?: DnaBase;
}

export type MutationEffect = 'none' | 'silent' | 'missense' | 'nonsense' | 'stop-loss' | 'frameshift';

export const MUTATION_EFFECT_LABELS: Record<MutationEffect, string> = {
  none: 'No change',
  silent: 'Silent (same amino acid)',
  missense: 'Missense (one amino acid changed)',
  nonsense: 'Nonsense (premature stop)',
  'stop-loss': 'Stop lost (translation reads on)',
  frameshift: 'Frameshift (reading frame shifted)',
};

export interface MutationResult {
  effect: MutationEffect;
  original: string;
  mutated: string;
  originalProtein: Translation;
  mutatedProtein: Translation;
  /** 0-based index of the first codon that differs, or -1 when the protein is unchanged. */
  firstChangedCodon: number;
  description: string;
}

/** Apply a single-base mutation to a coding strand (5'→3'). */
export function applyMutation(coding: string, m: Mutation): string {
  assertDna(coding);
  const n = coding.length;
  switch (m.type) {
    case 'substitute': {
      if (!m.base) throw new Error('substitute needs a base');
      if (m.position < 1 || m.position > n) throw new Error(`position ${m.position} outside 1..${n}`);
      return coding.slice(0, m.position - 1) + m.base + coding.slice(m.position);
    }
    case 'insert': {
      if (!m.base) throw new Error('insert needs a base');
      if (m.position < 0 || m.position > n) throw new Error(`position ${m.position} outside 0..${n}`);
      return coding.slice(0, m.position) + m.base + coding.slice(m.position);
    }
    case 'delete': {
      if (m.position < 1 || m.position > n) throw new Error(`position ${m.position} outside 1..${n}`);
      return coding.slice(0, m.position - 1) + coding.slice(m.position);
    }
  }
}

/**
 * Classify the effect of a single-base mutation on the protein translated from frame 0.
 * Insertions and deletions of one base always shift the reading frame downstream, so they are
 * reported as frameshift even when the shifted protein happens to be short.
 */
export function classifyMutation(coding: string, m: Mutation): MutationResult {
  const original = coding;
  const mutated = applyMutation(coding, m);
  const originalProtein = translate(transcribe(original));
  const mutatedProtein = translate(transcribe(mutated));
  const firstChangedCodon = firstDifference(originalProtein, mutatedProtein);

  if (m.type !== 'substitute') {
    const codonIdx = Math.floor((m.type === 'insert' ? m.position : m.position - 1) / 3);
    return {
      effect: 'frameshift', original, mutated, originalProtein, mutatedProtein, firstChangedCodon,
      description: `${m.type === 'insert' ? 'Inserting' : 'Deleting'} one base shifts every codon from codon ${codonIdx + 1} onward, so the amino-acid sequence downstream is rewritten and the original stop codon is usually lost or moved.`,
    };
  }

  if (mutated === original) {
    return { effect: 'none', original, mutated, originalProtein, mutatedProtein, firstChangedCodon: -1, description: 'The substituted base is the same as the original base, so nothing changes.' };
  }

  const codonIdx = Math.floor((m.position - 1) / 3);
  const oldCodon = transcribe(original).slice(codonIdx * 3, codonIdx * 3 + 3);
  const newCodon = transcribe(mutated).slice(codonIdx * 3, codonIdx * 3 + 3);
  const oldAA = oldCodon.length === 3 ? GENETIC_CODE[oldCodon]! : undefined;
  const newAA = newCodon.length === 3 ? GENETIC_CODE[newCodon]! : undefined;

  if (!oldAA || !newAA) {
    return { effect: 'silent', original, mutated, originalProtein, mutatedProtein, firstChangedCodon: -1, description: 'The change falls in an incomplete trailing codon that is never translated.' };
  }
  if (oldAA.code1 === newAA.code1) {
    return { effect: 'silent', original, mutated, originalProtein, mutatedProtein, firstChangedCodon: -1, description: `Codon ${codonIdx + 1} changes from ${oldCodon} to ${newCodon}, but both code for ${oldAA.code3}. The protein is unchanged.` };
  }
  // Only meaningful if this codon is actually reached before an earlier stop.
  const reached = codonIdx < originalProtein.codonsRead.length;
  if (!reached) {
    return { effect: 'silent', original, mutated, originalProtein, mutatedProtein, firstChangedCodon: -1, description: `Codon ${codonIdx + 1} lies after the stop codon, so it is never translated.` };
  }
  if (newAA.code1 === '*') {
    return { effect: 'nonsense', original, mutated, originalProtein, mutatedProtein, firstChangedCodon, description: `Codon ${codonIdx + 1} changes from ${oldCodon} (${oldAA.code3}) to ${newCodon}, a stop codon. Translation ends early: the protein is truncated to ${mutatedProtein.residues.length} amino acid${mutatedProtein.residues.length === 1 ? '' : 's'}.` };
  }
  if (oldAA.code1 === '*') {
    return { effect: 'stop-loss', original, mutated, originalProtein, mutatedProtein, firstChangedCodon, description: `Codon ${codonIdx + 1} was the stop codon ${oldCodon}; it now codes for ${newAA.code3}, so translation continues past the original end.` };
  }
  return { effect: 'missense', original, mutated, originalProtein, mutatedProtein, firstChangedCodon, description: `Codon ${codonIdx + 1} changes from ${oldCodon} (${oldAA.code3}) to ${newCodon} (${newAA.code3}). One amino acid is replaced; the rest of the chain is unchanged.` };
}

function firstDifference(a: Translation, b: Translation): number {
  const n = Math.max(a.codonsRead.length, b.codonsRead.length);
  for (let i = 0; i < n; i++) {
    const x = a.codonsRead[i] ? GENETIC_CODE[a.codonsRead[i]!]!.code1 : undefined;
    const y = b.codonsRead[i] ? GENETIC_CODE[b.codonsRead[i]!]!.code1 : undefined;
    if (x !== y) return i;
  }
  return -1;
}

/** Summary used by the UI readout and the instructor context. */
export interface DnaSummary {
  coding: string;
  template3to5: string;
  mrna: string;
  codons: string[];
  remainder: string;
  translation: Translation;
  gcPercent: number;
  chargaff: ChargaffReport;
}

export function summarizeDna(coding: string): DnaSummary {
  const mrna = transcribe(coding);
  const c = codons(mrna);
  return {
    coding,
    template3to5: complement(coding),
    mrna,
    codons: c.codons,
    remainder: c.remainder,
    translation: translate(mrna),
    gcPercent: gcContent(coding),
    chargaff: chargaffCounts(coding),
  };
}
