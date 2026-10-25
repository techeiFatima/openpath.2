import type { LewisStructure } from './bonding';

/**
 * Curated molecules for the viewer and the bonding lessons.
 *
 * Every entry is a well-known species whose composition, bonding and VSEPR description are
 * textbook facts. Coordinates are IDEALISED VSEPR GEOMETRY built from typical bond lengths
 * (Å) and ideal angles (109.5°, 120°, 180°); they are NOT measured structures and the UI must
 * label them as such. `measuredAngle` values are the commonly tabulated gas-phase bond angles
 * (±0.5°), listed only where I am confident; re-verify against NIST CCCBDB / PubChem before
 * sign-off. PubChem CIDs are given where I am confident of them, otherwise null.
 *
 * SO2 and O3 are drawn as one resonance form; real bond orders are intermediate.
 * NaCl is an ionic lattice: no discrete molecule exists, so one ion pair is shown at the
 * crystal Na–Cl separation and no VSEPR data is given.
 */

export type Vec3 = [number, number, number];

export interface MoleculeAtom {
  element: string;
  /** Idealised position in Å. */
  position: Vec3;
}

export interface MoleculeBond {
  a: number;
  b: number;
  order: 1 | 2 | 3;
  kind: 'covalent' | 'ionic';
}

export interface VseprData {
  centralIndex: number;
  /** Lone pairs on the central atom. */
  lonePairs: number;
  /** Bonded atoms + lone pairs around the central atom. */
  electronDomains: number;
  electronGeometry: string;
  molecularGeometry: string;
  idealAngle: number;
  /** Commonly tabulated bond angle, or null where it equals the ideal or is not given. */
  measuredAngle: number | null;
  /** Which angle `measuredAngle` refers to, when it is not obvious. */
  angleLabel: string;
}

export interface Molecule {
  /** Plain formula, e.g. "CH3OH". */
  formula: string;
  /** Formula with subscripts, e.g. "CH₃OH". */
  formulaPretty: string;
  name: string;
  pubchemCid: number | null;
  atoms: MoleculeAtom[];
  bonds: MoleculeBond[];
  /** Lone pairs per atom (same index as `atoms`) in the drawn Lewis structure. */
  lonePairs: number[];
  vsepr: VseprData | null;
  polarity: 'nonpolar' | 'polar' | 'ionic';
  /** Classification of the bonds in the molecule. */
  bondClass: 'nonpolar covalent' | 'polar covalent' | 'ionic';
  notes: string;
}

const T = 1 / Math.sqrt(3);
/** Four tetrahedral unit directions. */
const TET: Vec3[] = [
  [T, T, T],
  [T, -T, -T],
  [-T, T, -T],
  [-T, -T, T],
];
const scale = (v: Vec3, k: number): Vec3 => [v[0] * k, v[1] * k, v[2] * k];
const add = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const r = (x: number) => Math.round(x * 1000) / 1000;
const R = (v: Vec3): Vec3 => [r(v[0]), r(v[1]), r(v[2])];

const cov = (a: number, b: number, order: 1 | 2 | 3 = 1): MoleculeBond => ({ a, b, order, kind: 'covalent' });

function diatomic(formula: string, pretty: string, name: string, cid: number | null, elA: string, elB: string, length: number, order: 1 | 2 | 3, lonePairs: [number, number], polarity: Molecule['polarity'], bondClass: Molecule['bondClass'], notes: string): Molecule {
  return {
    formula,
    formulaPretty: pretty,
    name,
    pubchemCid: cid,
    atoms: [
      { element: elA, position: [-length / 2, 0, 0] },
      { element: elB, position: [length / 2, 0, 0] },
    ],
    bonds: [cov(0, 1, order)],
    lonePairs,
    vsepr: null,
    polarity,
    bondClass,
    notes,
  };
}

/** Bent AX2E2 (tetrahedral-based), e.g. water. */
function bentTetrahedral(central: string, outer: string, length: number): MoleculeAtom[] {
  return [
    { element: central, position: [0, 0, 0] },
    { element: outer, position: R(scale(TET[0]!, length)) },
    { element: outer, position: R(scale(TET[1]!, length)) },
  ];
}

