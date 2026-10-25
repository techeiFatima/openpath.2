import { create } from 'zustand';
import { ATOM_PRESETS, DEFAULT_PRESET_ID, resolvePreset, type AtomCounts, type Mode, type TableColor } from './presets';

/** Transient UI state for the Atoms & Molecules viewport (not persisted). */
export interface ChemistryUiState {
  presetId: string;
  mode: Mode;
  atom: AtomCounts;
  tableColor: TableColor;
  selectedZ: number;
  molecule: string;
  applyPreset(id: string): void;
  setMode(mode: Mode): void;
  changeAtom(part: keyof AtomCounts, delta: number): void;
  setAtom(counts: Partial<AtomCounts>): void;
  setTableColor(color: TableColor): void;
  selectElement(z: number): void;
  setMolecule(formula: string): void;
}

const MAX_PROTONS = 118;
const MAX_NEUTRONS = 180;
const MAX_ELECTRONS = 120;

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, Math.round(v)));

const initial = ATOM_PRESETS[DEFAULT_PRESET_ID]!;

export const useChemistryUi = create<ChemistryUiState>()((set) => ({
  presetId: DEFAULT_PRESET_ID,
  mode: 'atom',
  atom: initial.atom,
  tableColor: 'blocks',
  selectedZ: 11,
  molecule: 'H2O',
  applyPreset: (id) => {
    const p = resolvePreset(id);
    if (!p) return;
    set((s) => ({
      presetId: p.id,
      mode: p.mode,
      atom: p.atom ?? s.atom,
      tableColor: p.tableColor ?? s.tableColor,
      selectedZ: p.selectedZ ?? s.selectedZ,
      molecule: p.molecule ?? s.molecule,
    }));
  },
  setMode: (mode) => set({ mode }),
  changeAtom: (part, delta) =>
    set((s) => {
      const next = { ...s.atom };
      if (part === 'protons') next.protons = clamp(next.protons + delta, 1, MAX_PROTONS);
      if (part === 'neutrons') next.neutrons = clamp(next.neutrons + delta, 0, MAX_NEUTRONS);
      if (part === 'electrons') next.electrons = clamp(next.electrons + delta, 0, MAX_ELECTRONS);
      return { atom: next, presetId: 'atom:free' };
    }),
  setAtom: (counts) =>
    set((s) => ({
      atom: {
        protons: clamp(counts.protons ?? s.atom.protons, 1, MAX_PROTONS),
        neutrons: clamp(counts.neutrons ?? s.atom.neutrons, 0, MAX_NEUTRONS),
        electrons: clamp(counts.electrons ?? s.atom.electrons, 0, MAX_ELECTRONS),
      },
      presetId: 'atom:free',
    })),
  setTableColor: (tableColor) => set({ tableColor, presetId: `table:${tableColor}` }),
  selectElement: (selectedZ) => set((s) => ({ selectedZ, mode: 'table', presetId: `table:${s.tableColor}` })),
  setMolecule: (molecule) => set({ molecule, mode: 'molecule', presetId: `molecule:${molecule}` }),
}));
