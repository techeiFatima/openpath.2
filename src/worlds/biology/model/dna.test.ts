import { describe, expect, it } from 'vitest';
import {
  applyMutation, chargaffCounts, classifyMutation, cleanSequence, codons, complement, gcContent, GENETIC_CODE,
  invalidDnaCharacters, isDna, reverseComplement, STOP_CODONS, summarizeDna, transcribe, transcribeFromTemplate, translate,
} from './dna';

describe('genetic code table', () => {
  it('has all 64 codons, exactly three stops (UAA, UAG, UGA) and AUG → Met', () => {
    const keys = Object.keys(GENETIC_CODE);
    expect(keys).toHaveLength(64);
    expect(new Set(keys).size).toBe(64);
    for (const k of keys) expect(k).toMatch(/^[ACGU]{3}$/);
    const stops = keys.filter((k) => GENETIC_CODE[k]!.code1 === '*').sort();
    expect(stops).toEqual(['UAA', 'UAG', 'UGA']);
    expect([...STOP_CODONS].sort()).toEqual(stops);
    expect(GENETIC_CODE.AUG).toMatchObject({ code1: 'M', code3: 'Met' });
  });
  it('encodes 20 distinct amino acids with textbook spot checks', () => {
    const aas = new Set(Object.values(GENETIC_CODE).map((a) => a.code1));
    aas.delete('*');
    expect(aas.size).toBe(20);
    expect(GENETIC_CODE.UUU!.code3).toBe('Phe');
    expect(GENETIC_CODE.UGG!.code3).toBe('Trp');
    expect(GENETIC_CODE.GCC!.code3).toBe('Ala');
    expect(GENETIC_CODE.AAG!.code3).toBe('Lys');
    expect(GENETIC_CODE.GGG!.code3).toBe('Gly');
    expect(GENETIC_CODE.CAU!.code3).toBe('His');
    expect(GENETIC_CODE.AUA!.code3).toBe('Ile');
    // degeneracy: six codons for Leu, Ser and Arg; one for Met and Trp
    const count = (c1: string) => Object.values(GENETIC_CODE).filter((a) => a.code1 === c1).length;
    expect(count('L')).toBe(6);
    expect(count('S')).toBe(6);
    expect(count('R')).toBe(6);
    expect(count('M')).toBe(1);
    expect(count('W')).toBe(1);
  });
});

describe('strands', () => {
  it('complement of 5\'-ATGC-3\' is 3\'-TACG-5\' (aligned) and 5\'-GCAT-3\' (reverse complement)', () => {
    expect(complement('ATGC')).toBe('TACG');
    expect(reverseComplement('ATGC')).toBe('GCAT');
    expect(reverseComplement('GGATCC')).toBe('GGATCC'); // palindromic BamHI site
  });
  it('cleans decorated input and rejects non-bases', () => {
    expect(cleanSequence("5'-atg gcc-3'")).toBe('ATGGCC');
    expect(cleanSequence('5′-ATG-3′')).toBe('ATG');
    expect(isDna('ATGC')).toBe(true);
    expect(isDna('ATGU')).toBe(false);
    expect(invalidDnaCharacters('ATXGU')).toEqual(['X', 'U']);
    expect(() => complement('ATU')).toThrow();
  });
});

describe('transcription', () => {
  it('treats the input as the coding strand: ATGGCC → AUGGCC', () => {
    expect(transcribe('ATGGCC')).toBe('AUGGCC');
  });
  it('from the template strand (3\'→5\') gives the complementary RNA', () => {
    expect(transcribeFromTemplate('TACCGG')).toBe('AUGGCC');
    expect(transcribeFromTemplate(complement('ATGGCC'))).toBe(transcribe('ATGGCC'));
  });
  it('splits codons in a chosen frame and reports the remainder', () => {
    expect(codons('AUGGCCUAA')).toEqual({ codons: ['AUG', 'GCC', 'UAA'], remainder: '' });
    expect(codons('AUGGCCUAAG')).toEqual({ codons: ['AUG', 'GCC', 'UAA'], remainder: 'G' });
    expect(codons('AUGGCCUAA', 1).codons).toEqual(['UGG', 'CCU']);
  });
});

