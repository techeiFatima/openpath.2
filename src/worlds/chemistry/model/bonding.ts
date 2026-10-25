import { predictedIonCharge, valenceElectrons } from './configuration';
import { elementBySymbol, isMetal, type Element } from './elements';

/**
 * Deterministic bonding rules of thumb, with their limits stated.
 *
 * 1. Bond type from the electronegativity difference ΔEN (Pauling):
 *      ΔEN < 0.4            → nonpolar covalent
 *      0.4 ≤ ΔEN ≤ 1.7      → polar covalent
 *      ΔEN > 1.7            → ionic
 *    These cut-offs are the ones most textbooks quote. Real bonding is a CONTINUUM of
 *    electron sharing; the thresholds are a classroom convention. Known failures: H–F
 *    (ΔEN = 1.78) is a polar covalent molecule, not an ionic compound; many metal–nonmetal
 *    pairs with ΔEN below 1.7 (e.g. Al–Cl, 1.55; Be–Cl, 1.59) form compounds with substantial
 *    covalent character but are usually taught as ionic. The "metal + nonmetal → ionic,
 *    nonmetal + nonmetal → covalent" criterion is the one chemists actually apply first.
 *
 * 2. Ionic formula from predicted main-group ion charges (criss-cross / lowest common multiple).
 *    Works for simple binary compounds of groups 1, 2, 13 metals with groups 15–17 nonmetals.
 *    It says nothing about whether the compound is stable or exists.
 *
 * 3. Octet check for Lewis structures: counts electrons around each atom (2 per bond order,
 *    2 per lone pair) and the total valence electrons. Hydrogen needs 2 (duet); boron, beryllium
 *    and aluminium commonly stop short; period ≥ 3 central atoms may exceed 8 (expanded octet).
 */

export type BondType = 'nonpolar-covalent' | 'polar-covalent' | 'ionic';

export const BOND_THRESHOLDS = { nonpolarMax: 0.4, ionicMin: 1.7 } as const;

export const BOND_TYPE_LABELS: Record<BondType, string> = {
  'nonpolar-covalent': 'nonpolar covalent',
  'polar-covalent': 'polar covalent',
  ionic: 'ionic',
};

export function classifyBondByDifference(deltaEN: number): BondType {
  const d = Math.abs(deltaEN);
  if (d < BOND_THRESHOLDS.nonpolarMax) return 'nonpolar-covalent';
  if (d > BOND_THRESHOLDS.ionicMin) return 'ionic';
  return 'polar-covalent';
}

export interface BondPrediction {
  deltaEN: number;
  /** From the ΔEN rule alone. */
  byDifference: BondType;
  /** Rule combined with the metal/nonmetal criterion; what we actually recommend. */
  recommended: BondType;
  /** Element whose atoms carry the partial negative charge (more electronegative), or null if equal. */
  negativeEnd: Element | null;
  caveat: string | null;
}

/** Predict the bond between two elements. Returns null when either lacks an electronegativity value. */
export function predictBond(a: Element, b: Element): BondPrediction | null {
  if (a.electronegativity === null || b.electronegativity === null) return null;
  const deltaEN = Math.abs(a.electronegativity - b.electronegativity);
  const byDifference = classifyBondByDifference(deltaEN);
  const metalNonmetal = isMetal(a) !== isMetal(b);
  const bothNonmetal = !isMetal(a) && !isMetal(b);
  let recommended = byDifference;
  let caveat: string | null = null;
  if (byDifference === 'ionic' && bothNonmetal) {
    recommended = 'polar-covalent';
    caveat = `ΔEN = ${deltaEN.toFixed(2)} is above the 1.7 cut-off, but both elements are nonmetals, so they share electrons: a strongly polar covalent bond (as in HF). The ΔEN rule is a guide, not a law.`;
  } else if (byDifference === 'polar-covalent' && metalNonmetal && deltaEN >= 1.2) {
    recommended = 'ionic';
    caveat = `ΔEN = ${deltaEN.toFixed(2)} is below 1.7, yet a metal and a nonmetal usually form an ionic compound; such borderline compounds have noticeable covalent character.`;
  } else if (byDifference === 'polar-covalent' && metalNonmetal) {
    caveat = `ΔEN = ${deltaEN.toFixed(2)}: a metal–nonmetal pair with a modest difference. Expect bonding intermediate between ionic and covalent (polar covalent to ionic).`;
  }
  const negativeEnd = a.electronegativity === b.electronegativity ? null : a.electronegativity > b.electronegativity ? a : b;
  return { deltaEN, byDifference, recommended, negativeEnd, caveat };
}

export function predictBondBySymbols(a: string, b: string): BondPrediction | null {
  const ea = elementBySymbol(a);
  const eb = elementBySymbol(b);
  if (!ea || !eb) return null;
  return predictBond(ea, eb);
}

