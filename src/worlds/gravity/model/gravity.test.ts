import { describe, expect, it } from 'vitest';
import { circularSpeed, escapeSpeed, keplerRatio, orbitalPeriod, orbitFromState, semiMajorAxisFromPeriod } from './analytic';
import { BODIES, mu, PLANET_IDS } from './bodies';
import { G } from './constants';
import { NBodySimulation } from './nbody';
import { buildOrbitLab, buildSolarSystem } from './presets';

const earth = BODIES.earth!;
const sun = BODIES.sun!;
const muE = mu(earth);

describe('analytic results', () => {
  it('ISS-altitude circular speed and period match textbook values', () => {
    const r = earth.radius + 400e3;
    expect(circularSpeed(muE, r)).toBeCloseTo(7670, -1); // ≈ 7.67 km/s
    expect(orbitalPeriod(muE, r) / 60).toBeCloseTo(92.4, 0); // ≈ 92 minutes
  });
  it('Earth surface escape speed ≈ 11.2 km/s', () => {
    expect(escapeSpeed(muE, earth.radius) / 1000).toBeCloseTo(11.18, 1);
  });
  it('geostationary radius ≈ 42,200 km', () => {
    expect(semiMajorAxisFromPeriod(muE, 86164) / 1e3).toBeCloseTo(42_160, -2);
  });
  it('planetary data obey Kepler\'s third law (T²/a³ constant) to 0.5%', () => {
    const expected = (4 * Math.PI ** 2) / mu(sun);
    for (const id of PLANET_IDS) {
      const p = BODIES[id]!;
      const ratio = keplerRatio(p.semiMajorAxis!, p.period!);
      expect(Math.abs(ratio / expected - 1), id).toBeLessThan(0.005);
    }
  });
  it('the Moon\'s listed period matches the two-body prediction to 1%', () => {
    const m = BODIES.moon!;
    const T = 2 * Math.PI * Math.sqrt(m.semiMajorAxis! ** 3 / (G * (earth.mass + m.mass)));
    expect(Math.abs(T / m.period! - 1)).toBeLessThan(0.01);
  });
});

describe('orbit classification from launch conditions', () => {
  const r = earth.radius + 400e3;
  const vc = circularSpeed(muE, r);
  it('circular at v_c, elliptical above/below, crash when too slow, hyperbolic above escape', () => {
    expect(orbitFromState(muE, r, vc, 0, earth.radius).kind).toBe('circular');
    expect(orbitFromState(muE, r, vc * 1.1, 0, earth.radius).kind).toBe('elliptical');
    expect(orbitFromState(muE, r, vc * 0.99, 0, earth.radius).kind).toBe('elliptical');
    // Only 5% slower at 400 km altitude already drops the periapsis below the surface.
    expect(orbitFromState(muE, r, vc * 0.95, 0, earth.radius).kind).toBe('crash');
    expect(orbitFromState(muE, r, vc * 0.5, 0, earth.radius).kind).toBe('crash');
    expect(orbitFromState(muE, r, escapeSpeed(muE, r) * 1.01, 0, earth.radius).kind).toBe('hyperbolic');
  });
  it('reports consistent elements for an ellipse', () => {
    const el = orbitFromState(muE, r, vc * 1.1, 0, earth.radius);
    expect(el.periapsis).toBeCloseTo(r, -3); // launched at periapsis (speed above circular, tangential)
    expect(el.apoapsis).toBeGreaterThan(r);
    expect(el.semiMajorAxis).toBeCloseTo((el.periapsis + el.apoapsis) / 2, -3);
    expect(el.eccentricity).toBeCloseTo((el.apoapsis - el.periapsis) / (el.apoapsis + el.periapsis), 6);
  });
  it('an outward escape launch is never a crash', () => {
    expect(orbitFromState(muE, earth.radius, 12_000, 45, earth.radius).kind).toBe('hyperbolic');
  });
});