describe('translation', () => {
  it('AUGGCCUAA → Met-Ala-Stop / MA*', () => {
    const t = translate('AUGGCCUAA');
    expect(t.threeLetter).toBe('Met-Ala-Stop');
    expect(t.oneLetter).toBe('MA*');
    expect(t.terminated).toBe(true);
    expect(t.residues.map((r) => r.name)).toEqual(['Methionine', 'Alanine']);
  });
  it('runs to the end when there is no stop codon', () => {
    const t = translate('AUGGCCAAG');
    expect(t.threeLetter).toBe('Met-Ala-Lys');
    expect(t.terminated).toBe(false);
  });
  it('can start at the first AUG', () => {
    const t = translate('CCAUGUUUUAA', { startAtFirstAUG: true });
    expect(t.threeLetter).toBe('Met-Phe-Stop');
    expect(t.startIndex).toBe(2);
    expect(translate('CCCUUU', { startAtFirstAUG: true }).startIndex).toBe(-1);
  });
  it('reads a different protein in a different frame', () => {
    expect(translate('AUGGCCAAGUGGUAA').threeLetter).toBe('Met-Ala-Lys-Trp-Stop');
    expect(translate('AUGGCCAAGUGGUAA', { frame: 1 }).threeLetter).toBe('Trp-Pro-Ser-Gly');
  });
  it('rejects DNA letters', () => {
    expect(() => translate('ATG')).toThrow();
  });
});

describe('composition', () => {
  it('GC content of GGCC is 100%, of ATAT is 0%, of ATGCGTTA is 37.5%', () => {
    expect(gcContent('GGCC')).toBe(100);
    expect(gcContent('ATAT')).toBe(0);
    expect(gcContent('ATGCGTTA')).toBe(37.5);
    expect(gcContent('')).toBe(0);
  });
  it('Chargaff: the duplex always has A = T and G = C even when one strand does not', () => {
    const r = chargaffCounts('AAAG');
    expect(r.strand).toEqual({ A: 3, C: 0, G: 1, T: 0, total: 4 });
    expect(r.strandAEqualsT).toBe(false);
    expect(r.duplex).toEqual({ A: 3, T: 3, G: 1, C: 1, total: 8 });
    expect(r.duplexAEqualsT).toBe(true);
    expect(r.duplexGEqualsC).toBe(true);
  });
});

describe('mutations', () => {
  const gene = 'ATGGCCAAGTGGTAA'; // Met-Ala-Lys-Trp-Stop
  it('applies substitutions, insertions and deletions at 1-based positions', () => {
    expect(applyMutation(gene, { type: 'substitute', position: 6, base: 'T' })).toBe('ATGGCTAAGTGGTAA');
    expect(applyMutation(gene, { type: 'insert', position: 3, base: 'A' })).toBe('ATGAGCCAAGTGGTAA');
    expect(applyMutation(gene, { type: 'insert', position: 0, base: 'A' })).toBe('A' + gene);
    expect(applyMutation(gene, { type: 'delete', position: 4 })).toBe('ATGCCAAGTGGTAA');
    expect(() => applyMutation(gene, { type: 'delete', position: 16 })).toThrow();
  });
  it('silent: GCC → GCT still Ala', () => {
    const r = classifyMutation(gene, { type: 'substitute', position: 6, base: 'T' });
    expect(r.effect).toBe('silent');
    expect(r.mutatedProtein.threeLetter).toBe('Met-Ala-Lys-Trp-Stop');
  });
  it('missense: GCC → GAC changes Ala to Asp', () => {
    const r = classifyMutation(gene, { type: 'substitute', position: 5, base: 'A' });
    expect(r.effect).toBe('missense');
    expect(r.mutatedProtein.threeLetter).toBe('Met-Asp-Lys-Trp-Stop');
    expect(r.firstChangedCodon).toBe(1);
  });
  it('nonsense: TGG → TAG makes a premature stop', () => {
    const r = classifyMutation(gene, { type: 'substitute', position: 11, base: 'A' });
    expect(r.effect).toBe('nonsense');
    expect(r.mutatedProtein.threeLetter).toBe('Met-Ala-Lys-Stop');
  });
  it('frameshift: deleting or inserting one base rewrites downstream codons', () => {
    const del = classifyMutation(gene, { type: 'delete', position: 4 });
    expect(del.effect).toBe('frameshift');
    expect(del.mutatedProtein.threeLetter).toBe('Met-Pro-Ser-Gly');
    const ins = classifyMutation(gene, { type: 'insert', position: 3, base: 'A' });
    expect(ins.effect).toBe('frameshift');
    expect(ins.mutatedProtein.threeLetter).toBe('Met-Ser-Gln-Val-Val');
  });
  it('stop-loss and no-change cases', () => {
    expect(classifyMutation(gene, { type: 'substitute', position: 14, base: 'C' }).effect).toBe('stop-loss'); // TAA → TCA (Ser)
    expect(classifyMutation(gene, { type: 'substitute', position: 1, base: 'A' }).effect).toBe('none');
  });
  it('summarizeDna gathers everything consistently', () => {
    const s = summarizeDna(gene);
    expect(s.template3to5).toBe('TACCGGTTCACCATT');
    expect(s.mrna).toBe('AUGGCCAAGUGGUAA');
    expect(s.codons).toHaveLength(5);
    expect(s.translation.oneLetter).toBe('MAKW*');
    expect(s.gcPercent).toBeCloseTo(46.67, 1);
    expect(s.chargaff.duplexAEqualsT).toBe(true);
  });
});
