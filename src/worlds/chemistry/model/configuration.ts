import { ELEMENTS, elementByZ, isMainGroup, NOBLE_GASES, type Element } from './elements';

/**
 * Ground-state electron configurations.
 *
 * Rule: fill subshells in the Madelung (n + l) order 1s 2s 2p 3s 3p 4s 3d 4p 5s 4d 5p 6s 4f
 * 5d 6p 7s 5f 6d 7p, respecting capacities s=2, p=6, d=10, f=14 (Pauli). The ground states
 * of about twenty elements differ from this rule because of d/f near-degeneracy and
 * exchange-energy effects; they are listed explicitly in CONFIGURATION_EXCEPTIONS and the
 * result carries `isException: true`. The exception list follows the configurations in
 * standard references (NIST Atomic Spectra Database ground levels, CRC Handbook). Elements
 * 104–118 are given Madelung configurations with no claim of experimental confirmation.
 */

export type Orbital = 's' | 'p' | 'd' | 'f';

export interface Subshell {
  n: number;
  l: Orbital;
  /** e.g. "3d" */
  label: string;
  electrons: number;
}

export interface ElectronConfiguration {
  z: number;
  /** Total electrons represented (= z for a neutral atom). */
  electrons: number;
  /** Occupied subshells in spectroscopic order (increasing n, then s < p < d < f). */
  subshells: Subshell[];
  /** e.g. "1s2 2s2 2p6 3s1" */
  full: string;
  /** e.g. "[Ne] 3s1"; identical to `full` for H and He. */
  nobleGasCore: string;
  /** Electrons per principal shell n = 1, 2, 3 … (Bohr-style occupancy). */
  shells: number[];
  isException: boolean;
}

export const MADELUNG_ORDER: readonly string[] = ['1s', '2s', '2p', '3s', '3p', '4s', '3d', '4p', '5s', '4d', '5p', '6s', '4f', '5d', '6p', '7s', '5f', '6d', '7p'];

export const SUBSHELL_CAPACITY: Record<Orbital, number> = { s: 2, p: 6, d: 10, f: 14 };
const L_INDEX: Record<Orbital, number> = { s: 0, p: 1, d: 2, f: 3 };

/** Maximum electrons in principal shell n: 2n². */
export function shellCapacity(n: number): number {
  return 2 * n * n;
}

/**
 * Known departures from the Madelung order. Written relative to the preceding noble-gas core.
 * Each `why` is a one-line teaching explanation, not a quantitative claim.
 */
export const CONFIGURATION_EXCEPTIONS: Record<number, { config: string; why: string }> = {
  24: { config: '[Ar] 3d5 4s1', why: 'Chromium: a half-filled 3d subshell (one electron per orbital) is favoured over 3d4 4s2.' },
  29: { config: '[Ar] 3d10 4s1', why: 'Copper: a filled 3d subshell is favoured over 3d9 4s2.' },
  41: { config: '[Kr] 4d4 5s1', why: 'Niobium: 4d and 5s are very close in energy; 4d4 5s1 is the observed ground state.' },
  42: { config: '[Kr] 4d5 5s1', why: 'Molybdenum: half-filled 4d, like chromium.' },
  44: { config: '[Kr] 4d7 5s1', why: 'Ruthenium: observed ground state favours 4d7 5s1 over 4d6 5s2.' },
  45: { config: '[Kr] 4d8 5s1', why: 'Rhodium: observed ground state favours 4d8 5s1.' },
  46: { config: '[Kr] 4d10', why: 'Palladium: completely filled 4d with an empty 5s is the ground state.' },
  47: { config: '[Kr] 4d10 5s1', why: 'Silver: filled 4d, like copper.' },
  57: { config: '[Xe] 5d1 6s2', why: 'Lanthanum: the first "f-block" electron actually enters 5d, not 4f.' },
  58: { config: '[Xe] 4f1 5d1 6s2', why: 'Cerium: one electron each in 4f and 5d.' },
  64: { config: '[Xe] 4f7 5d1 6s2', why: 'Gadolinium: half-filled 4f plus one 5d electron, instead of 4f8.' },
  78: { config: '[Xe] 4f14 5d9 6s1', why: 'Platinum: 5d9 6s1 observed instead of 5d8 6s2.' },
  79: { config: '[Xe] 4f14 5d10 6s1', why: 'Gold: filled 5d, like copper and silver.' },
  89: { config: '[Rn] 6d1 7s2', why: 'Actinium: first electron enters 6d, not 5f (like lanthanum).' },
  90: { config: '[Rn] 6d2 7s2', why: 'Thorium: two 6d electrons and no 5f electrons in the ground state.' },
  91: { config: '[Rn] 5f2 6d1 7s2', why: 'Protactinium: one 6d electron alongside 5f.' },
  92: { config: '[Rn] 5f3 6d1 7s2', why: 'Uranium: one 6d electron alongside 5f.' },
  93: { config: '[Rn] 5f4 6d1 7s2', why: 'Neptunium: one 6d electron alongside 5f.' },
  96: { config: '[Rn] 5f7 6d1 7s2', why: 'Curium: half-filled 5f plus one 6d electron (like gadolinium).' },
  103: { config: '[Rn] 5f14 7s2 7p1', why: 'Lawrencium: relativistic effects place the last electron in 7p rather than 6d (experimentally supported, 2015).' },
};

