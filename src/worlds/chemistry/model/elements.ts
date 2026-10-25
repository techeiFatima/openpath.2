/**
 * Element data for all 118 elements.
 *
 * SOURCES RELIED ON (from memory of the published tables; network access to the official
 * sites is blocked in the build environment, so nothing here is machine-verified):
 *  - Atomic masses: IUPAC Commission on Isotopic Abundances and Atomic Weights, abridged
 *    standard atomic weights (2013/2021 tables), rounded to 4 significant figures. For
 *    elements with no stable isotope the mass number of the longest-lived or best-known
 *    isotope is given and `massKind` is 'most-stable-isotope'.
 *  - Electronegativity: Pauling scale as tabulated in common references (CRC Handbook /
 *    WebElements). `null` where no accepted value exists (He, Ne, Ar, Z ≥ 104).
 *  - Period, group and block: 18-column IUPAC-style table. Group 3 is Sc, Y, Lu, Lr and the
 *    f-block is La–Yb and Ac–No (the 2021 IUPAC provisional recommendation and the layout
 *    used by most online tables). Many textbooks put La and Ac in group 3 instead; both are
 *    conventions, not facts, and the UI says so.
 *  - Category and state at STP: conventional classroom classification (CRC / Wikipedia).
 *    Elements 104–118 have predicted properties only.
 *
 * STATUS: values must be re-verified against the official IUPAC/CODATA/NIST tables before
 * any scientific sign-off. Do not describe this table as "verified".
 */

export type ElementCategory =
  | 'alkali-metal'
  | 'alkaline-earth-metal'
  | 'transition-metal'
  | 'post-transition-metal'
  | 'metalloid'
  | 'reactive-nonmetal'
  | 'noble-gas'
  | 'lanthanide'
  | 'actinide'
  | 'unknown';

export type Block = 's' | 'p' | 'd' | 'f';
export type StateAtSTP = 'solid' | 'liquid' | 'gas' | 'unknown';

export interface Element {
  z: number;
  symbol: string;
  name: string;
  /** Standard atomic weight (4 s.f.) or, for unstable elements, the mass number of a well-known isotope. */
  atomicMass: number;
  massKind: 'standard' | 'most-stable-isotope';
  period: number;
  /** 1–18, or null for the f-block. */
  group: number | null;
  block: Block;
  category: ElementCategory;
  /** Pauling electronegativity; null where no accepted value exists. */
  electronegativity: number | null;
  stateAtSTP: StateAtSTP;
}

type Cat = ElementCategory;
const AM: Cat = 'alkali-metal', AE: Cat = 'alkaline-earth-metal', TM: Cat = 'transition-metal', PT: Cat = 'post-transition-metal';
const MD: Cat = 'metalloid', NM: Cat = 'reactive-nonmetal', NG: Cat = 'noble-gas', LA: Cat = 'lanthanide', AC: Cat = 'actinide', UN: Cat = 'unknown';

/** [symbol, name, mass, category, electronegativity, state]; mass marked negative = most-stable isotope. */
type Row = [string, string, number, Cat, number | null, StateAtSTP];