/** Bent AX2E1 (trigonal-planar based, 120°), e.g. SO2, O3. */
function bentTrigonal(central: string, outer: string, length: number): MoleculeAtom[] {
  const s = Math.sin(Math.PI / 3);
  return [
    { element: central, position: [0, 0, 0] },
    { element: outer, position: R([length * s, -length * 0.5, 0]) },
    { element: outer, position: R([-length * s, -length * 0.5, 0]) },
  ];
}

function trigonalPlanar(central: string, outer: string, length: number): MoleculeAtom[] {
  const at = (deg: number): Vec3 => R([length * Math.cos((deg * Math.PI) / 180), length * Math.sin((deg * Math.PI) / 180), 0]);
  return [
    { element: central, position: [0, 0, 0] },
    { element: outer, position: at(90) },
    { element: outer, position: at(210) },
    { element: outer, position: at(330) },
  ];
}

const O_H = 0.96, N_H = 1.01, C_H = 1.09, C_O2 = 1.16, C_O = 1.43, S_O = 1.43, S_H = 1.34, B_F = 1.31, O_O3 = 1.28, C_C2 = 1.34, C_C3 = 1.2;

export const MOLECULES: readonly Molecule[] = [
  diatomic('H2', 'H₂', 'Hydrogen', 783, 'H', 'H', 0.74, 1, [0, 0], 'nonpolar', 'nonpolar covalent', 'Two identical atoms share one pair: ΔEN = 0.'),
  diatomic('O2', 'O₂', 'Oxygen', 977, 'O', 'O', 1.21, 2, [2, 2], 'nonpolar', 'nonpolar covalent', 'Double bond; each O keeps two lone pairs. (O₂ is actually paramagnetic, which the simple Lewis picture does not capture.)'),
  diatomic('N2', 'N₂', 'Nitrogen', 947, 'N', 'N', 1.1, 3, [1, 1], 'nonpolar', 'nonpolar covalent', 'Triple bond: one of the strongest bonds between two atoms, which is why N₂ is so unreactive.'),
  diatomic('HCl', 'HCl', 'Hydrogen chloride', 313, 'H', 'Cl', 1.27, 1, [0, 3], 'polar', 'polar covalent', 'ΔEN = 0.96: the shared pair sits closer to chlorine.'),
  diatomic('HF', 'HF', 'Hydrogen fluoride', 14917, 'H', 'F', 0.92, 1, [0, 3], 'polar', 'polar covalent', 'ΔEN = 1.78 exceeds the 1.7 "ionic" cut-off, yet HF is a covalent molecule: a well-known limit of the ΔEN rule.'),
  diatomic('CO', 'CO', 'Carbon monoxide', 281, 'C', 'O', 1.13, 3, [1, 1], 'polar', 'polar covalent', 'Triple bond with a lone pair on each atom; the dipole is small and points with the negative end on carbon, contrary to the ΔEN prediction.'),
  {
    formula: 'H2O',
    formulaPretty: 'H₂O',
    name: 'Water',
    pubchemCid: 962,
    atoms: bentTetrahedral('O', 'H', O_H),
    bonds: [cov(0, 1), cov(0, 2)],
    lonePairs: [2, 0, 0],
    vsepr: { centralIndex: 0, lonePairs: 2, electronDomains: 4, electronGeometry: 'tetrahedral', molecularGeometry: 'bent', idealAngle: 109.5, measuredAngle: 104.5, angleLabel: 'H–O–H' },
    polarity: 'polar',
    bondClass: 'polar covalent',
    notes: 'Two lone pairs repel more strongly than bonding pairs, closing the angle from 109.5° to 104.5°.',
  },
  {
    formula: 'CO2',
    formulaPretty: 'CO₂',
    name: 'Carbon dioxide',
    pubchemCid: 280,
    atoms: [
      { element: 'C', position: [0, 0, 0] },
      { element: 'O', position: [-C_O2, 0, 0] },
      { element: 'O', position: [C_O2, 0, 0] },
    ],
    bonds: [cov(0, 1, 2), cov(0, 2, 2)],
    lonePairs: [0, 2, 2],
    vsepr: { centralIndex: 0, lonePairs: 0, electronDomains: 2, electronGeometry: 'linear', molecularGeometry: 'linear', idealAngle: 180, measuredAngle: 180, angleLabel: 'O–C–O' },
    polarity: 'nonpolar',
    bondClass: 'polar covalent',
    notes: 'Each C=O bond is polar, but the two dipoles point in opposite directions and cancel: the molecule is nonpolar.',
  },
  {
    formula: 'NH3',
    formulaPretty: 'NH₃',
    name: 'Ammonia',
    pubchemCid: 222,
    atoms: [
      { element: 'N', position: [0, 0, 0] },
      { element: 'H', position: R(scale(TET[0]!, N_H)) },
      { element: 'H', position: R(scale(TET[1]!, N_H)) },
      { element: 'H', position: R(scale(TET[2]!, N_H)) },
    ],
    bonds: [cov(0, 1), cov(0, 2), cov(0, 3)],
    lonePairs: [1, 0, 0, 0],
    vsepr: { centralIndex: 0, lonePairs: 1, electronDomains: 4, electronGeometry: 'tetrahedral', molecularGeometry: 'trigonal pyramidal', idealAngle: 109.5, measuredAngle: 106.7, angleLabel: 'H–N–H' },
    polarity: 'polar',
    bondClass: 'polar covalent',
    notes: 'One lone pair pushes the three N–H bonds slightly together: 106.7° instead of 109.5°.',
  },
  {
    formula: 'CH4',
    formulaPretty: 'CH₄',
    name: 'Methane',
    pubchemCid: 297,
    atoms: [{ element: 'C', position: [0, 0, 0] }, ...TET.map((d) => ({ element: 'H', position: R(scale(d, C_H)) }))],
    bonds: [cov(0, 1), cov(0, 2), cov(0, 3), cov(0, 4)],
    lonePairs: [0, 0, 0, 0, 0],
    vsepr: { centralIndex: 0, lonePairs: 0, electronDomains: 4, electronGeometry: 'tetrahedral', molecularGeometry: 'tetrahedral', idealAngle: 109.5, measuredAngle: 109.5, angleLabel: 'H–C–H' },
    polarity: 'nonpolar',
    bondClass: 'nonpolar covalent',
    notes: 'Four identical bonds arranged symmetrically: no net dipole. C–H has ΔEN = 0.35.',
  },
  {
    formula: 'C2H4',
    formulaPretty: 'C₂H₄',
    name: 'Ethene (ethylene)',
    pubchemCid: 6325,
    atoms: (() => {
      const h = C_C2 / 2;
      const dx = C_H * Math.cos(Math.PI / 3);
      const dy = C_H * Math.sin(Math.PI / 3);
      return [
        { element: 'C', position: [h, 0, 0] as Vec3 },
        { element: 'C', position: [-h, 0, 0] as Vec3 },
        { element: 'H', position: R([h + dx, dy, 0]) },
        { element: 'H', position: R([h + dx, -dy, 0]) },
        { element: 'H', position: R([-h - dx, dy, 0]) },
        { element: 'H', position: R([-h - dx, -dy, 0]) },
      ];
    })(),
    bonds: [cov(0, 1, 2), cov(0, 2), cov(0, 3), cov(1, 4), cov(1, 5)],
    lonePairs: [0, 0, 0, 0, 0, 0],
    vsepr: { centralIndex: 0, lonePairs: 0, electronDomains: 3, electronGeometry: 'trigonal planar', molecularGeometry: 'trigonal planar (about each carbon)', idealAngle: 120, measuredAngle: 117.4, angleLabel: 'H–C–H' },
    polarity: 'nonpolar',
    bondClass: 'nonpolar covalent',
    notes: 'The double bond counts as ONE electron domain. The whole molecule is planar.',
  },
  {
    formula: 'C2H2',
    formulaPretty: 'C₂H₂',
    name: 'Ethyne (acetylene)',
    pubchemCid: 6326,
    atoms: [
      { element: 'C', position: [C_C3 / 2, 0, 0] },
      { element: 'C', position: [-C_C3 / 2, 0, 0] },
      { element: 'H', position: [C_C3 / 2 + 1.06, 0, 0] },
      { element: 'H', position: [-C_C3 / 2 - 1.06, 0, 0] },
    ],
    bonds: [cov(0, 1, 3), cov(0, 2), cov(1, 3)],
    lonePairs: [0, 0, 0, 0],
    vsepr: { centralIndex: 0, lonePairs: 0, electronDomains: 2, electronGeometry: 'linear', molecularGeometry: 'linear', idealAngle: 180, measuredAngle: 180, angleLabel: 'H–C–C' },
    polarity: 'nonpolar',
    bondClass: 'nonpolar covalent',
    notes: 'A triple bond is still one electron domain: two domains on each carbon give a linear molecule.',
  },
  {
    formula: 'SO2',
    formulaPretty: 'SO₂',
    name: 'Sulfur dioxide',
    pubchemCid: 1119,
    atoms: bentTrigonal('S', 'O', S_O),
    bonds: [cov(0, 1, 2), cov(0, 2, 2)],
    lonePairs: [1, 2, 2],
    vsepr: { centralIndex: 0, lonePairs: 1, electronDomains: 3, electronGeometry: 'trigonal planar', molecularGeometry: 'bent', idealAngle: 120, measuredAngle: 119, angleLabel: 'O–S–O' },
    polarity: 'polar',
    bondClass: 'polar covalent',
    notes: 'Drawn with two S=O bonds (sulfur shows an expanded octet of 10 electrons); textbooks also draw resonance forms with one S=O and one S–O.',
  },
  {
    formula: 'H2S',
    formulaPretty: 'H₂S',
    name: 'Hydrogen sulfide',
    pubchemCid: 402,
    atoms: bentTetrahedral('S', 'H', S_H),
    bonds: [cov(0, 1), cov(0, 2)],
    lonePairs: [2, 0, 0],
    vsepr: { centralIndex: 0, lonePairs: 2, electronDomains: 4, electronGeometry: 'tetrahedral', molecularGeometry: 'bent', idealAngle: 109.5, measuredAngle: 92.1, angleLabel: 'H–S–H' },
    polarity: 'polar',
    bondClass: 'nonpolar covalent',
    notes: 'Same shape class as water but the angle is only 92°: simple VSEPR predicts the shape, not the exact angle. S–H has ΔEN = 0.38, nominally nonpolar, yet the molecule has a small dipole.',
  },
  {
    formula: 'BF3',
    formulaPretty: 'BF₃',
    name: 'Boron trifluoride',
    pubchemCid: 6356,
    atoms: trigonalPlanar('B', 'F', B_F),
    bonds: [cov(0, 1), cov(0, 2), cov(0, 3)],
    lonePairs: [0, 3, 3, 3],
    vsepr: { centralIndex: 0, lonePairs: 0, electronDomains: 3, electronGeometry: 'trigonal planar', molecularGeometry: 'trigonal planar', idealAngle: 120, measuredAngle: 120, angleLabel: 'F–B–F' },
    polarity: 'nonpolar',
    bondClass: 'polar covalent',
    notes: 'Boron has only six electrons around it: a stable exception to the octet rule. Three polar bonds at 120° cancel.',
  },
  {
    formula: 'CH3OH',
    formulaPretty: 'CH₃OH',
    name: 'Methanol',
    pubchemCid: 887,
    atoms: (() => {
      const o = scale(TET[0]!, C_O);
      // O–H direction making an idealised 109.5° C–O–H angle.
      const d: Vec3 = [0.8592, -0.4742, 0.1925];
      return [
        { element: 'C', position: [0, 0, 0] as Vec3 },
        { element: 'O', position: R(o) },
        { element: 'H', position: R(scale(TET[1]!, C_H)) },
        { element: 'H', position: R(scale(TET[2]!, C_H)) },
        { element: 'H', position: R(scale(TET[3]!, C_H)) },
        { element: 'H', position: R(add(o, scale(d, O_H))) },
      ];
    })(),
    bonds: [cov(0, 1), cov(0, 2), cov(0, 3), cov(0, 4), cov(1, 5)],
    lonePairs: [0, 2, 0, 0, 0, 0],
    vsepr: { centralIndex: 0, lonePairs: 0, electronDomains: 4, electronGeometry: 'tetrahedral', molecularGeometry: 'tetrahedral (about carbon); bent about oxygen', idealAngle: 109.5, measuredAngle: null, angleLabel: 'H–C–H' },
    polarity: 'polar',
    bondClass: 'polar covalent',
    notes: 'Two centres: tetrahedral carbon and a bent oxygen (two lone pairs). The O–H end makes the molecule polar.',
  },
  {
    formula: 'O3',
    formulaPretty: 'O₃',
    name: 'Ozone',
    pubchemCid: 24823,
    atoms: bentTrigonal('O', 'O', O_O3),
    bonds: [cov(0, 1, 2), cov(0, 2, 1)],
    lonePairs: [1, 2, 3],
    vsepr: { centralIndex: 0, lonePairs: 1, electronDomains: 3, electronGeometry: 'trigonal planar', molecularGeometry: 'bent', idealAngle: 120, measuredAngle: 116.8, angleLabel: 'O–O–O' },
    polarity: 'polar',
    bondClass: 'nonpolar covalent',
    notes: 'One resonance form is drawn; both O–O bonds are really equivalent (order 1.5). Three identical atoms, yet the molecule is slightly polar because of its bent shape and uneven charge.',
  },
  {
    formula: 'NaCl',
    formulaPretty: 'NaCl',
    name: 'Sodium chloride (ion pair from the lattice)',
    pubchemCid: 5234,
    atoms: [
      { element: 'Na', position: [-1.41, 0, 0] },
      { element: 'Cl', position: [1.41, 0, 0] },
    ],
    bonds: [{ a: 0, b: 1, order: 1, kind: 'ionic' }],
    lonePairs: [0, 4],
    vsepr: null,
    polarity: 'ionic',
    bondClass: 'ionic',
    notes: 'Not a molecule: in the solid every Na⁺ is surrounded by six Cl⁻ and vice versa. One ion pair is shown at the crystal separation (2.82 Å). ΔEN = 2.23.',
  },
];

