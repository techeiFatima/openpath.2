/**
 * Scale of life: typical sizes of organisms, cells, organelles, viruses, molecules and atoms.
 *
 * Every `size` below is a TYPICAL ORDER-OF-MAGNITUDE value, not a measurement of one specimen.
 * The `range` gives the span commonly quoted in introductory biology texts; real populations
 * vary more. Sizes are the longest dimension unless the description says otherwise.
 * The UI must label these values "typical size".
 *
 * Sources of the typical values (textbook-level, cross-checked for order of magnitude):
 *   adult human height ~1.5–1.9 m; adult hand length ~0.17–0.20 m; common ants ~1–10 mm;
 *   human oocyte ~0.1 mm (100–120 µm); human cheek epithelial cell ~50–60 µm;
 *   red blood cell ~6–8 µm diameter; E. coli ~1–3 µm long (≈0.5 µm wide);
 *   mitochondrion ~1–2 µm long (≈0.5–1 µm wide); influenza virion ~80–120 nm;
 *   ribosome ~20–30 nm (bacterial ≈ 20 nm, eukaryotic ≈ 25–30 nm);
 *   DNA double helix ~2 nm in diameter; glucose ~1 nm across; water ~0.3 nm;
 *   hydrogen atom ~0.1 nm in diameter (twice the Bohr radius, 0.053 nm).
 */

export type ScaleCategory = 'organism' | 'body-part' | 'cell' | 'organelle' | 'virus' | 'molecule' | 'atom';

export interface ScaleObject {
  id: string;
  name: string;
  /** Typical size in metres (longest dimension unless stated). */
  size: number;
  /** Conservative range commonly quoted, in metres [min, max]. */
  range: [number, number];
  category: ScaleCategory;
  /** What the size refers to and one memorable fact. */
  description: string;
}

export const SCALE_OBJECTS: ScaleObject[] = [
  { id: 'human', name: 'Adult human', size: 1.7, range: [1.5, 1.9], category: 'organism', description: 'Height. Made of roughly tens of trillions of cells.' },
  { id: 'hand', name: 'Human hand', size: 0.18, range: [0.17, 0.2], category: 'body-part', description: 'Length from wrist to fingertip.' },
  { id: 'ant', name: 'Ant', size: 3e-3, range: [1e-3, 1e-2], category: 'organism', description: 'Body length of a common garden ant; species range from ~1 mm to over 2 cm.' },
  { id: 'egg-cell', name: 'Human egg cell', size: 1e-4, range: [1e-4, 1.2e-4], category: 'cell', description: 'Diameter. The largest human cell, just at the limit of unaided sight.' },
  { id: 'cheek-cell', name: 'Human cheek cell', size: 5.5e-5, range: [5e-5, 6e-5], category: 'cell', description: 'Diameter of a flattened epithelial cell from the inside of the mouth.' },
  { id: 'red-blood-cell', name: 'Red blood cell', size: 7.5e-6, range: [6e-6, 8e-6], category: 'cell', description: 'Diameter of the disc. Has no nucleus; carries oxygen.' },
  { id: 'e-coli', name: 'E. coli bacterium', size: 2e-6, range: [1e-6, 3e-6], category: 'cell', description: 'Length of the rod; about 0.5 µm wide. A prokaryote: no nucleus.' },
  { id: 'mitochondrion', name: 'Mitochondrion', size: 1.5e-6, range: [1e-6, 2e-6], category: 'organelle', description: 'Length; about 0.5–1 µm wide. Similar in size to a bacterium.' },
  { id: 'influenza', name: 'Influenza virus', size: 1e-7, range: [8e-8, 1.2e-7], category: 'virus', description: 'Diameter of the roughly spherical virion. Not a cell.' },
  { id: 'ribosome', name: 'Ribosome', size: 2.5e-8, range: [2e-8, 3e-8], category: 'organelle', description: 'Diameter. The molecular machine that translates mRNA into protein.' },
  { id: 'dna', name: 'DNA double helix', size: 2e-9, range: [2e-9, 2e-9], category: 'molecule', description: 'Width (diameter) of the helix. Its length can be centimetres.' },
  { id: 'glucose', name: 'Glucose molecule', size: 1e-9, range: [7e-10, 1e-9], category: 'molecule', description: 'Width across the ring. C₆H₁₂O₆.' },
  { id: 'water', name: 'Water molecule', size: 3e-10, range: [2.7e-10, 3e-10], category: 'molecule', description: 'Width across H–O–H.' },
  { id: 'hydrogen', name: 'Hydrogen atom', size: 1e-10, range: [1e-10, 1.1e-10], category: 'atom', description: 'Diameter (twice the Bohr radius of 0.053 nm). The smallest atom.' },
];

export const SCALE_OBJECTS_BY_ID: ReadonlyMap<string, ScaleObject> = new Map(SCALE_OBJECTS.map((o) => [o.id, o]));

export function scaleObject(id: string): ScaleObject {
  const o = SCALE_OBJECTS_BY_ID.get(id);
  if (!o) throw new Error(`Unknown scale object ${id}`);
  return o;
}