type Occupancy = Map<string, number>;

function orbitalOf(label: string): Orbital {
  return label.charAt(1) as Orbital;
}

/** Fill `electrons` electrons by the Madelung order (no exceptions). */
export function fillMadelung(electrons: number): Occupancy {
  const occ: Occupancy = new Map();
  let left = electrons;
  for (const label of MADELUNG_ORDER) {
    if (left <= 0) break;
    const take = Math.min(left, SUBSHELL_CAPACITY[orbitalOf(label)]);
    occ.set(label, take);
    left -= take;
  }
  if (left > 0) throw new Error(`Cannot place ${electrons} electrons in the subshells up to 7p`);
  return occ;
}

const NOBLE_GAS_BY_SYMBOL = new Map(NOBLE_GASES.map((z) => [elementByZ(z)!.symbol, z]));

/** Parse "[Ar] 3d5 4s1" or "1s2 2s2 2p4" into an occupancy map. Also accepts "3d^5" and "3d⁵". */
export function parseConfiguration(text: string): Occupancy {
  const occ: Occupancy = new Map();
  const core = /\[([A-Z][a-z]?)\]/.exec(text);
  if (core) {
    const z = NOBLE_GAS_BY_SYMBOL.get(core[1]!);
    if (z === undefined) throw new Error(`Unknown noble-gas core [${core[1]}]`);
    for (const [k, v] of fillMadelung(z)) occ.set(k, v);
  }
  const rest = text.replace(/\[[A-Za-z]+\]/, '');
  for (const m of rest.matchAll(/([1-7][spdf])\^?(\d+)/g)) occ.set(m[1]!, (occ.get(m[1]!) ?? 0) + Number(m[2]));
  return occ;
}

function spectroscopicOrder(occ: Occupancy): Subshell[] {
  return [...occ.entries()]
    .filter(([, e]) => e > 0)
    .map(([label, electrons]) => ({ n: Number(label.charAt(0)), l: orbitalOf(label), label, electrons }))
    .sort((a, b) => a.n - b.n || L_INDEX[a.l] - L_INDEX[b.l]);
}

export function formatSubshells(subshells: Subshell[]): string {
  return subshells.map((s) => `${s.label}${s.electrons}`).join(' ');
}

function shellsOf(subshells: Subshell[]): number[] {
  const shells: number[] = [];
  for (const s of subshells) shells[s.n - 1] = (shells[s.n - 1] ?? 0) + s.electrons;
  for (let i = 0; i < shells.length; i++) shells[i] = shells[i] ?? 0;
  return shells;
}

function nobleGasNotation(occ: Occupancy, electrons: number): string {
  let coreZ = 0;
  for (const z of NOBLE_GASES) if (z < electrons) coreZ = z;
  const subs = spectroscopicOrder(occ);
  if (coreZ === 0) return formatSubshells(subs);
  const core = fillMadelung(coreZ);
  const rest: Occupancy = new Map();
  for (const [k, v] of occ) {
    const left = v - (core.get(k) ?? 0);
    if (left > 0) rest.set(k, left);
  }
  return `[${elementByZ(coreZ)!.symbol}] ${formatSubshells(spectroscopicOrder(rest))}`.trim();
}

function fromOccupancy(z: number, occ: Occupancy, isException: boolean): ElectronConfiguration {
  const subshells = spectroscopicOrder(occ);
  const electrons = subshells.reduce((s, x) => s + x.electrons, 0);
  return { z, electrons, subshells, full: formatSubshells(subshells), nobleGasCore: nobleGasNotation(occ, electrons), shells: shellsOf(subshells), isException };
}

function neutralOccupancy(z: number): { occ: Occupancy; isException: boolean } {
  const exception = CONFIGURATION_EXCEPTIONS[z];
  if (exception) return { occ: parseConfiguration(exception.config), isException: true };
  return { occ: fillMadelung(z), isException: false };
}

