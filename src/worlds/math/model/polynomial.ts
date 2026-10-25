/**
 * Exact polynomial arithmetic for the Functions & Calculus world. Coefficients are
 * stored lowest degree first: [c0, c1, c2] = c0 + c1 x + c2 x². Derivatives and
 * antiderivatives are exact, so the renderer's "tangent" and "area" readouts are
 * computed, not estimated, for every polynomial lesson function.
 */
export class Polynomial {
  readonly coeffs: readonly number[];

  constructor(coeffs: readonly number[]) {
    let end = coeffs.length;
    while (end > 1 && coeffs[end - 1] === 0) end--;
    this.coeffs = coeffs.slice(0, end);
  }

  static of(...coeffs: number[]): Polynomial {
    return new Polynomial(coeffs);
  }

  get degree(): number {
    return this.coeffs.length - 1;
  }

  evaluate(x: number): number {
    // Horner's rule
    let acc = 0;
    for (let i = this.coeffs.length - 1; i >= 0; i--) acc = acc * x + this.coeffs[i]!;
    return acc;
  }

  derivative(): Polynomial {
    if (this.coeffs.length <= 1) return Polynomial.of(0);
    return new Polynomial(this.coeffs.slice(1).map((c, i) => c * (i + 1)));
  }

  /** Antiderivative with constant term `C`. */
  antiderivative(C = 0): Polynomial {
    return new Polynomial([C, ...this.coeffs.map((c, i) => c / (i + 1))]);
  }

  /** Exact definite integral on [a, b]. */
  integrate(a: number, b: number): number {
    const F = this.antiderivative();
    return F.evaluate(b) - F.evaluate(a);
  }

  add(other: Polynomial): Polynomial {
    const n = Math.max(this.coeffs.length, other.coeffs.length);
    return new Polynomial(Array.from({ length: n }, (_, i) => (this.coeffs[i] ?? 0) + (other.coeffs[i] ?? 0)));
  }

  scale(k: number): Polynomial {
    return new Polynomial(this.coeffs.map((c) => c * k));
  }

  /** p(x − h): horizontal shift by h. */
  shiftX(h: number): Polynomial {
    // Expand via repeated composition with (x - h) using binomial expansion.
    let result = Polynomial.of(0);
    let power = Polynomial.of(1);
    const xMinusH = Polynomial.of(-h, 1);
    for (const c of this.coeffs) {
      result = result.add(power.scale(c));
      power = power.multiply(xMinusH);
    }
    return result;
  }

  multiply(other: Polynomial): Polynomial {
    const out = new Array<number>(this.coeffs.length + other.coeffs.length - 1).fill(0);
    this.coeffs.forEach((a, i) => other.coeffs.forEach((b, j) => { out[i + j]! += a * b; }));
    return new Polynomial(out);
  }

  /** Real roots for degree ≤ 2 (exact formulas); empty array otherwise. */
  realRoots(): number[] {
    const [c0 = 0, c1 = 0, c2 = 0] = this.coeffs;
    if (this.degree === 1) return [-c0 / c1];
    if (this.degree === 2) {
      const disc = c1 * c1 - 4 * c2 * c0;
      if (disc < 0) return [];
      if (disc === 0) return [-c1 / (2 * c2)];
      const s = Math.sqrt(disc);
      return [(-c1 - s) / (2 * c2), (-c1 + s) / (2 * c2)].sort((a, b) => a - b);
    }
    if (this.degree === 0) return [];
    return [];
  }

  /** Vertex (x, y) of a quadratic. */
  vertex(): { x: number; y: number } | null {
    if (this.degree !== 2) return null;
    const x = -this.coeffs[1]! / (2 * this.coeffs[2]!);
    return { x, y: this.evaluate(x) };
  }

  /** Expression string usable by the expression grader and KaTeX, e.g. "3x^2 - 2x + 1". */
  toString(variable = 'x'): string {
    const terms: string[] = [];
    for (let i = this.coeffs.length - 1; i >= 0; i--) {
      const c = this.coeffs[i]!;
      if (c === 0 && this.coeffs.length > 1) continue;
      const abs = Math.abs(c);
      const coef = i === 0 || abs !== 1 ? fmt(abs) : '';
      const v = i === 0 ? '' : i === 1 ? variable : `${variable}^${i}`;
      const sign = c < 0 ? '-' : '+';
      terms.push(`${sign}${coef}${v}`);
    }
    if (terms.length === 0) return '0';
    let s = terms.join(' ');
    s = s.startsWith('+') ? s.slice(1) : `-${s.slice(1)}`;
    return s.replace(/ \+/g, ' + ').replace(/ -/g, ' - ');
  }

  toLatex(variable = 'x'): string {
    return this.toString(variable).replace(/\^(\d+)/g, '^{$1}');
  }
}

function fmt(n: number): string {
  return Number.isInteger(n) ? String(n) : String(Number(n.toPrecision(6)));
}