/** How many times larger `a` is than `b` (both in metres or both ScaleObjects). */
export function sizeRatio(a: number | ScaleObject, b: number | ScaleObject): number {
  return metres(a) / metres(b);
}

/** Orders of magnitude between two sizes: log10(a / b). Positive when a is larger. */
export function ordersOfMagnitude(a: number | ScaleObject, b: number | ScaleObject): number {
  return Math.log10(sizeRatio(a, b));
}

function metres(x: number | ScaleObject): number {
  return typeof x === 'number' ? x : x.size;
}

/** SI prefixes used by the explorer (largest first). */
const PREFIXES: { symbol: string; factor: number; name: string }[] = [
  { symbol: 'km', factor: 1e3, name: 'kilometre' },
  { symbol: 'm', factor: 1, name: 'metre' },
  { symbol: 'mm', factor: 1e-3, name: 'millimetre' },
  { symbol: 'µm', factor: 1e-6, name: 'micrometre' },
  { symbol: 'nm', factor: 1e-9, name: 'nanometre' },
  { symbol: 'pm', factor: 1e-12, name: 'picometre' },
];

export interface PrefixedLength {
  value: number;
  symbol: string;
  name: string;
  factor: number;
}

/**
 * Choose the SI prefix that puts the number in [1, 1000), except that anything below 1 nm
 * stays in nanometres (0.3 nm, 0.1 nm) because that is how atomic sizes are usually quoted.
 */
export function toPrefixed(metres: number, sig = 3): PrefixedLength {
  const abs = Math.abs(metres);
  const nm = PREFIXES.find((p) => p.symbol === 'nm')!;
  let chosen = PREFIXES[PREFIXES.length - 1]!;
  if (abs === 0) chosen = PREFIXES.find((p) => p.symbol === 'm')!;
  else {
    for (const p of PREFIXES) {
      if (abs >= p.factor * (1 - 1e-9)) { chosen = p; break; }
    }
    if (chosen.factor < nm.factor) chosen = nm;
  }
  const value = Number((metres / chosen.factor).toPrecision(sig));
  return { value, symbol: chosen.symbol, name: chosen.name, factor: chosen.factor };
}

/** "7.5 µm", "1.7 m", "0.1 nm". */
export function formatLength(metres: number, sig = 3): string {
  if (!Number.isFinite(metres)) return '—';
  const p = toPrefixed(metres, sig);
  return `${p.value} ${p.symbol}`;
}

/** Scientific-notation string for prose: 7.5e-6 → "7.5 × 10⁻⁶ m". */
export function formatScientific(metres: number, sig = 2): string {
  if (metres === 0) return '0 m';
  const exp = Math.floor(Math.log10(Math.abs(metres)));
  const mant = Number((metres / 10 ** exp).toPrecision(sig));
  return `${mant} × 10^${exp} m`;
}

/** A "nice" scale-bar length (1, 2 or 5 × 10ⁿ metres) no longer than `maxLength`. */
export function niceScaleBar(maxLength: number): number {
  const exp = Math.floor(Math.log10(maxLength) + 1e-9);
  for (const m of [5, 2, 1]) {
    const candidate = Number(`${m}e${exp}`);
    if (candidate <= maxLength * (1 + 1e-9)) return candidate;
  }
  return Number(`5e${exp - 1}`);
}

export type Microscope = 'naked-eye' | 'light-microscope' | 'electron-microscope';

/**
 * Rule-of-thumb resolution limits (metres). These are approximate teaching thresholds, not
 * instrument specifications:
 *   naked eye: can separate features down to roughly 0.1 mm (1e-4 m);
 *   light microscope: diffraction limits resolution to roughly 200 nm (2e-7 m);
 *   electron microscope: resolves well below that (down to ~0.1 nm for the best instruments).
 */
export const NAKED_EYE_LIMIT_M = 1e-4;
export const LIGHT_MICROSCOPE_LIMIT_M = 2e-7;

export const MICROSCOPE_LABELS: Record<Microscope, string> = {
  'naked-eye': 'Naked eye',
  'light-microscope': 'Light microscope',
  'electron-microscope': 'Electron microscope',
};

export const MICROSCOPE_RULE_OF_THUMB = `Rule of thumb: naked eye ≳ ${formatLength(NAKED_EYE_LIMIT_M)}; light microscope ≳ ${formatLength(LIGHT_MICROSCOPE_LIMIT_M)}; electron microscope below that.`;

/** Which tool is needed to resolve an object of this size (rule of thumb). */
export function microscopeFor(size: number): Microscope {
  if (size >= NAKED_EYE_LIMIT_M) return 'naked-eye';
  if (size >= LIGHT_MICROSCOPE_LIMIT_M) return 'light-microscope';
  return 'electron-microscope';
}

/**
 * Objects that fit sensibly in a field of view `fov` metres wide: no larger than the view and
 * no smaller than `minFraction` of it (default 1/400, about 2 px on an 800 px wide drawing).
 */
export function objectsInView(fov: number, minFraction = 1 / 400): ScaleObject[] {
  return SCALE_OBJECTS.filter((o) => o.size <= fov && o.size >= fov * minFraction);
}

export const FOV_MAX_M = 3; // enough to see a whole human
export const FOV_MIN_M = 1e-10;