/** Ground-state configuration of the neutral atom with atomic number z (1–118). */
export function electronConfiguration(z: number): ElectronConfiguration {
  if (!Number.isInteger(z) || z < 1 || z > ELEMENTS.length) throw new Error(`No element with Z = ${z}`);
  const { occ, isException } = neutralOccupancy(z);
  return fromOccupancy(z, occ, isException);
}

/**
 * Configuration of an ion. Cations lose electrons from the highest n first (then the
 * highest l within that shell), which is why Fe²⁺ is [Ar] 3d6, not [Ar] 3d4 4s2. Anions gain
 * electrons into the next unfilled subshell in Madelung order. This is the standard
 * textbook rule; a few heavy ions are known to deviate.
 */
export function ionConfiguration(z: number, charge: number): ElectronConfiguration {
  const { occ, isException } = neutralOccupancy(z);
  const electrons = z - charge;
  if (electrons < 0) throw new Error('An ion cannot have negative electron count');
  if (charge > 0) {
    let toRemove = charge;
    while (toRemove > 0) {
      const subs = spectroscopicOrder(occ);
      const last = subs[subs.length - 1];
      if (!last) throw new Error('No electrons left to remove');
      const take = Math.min(toRemove, last.electrons);
      occ.set(last.label, last.electrons - take);
      toRemove -= take;
    }
  } else if (charge < 0) {
    let toAdd = -charge;
    for (const label of MADELUNG_ORDER) {
      if (toAdd <= 0) break;
      const cap = SUBSHELL_CAPACITY[orbitalOf(label)];
      const have = occ.get(label) ?? 0;
      const room = cap - have;
      if (room <= 0) continue;
      const put = Math.min(room, toAdd);
      occ.set(label, have + put);
      toAdd -= put;
    }
    if (toAdd > 0) throw new Error('Too many electrons to place');
  }
  return fromOccupancy(z, occ, isException);
}

/** Bohr-style shell occupancy for any (protons, electrons) pair, e.g. Na → [2, 8, 1], Na⁺ → [2, 8]. */
export function shellOccupancy(z: number, electrons: number = z): number[] {
  return ionConfiguration(z, z - electrons).shells;
}

/**
 * Valence electrons for main-group (s- and p-block) elements: equal to the group number
 * for groups 1–2 and group − 10 for groups 13–18 (helium: 2). Returns null for d- and f-block
 * elements, where the count is ambiguous.
 */
export function valenceElectrons(e: Element): number | null {
  if (!isMainGroup(e) || e.group === null) return null;
  if (e.z === 2) return 2;
  return e.group <= 2 ? e.group : e.group - 10;
}

/**
 * Most common monatomic ion charge predicted from the group for main-group elements:
 * groups 1, 2, 13 metals lose 1, 2, 3 electrons; nonmetals in groups 15–17 gain 3, 2, 1;
 * noble gases 0. Returns null where no single answer is reasonable (H, boron, group 14,
 * metalloids, heavy p-block metals such as Sn/Pb/Bi, and the d/f blocks).
 */
export function predictedIonCharge(e: Element): number | null {
  if (!isMainGroup(e) || e.group === null) return null;
  if (e.category === 'noble-gas') return 0;
  const g = e.group;
  const metal = e.category === 'alkali-metal' || e.category === 'alkaline-earth-metal' || e.category === 'post-transition-metal';
  if (metal && g === 1) return 1;
  if (metal && g === 2) return 2;
  if (metal && g === 13) return 3;
  if (e.category === 'reactive-nonmetal' && e.z !== 1) {
    if (g === 15) return -3;
    if (g === 16) return -2;
    if (g === 17) return -1;
  }
  return null;
}

/** Period and block an element occupies, read from its configuration (for the "position" lesson). */
export function positionFromConfiguration(cfg: ElectronConfiguration): { period: number; block: Orbital; outerShellElectrons: number } {
  const maxN = Math.max(...cfg.subshells.map((s) => s.n));
  // The block is the subshell being filled last in Aufbau order (or the exception's valence subshell).
  const lastFilled = [...cfg.subshells].sort((a, b) => MADELUNG_ORDER.indexOf(a.label) - MADELUNG_ORDER.indexOf(b.label)).pop()!;
  const outer = cfg.shells[maxN - 1] ?? 0;
  // Palladium ([Kr] 4d10) has no 5s electron yet sits in period 5: the one case where the highest occupied n is not the period.
  const period = cfg.z === 46 ? 5 : maxN;
  return { period, block: lastFilled.l, outerShellElectrons: outer };
}
