import type { Mutation } from '../model/dna';

export type Panel = 'scale' | 'dna';

export interface UiPreset {
  id: string;
  label: string;
  panel: Panel;
  description: string;
  /** Scale explorer: field of view in metres and which objects the readout compares. */
  fov?: number;
  selectedId?: string;
  referenceId?: string;
  /** DNA workbench: coding strand 5'→3' and an optional mutation to show. */
  coding?: string;
  mutation?: Mutation;
}

/** Example gene used throughout lesson 3: ATG GCC AAG TGG TAA → Met-Ala-Lys-Trp-Stop. */
export const EXAMPLE_GENE = 'ATGGCCAAGTGGTAA';
/** Example strand used in lesson 2 (GC content 37.5%). */
export const EXAMPLE_STRAND = 'ATGCGTTA';

export const PRESETS: Record<string, UiPreset> = {
  'scale:human': { id: 'scale:human', label: 'A whole person', panel: 'scale', fov: 3, selectedId: 'human', referenceId: 'red-blood-cell', description: 'Field of view 3 m: the human scale.' },
  'scale:hand': { id: 'scale:hand', label: 'Hand and ant', panel: 'scale', fov: 0.3, selectedId: 'hand', referenceId: 'ant', description: 'Field of view 30 cm: the largest things an ant shares a view with.' },
  'scale:cell': { id: 'scale:cell', label: 'Cells', panel: 'scale', fov: 2e-4, selectedId: 'red-blood-cell', referenceId: 'cheek-cell', description: 'Field of view 200 µm: egg cell, cheek cell, red blood cell, bacterium.' },
  'scale:bacterium': { id: 'scale:bacterium', label: 'Bacterium and mitochondrion', panel: 'scale', fov: 1.2e-5, selectedId: 'e-coli', referenceId: 'mitochondrion', description: 'Field of view 12 µm: a red blood cell fills most of the view.' },
  'scale:virus': { id: 'scale:virus', label: 'Virus and ribosome', panel: 'scale', fov: 4e-7, selectedId: 'influenza', referenceId: 'ribosome', description: 'Field of view 400 nm: below the light-microscope limit.' },
  'scale:dna': { id: 'scale:dna', label: 'DNA and small molecules', panel: 'scale', fov: 6e-9, selectedId: 'dna', referenceId: 'water', description: 'Field of view 6 nm: the double helix next to glucose and water.' },
  'scale:atom': { id: 'scale:atom', label: 'Atoms', panel: 'scale', fov: 8e-10, selectedId: 'hydrogen', referenceId: 'water', description: 'Field of view 0.8 nm: the bottom of the slider.' },
  'scale:free': { id: 'scale:free', label: 'Free exploration', panel: 'scale', fov: 1e-4, selectedId: 'red-blood-cell', referenceId: 'human', description: 'Zoom anywhere from 3 m to 0.1 nm.' },
  'dna:example': { id: 'dna:example', label: 'Example gene', panel: 'dna', coding: EXAMPLE_GENE, description: '5′-ATGGCCAAGTGGTAA-3′: Met-Ala-Lys-Trp-Stop.' },
  'dna:chargaff': { id: 'dna:chargaff', label: 'Short strand (Chargaff)', panel: 'dna', coding: EXAMPLE_STRAND, description: '5′-ATGCGTTA-3′: watch the base counts for one strand and for the double helix.' },
  'dna:palindrome': { id: 'dna:palindrome', label: 'Palindromic site', panel: 'dna', coding: 'GGATCC', description: 'GGATCC reads the same on both strands 5′→3′.' },
  'dna:mutation': { id: 'dna:mutation', label: 'Silent mutation', panel: 'dna', coding: EXAMPLE_GENE, mutation: { type: 'substitute', position: 6, base: 'T' }, description: 'Position 6 C→T: GCC becomes GCT, still Ala.' },
  'dna:mutation-missense': { id: 'dna:mutation-missense', label: 'Missense mutation', panel: 'dna', coding: EXAMPLE_GENE, mutation: { type: 'substitute', position: 5, base: 'A' }, description: 'Position 5 C→A: Ala becomes Asp.' },
  'dna:mutation-nonsense': { id: 'dna:mutation-nonsense', label: 'Nonsense mutation', panel: 'dna', coding: EXAMPLE_GENE, mutation: { type: 'substitute', position: 11, base: 'A' }, description: 'Position 11 G→A: TGG (Trp) becomes TAG, a stop.' },
  'dna:frameshift': { id: 'dna:frameshift', label: 'Frameshift (deletion)', panel: 'dna', coding: EXAMPLE_GENE, mutation: { type: 'delete', position: 4 }, description: 'Deleting base 4 shifts every codon after it.' },
  'dna:free': { id: 'dna:free', label: 'Your own sequence', panel: 'dna', coding: EXAMPLE_GENE, description: 'Type any A/C/G/T sequence.' },
};

export const DEFAULT_PRESET_ID = 'scale:human';
