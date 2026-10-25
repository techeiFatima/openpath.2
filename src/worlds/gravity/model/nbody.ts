import type { Measurement, Simulation } from '@/core/simulation/types';
import { orbitFromVectors } from './analytic';
import { G as G_SI } from './constants';

export type Vec3 = [number, number, number];

export interface Body {
  id: string;
  name: string;
  mass: number;
  radius: number;
  position: Vec3;
  velocity: Vec3;
  color: string;
  kind: 'star' | 'planet' | 'moon' | 'satellite';
  /** Fixed bodies feel no acceleration (used for a dominant central mass). */
  fixed?: boolean;
  crashed?: boolean;
  /** Which body this one is considered to orbit, for measurements. */
  primary?: string;
}

export interface NBodyParams {
  bodies: Body[];
  G: number;
  /** Largest internal step allowed (s); step(dt) is subdivided to respect it. */
  maxStep: number;
  /** Body whose orbit is reported by measurements(). */
  focusId?: string;
}

export interface NBodyState {
  time: number;
  bodies: Body[];
}

const clone = (b: Body): Body => ({ ...b, position: [...b.position] as Vec3, velocity: [...b.velocity] as Vec3 });

/**
 * Newtonian N-body simulation integrated with the leapfrog (kick-drift-kick) scheme.
 * Leapfrog is symplectic: it conserves energy to a bounded oscillation rather than
 * drifting, which is what makes long orbital runs trustworthy for teaching.
 *
 * Simplifications (shown to learners via assumptions()):
 *  - point masses (no tides, oblateness, or atmospheric drag)
 *  - Newtonian gravity only (no relativistic precession)
 *  - a body is "crashed" when it enters another body's radius; it then stops moving
 */
export class NBodySimulation implements Simulation<NBodyState, NBodyParams> {
  readonly id = 'gravity.nbody';
  params: NBodyParams;
  private initial: Body[];
  private bodies: Body[];
  private timeValue = 0;
  private acc: Vec3[] = [];

  constructor(params: NBodyParams) {
    this.params = { ...params, G: params.G ?? G_SI };
    this.initial = params.bodies.map(clone);
    this.bodies = params.bodies.map(clone);
    this.computeAccelerations();
  }

  reset(params?: Partial<NBodyParams>): void {
    if (params) {
      this.params = { ...this.params, ...params };
      if (params.bodies) this.initial = params.bodies.map(clone);
    }
    this.bodies = this.initial.map(clone);
    this.timeValue = 0;
    this.computeAccelerations();
  }

  private computeAccelerations(): void {
    const n = this.bodies.length;
    if (this.acc.length !== n) this.acc = Array.from({ length: n }, () => [0, 0, 0] as Vec3);
    for (const a of this.acc) a[0] = a[1] = a[2] = 0;
    const G = this.params.G;
    for (let i = 0; i < n; i++) {
      const bi = this.bodies[i]!;
      for (let j = i + 1; j < n; j++) {
        const bj = this.bodies[j]!;
        const dx = bj.position[0] - bi.position[0];
        const dy = bj.position[1] - bi.position[1];
        const dz = bj.position[2] - bi.position[2];
        const r2 = dx * dx + dy * dy + dz * dz;
        const r = Math.sqrt(r2);
        if (r === 0) continue;
        const inv = 1 / (r2 * r);
        const ai = this.acc[i]!;
        const aj = this.acc[j]!;
        if (!bi.fixed && !bi.crashed) {
          const s = G * bj.mass * inv;
          ai[0] += s * dx; ai[1] += s * dy; ai[2] += s * dz;
        }
        if (!bj.fixed && !bj.crashed) {
          const s = G * bi.mass * inv;
          aj[0] -= s * dx; aj[1] -= s * dy; aj[2] -= s * dz;
        }
      }
    }
  }

  private kick(h: number): void {
    for (let i = 0; i < this.bodies.length; i++) {
      const b = this.bodies[i]!;
      if (b.fixed || b.crashed) continue;
      const a = this.acc[i]!;
      b.velocity[0] += a[0] * h; b.velocity[1] += a[1] * h; b.velocity[2] += a[2] * h;
    }
  }

  private drift(h: number): void {
    for (const b of this.bodies) {
      if (b.fixed || b.crashed) continue;
      b.position[0] += b.velocity[0] * h; b.position[1] += b.velocity[1] * h; b.position[2] += b.velocity[2] * h;
    }
  }

