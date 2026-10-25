import { AU_M, DAY_S, G } from './constants';

/**
 * Reference data for the bodies used in Gravity Lab.
 *
 * Sources (to re-verify before scientific sign-off; the official pages could not be
 * fetched from this build environment on 2026-10-25, see docs/10-milestone-1-report.md):
 *  - Masses and mean radii: NASA NSSDC Planetary Fact Sheet (metric), 3 significant figures.
 *    Values were cross-checked against an indexed copy of that table.
 *  - Semi-major axes and eccentricities: JPL Solar System Dynamics, "Approximate Positions
 *    of the Planets", Keplerian elements at epoch J2000 (Table 1), converted at
 *    1 au = 149 597 870.7 km. We use these rather than the fact sheet's "distance from
 *    Sun" because the latter is a time-averaged distance that does not satisfy Kepler's
 *    third law for the outer planets (Saturn deviates by 1.6%).
 *  - Orbital periods: sidereal periods in days.
 * The consistency test in gravity.test.ts checks T²/a³ is constant across the planets to
 * 0.5%, which independently cross-checks the mass of the Sun, the distances and the periods.
 */
export interface BodyData {
  id: string;
  name: string;
  kind: 'star' | 'planet' | 'moon';
  mass: number; // kg
  radius: number; // m (mean)
  /** Semi-major axis of the orbit around `primary`, m. Undefined for the Sun. */
  semiMajorAxis?: number;
  eccentricity?: number;
  /** Orbital period around `primary`, s. */
  period?: number;
  primary?: string;
  color: string;
}

const au = AU_M;

export const BODIES: Record<string, BodyData> = {
  sun: { id: 'sun', name: 'Sun', kind: 'star', mass: 1.989e30, radius: 695_700e3, color: '#ffd27a' },
  mercury: { id: 'mercury', name: 'Mercury', kind: 'planet', mass: 0.33e24, radius: 2439.7e3, semiMajorAxis: 0.38709927 * au, eccentricity: 0.20563593, period: 87.969 * DAY_S, primary: 'sun', color: '#b1a7a6' },
  venus: { id: 'venus', name: 'Venus', kind: 'planet', mass: 4.87e24, radius: 6051.8e3, semiMajorAxis: 0.72333566 * au, eccentricity: 0.00677672, period: 224.701 * DAY_S, primary: 'sun', color: '#e6c89c' },
  earth: { id: 'earth', name: 'Earth', kind: 'planet', mass: 5.97e24, radius: 6371e3, semiMajorAxis: 1.00000261 * au, eccentricity: 0.01671123, period: 365.256 * DAY_S, primary: 'sun', color: '#4f8fe6' },
  moon: { id: 'moon', name: 'Moon', kind: 'moon', mass: 0.073e24, radius: 1737.4e3, semiMajorAxis: 384_400e3, eccentricity: 0.0549, period: 27.3217 * DAY_S, primary: 'earth', color: '#cfcfcf' },
  mars: { id: 'mars', name: 'Mars', kind: 'planet', mass: 0.642e24, radius: 3389.5e3, semiMajorAxis: 1.52371034 * au, eccentricity: 0.09339410, period: 686.980 * DAY_S, primary: 'sun', color: '#d9704a' },
  jupiter: { id: 'jupiter', name: 'Jupiter', kind: 'planet', mass: 1898e24, radius: 69_911e3, semiMajorAxis: 5.20288700 * au, eccentricity: 0.04838624, period: 4332.59 * DAY_S, primary: 'sun', color: '#d8b48a' },
  saturn: { id: 'saturn', name: 'Saturn', kind: 'planet', mass: 568e24, radius: 58_232e3, semiMajorAxis: 9.53667594 * au, eccentricity: 0.05386179, period: 10_759.22 * DAY_S, primary: 'sun', color: '#e8d6a8' },
  uranus: { id: 'uranus', name: 'Uranus', kind: 'planet', mass: 86.8e24, radius: 25_362e3, semiMajorAxis: 19.18916464 * au, eccentricity: 0.04725744, period: 30_688.5 * DAY_S, primary: 'sun', color: '#9fd8e0' },
  neptune: { id: 'neptune', name: 'Neptune', kind: 'planet', mass: 102e24, radius: 24_622e3, semiMajorAxis: 30.06992276 * au, eccentricity: 0.00859048, period: 60_182 * DAY_S, primary: 'sun', color: '#5b7fe0' },
};

export const PLANET_IDS = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'] as const;

/** Standard gravitational parameter μ = GM, m^3/s^2. */
export function mu(body: BodyData): number {
  return G * body.mass;
}

export { AU_M };