const ROWS: Row[] = [
  ['H', 'Hydrogen', 1.008, NM, 2.2, 'gas'],
  ['He', 'Helium', 4.003, NG, null, 'gas'],
  ['Li', 'Lithium', 6.941, AM, 0.98, 'solid'],
  ['Be', 'Beryllium', 9.012, AE, 1.57, 'solid'],
  ['B', 'Boron', 10.81, MD, 2.04, 'solid'],
  ['C', 'Carbon', 12.01, NM, 2.55, 'solid'],
  ['N', 'Nitrogen', 14.01, NM, 3.04, 'gas'],
  ['O', 'Oxygen', 16.0, NM, 3.44, 'gas'],
  ['F', 'Fluorine', 19.0, NM, 3.98, 'gas'],
  ['Ne', 'Neon', 20.18, NG, null, 'gas'],
  ['Na', 'Sodium', 22.99, AM, 0.93, 'solid'],
  ['Mg', 'Magnesium', 24.31, AE, 1.31, 'solid'],
  ['Al', 'Aluminium', 26.98, PT, 1.61, 'solid'],
  ['Si', 'Silicon', 28.09, MD, 1.9, 'solid'],
  ['P', 'Phosphorus', 30.97, NM, 2.19, 'solid'],
  ['S', 'Sulfur', 32.06, NM, 2.58, 'solid'],
  ['Cl', 'Chlorine', 35.45, NM, 3.16, 'gas'],
  ['Ar', 'Argon', 39.95, NG, null, 'gas'],
  ['K', 'Potassium', 39.1, AM, 0.82, 'solid'],
  ['Ca', 'Calcium', 40.08, AE, 1.0, 'solid'],
  ['Sc', 'Scandium', 44.96, TM, 1.36, 'solid'],
  ['Ti', 'Titanium', 47.87, TM, 1.54, 'solid'],
  ['V', 'Vanadium', 50.94, TM, 1.63, 'solid'],
  ['Cr', 'Chromium', 52.0, TM, 1.66, 'solid'],
  ['Mn', 'Manganese', 54.94, TM, 1.55, 'solid'],
  ['Fe', 'Iron', 55.85, TM, 1.83, 'solid'],
  ['Co', 'Cobalt', 58.93, TM, 1.88, 'solid'],
  ['Ni', 'Nickel', 58.69, TM, 1.91, 'solid'],
  ['Cu', 'Copper', 63.55, TM, 1.9, 'solid'],
  ['Zn', 'Zinc', 65.38, TM, 1.65, 'solid'],
  ['Ga', 'Gallium', 69.72, PT, 1.81, 'solid'],
  ['Ge', 'Germanium', 72.63, MD, 2.01, 'solid'],
  ['As', 'Arsenic', 74.92, MD, 2.18, 'solid'],
  ['Se', 'Selenium', 78.97, NM, 2.55, 'solid'],
  ['Br', 'Bromine', 79.9, NM, 2.96, 'liquid'],
  ['Kr', 'Krypton', 83.8, NG, 3.0, 'gas'],
  ['Rb', 'Rubidium', 85.47, AM, 0.82, 'solid'],
  ['Sr', 'Strontium', 87.62, AE, 0.95, 'solid'],
  ['Y', 'Yttrium', 88.91, TM, 1.22, 'solid'],
  ['Zr', 'Zirconium', 91.22, TM, 1.33, 'solid'],
  ['Nb', 'Niobium', 92.91, TM, 1.6, 'solid'],
  ['Mo', 'Molybdenum', 95.95, TM, 2.16, 'solid'],
  ['Tc', 'Technetium', -98, TM, 1.9, 'solid'],
  ['Ru', 'Ruthenium', 101.1, TM, 2.2, 'solid'],
  ['Rh', 'Rhodium', 102.9, TM, 2.28, 'solid'],
  ['Pd', 'Palladium', 106.4, TM, 2.2, 'solid'],
  ['Ag', 'Silver', 107.9, TM, 1.93, 'solid'],
  ['Cd', 'Cadmium', 112.4, TM, 1.69, 'solid'],
  ['In', 'Indium', 114.8, PT, 1.78, 'solid'],
  ['Sn', 'Tin', 118.7, PT, 1.96, 'solid'],
  ['Sb', 'Antimony', 121.8, MD, 2.05, 'solid'],
  ['Te', 'Tellurium', 127.6, MD, 2.1, 'solid'],
  ['I', 'Iodine', 126.9, NM, 2.66, 'solid'],
  ['Xe', 'Xenon', 131.3, NG, 2.6, 'gas'],
  ['Cs', 'Caesium', 132.9, AM, 0.79, 'solid'],
  ['Ba', 'Barium', 137.3, AE, 0.89, 'solid'],
  ['La', 'Lanthanum', 138.9, LA, 1.1, 'solid'],
  ['Ce', 'Cerium', 140.1, LA, 1.12, 'solid'],
  ['Pr', 'Praseodymium', 140.9, LA, 1.13, 'solid'],
  ['Nd', 'Neodymium', 144.2, LA, 1.14, 'solid'],
  ['Pm', 'Promethium', -145, LA, 1.13, 'solid'],
  ['Sm', 'Samarium', 150.4, LA, 1.17, 'solid'],
  ['Eu', 'Europium', 152.0, LA, 1.2, 'solid'],
  ['Gd', 'Gadolinium', 157.3, LA, 1.2, 'solid'],
  ['Tb', 'Terbium', 158.9, LA, 1.1, 'solid'],
  ['Dy', 'Dysprosium', 162.5, LA, 1.22, 'solid'],
  ['Ho', 'Holmium', 164.9, LA, 1.23, 'solid'],
  ['Er', 'Erbium', 167.3, LA, 1.24, 'solid'],
  ['Tm', 'Thulium', 168.9, LA, 1.25, 'solid'],
  ['Yb', 'Ytterbium', 173.0, LA, 1.1, 'solid'],
  ['Lu', 'Lutetium', 175.0, LA, 1.27, 'solid'],
  ['Hf', 'Hafnium', 178.5, TM, 1.3, 'solid'],
  ['Ta', 'Tantalum', 180.9, TM, 1.5, 'solid'],
  ['W', 'Tungsten', 183.8, TM, 2.36, 'solid'],
  ['Re', 'Rhenium', 186.2, TM, 1.9, 'solid'],
  ['Os', 'Osmium', 190.2, TM, 2.2, 'solid'],
  ['Ir', 'Iridium', 192.2, TM, 2.2, 'solid'],
  ['Pt', 'Platinum', 195.1, TM, 2.28, 'solid'],
  ['Au', 'Gold', 197.0, TM, 2.54, 'solid'],
  ['Hg', 'Mercury', 200.6, TM, 2.0, 'liquid'],
  ['Tl', 'Thallium', 204.4, PT, 1.62, 'solid'],
  ['Pb', 'Lead', 207.2, PT, 2.33, 'solid'],
  ['Bi', 'Bismuth', 209.0, PT, 2.02, 'solid'],
  ['Po', 'Polonium', -209, PT, 2.0, 'solid'],
  ['At', 'Astatine', -210, MD, 2.2, 'solid'],
  ['Rn', 'Radon', -222, NG, 2.2, 'gas'],
  ['Fr', 'Francium', -223, AM, 0.7, 'solid'],
  ['Ra', 'Radium', -226, AE, 0.9, 'solid'],
  ['Ac', 'Actinium', -227, AC, 1.1, 'solid'],
  ['Th', 'Thorium', 232.0, AC, 1.3, 'solid'],
  ['Pa', 'Protactinium', 231.0, AC, 1.5, 'solid'],
  ['U', 'Uranium', 238.0, AC, 1.38, 'solid'],
  ['Np', 'Neptunium', -237, AC, 1.36, 'solid'],
  ['Pu', 'Plutonium', -244, AC, 1.28, 'solid'],
  ['Am', 'Americium', -243, AC, 1.13, 'solid'],
  ['Cm', 'Curium', -247, AC, 1.28, 'solid'],
  ['Bk', 'Berkelium', -247, AC, 1.3, 'solid'],
  ['Cf', 'Californium', -251, AC, 1.3, 'solid'],
  ['Es', 'Einsteinium', -252, AC, 1.3, 'solid'],
  ['Fm', 'Fermium', -257, AC, 1.3, 'solid'],
  ['Md', 'Mendelevium', -258, AC, 1.3, 'solid'],
  ['No', 'Nobelium', -259, AC, 1.3, 'solid'],
  ['Lr', 'Lawrencium', -266, AC, null, 'unknown'],
  ['Rf', 'Rutherfordium', -267, TM, null, 'unknown'],
  ['Db', 'Dubnium', -268, TM, null, 'unknown'],
  ['Sg', 'Seaborgium', -269, TM, null, 'unknown'],
  ['Bh', 'Bohrium', -270, TM, null, 'unknown'],
  ['Hs', 'Hassium', -269, TM, null, 'unknown'],
  ['Mt', 'Meitnerium', -278, UN, null, 'unknown'],
  ['Ds', 'Darmstadtium', -281, UN, null, 'unknown'],
  ['Rg', 'Roentgenium', -282, UN, null, 'unknown'],
  ['Cn', 'Copernicium', -285, TM, null, 'unknown'],
  ['Nh', 'Nihonium', -286, UN, null, 'unknown'],
  ['Fl', 'Flerovium', -289, UN, null, 'unknown'],
  ['Mc', 'Moscovium', -290, UN, null, 'unknown'],
  ['Lv', 'Livermorium', -293, UN, null, 'unknown'],
  ['Ts', 'Tennessine', -294, UN, null, 'unknown'],
  ['Og', 'Oganesson', -294, UN, null, 'unknown'],
];