export interface IonicFormula {
  cation: { symbol: string; charge: number; count: number };
  anion: { symbol: string; charge: number; count: number };
  /** e.g. "MgCl2" (plain) */
  formula: string;
  /** e.g. "MgCl₂" */
  formulaPretty: string;
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

const SUB = '₀₁₂₃₄₅₆₇₈₉';
export function subscriptDigits(n: number): string {
  return n === 1 ? '' : String(n).split('').map((d) => SUB[Number(d)]!).join('');
}

/**
 * Formula of the binary ionic compound of a main-group metal and nonmetal, using the group
 * ion charges. Returns null when either element has no predicted ion charge (or the charges
 * have the same sign).
 */
export function ionicFormula(metal: Element, nonmetal: Element): IonicFormula | null {
  const qc = predictedIonCharge(metal);
  const qa = predictedIonCharge(nonmetal);
  if (qc === null || qa === null || qc <= 0 || qa >= 0) return null;
  const g = gcd(qc, -qa);
  const nCation = -qa / g;
  const nAnion = qc / g;
  const formula = `${metal.symbol}${nCation === 1 ? '' : nCation}${nonmetal.symbol}${nAnion === 1 ? '' : nAnion}`;
  const formulaPretty = `${metal.symbol}${subscriptDigits(nCation)}${nonmetal.symbol}${subscriptDigits(nAnion)}`;
  return { cation: { symbol: metal.symbol, charge: qc, count: nCation }, anion: { symbol: nonmetal.symbol, charge: qa, count: nAnion }, formula, formulaPretty };
}

export function ionicFormulaBySymbols(metal: string, nonmetal: string): IonicFormula | null {
  const m = elementBySymbol(metal);
  const n = elementBySymbol(nonmetal);
  return m && n ? ionicFormula(m, n) : null;
}

// ----- Lewis structures -----

export interface LewisAtom {
  symbol: string;
  lonePairs: number;
}
export interface LewisBond {
  a: number;
  b: number;
  order: number;
}
export interface LewisStructure {
  atoms: LewisAtom[];
  bonds: LewisBond[];
  /** Net charge of the species (0 for a neutral molecule). */
  charge?: number;
}

export type OctetStatus = 'ok' | 'duet' | 'incomplete' | 'expanded' | 'over' | 'unknown';

export interface OctetReport {
  atoms: { index: number; symbol: string; electrons: number; bonds: number; status: OctetStatus }[];
  /** Valence electrons available (sum over atoms, adjusted for charge). */
  valenceAvailable: number;
  /** Electrons drawn: 2 per bond order + 2 per lone pair. */
  electronsDrawn: number;
  valenceBalanced: boolean;
  /** Human-readable problems; empty means the structure passes. */
  issues: string[];
}

/** Elements that routinely stop short of an octet in stable neutral molecules. */
const INCOMPLETE_OK = new Set(['B', 'Be', 'Al']);

export function octetCheck(ls: LewisStructure): OctetReport {
  const issues: string[] = [];
  const bondElectrons = ls.atoms.map(() => 0);
  const bondCounts = ls.atoms.map(() => 0);
  for (const b of ls.bonds) {
    if (!ls.atoms[b.a] || !ls.atoms[b.b]) {
      issues.push(`Bond ${b.a}–${b.b} references a missing atom`);
      continue;
    }
    bondElectrons[b.a]! += 2 * b.order;
    bondElectrons[b.b]! += 2 * b.order;
    bondCounts[b.a]! += 1;
    bondCounts[b.b]! += 1;
  }
  let valenceAvailable = -(ls.charge ?? 0);
  let unknownValence = false;
  const atoms = ls.atoms.map((atom, index) => {
    const el = elementBySymbol(atom.symbol);
    const v = el ? valenceElectrons(el) : null;
    if (v === null) unknownValence = true;
    else valenceAvailable += v;
    const electrons = bondElectrons[index]! + 2 * atom.lonePairs;
    let status: OctetStatus;
    if (!el) status = 'unknown';
    else if (el.symbol === 'H' || el.symbol === 'He') {
      status = electrons === 2 ? 'duet' : electrons < 2 ? 'incomplete' : 'over';
    } else if (electrons === 8) status = 'ok';
    else if (electrons < 8) status = 'incomplete';
    else status = el.period >= 3 ? 'expanded' : 'over';
    if (status === 'over') issues.push(`${atom.symbol} (atom ${index}) has ${electrons} electrons: more than an octet is not possible for a period-${el?.period ?? '?'} element`);
    if (status === 'incomplete' && !INCOMPLETE_OK.has(atom.symbol)) issues.push(`${atom.symbol} (atom ${index}) has only ${electrons} electrons; it needs ${el?.symbol === 'H' ? 2 : 8}`);
    if (status === 'unknown') issues.push(`Unknown element symbol ${atom.symbol}`);
    return { index, symbol: atom.symbol, electrons, bonds: bondCounts[index]!, status };
  });
  const electronsDrawn = ls.bonds.reduce((s, b) => s + 2 * b.order, 0) + ls.atoms.reduce((s, a) => s + 2 * a.lonePairs, 0);
  const valenceBalanced = !unknownValence && electronsDrawn === valenceAvailable;
  if (!unknownValence && !valenceBalanced) issues.push(`The structure shows ${electronsDrawn} electrons but the atoms supply ${valenceAvailable} valence electrons`);
  return { atoms, valenceAvailable, electronsDrawn, valenceBalanced, issues };
}

/** Total valence electrons for a set of main-group atoms (null if any atom is d/f block). */
export function totalValenceElectrons(symbols: string[], charge = 0): number | null {
  let total = -charge;
  for (const s of symbols) {
    const el = elementBySymbol(s);
    const v = el ? valenceElectrons(el) : null;
    if (v === null) return null;
    total += v;
  }
  return total;
}
