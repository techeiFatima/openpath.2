import { compile } from '@/core/assessment/expression';
import { Polynomial } from './polynomial';

/**
 * Function model used by the graph environment. Polynomials carry exact calculus;
 * other expressions fall back to numerical estimates that are labelled as such.
 */
export interface PlotFunction {
  id: string;
  label: string;
  latex: string;
  f(x: number): number;
  /** Exact derivative when available (polynomials). */
  derivative?: PlotFunction;
  polynomial?: Polynomial;
}

export function fromPolynomial(id: string, p: Polynomial, label?: string): PlotFunction {
  const d = p.derivative();
  const fn: PlotFunction = {
    id,
    label: label ?? `f(x) = ${p.toString()}`,
    latex: p.toLatex(),
    f: (x) => p.evaluate(x),
    polynomial: p,
  };
  fn.derivative = {
    id: `${id}'`,
    label: `f'(x) = ${d.toString()}`,
    latex: d.toLatex(),
    f: (x) => d.evaluate(x),
    polynomial: d,
  };
  return fn;
}

export function fromExpression(id: string, expr: string, latex = expr): PlotFunction {
  const c = compile(expr, ['x']);
  return { id, label: `f(x) = ${expr}`, latex, f: (x) => c.evaluate({ x }) };
}

/**
 * Transformation y = a·g(b(x − h)) + k of a base function g. For polynomial bases the
 * result stays an exact polynomial so derivatives and roots remain exact.
 */
export interface Transform {
  a: number;
  b: number;
  h: number;
  k: number;
}

export function transformPolynomial(base: Polynomial, t: Transform): Polynomial {
  // g(b(x − h)): substitute x → b x − b h. Compute via expansion of (b x − b h)^n.
  let result = Polynomial.of(0);
  let power = Polynomial.of(1);
  const inner = Polynomial.of(-t.b * t.h, t.b);
  for (const c of base.coeffs) {
    result = result.add(power.scale(c));
    power = power.multiply(inner);
  }
  return result.scale(t.a).add(Polynomial.of(t.k));
}

/** Average rate of change (secant slope) of f between a and a + h. */
export function secantSlope(f: (x: number) => number, a: number, h: number): number {
  return (f(a + h) - f(a)) / h;
}

/** Numerical derivative by central difference; used only when no exact derivative exists. */
export function numericalDerivative(f: (x: number) => number, a: number, h = 1e-5): number {
  return (f(a + h) - f(a - h)) / (2 * h);
}

export type RiemannMethod = 'left' | 'right' | 'midpoint' | 'trapezoid';

export interface RiemannResult {
  sum: number;
  rectangles: { x0: number; x1: number; height: number }[];
}

export function riemannSum(f: (x: number) => number, a: number, b: number, n: number, method: RiemannMethod): RiemannResult {
  const dx = (b - a) / n;
  const rectangles: RiemannResult['rectangles'] = [];
  let sum = 0;
  for (let i = 0; i < n; i++) {
    const x0 = a + i * dx;
    const x1 = x0 + dx;
    let height: number;
    switch (method) {
      case 'left': height = f(x0); break;
      case 'right': height = f(x1); break;
      case 'midpoint': height = f((x0 + x1) / 2); break;
      case 'trapezoid': height = (f(x0) + f(x1)) / 2; break;
    }
    rectangles.push({ x0, x1, height });
    sum += height * dx;
  }
  return { sum, rectangles };
}

/** Point-slope line through (a, f(a)) with slope m, as a function and as LaTeX. */
export function tangentLine(a: number, fa: number, m: number): { f(x: number): number; latex: string } {
  const sign = fa - m * a >= 0 ? '+' : '-';
  const c = Math.abs(fa - m * a);
  const r = (v: number) => Number(v.toPrecision(4));
  return { f: (x) => fa + m * (x - a), latex: `y = ${r(m)}x ${sign} ${r(c)}` };
}
