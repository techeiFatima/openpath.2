/**
 * A small, dependency-free expression evaluator used to grade algebraic answers by
 * numeric sampling. This is NOT a symbolic engine: it decides equivalence by evaluating
 * both expressions at many random points inside a declared domain. That is reliable
 * for the elementary expressions used in the first worlds (powers, roots, rational
 * forms) and is documented as a stop-gap until a SymPy-backed service exists
 * (see docs/06-problem-engine.md).
 */

export type Token =
  | { t: 'num'; v: number }
  | { t: 'id'; v: string }
  | { t: 'op'; v: '+' | '-' | '*' | '/' | '^' | 'neg' }
  | { t: 'lparen' }
  | { t: 'rparen' }
  | { t: 'comma' };

const FUNCTIONS: Record<string, (...a: number[]) => number> = {
  sqrt: Math.sqrt,
  cbrt: Math.cbrt,
  abs: Math.abs,
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  exp: Math.exp,
  ln: Math.log,
  log: Math.log10,
  log10: Math.log10,
};
const CONSTANTS: Record<string, number> = { pi: Math.PI, π: Math.PI, e: Math.E };

export class ExpressionError extends Error {}

export function tokenize(src: string, variables: string[]): Token[] {
  const s = src.replace(/\s+/g, '').replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').replace(/√/g, 'sqrt');
  const tokens: Token[] = [];
  let i = 0;
  const known = new Set([...variables, ...Object.keys(FUNCTIONS), ...Object.keys(CONSTANTS)]);
  while (i < s.length) {
    const c = s[i]!;
    if (/[0-9.]/.test(c)) {
      const m = /^(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?/.exec(s.slice(i));
      if (!m) throw new ExpressionError(`Bad number at ${i}`);
      tokens.push({ t: 'num', v: Number(m[0]) });
      i += m[0].length;
      continue;
    }
    if (/[A-Za-zπ_]/.test(c)) {
      const m = /^[A-Za-zπ_][A-Za-z0-9_π]*/.exec(s.slice(i))!;
      const word = m[0];
      i += word.length;
      if (known.has(word)) {
        tokens.push({ t: 'id', v: word });
        continue;
      }
      // Split a run like "GM" into known single-character symbols: G * M.
      const parts = [...word];
      if (parts.every((p) => known.has(p))) {
        parts.forEach((p, k) => {
          if (k > 0) tokens.push({ t: 'op', v: '*' });
          tokens.push({ t: 'id', v: p });
        });
        continue;
      }
      throw new ExpressionError(`Unknown symbol "${word}"`);
    }
    if (c === '(') tokens.push({ t: 'lparen' });
    else if (c === ')') tokens.push({ t: 'rparen' });
    else if (c === ',') tokens.push({ t: 'comma' });
    else if ('+-*/^'.includes(c)) tokens.push({ t: 'op', v: c as '+' | '-' | '*' | '/' | '^' });
    else throw new ExpressionError(`Unexpected character "${c}"`);
    i++;
  }
  return insertImplicitMultiplication(markUnaryMinus(tokens));
}

function markUnaryMinus(tokens: Token[]): Token[] {
  return tokens.map((tok, i) => {
    if (tok.t === 'op' && tok.v === '-') {
      const prev = tokens[i - 1];
      if (!prev || prev.t === 'op' || prev.t === 'lparen' || prev.t === 'comma') return { t: 'op', v: 'neg' } as Token;
    }
    return tok;
  });
}

function insertImplicitMultiplication(tokens: Token[]): Token[] {
  const out: Token[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i]!;
    const prev = out[out.length - 1];
    if (prev) {
      const prevEndsValue = prev.t === 'num' || prev.t === 'rparen' || (prev.t === 'id' && !(prev.v in FUNCTIONS));
      const startsValue = tok.t === 'num' || tok.t === 'id' || tok.t === 'lparen';
      if (prevEndsValue && startsValue) out.push({ t: 'op', v: '*' });
    }
    out.push(tok);
  }
  return out;
}

type RpnItem = Token | { t: 'call'; v: string };

const PRECEDENCE: Record<string, number> = { '+': 1, '-': 1, '*': 2, '/': 2, neg: 3, '^': 4 };
const RIGHT_ASSOC = new Set(['^', 'neg']);

