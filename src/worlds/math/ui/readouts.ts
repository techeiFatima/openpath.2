import type { Measurement } from '@/core/simulation/types';
import { numericalDerivative, riemannSum, secantSlope, tangentLine, transformPolynomial, type PlotFunction } from '../model/functions';
import { fromPolynomial } from '../model/functions';
import { FUNCTIONS, type Mode } from './presets';
import type { useMathUi } from './store';

type UiState = ReturnType<typeof useMathUi.getState>;

/** The function currently on screen (transform mode builds it from the sliders). */
export function currentFunction(s: Pick<UiState, 'mode' | 'functionId' | 'transform'>): PlotFunction {
  const base = FUNCTIONS[s.functionId] ?? FUNCTIONS.parabola!;
  if (s.mode === 'transform' && base.polynomial) {
    const p = transformPolynomial(base.polynomial, s.transform);
    return fromPolynomial(`${base.id}-t`, p, `y = ${p.toString()}`);
  }
  return base;
}

const M = (id: string, label: string, value: number, unit = '', source: Measurement['source'] = 'analytic', formula?: string): Measurement =>
  ({ id, label, value, unit, source, ...(formula ? { formula } : {}) });

/** Readouts shown in the panel and handed to the instructor. Everything here is computed by the model. */
export function computeReadouts(s: UiState): Measurement[] {
  const fn = currentFunction(s);
  const out: Measurement[] = [];
  const mode: Mode = s.mode;
  if (mode === 'graph' || mode === 'secant' || mode === 'transform') {
    out.push(M('fa', `f(${fmt(s.a)})`, fn.f(s.a)));
  }
  if (mode === 'graph' || mode === 'secant') {
    out.push(M('fah', `f(${fmt(s.a + s.h)})`, fn.f(s.a + s.h)));
    out.push(M('secant', `Average rate of change from ${fmt(s.a)} to ${fmt(s.a + s.h)}`, secantSlope(fn.f, s.a, s.h), '', 'analytic', '\\frac{f(a+h)-f(a)}{h}'));
  }
  if (mode === 'secant' || mode === 'graph') {
    const exact = fn.derivative;
    const slope = exact ? exact.f(s.a) : numericalDerivative(fn.f, s.a);
    out.push(M('tangent', exact ? `Tangent slope at ${fmt(s.a)} (exact)` : `Tangent slope at ${fmt(s.a)} (numerical estimate)`, slope, '', exact ? 'analytic' : 'numerical', exact ? `f'(x) = ${exact.latex}` : undefined));
    out.push(M('gap', 'Secant slope − tangent slope', secantSlope(fn.f, s.a, s.h) - slope));
    const t = tangentLine(s.a, fn.f(s.a), slope);
    out.push(M('tangent-line', `Tangent line: ${t.latex.replace('y = ', '')}`, slope, '', 'analytic', t.latex));
  }
  if (fn.polynomial && fn.polynomial.degree === 2) {
    const v = fn.polynomial.vertex()!;
    out.push(M('vertex-x', 'Vertex x', v.x));
    out.push(M('vertex-y', 'Vertex y', v.y));
    const roots = fn.polynomial.realRoots();
    roots.forEach((r, i) => out.push(M(`root-${i}`, `x-intercept ${i + 1}`, r)));
    if (roots.length === 0) out.push(M('roots', 'x-intercepts', NaN));
  }
  if (fn.polynomial && fn.polynomial.degree === 1) {
    out.push(M('slope', 'Slope m', fn.polynomial.coeffs[1] ?? 0));
    out.push(M('intercept', 'y-intercept b', fn.polynomial.coeffs[0] ?? 0));
  }
  if (mode === 'riemann') {
    const [a, b] = s.interval;
    const r = riemannSum(fn.f, a, b, s.n, s.method);
    out.push(M('riemann', `${s.method} sum with n = ${s.n}`, r.sum, '', 'numerical', '\\sum f(x_i)\\,\\Delta x'));
    if (fn.polynomial) {
      const exact = fn.polynomial.integrate(a, b);
      out.push(M('exact', `Exact ∫ from ${fmt(a)} to ${fmt(b)}`, exact, '', 'analytic', `F(x) = ${fn.polynomial.antiderivative().toLatex()}`));
      out.push(M('error', 'Estimate − exact', r.sum - exact));
    } else {
      out.push(M('fine', 'Midpoint sum with n = 2000 (reference)', riemannSum(fn.f, a, b, 2000, 'midpoint').sum, '', 'numerical'));
    }
    out.push(M('dx', 'Width of each piece Δx', (b - a) / s.n));
  }
  return out;
}

export function assumptions(): string[] {
  return [
    'Curves are drawn from 400 sample points; very steep features between samples may be smoothed.',
    'Tangent slopes and areas are exact for polynomial functions; for other functions they are numerical estimates and labelled as such.',
    'The graph window can be zoomed and panned; zooming does not change any value.',
  ];
}

export const fmt = (v: number): string => (Number.isInteger(v) ? String(v) : String(Number(v.toPrecision(4))));