  private detectCollisions(): void {
    const n = this.bodies.length;
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const a = this.bodies[i]!;
        const b = this.bodies[j]!;
        if (a.crashed || b.crashed) continue;
        const d = Math.hypot(a.position[0] - b.position[0], a.position[1] - b.position[1], a.position[2] - b.position[2]);
        if (d < a.radius + b.radius) {
          // The lighter body crashes into the heavier one.
          const victim = a.mass <= b.mass ? a : b;
          victim.crashed = true;
          victim.velocity = [0, 0, 0];
        }
      }
    }
  }

  step(dt: number): void {
    if (dt <= 0) return;
    const n = Math.max(1, Math.ceil(dt / this.params.maxStep));
    const h = dt / n;
    for (let k = 0; k < n; k++) {
      this.kick(h / 2);
      this.drift(h);
      this.computeAccelerations();
      this.kick(h / 2);
      this.detectCollisions();
      this.timeValue += h;
    }
  }

  snapshot(): Readonly<NBodyState> {
    return { time: this.timeValue, bodies: this.bodies.map(clone) };
  }

  /** Live (not cloned) body array for per-frame rendering. Do not mutate. */
  peek(): readonly Body[] {
    return this.bodies;
  }

  get time(): number {
    return this.timeValue;
  }

  body(id: string): Body | undefined {
    return this.bodies.find((b) => b.id === id);
  }

  /** Total mechanical energy (J): Σ ½mv² − Σ G m_i m_j / r_ij. */
  totalEnergy(): number {
    let ke = 0;
    let pe = 0;
    const G = this.params.G;
    for (let i = 0; i < this.bodies.length; i++) {
      const bi = this.bodies[i]!;
      const v2 = bi.velocity[0] ** 2 + bi.velocity[1] ** 2 + bi.velocity[2] ** 2;
      ke += 0.5 * bi.mass * v2;
      for (let j = i + 1; j < this.bodies.length; j++) {
        const bj = this.bodies[j]!;
        const r = Math.hypot(bj.position[0] - bi.position[0], bj.position[1] - bi.position[1], bj.position[2] - bi.position[2]);
        pe -= (G * bi.mass * bj.mass) / r;
      }
    }
    return ke + pe;
  }

  measurements(): Measurement[] {
    const focus = this.params.focusId ? this.body(this.params.focusId) : undefined;
    const primary = focus?.primary ? this.body(focus.primary) : undefined;
    if (!focus || !primary) return [{ id: 't', label: 'Elapsed time', value: this.timeValue, unit: 's', source: 'numerical' }];
    const rel: Vec3 = [focus.position[0] - primary.position[0], focus.position[1] - primary.position[1], focus.position[2] - primary.position[2]];
    const vel: Vec3 = [focus.velocity[0] - primary.velocity[0], focus.velocity[1] - primary.velocity[1], focus.velocity[2] - primary.velocity[2]];
    const r = Math.hypot(...rel);
    const v = Math.hypot(...vel);
    const mu = this.params.G * (primary.mass + (primary.fixed ? 0 : focus.mass));
    const el = orbitFromVectors(mu, rel, vel, primary.radius);
    const g = mu / (r * r);
    const out: Measurement[] = [
      { id: 't', label: 'Elapsed time', value: this.timeValue, unit: 's', source: 'numerical' },
      { id: 'r', label: `Distance ${focus.name}–${primary.name} (centre to centre)`, value: r, unit: 'm', source: 'numerical' },
      { id: 'v', label: `Speed of ${focus.name}`, value: v, unit: 'm/s', source: 'numerical' },
      { id: 'g', label: 'Gravitational acceleration here', value: g, unit: 'm/s²', formula: 'g = \\frac{GM}{r^2}', source: 'analytic' },
      { id: 'vcirc', label: 'Speed needed for a circular orbit here', value: Math.sqrt(mu / r), unit: 'm/s', formula: 'v_c = \\sqrt{\\frac{GM}{r}}', source: 'analytic' },
      { id: 'vesc', label: 'Escape speed here', value: Math.sqrt((2 * mu) / r), unit: 'm/s', formula: 'v_{esc} = \\sqrt{\\frac{2GM}{r}}', source: 'analytic' },
      { id: 'eps', label: 'Specific orbital energy', value: el.specificEnergy, unit: 'J/kg', formula: '\\varepsilon = \\tfrac{1}{2}v^2 - \\frac{GM}{r}', source: 'analytic' },
      { id: 'e', label: 'Eccentricity', value: el.eccentricity, unit: '', source: 'analytic' },
    ];
    if (Number.isFinite(el.period)) {
      out.push({ id: 'T', label: 'Orbital period (from current state)', value: el.period, unit: 's', formula: 'T = 2\\pi\\sqrt{\\frac{a^3}{GM}}', source: 'analytic' });
      out.push({ id: 'a', label: 'Semi-major axis', value: el.semiMajorAxis, unit: 'm', source: 'analytic' });
      out.push({ id: 'rp', label: 'Closest approach (periapsis)', value: el.periapsis, unit: 'm', source: 'analytic' });
      out.push({ id: 'ra', label: 'Farthest point (apoapsis)', value: el.apoapsis, unit: 'm', source: 'analytic' });
    }
    return out;
  }

  assumptions(): string[] {
    return [
      'Bodies are treated as point masses; real planets are slightly non-spherical and have atmospheres.',
      'Only Newtonian gravity acts: no relativistic corrections, radiation pressure or drag.',
      'A body that enters another body’s radius is marked crashed and stops.',
      'Time is advanced with the leapfrog integrator; the step is small enough that energy stays constant to better than 0.01% in the validation tests.',
    ];
  }
}
