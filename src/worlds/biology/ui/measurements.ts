import type { Measurement } from '@/core/simulation/types';
import { classifyMutation, MUTATION_EFFECT_LABELS, summarizeDna, type DnaSummary, type Mutation, type MutationResult } from '../model/dna';
import { MICROSCOPE_LABELS, microscopeFor, ordersOfMagnitude, SCALE_OBJECTS_BY_ID, sizeRatio } from '../model/scale';
import type { Panel } from './presets';

/**
 * Pure helpers that turn UI state into the labelled values shown in the readout and handed
 * to the instructor as `simulationContext`. No React here so they can be unit tested.
 */

export interface ScaleState { fov: number; selectedId: string; referenceId: string }

export function scaleMeasurements({ fov, selectedId, referenceId }: ScaleState): Measurement[] {
  const sel = SCALE_OBJECTS_BY_ID.get(selectedId);
  const ref = SCALE_OBJECTS_BY_ID.get(referenceId);
  const out: Measurement[] = [{ id: 'fov', label: 'Field of view (height)', value: fov, unit: 'm', source: 'numerical' }];
  if (sel) out.push({ id: 'selected', label: `${sel.name}: typical size`, value: sel.size, unit: 'm', source: 'numerical' });
  if (ref) out.push({ id: 'reference', label: `${ref.name}: typical size`, value: ref.size, unit: 'm', source: 'numerical' });
  if (sel && ref) {
    out.push({ id: 'ratio', label: `Ratio ${sel.name} / ${ref.name}`, value: sizeRatio(sel, ref), unit: '', formula: '\\frac{\\text{size}_A}{\\text{size}_B}', source: 'analytic' });
    out.push({ id: 'orders', label: 'Orders of magnitude', value: ordersOfMagnitude(sel, ref), unit: '', formula: '\\log_{10}\\frac{\\text{size}_A}{\\text{size}_B}', source: 'analytic' });
  }
  return out;
}

export function microscopeSentence(selectedId: string): string {
  const sel = SCALE_OBJECTS_BY_ID.get(selectedId);
  if (!sel) return '';
  return `${MICROSCOPE_LABELS[microscopeFor(sel.size)]} needed for: ${sel.name} (rule of thumb)`;
}

export interface DnaState { coding: string; mutation: Mutation | null }

export interface DnaReadout {
  summary: DnaSummary;
  mutation: MutationResult | null;
  mutationError: string | null;
}

export function dnaReadout({ coding, mutation }: DnaState): DnaReadout {
  const summary = summarizeDna(coding);
  if (!mutation) return { summary, mutation: null, mutationError: null };
  try {
    return { summary, mutation: classifyMutation(coding, mutation), mutationError: null };
  } catch (e) {
    return { summary, mutation: null, mutationError: e instanceof Error ? e.message : 'Invalid mutation' };
  }
}

export function dnaMeasurements(r: DnaReadout): Measurement[] {
  const s = r.summary;
  const out: Measurement[] = [
    { id: 'length', label: 'Length (bases)', value: s.coding.length, unit: 'nt', source: 'numerical' },
    { id: 'gc', label: 'GC content', value: s.gcPercent, unit: '%', formula: '\\frac{G + C}{\\text{total}} \\times 100', source: 'analytic' },
    { id: 'codons', label: 'Complete codons', value: s.codons.length, unit: '', source: 'analytic' },
    { id: 'aa', label: 'Amino acids translated', value: s.translation.residues.length, unit: '', source: 'analytic' },
  ];
  if (r.mutation) out.push({ id: 'mutant-aa', label: 'Amino acids after mutation', value: r.mutation.mutatedProtein.residues.length, unit: '', source: 'analytic' });
  return out;
}

export function dnaSentence(r: DnaReadout): string {
  const s = r.summary;
  const protein = s.translation.threeLetter || '(none)';
  const base = `Coding strand ${s.coding} (${s.coding.length} bases, GC ${s.gcPercent.toFixed(1)}%). mRNA ${s.mrna}. Protein ${protein}${s.translation.terminated ? '' : ' (no stop codon reached)'}.`;
  if (!r.mutation) return base;
  return `${base} Mutation: ${MUTATION_EFFECT_LABELS[r.mutation.effect]}. Mutated protein ${r.mutation.mutatedProtein.threeLetter || '(none)'}.`;
}

export function assumptionsFor(panel: Panel): string[] {
  return panel === 'scale'
    ? [
        'Every object is drawn at one typical size; real sizes vary (ranges shown in the readout).',
        'Shapes are schematic, not to-scale drawings of real specimens.',
        'Microscope thresholds (naked eye ≳ 0.1 mm, light ≳ 200 nm, electron below) are rules of thumb.',
      ]
    : [
        'The typed sequence is treated as the coding strand (5′→3′); the mRNA copies it with U for T.',
        'Translation starts at the first base of the sequence, assumed to be the start codon AUG, and uses the standard genetic code.',
        'Promoters, untranslated regions, introns and RNA processing are ignored.',
      ];
}
