import { describe, expect, it } from 'vitest';
import { fromExpression, fromPolynomial, numericalDerivative, riemannSum, secantSlope, transformPolynomial } from './functions';
import { Polynomial } from './polynomial';

describe('Polynomial', () => {
  const p = Polynomial.of(1, -2, 3); // 1 − 2x + 3x²
  it('evaluates with Horner and prints readable strings', () => {
    expect(p.evaluate(2)).toBe(9);
    expect(p.toString()).toBe('3x^2 - 2x + 1');
    expect(Polynomial.of(0, 1).toString()).toBe('x');
    expect(Polynomial.of(0, 0, -1).toString()).toBe('-x^2');
    expect(Polynomial.of(0, 0, 1).toLatex()).toBe('x^{2}');
  });
  it('differentiates and integrates exactly', () => {
    expect(p.derivative().coeffs).toEqual([-2, 6]);
    expect(Polynomial.of(0, 0, 1).integrate(0, 3)).toBeCloseTo(9, 12);
    expect(Polynomial.of(0, 0, 1).antiderivative().coeffs).toEqual([0, 0, 0, 1 / 3]);
    expect(Polynomial.of(5).derivative().coeffs).toEqual([0]);
  });
  it('finds quadratic roots and vertex', () => {
    const q = Polynomial.of(2, -3, 1); // x² − 3x + 2
    expect(q.realRoots()).toEqual([1, 2]);
    expect(q.vertex()).toEqual({ x: 1.5, y: -0.25 });
    expect(Polynomial.of(1, 0, 1).realRoots()).toEqual([]);
    expect(Polynomial.of(-4, 2).realRoots()).toEqual([2]);
  });
  it('shifts and multiplies', () => {
    const s = Polynomial.of(0, 0, 1).shiftX(2); // (x − 2)²
    expect(s.coeffs).toEqual([4, -4, 1]);
    expect(Polynomial.of(1, 1).multiply(Polynomial.of(-1, 1)).coeffs).toEqual([-1, 0, 1]);
  });
});

describe('function model', () => {
  it('exposes exact derivatives for polynomials', () => {
    const f = fromPolynomial('f', Polynomial.of(0, 0, 1));
    expect(f.derivative!.f(3)).toBe(6);
    expect(f.derivative!.latex).toBe('2x');
  });
  it('secant slopes approach the tangent slope as h → 0', () => {
    const f = (x: number) => x * x;
    const slopes = [1, 0.1, 0.01, 0.001].map((h) => secantSlope(f, 3, h));
    expect(slopes[0]).toBe(7);
    expect(slopes.map((s) => Math.abs(s - 6))).toEqual(slopes.map((s) => Math.abs(s - 6)).sort((a, b) => b - a));
    expect(slopes[3]).toBeCloseTo(6, 2);
  });
  it('numerical derivative matches exact derivative for non-polynomials', () => {
    const g = fromExpression('g', 'sin(x)');
    expect(numericalDerivative(g.f, 0)).toBeCloseTo(1, 6);
  });
  it('Riemann sums converge to the exact integral and bracket it for monotone f', () => {
    const f = (x: number) => x * x;
    const exact = Polynomial.of(0, 0, 1).integrate(0, 3);
    const left = riemannSum(f, 0, 3, 6, 'left').sum;
    const right = riemannSum(f, 0, 3, 6, 'right').sum;
    expect(left).toBeLessThan(exact);
    expect(right).toBeGreaterThan(exact);
    expect(Math.abs(riemannSum(f, 0, 3, 1000, 'midpoint').sum - exact)).toBeLessThan(1e-4);
    expect(riemannSum(f, 0, 3, 6, 'left').rectangles).toHaveLength(6);
  });
  it('transforms polynomials exactly: 2(x − 1)² + 3', () => {
    const t = transformPolynomial(Polynomial.of(0, 0, 1), { a: 2, b: 1, h: 1, k: 3 });
    expect(t.coeffs).toEqual([5, -4, 2]);
    expect(t.vertex()).toEqual({ x: 1, y: 3 });
    const r = transformPolynomial(Polynomial.of(0, 0, 1), { a: 1, b: 2, h: 0, k: 0 }); // (2x)² = 4x²
    expect(r.coeffs).toEqual([0, 0, 4]);
  });
});
