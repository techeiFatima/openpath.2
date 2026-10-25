/**
 * Minimal, explicit unit system for grading numeric answers in SI.
 * Only dimensions needed by current worlds are included; extend deliberately.
 */
export type Dimension =
  | 'dimensionless'
  | 'length'
  | 'time'
  | 'speed'
  | 'mass'
  | 'acceleration'
  | 'force'
  | 'energy'
  | 'gravitational-parameter' // m^3/s^2
  | 'specific-energy'; // J/kg

interface UnitDef {
  dimension: Dimension;
  /** Multiply a value in this unit by `toSI` to get the SI value. */
  toSI: number;
}

const JULIAN_YEAR_S = 365.25 * 86400;
const AU_M = 1.495978707e11; // IAU 2012 definition (exact)

const UNIT_TABLE: Record<string, UnitDef> = {
  // length
  m: { dimension: 'length', toSI: 1 },
  meter: { dimension: 'length', toSI: 1 },
  meters: { dimension: 'length', toSI: 1 },
  metre: { dimension: 'length', toSI: 1 },
  metres: { dimension: 'length', toSI: 1 },
  km: { dimension: 'length', toSI: 1e3 },
  kilometer: { dimension: 'length', toSI: 1e3 },
  kilometers: { dimension: 'length', toSI: 1e3 },
  kilometre: { dimension: 'length', toSI: 1e3 },
  kilometres: { dimension: 'length', toSI: 1e3 },
  cm: { dimension: 'length', toSI: 1e-2 },
  au: { dimension: 'length', toSI: AU_M },
  // time
  s: { dimension: 'time', toSI: 1 },
  sec: { dimension: 'time', toSI: 1 },
  second: { dimension: 'time', toSI: 1 },
  seconds: { dimension: 'time', toSI: 1 },
  min: { dimension: 'time', toSI: 60 },
  minute: { dimension: 'time', toSI: 60 },
  minutes: { dimension: 'time', toSI: 60 },
  h: { dimension: 'time', toSI: 3600 },
  hr: { dimension: 'time', toSI: 3600 },
  hour: { dimension: 'time', toSI: 3600 },
  hours: { dimension: 'time', toSI: 3600 },
  d: { dimension: 'time', toSI: 86400 },
  day: { dimension: 'time', toSI: 86400 },
  days: { dimension: 'time', toSI: 86400 },
  yr: { dimension: 'time', toSI: JULIAN_YEAR_S },
  year: { dimension: 'time', toSI: JULIAN_YEAR_S },
  years: { dimension: 'time', toSI: JULIAN_YEAR_S },
  // speed
  'm/s': { dimension: 'speed', toSI: 1 },
  'km/s': { dimension: 'speed', toSI: 1e3 },
  'km/h': { dimension: 'speed', toSI: 1000 / 3600 },
  'km/hr': { dimension: 'speed', toSI: 1000 / 3600 },
  // mass
  kg: { dimension: 'mass', toSI: 1 },
  g: { dimension: 'mass', toSI: 1e-3 },
  // acceleration
  'm/s^2': { dimension: 'acceleration', toSI: 1 },
  'm/s²': { dimension: 'acceleration', toSI: 1 },
  'm/s2': { dimension: 'acceleration', toSI: 1 },
  // force / energy
  n: { dimension: 'force', toSI: 1 },
  kn: { dimension: 'force', toSI: 1e3 },
  j: { dimension: 'energy', toSI: 1 },
  kj: { dimension: 'energy', toSI: 1e3 },
  mj: { dimension: 'energy', toSI: 1e6 },
  // specific energy
  'j/kg': { dimension: 'specific-energy', toSI: 1 },
  'kj/kg': { dimension: 'specific-energy', toSI: 1e3 },
  'mj/kg': { dimension: 'specific-energy', toSI: 1e6 },
  'm^2/s^2': { dimension: 'specific-energy', toSI: 1 },
  'm²/s²': { dimension: 'specific-energy', toSI: 1 },
  // gravitational parameter
  'm^3/s^2': { dimension: 'gravitational-parameter', toSI: 1 },
  'm³/s²': { dimension: 'gravitational-parameter', toSI: 1 },
  'km^3/s^2': { dimension: 'gravitational-parameter', toSI: 1e9 },
  'km³/s²': { dimension: 'gravitational-parameter', toSI: 1e9 },
};

export function lookupUnit(raw: string): UnitDef | undefined {
  const key = raw.trim().replace(/\s+/g, '');
  // Unit symbols are case-sensitive in SI (m vs M) but learners type freely; we accept
  // case-insensitive matches except where it would be ambiguous (none in this table).
  return UNIT_TABLE[key] ?? UNIT_TABLE[key.toLowerCase()];
}

export interface Quantity {
  value: number;
  /** Unit as typed, normalised; undefined when the learner gave a bare number. */
  unit?: string;
}

const NUMBER_RE =
  /^\s*([-+]?(?:\d{1,3}(?:,\d{3})+|\d+)?(?:\.\d+)?(?:\s*(?:[eE][-+]?\d+|[x×*]\s*10\s*\^?\s*\(?[-+]?\d+\)?))?)\s*(.*?)\s*$/;

/**
 * Parse learner input such as "7.67 km/s", "7,672 m/s", "3.986e14", "3.986 × 10^14 m^3/s^2".
 * Returns null when no leading number is present.
 */
export function parseQuantity(input: string): Quantity | null {
  const m = NUMBER_RE.exec(input.replace(/−/g, '-'));
  if (!m || m[1] === undefined || m[1] === '' || m[1] === '-' || m[1] === '+') return null;
  let numText = m[1].replace(/,/g, '');
  // "a x 10^b" → "aEb"
  numText = numText.replace(/\s*[x×*]\s*10\s*\^?\s*\(?([-+]?\d+)\)?/i, 'e$1');
  // bare "10^b" without mantissa is handled by the caller typing "1e..."; keep simple
  const value = Number(numText.replace(/\s+/g, ''));
  if (!Number.isFinite(value)) return null;
  const unitText = (m[2] ?? '').trim();
  return unitText ? { value, unit: unitText } : { value };
}

export function toSI(q: Quantity): { value: number; dimension: Dimension } | { error: string } {
  if (q.unit === undefined) return { value: q.value, dimension: 'dimensionless' };
  const def = lookupUnit(q.unit);
  if (!def) return { error: `Unrecognised unit "${q.unit}"` };
  return { value: q.value * def.toSI, dimension: def.dimension };
}

export function dimensionOfUnit(unit: string): Dimension | undefined {
  return lookupUnit(unit)?.dimension;
}

export const CONSTANTS = { AU_M, JULIAN_YEAR_S };
