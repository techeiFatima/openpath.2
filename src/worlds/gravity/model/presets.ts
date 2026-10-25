import { circularSpeed } from './analytic';
import { BODIES, mu, PLANET_IDS } from './bodies';
import { G } from './constants';
import type { Body, NBodyParams, Vec3 } from './nbody';

/**
 * Initial conditions. Planets start at perihelion of their (coplanar) ellipses with the
 * exact perihelion speed v_p = sqrt(μ(1+e)/(a(1−e))). Orbit orientations and the
 * positions on any real calendar date are NOT modelled; perihelion directions are spread
 * so bodies do not overlap visually.
 */
export function buildSolarSystem(opts: { includeMoon?: boolean } = {}): NBodyParams {
  const sun = BODIES.sun!;
  const bodies: Body[] = [
    { id: 'sun', name: sun.name, mass: sun.mass, radius: sun.radius, position: [0, 0, 0], velocity: [0, 0, 0], color: sun.color, kind: 'star' },
  ];
  PLANET_IDS.forEach((id, i) => {
    const p = BODIES[id]!;
    const a = p.semiMajorAxis!;
    const e = p.eccentricity ?? 0;
    const rp = a * (1 - e);
    const vp = Math.sqrt((mu(sun) * (1 + e)) / rp);
    const theta = (i * 2 * Math.PI) / PLANET_IDS.length + 0.3;
    const position: Vec3 = [rp * Math.cos(theta), 0, rp * Math.sin(theta)];
    const velocity: Vec3 = [-vp * Math.sin(theta), 0, vp * Math.cos(theta)];
    bodies.push({ id, name: p.name, mass: p.mass, radius: p.radius, position, velocity, color: p.color, kind: 'planet', primary: 'sun' });
  });
  if (opts.includeMoon) {
    const earth = bodies.find((b) => b.id === 'earth')!;
    const m = BODIES.moon!;
    const r = m.semiMajorAxis!;
    const v = circularSpeed(mu(BODIES.earth!), r);
    bodies.push({
      id: 'moon', name: m.name, mass: m.mass, radius: m.radius, kind: 'moon', color: m.color, primary: 'earth',
      position: [earth.position[0] + r, 0, earth.position[2]],
      velocity: [earth.velocity[0], 0, earth.velocity[2] + v],
    });
  }
  // Mercury's period is 88 days; 2000 steps per orbit keeps the error tiny.
  return { bodies, G, maxStep: 3600, focusId: 'earth' };
}

export interface OrbitLabSettings {
  /** Central body id from BODIES. */
  centralId: 'earth' | 'moon' | 'mars' | 'sun' | 'jupiter';
  /** Launch distance from the centre, m. */
  distance: number;
  /** Launch speed, m/s. */
  speed: number;
  /** Flight path angle in degrees (0 = horizontal). */
  angleDeg: number;
}

/** A dominant fixed central mass and a 1000 kg probe. */
export function buildOrbitLab(s: OrbitLabSettings): NBodyParams {
  const c = BODIES[s.centralId]!;
  const gamma = (s.angleDeg * Math.PI) / 180;
  const bodies: Body[] = [
    { id: 'central', name: c.name, mass: c.mass, radius: c.radius, position: [0, 0, 0], velocity: [0, 0, 0], color: c.color, kind: c.kind === 'star' ? 'star' : 'planet', fixed: true },
    {
      id: 'probe', name: 'Probe', mass: 1000, radius: 1, kind: 'satellite', color: '#ffffff', primary: 'central',
      position: [s.distance, 0, 0],
      velocity: [s.speed * Math.sin(gamma), 0, s.speed * Math.cos(gamma)],
    },
  ];
  // Choose the step from the circular-orbit period at the launch radius: ≥ 2000 steps/orbit.
  const T = 2 * Math.PI * Math.sqrt(s.distance ** 3 / mu(c));
  return { bodies, G, maxStep: Math.max(0.05, T / 2000), focusId: 'probe' };
}

export const DEFAULT_ORBIT_LAB: OrbitLabSettings = {
  centralId: 'earth',
  distance: BODIES.earth!.radius + 400e3,
  speed: Math.round(circularSpeed(mu(BODIES.earth!), BODIES.earth!.radius + 400e3)),
  angleDeg: 0,
};