export function toRpn(tokens: Token[]): RpnItem[] {
  const out: RpnItem[] = [];
  const stack: Token[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i]!;
    switch (tok.t) {
      case 'num':
        out.push(tok);
        break;
      case 'id':
        if (tok.v in FUNCTIONS && tokens[i + 1]?.t === 'lparen') stack.push(tok);
        else out.push(tok);
        break;
      case 'comma':
        while (stack.length && stack[stack.length - 1]!.t !== 'lparen') out.push(stack.pop()!);
        if (!stack.length) throw new ExpressionError('Misplaced comma');
        break;
      case 'op': {
        while (stack.length) {
          const top = stack[stack.length - 1]!;
          if (top.t !== 'op') break;
          const pTop = PRECEDENCE[top.v]!;
          const pTok = PRECEDENCE[tok.v]!;
          if (pTop > pTok || (pTop === pTok && !RIGHT_ASSOC.has(tok.v))) out.push(stack.pop()!);
          else break;
        }
        stack.push(tok);
        break;
      }
      case 'lparen':
        stack.push(tok);
        break;
      case 'rparen': {
        while (stack.length && stack[stack.length - 1]!.t !== 'lparen') out.push(stack.pop()!);
        if (!stack.length) throw new ExpressionError('Unbalanced parentheses');
        stack.pop();
        const top = stack[stack.length - 1];
        if (top && top.t === 'id' && top.v in FUNCTIONS) {
          stack.pop();
          out.push({ t: 'call', v: top.v });
        }
        break;
      }
    }
  }
  while (stack.length) {
    const top = stack.pop()!;
    if (top.t === 'lparen') throw new ExpressionError('Unbalanced parentheses');
    out.push(top);
  }
  return out;
}

export interface CompiledExpression {
  source: string;
  variables: string[];
  evaluate(env: Record<string, number>): number;
}

export function compile(source: string, variables: string[]): CompiledExpression {
  if (!source.trim()) throw new ExpressionError('Empty expression');
  const rpn = toRpn(tokenize(source, variables));
  return {
    source,
    variables,
    evaluate(env) {
      const st: number[] = [];
      for (const item of rpn) {
        if (item.t === 'num') st.push(item.v);
        else if (item.t === 'id') {
          const v = env[item.v] ?? CONSTANTS[item.v];
          if (v === undefined) throw new ExpressionError(`Unbound symbol ${item.v}`);
          st.push(v);
        } else if (item.t === 'call') {
          const f = FUNCTIONS[item.v]!;
          const a = st.pop();
          if (a === undefined) throw new ExpressionError('Missing argument');
          st.push(f(a));
        } else if (item.t === 'op') {
          if (item.v === 'neg') {
            const a = st.pop();
            if (a === undefined) throw new ExpressionError('Missing operand');
            st.push(-a);
            continue;
          }
          const b = st.pop();
          const a = st.pop();
          if (a === undefined || b === undefined) throw new ExpressionError('Missing operand');
          switch (item.v) {
            case '+': st.push(a + b); break;
            case '-': st.push(a - b); break;
            case '*': st.push(a * b); break;
            case '/': st.push(a / b); break;
            case '^': st.push(Math.pow(a, b)); break;
          }
        } else throw new ExpressionError('Bad token');
      }
      if (st.length !== 1) throw new ExpressionError('Malformed expression');
      return st[0]!;
    },
  };
}

/** Deterministic PRNG (mulberry32) so equivalence checks are reproducible in tests. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface VariableDomain {
  name: string;
  min: number;
  max: number;
}

export interface EquivalenceResult {
  equivalent: boolean;
  /** Fraction of sample points where both expressions were finite. */
  definedFraction: number;
  /** Largest relative discrepancy seen on jointly-defined points. */
  maxRelativeError: number;
  reason?: string;
}

/**
 * Decide whether two expressions agree on a domain by sampling. Uses log-uniform
 * sampling when the domain spans orders of magnitude (typical for physical constants).
 */
export function areEquivalent(
  a: CompiledExpression,
  b: CompiledExpression,
  domains: VariableDomain[],
  opts: { samples?: number; relTol?: number; seed?: number } = {},
): EquivalenceResult {
  const samples = opts.samples ?? 60;
  const relTol = opts.relTol ?? 1e-6;
  const rnd = mulberry32(opts.seed ?? 20251025);
  let defined = 0;
  let maxErr = 0;
  for (let i = 0; i < samples; i++) {
    const env: Record<string, number> = {};
    for (const d of domains) {
      if (d.min > 0 && d.max / d.min > 100) {
        const lo = Math.log(d.min);
        const hi = Math.log(d.max);
        env[d.name] = Math.exp(lo + (hi - lo) * rnd());
      } else env[d.name] = d.min + (d.max - d.min) * rnd();
    }
    let va: number;
    let vb: number;
    try {
      va = a.evaluate(env);
      vb = b.evaluate(env);
    } catch (e) {
      return { equivalent: false, definedFraction: 0, maxRelativeError: Infinity, reason: (e as Error).message };
    }
    if (!Number.isFinite(va) || !Number.isFinite(vb)) continue;
    defined++;
    const scale = Math.max(Math.abs(va), Math.abs(vb), 1e-300);
    const err = Math.abs(va - vb) / scale;
    if (err > maxErr) maxErr = err;
  }
  const definedFraction = defined / samples;
  if (definedFraction < 0.8) {
    return { equivalent: false, definedFraction, maxRelativeError: maxErr, reason: 'Expression undefined on most of the domain' };
  }
  return { equivalent: maxErr <= relTol, definedFraction, maxRelativeError: maxErr };
}