const PERIOD_START = [1, 3, 11, 19, 37, 55, 87];

export function periodOf(z: number): number {
  let p = 1;
  for (let i = 0; i < PERIOD_START.length; i++) if (z >= PERIOD_START[i]!) p = i + 1;
  return p;
}

function isFBlock(z: number): boolean {
  return (z >= 57 && z <= 70) || (z >= 89 && z <= 102);
}

/** Group 1–18 by table position, or null for the f-block. */
export function groupOf(z: number): number | null {
  if (z === 1) return 1;
  if (z === 2) return 18;
  if (isFBlock(z)) return null;
  const period = periodOf(z);
  const offset = z - PERIOD_START[period - 1]! + 1; // 1-based position in the period
  if (period === 2 || period === 3) return offset <= 2 ? offset : offset + 10;
  if (period === 4 || period === 5) return offset;
  // periods 6 and 7: 14 f-block elements sit between group 2 and group 3
  return offset <= 2 ? offset : offset - 14;
}

export function blockOf(z: number): Block {
  if (z === 2) return 's';
  if (isFBlock(z)) return 'f';
  const g = groupOf(z)!;
  if (g <= 2) return 's';
  if (g >= 13) return 'p';
  return 'd';
}

export const ELEMENTS: readonly Element[] = ROWS.map(([symbol, name, mass, category, electronegativity, stateAtSTP], i) => {
  const z = i + 1;
  return {
    z,
    symbol,
    name,
    atomicMass: Math.abs(mass),
    massKind: mass < 0 ? 'most-stable-isotope' : 'standard',
    period: periodOf(z),
    group: groupOf(z),
    block: blockOf(z),
    category,
    electronegativity,
    stateAtSTP,
  };
});

