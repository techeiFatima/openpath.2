import { shellOccupancy } from './configuration';
import { elementByZ, type Element } from './elements';

/**
 * Bookkeeping for the atom builder: identity, mass number, charge and isotope notation from
 * particle counts. Nothing here is a physical model of the nucleus; it is arithmetic on
 * counts, plus the Bohr-style shell occupancy (a teaching idealisation).
 */

export interface AtomDescription {
  protons: number;
  neutrons: number;
  electrons: number;
  element: Element | undefined;
  /** A = protons + neutrons */
  massNumber: number;
  /** protons − electrons */
  charge: number;
  /** "neutral atom" | "cation" | "anion" */
  ionKind: 'neutral atom' | 'cation' | 'anion';
  /** e.g. "2+", "−", "" */
  chargeLabel: string;
  /** e.g. "C-14" or "Na-23 +" */
  hyphenNotation: string;
  /** LaTeX, e.g. "^{14}_{6}\\mathrm{C}" or "^{23}_{11}\\mathrm{Na}^{+}" */
  latexNotation: string;
  /** Bohr shells, e.g. [2, 8, 1]; empty when there are no electrons. */
  shells: number[];
}

export function chargeLabel(charge: number): string {
  if (charge === 0) return '';
  const mag = Math.abs(charge);
  return `${mag === 1 ? '' : mag}${charge > 0 ? '+' : '−'}`;
}

export function describeAtom(protons: number, neutrons: number, electrons: number): AtomDescription {
  const element = elementByZ(protons);
  const massNumber = protons + neutrons;
  const charge = protons - electrons;
  const sym = element?.symbol ?? '?';
  const label = chargeLabel(charge);
  const shells = protons >= 1 && electrons > 0 && protons <= 118 ? safeShells(protons, electrons) : [];
  return {
    protons,
    neutrons,
    electrons,
    element,
    massNumber,
    charge,
    ionKind: charge === 0 ? 'neutral atom' : charge > 0 ? 'cation' : 'anion',
    chargeLabel: label,
    hyphenNotation: `${sym}-${massNumber}${label ? ` ${label}` : ''}`,
    latexNotation: `^{${massNumber}}_{${protons}}\\mathrm{${sym}}${label ? `^{${label.replace('−', '-')}}` : ''}`,
    shells,
  };
}

function safeShells(z: number, electrons: number): number[] {
  try {
    return shellOccupancy(z, electrons);
  } catch {
    return [];
  }
}

export interface Isotope {
  /** Isotopic mass in u. */
  mass: number;
  /** Natural abundance as a fraction (0–1) or a percentage (0–100); the function detects which. */
  abundance: number;
}

/** Abundance-weighted average of isotopic masses (what the periodic table lists as atomic mass). */
export function averageAtomicMass(isotopes: Isotope[]): number {
  const total = isotopes.reduce((s, i) => s + i.abundance, 0);
  if (total <= 0) throw new Error('Abundances must be positive');
  return isotopes.reduce((s, i) => s + i.mass * (i.abundance / total), 0);
}

/**
 * Isotope data used in lessons (masses in u, abundances in %). Values are the commonly
 * tabulated ones (IUPAC/CIAAW), rounded; re-verify before scientific sign-off.
 */
export const ISOTOPE_DATA: Record<string, Isotope[]> = {
  Cl: [
    { mass: 34.969, abundance: 75.76 },
    { mass: 36.966, abundance: 24.24 },
  ],
  Cu: [
    { mass: 62.930, abundance: 69.15 },
    { mass: 64.928, abundance: 30.85 },
  ],
  Mg: [
    { mass: 23.985, abundance: 78.99 },
    { mass: 24.986, abundance: 10.00 },
    { mass: 25.983, abundance: 11.01 },
  ],
  B: [
    { mass: 10.013, abundance: 19.9 },
    { mass: 11.009, abundance: 80.1 },
  ],
};
