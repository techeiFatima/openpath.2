import { elementBySymbol } from '../model/elements';
import { MOLECULES, moleculeByFormula } from '../model/molecules';

/**
 * Preset ids are the bridge between lesson prose and the environment (docs/05-world-engine.md §4).
 *   atom:<name>                       a named particle-count setup for the atom builder
 *   table:<blocks|electronegativity|radius>[:<Symbol>]   periodic table colouring, optionally selecting an element
 *   molecule:<Formula>                a curated molecule in the viewer
 * This module has no React dependency so content tests can check that every referenced preset resolves.
 */
export type Mode = 'atom' | 'table' | 'molecule';
export type TableColor = 'blocks' | 'electronegativity' | 'radius';

export interface AtomCounts {
  protons: number;
  neutrons: number;
  electrons: number;
}

export interface ResolvedPreset {
  id: string;
  label: string;
  mode: Mode;
  description: string;
  atom: AtomCounts | null;
  tableColor: TableColor | null;
  selectedZ: number | null;
  molecule: string | null;
}

const A = (protons: number, neutrons: number, electrons: number): AtomCounts => ({ protons, neutrons, electrons });

export const ATOM_PRESETS: Record<string, { label: string; description: string; atom: AtomCounts }> = {
  'atom:hydrogen-1': { label: 'Hydrogen-1', description: 'One proton, one electron, no neutrons.', atom: A(1, 0, 1) },
  'atom:carbon-12': { label: 'Carbon-12', description: 'The common carbon isotope: 6 p, 6 n, 6 e.', atom: A(6, 6, 6) },
  'atom:carbon-13': { label: 'Carbon-13', description: 'Heavier stable isotope of carbon.', atom: A(6, 7, 6) },
  'atom:carbon-14': { label: 'Carbon-14', description: 'Radioactive isotope used in dating.', atom: A(6, 8, 6) },
  'atom:oxygen': { label: 'Oxygen-16', description: 'Neutral oxygen atom.', atom: A(8, 8, 8) },
  'atom:o-ion': { label: 'Oxide ion O²⁻', description: 'Oxygen with two extra electrons.', atom: A(8, 8, 10) },
  'atom:neon': { label: 'Neon-20', description: 'Full shells: 2, 8.', atom: A(10, 10, 10) },
  'atom:sodium': { label: 'Sodium-23', description: 'Neutral sodium: shells 2, 8, 1.', atom: A(11, 12, 11) },
  'atom:na-ion': { label: 'Sodium ion Na⁺', description: 'Sodium that has lost one electron.', atom: A(11, 12, 10) },
  'atom:chlorine': { label: 'Chlorine-35', description: 'Neutral chlorine: shells 2, 8, 7.', atom: A(17, 18, 17) },
  'atom:cl-ion': { label: 'Chloride ion Cl⁻', description: 'Chlorine that has gained one electron.', atom: A(17, 18, 18) },
  'atom:argon': { label: 'Argon-40', description: 'Full outer shell: 2, 8, 8.', atom: A(18, 22, 18) },
  'atom:potassium': { label: 'Potassium-39', description: 'Shells 2, 8, 8, 1: the 19th electron starts shell 4.', atom: A(19, 20, 19) },
  'atom:free': { label: 'Free experiment', description: 'Change anything.', atom: A(6, 6, 6) },
};

const TABLE_LABELS: Record<TableColor, string> = {
  blocks: 'Periodic table: s, p, d, f blocks',
  electronegativity: 'Periodic table: coloured by electronegativity',
  radius: 'Periodic table: atomic radius trend (qualitative)',
};

export function resolvePreset(id: string): ResolvedPreset | null {
  const atom = ATOM_PRESETS[id];
  if (atom) return { id, label: atom.label, mode: 'atom', description: atom.description, atom: atom.atom, tableColor: null, selectedZ: null, molecule: null };
  const table = /^table:(blocks|electronegativity|radius)(?::([A-Z][a-z]?))?$/.exec(id);
  if (table) {
    const colorBy = table[1] as TableColor;
    const sym = table[2];
    const el = sym ? elementBySymbol(sym) : undefined;
    if (sym && !el) return null;
    return { id, label: TABLE_LABELS[colorBy], mode: 'table', description: el ? `${TABLE_LABELS[colorBy]}, ${el.name} selected.` : TABLE_LABELS[colorBy], atom: null, tableColor: colorBy, selectedZ: el?.z ?? null, molecule: null };
  }
  const mol = /^molecule:(\S+)$/.exec(id);
  if (mol) {
    const m = moleculeByFormula(mol[1]!);
    if (!m) return null;
    return { id, label: `${m.name} (${m.formulaPretty})`, mode: 'molecule', description: m.notes, atom: null, tableColor: null, selectedZ: null, molecule: m.formula };
  }
  return null;
}

export const DEFAULT_PRESET_ID = 'atom:carbon-12';

/** Presets offered in the setup menu, grouped by mode. */
export const PRESET_MENU: ResolvedPreset[] = [
  ...Object.keys(ATOM_PRESETS),
  'table:blocks',
  'table:electronegativity',
  'table:radius',
  ...MOLECULES.map((m) => `molecule:${m.formula}`),
].map((id) => resolvePreset(id)!);