const BY_SYMBOL = new Map(ELEMENTS.map((e) => [e.symbol.toLowerCase(), e]));

export function elementByZ(z: number): Element | undefined {
  return ELEMENTS[z - 1];
}

export function elementBySymbol(symbol: string): Element | undefined {
  return BY_SYMBOL.get(symbol.trim().toLowerCase());
}

export function isMetal(e: Element): boolean {
  return e.category === 'alkali-metal' || e.category === 'alkaline-earth-metal' || e.category === 'transition-metal' || e.category === 'post-transition-metal' || e.category === 'lanthanide' || e.category === 'actinide';
}

export function isMainGroup(e: Element): boolean {
  return e.block === 's' || e.block === 'p';
}

export const NOBLE_GASES = [2, 10, 18, 36, 54, 86, 118] as const;

export const CATEGORY_LABELS: Record<ElementCategory, string> = {
  'alkali-metal': 'Alkali metal',
  'alkaline-earth-metal': 'Alkaline earth metal',
  'transition-metal': 'Transition metal',
  'post-transition-metal': 'Post-transition metal',
  metalloid: 'Metalloid',
  'reactive-nonmetal': 'Nonmetal',
  'noble-gas': 'Noble gas',
  lanthanide: 'Lanthanide',
  actinide: 'Actinide',
  unknown: 'Properties unknown or predicted only',
};
