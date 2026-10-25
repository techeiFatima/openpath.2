import type { RiemannMethod, Transform } from '../model/functions';
import { fromExpression, fromPolynomial, type PlotFunction } from '../model/functions';
import { Polynomial } from '../model/polynomial';

export type Mode = 'graph' | 'transform' | 'secant' | 'riemann';

export const FUNCTIONS: Record<string, PlotFunction> = {
  'line-2x+1': fromPolynomial('line-2x+1', Polynomial.of(1, 2)),
  'line-taxi': fromPolynomial('line-taxi', Polynomial.of(3, 2), 'fare = 2·km + 3'),
  'line-neg': fromPolynomial('line-neg', Polynomial.of(3, -0.5)),
  'parabola': fromPolynomial('parabola', Polynomial.of(0, 0, 1)),
  'quad-roots': fromPolynomial('quad-roots', Polynomial.of(2, -3, 1)),
  'quad-down': fromPolynomial('quad-down', Polynomial.of(1, 20, -5), 'h(t) = −5t² + 20t + 1'),
  'cubic': fromPolynomial('cubic', Polynomial.of(0, -3, 0, 1)),
  'quartic': fromPolynomial('quartic', Polynomial.of(2, 0, -5, 0, 1)),
  'sine': fromExpression('sine', 'sin(x)', '\\sin x'),
};

export interface MathPreset {
  id: string;
  label: string;
  mode: Mode;
  functionId: string;
  a?: number;
  h?: number;
  n?: number;
  interval?: [number, number];
  method?: RiemannMethod;
  transform?: Transform;
  view?: { xMin: number; xMax: number; yMin: number; yMax: number };
  description: string;
}

const V = (xMin: number, xMax: number, yMin: number, yMax: number) => ({ xMin, xMax, yMin, yMax });

export const PRESETS: Record<string, MathPreset> = {
  'graph:linear': { id: 'graph:linear', label: 'A straight line', mode: 'graph', functionId: 'line-2x+1', a: 1, h: 1, view: V(-5, 5, -5, 8), description: 'y = 2x + 1. Drag the point; watch the rate of change.' },
  'graph:taxi': { id: 'graph:taxi', label: 'Taxi fare', mode: 'graph', functionId: 'line-taxi', a: 2, h: 1, view: V(-1, 8, -1, 20), description: 'fare = 3 + 2 per km.' },
  'graph:quadratic': { id: 'graph:quadratic', label: 'A parabola with roots', mode: 'graph', functionId: 'quad-roots', a: 1.5, h: 1, view: V(-3, 5, -2, 8), description: 'y = x² − 3x + 2.' },
  'transform:parabola': { id: 'transform:parabola', label: 'Transform y = x²', mode: 'transform', functionId: 'parabola', transform: { a: 1, b: 1, h: 0, k: 0 }, view: V(-6, 6, -4, 10), description: 'y = a(x − h)² + k with b inside.' },
  'transform:right3': { id: 'transform:right3', label: 'Shift right by 3', mode: 'transform', functionId: 'parabola', transform: { a: 1, b: 1, h: 3, k: 0 }, view: V(-6, 8, -4, 10), description: 'y = (x − 3)².' },
  'secant:parabola': { id: 'secant:parabola', label: 'Secant on y = x²', mode: 'secant', functionId: 'parabola', a: 3, h: 1, view: V(-1, 6, -2, 20), description: 'Shrink h and watch the secant become the tangent.' },
  'secant:cubic': { id: 'secant:cubic', label: 'Tangent on y = x³ − 3x', mode: 'secant', functionId: 'cubic', a: 2, h: 0.5, view: V(-3, 3, -5, 6), description: 'Move the point to where the tangent is flat.' },
  'riemann:parabola': { id: 'riemann:parabola', label: 'Area under y = x²', mode: 'riemann', functionId: 'parabola', interval: [0, 3], n: 6, method: 'left', view: V(-0.5, 3.5, -1, 10), description: 'Rectangles under the curve from 0 to 3.' },
  'riemann:velocity': { id: 'riemann:velocity', label: 'Distance from velocity', mode: 'riemann', functionId: 'parabola', interval: [0, 2], n: 4, method: 'midpoint', view: V(-0.5, 2.5, -0.5, 5), description: 'Area under v(t) = t² is distance travelled.' },
  'free': { id: 'free', label: 'Free exploration', mode: 'secant', functionId: 'sine', a: 1, h: 0.5, view: V(-7, 7, -3, 3), description: 'Any function, any tool.' },
};

export const DEFAULT_PRESET_ID = 'graph:linear';
