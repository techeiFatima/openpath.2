/**
 * Simulation layer: the mathematical/scientific behaviour of an environment.
 * Simulations are pure TypeScript with no rendering dependencies so they can be unit
 * tested against analytic results and reused across worlds.
 */

export interface Measurement {
  id: string;
  label: string;
  value: number;
  /** SI unit symbol for display; conversion for display happens in the UI. */
  unit: string;
  /** Optional LaTeX of the relationship that produced this value. */
  formula?: string;
  /** Marks values computed analytically (closed form) vs read from the numerical state. */
  source: 'analytic' | 'numerical';
}

export interface Simulation<State, Params> {
  readonly id: string;
  readonly params: Readonly<Params>;
  /** Advance the model by `dt` seconds of simulated time. */
  step(dt: number): void;
  reset(params?: Partial<Params>): void;
  snapshot(): Readonly<State>;
  measurements(): Measurement[];
  /** Human-readable list of modelling assumptions shown to learners. */
  assumptions(): string[];
}