export const MOLECULES_BY_FORMULA = new Map(MOLECULES.map((m) => [m.formula, m]));

export function moleculeByFormula(formula: string): Molecule | undefined {
  return MOLECULES_BY_FORMULA.get(formula) ?? MOLECULES.find((m) => m.formula.toLowerCase() === formula.trim().toLowerCase());
}

/** Count atoms in a simple formula without parentheses, e.g. "CH3OH" → { C: 1, H: 4, O: 1 }. */
export function formulaCounts(formula: string): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const m of formula.matchAll(/([A-Z][a-z]?)(\d*)/g)) {
    const sym = m[1]!;
    counts[sym] = (counts[sym] ?? 0) + (m[2] ? Number(m[2]) : 1);
  }
  return counts;
}

export function lewisOf(m: Molecule): LewisStructure {
  return {
    atoms: m.atoms.map((a, i) => ({ symbol: a.element, lonePairs: m.lonePairs[i] ?? 0 })),
    bonds: m.bonds.map((b) => ({ a: b.a, b: b.b, order: b.order })),
  };
}

/** Angle in degrees at atom `centre` between atoms `a` and `b` of the idealised coordinates. */
export function bondAngle(m: Molecule, a: number, centre: number, b: number): number {
  const pa = m.atoms[a]!.position, pc = m.atoms[centre]!.position, pb = m.atoms[b]!.position;
  const u: Vec3 = [pa[0] - pc[0], pa[1] - pc[1], pa[2] - pc[2]];
  const v: Vec3 = [pb[0] - pc[0], pb[1] - pc[1], pb[2] - pc[2]];
  const dot = u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
  const nu = Math.hypot(...u), nv = Math.hypot(...v);
  return (Math.acos(Math.max(-1, Math.min(1, dot / (nu * nv)))) * 180) / Math.PI;
}