describe('N-body leapfrog integrator', () => {
  it('keeps a circular orbit circular and conserves energy over 10 orbits', () => {
    const r = earth.radius + 400e3;
    const vc = circularSpeed(muE, r);
    const sim = new NBodySimulation(buildOrbitLab({ centralId: 'earth', distance: r, speed: vc, angleDeg: 0 }));
    const T = orbitalPeriod(muE, r);
    const e0 = sim.totalEnergy();
    let maxRadiusError = 0;
    let maxEnergyError = 0;
    for (let i = 0; i < 1000; i++) {
      sim.step((10 * T) / 1000);
      const p = sim.body('probe')!;
      const rr = Math.hypot(...p.position);
      maxRadiusError = Math.max(maxRadiusError, Math.abs(rr / r - 1));
      maxEnergyError = Math.max(maxEnergyError, Math.abs((sim.totalEnergy() - e0) / e0));
    }
    expect(maxRadiusError).toBeLessThan(1e-4);
    expect(maxEnergyError).toBeLessThan(1e-4);
  });

  it('numerical period matches the analytic period to 0.1%', () => {
    const r = earth.radius + 1000e3;
    const sim = new NBodySimulation(buildOrbitLab({ centralId: 'earth', distance: r, speed: circularSpeed(muE, r) * 1.15, angleDeg: 0 }));
    const el = orbitFromState(muE, r, circularSpeed(muE, r) * 1.15);
    // Detect return to the starting angle (z crosses from negative to positive at x>0).
    let prevZ = 0;
    let t = 0;
    const dt = el.period / 5000;
    let measured: number | null = null;
    for (let i = 0; i < 20000 && measured === null; i++) {
      sim.step(dt);
      t += dt;
      const p = sim.body('probe')!;
      if (i > 10 && prevZ < 0 && p.position[2] >= 0 && p.position[0] > 0) measured = t;
      prevZ = p.position[2];
    }
    expect(measured).not.toBeNull();
    expect(Math.abs(measured! / el.period - 1)).toBeLessThan(1e-3);
  });

  it('a too-slow probe crashes into the planet', () => {
    const r = earth.radius + 400e3;
    const sim = new NBodySimulation(buildOrbitLab({ centralId: 'earth', distance: r, speed: 3000, angleDeg: 0 }));
    for (let i = 0; i < 2000 && !sim.body('probe')!.crashed; i++) sim.step(5);
    expect(sim.body('probe')!.crashed).toBe(true);
  });

  it('the solar system preset reproduces Earth\'s year to 0.5% in a full N-body run', () => {
    const sim = new NBodySimulation(buildSolarSystem());
    const start = sim.body('earth')!;
    const theta0 = Math.atan2(start.position[2], start.position[0]);
    const year = BODIES.earth!.period!;
    let prev = 0;
    let measured: number | null = null;
    const dt = 86400 / 4;
    for (let i = 0; i < 4 * 400 && measured === null; i++) {
      sim.step(dt);
      const e = sim.body('earth')!;
      const sunB = sim.body('sun')!;
      const ang = Math.atan2(e.position[2] - sunB.position[2], e.position[0] - sunB.position[0]) - theta0;
      const wrapped = ((ang % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
      if (i > 100 && prev > Math.PI && wrapped < Math.PI) measured = (i + 1) * dt - (wrapped / (wrapped + (2 * Math.PI - prev))) * dt;
      prev = wrapped;
    }
    expect(measured).not.toBeNull();
    expect(Math.abs(measured! / year - 1)).toBeLessThan(0.005);
  });

  it('measurements expose circular and escape speeds that agree with the closed forms', () => {
    const r = earth.radius + 400e3;
    const sim = new NBodySimulation(buildOrbitLab({ centralId: 'earth', distance: r, speed: 7000, angleDeg: 0 }));
    const m = Object.fromEntries(sim.measurements().map((x) => [x.id, x.value]));
    expect(m.vcirc).toBeCloseTo(circularSpeed(muE, r), 3);
    expect(m.vesc).toBeCloseTo(escapeSpeed(muE, r), 3);
    expect(m.v).toBeCloseTo(7000, 6);
    expect(m.r).toBeCloseTo(r, 3);
  });
});
