/**
 * Closed-form two-body results used to (a) validate the numerical integrator and
 * (b) give learners exact reference values. All inputs/outputs are SI.
 * μ (mu) is the standard gravitational parameter G·M of the central body.
 */

export const circularSpeed = (mu: number, r: number): number => Math.sqrt(mu / r);
export const escapeSpeed = (mu: number, r: number): number => Math.sqrt((2 * mu) / r);
export const orbitalPeriod = (mu: number, a: number): number => 2 * Math.PI * Math.sqrt((a * a * a) / mu);
export const semiMajorAxisFromPeriod = (mu: number, T: number): number => Math.cbrt((mu * T * T) / (4 * Math.PI * Math.PI));
export const gravitationalAcceleration = (mu: number, r: number): number => mu / (r * r);
export const gravitationalForce = (G: number, m1: number, m2: number, r: number): number => (G * m1 * m2) / (r * r);
/** Specific orbital energy ε = v²/2 − μ/r (J/kg). Negative = bound. */
export const specificEnergy = (mu: number, r: number, v: number): number => (v * v) / 2 - mu / r;
/** Kepler's third law ratio T²/a³, which equals 4π²/μ for every orbit around the same primary. */
export const keplerRatio = (a: number, T: number): number => (T * T) / (a * a * a);

export type OrbitKind = 'crash' | 'circular' | 'elliptical' | 'parabolic' | 'hyperbolic';

export interface OrbitElements {
  kind: OrbitKind;
  specificEnergy: number;
  /** Semi-major axis (m); negative for hyperbolic, Infinity for parabolic. */
  semiMajorAxis: number;
  eccentricity: number;
  periapsis: number;
  /** Apoapsis (m); Infinity when unbound. */
  apoapsis: number;
  /** Period (s); Infinity when unbound. */
  period: number;
  /** Specific angular momentum magnitude (m²/s). */
  angularMomentum: number;
}

/**
 * Orbit from launch conditions: distance r from the centre, speed v, and flight-path
 * angle γ (degrees) between the velocity and the local horizontal (0 = purely tangential).
 * `centralRadius` lets us flag orbits whose periapsis lies inside the central body.
 */
export function orbitFromState(mu: number, r: number, v: number, flightPathAngleDeg = 0, centralRadius = 0): OrbitElements {
  const gamma = (flightPathAngleDeg * Math.PI) / 180;
  const h = r * v * Math.cos(gamma);
  const eps = specificEnergy(mu, r, v);
  const eSq = 1 + (2 * eps * h * h) / (mu * mu);
  const e = Math.sqrt(Math.max(0, eSq));
  const a = Math.abs(eps) < 1e-12 * (mu / r) ? Infinity : -mu / (2 * eps);
  const p = (h * h) / mu; // semi-latus rectum
  const periapsis = p / (1 + e);
  const bound = eps < 0 && Number.isFinite(a);
  const apoapsis = bound ? p / (1 - e) : Infinity;
  const period = bound ? orbitalPeriod(mu, a) : Infinity;

  let kind: OrbitKind;
  if (!Number.isFinite(a)) kind = 'parabolic';
  else if (eps > 0) kind = 'hyperbolic';
  else if (e < 1e-3) kind = 'circular';
  else kind = 'elliptical';
  // The path hits the central body if its closest approach lies inside the body and the
  // probe will actually get there: always for a bound orbit (it comes back around), and
  // for an unbound path only when it is currently heading inward (γ < 0).
  if (periapsis < centralRadius && (bound || gamma < 0)) kind = 'crash';

  return { kind, specificEnergy: eps, semiMajorAxis: a, eccentricity: e, periapsis, apoapsis, period, angularMomentum: h };
}

/** Elements from Cartesian state vectors (used to read the live simulation). */
export function orbitFromVectors(mu: number, rel: readonly [number, number, number], vel: readonly [number, number, number], centralRadius = 0): OrbitElements {
  const r = Math.hypot(rel[0], rel[1], rel[2]);
  const v = Math.hypot(vel[0], vel[1], vel[2]);
  const radial = (rel[0] * vel[0] + rel[1] * vel[1] + rel[2] * vel[2]) / (r || 1);
  const gamma = v > 0 ? Math.asin(Math.max(-1, Math.min(1, radial / v))) : 0;
  return orbitFromState(mu, r, v, (gamma * 180) / Math.PI, centralRadius);
}
