import { useCallback, useMemo, useRef } from 'react';
import { numericalDerivative, riemannSum, secantSlope } from '../model/functions';
import { currentFunction } from './readouts';
import { useMathUi, type View } from './store';

const W = 800;
const H = 520;
const SAMPLES = 400;

/** Choose a "nice" tick step for an axis span. */
function niceStep(span: number): number {
  const raw = span / 8;
  const pow = Math.pow(10, Math.floor(Math.log10(raw)));
  const m = raw / pow;
  return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * pow;
}

/**
 * SVG graph: axes, curve, movable point, secant/tangent lines, Riemann rectangles.
 * It only draws what the model computes; no mathematics happens here beyond
 * coordinate mapping.
 */
export function Graph() {
  const s = useMathUi();
  const set = useMathUi((st) => st.set);
  const fn = useMemo(() => currentFunction(s), [s.mode, s.functionId, s.transform]); // eslint-disable-line react-hooks/exhaustive-deps
  const { view } = s;
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<{ kind: 'point' | 'pan'; startX: number; startY: number; view: View } | null>(null);

  const sx = useCallback((x: number) => ((x - view.xMin) / (view.xMax - view.xMin)) * W, [view]);
  const sy = useCallback((y: number) => H - ((y - view.yMin) / (view.yMax - view.yMin)) * H, [view]);
  const ux = useCallback((px: number) => view.xMin + (px / W) * (view.xMax - view.xMin), [view]);

  const path = useMemo(() => {
    let d = '';
    let pen = false;
    for (let i = 0; i <= SAMPLES; i++) {
      const x = view.xMin + ((view.xMax - view.xMin) * i) / SAMPLES;
      const y = fn.f(x);
      if (!Number.isFinite(y) || Math.abs(y) > 1e6) { pen = false; continue; }
      const px = sx(x);
      const py = sy(y);
      const clampedY = Math.max(-H, Math.min(2 * H, py));
      d += `${pen ? 'L' : 'M'}${px.toFixed(1)},${clampedY.toFixed(1)} `;
      pen = true;
    }
    return d;
  }, [fn, view, sx, sy]);

  const lineAcross = (x0: number, y0: number, m: number) => {
    const y1 = y0 + m * (view.xMin - x0);
    const y2 = y0 + m * (view.xMax - x0);
    return { x1: sx(view.xMin), y1: sy(y1), x2: sx(view.xMax), y2: sy(y2) };
  };

  const toSvg = (e: React.PointerEvent) => {
    const r = svgRef.current!.getBoundingClientRect();
    return { px: ((e.clientX - r.left) / r.width) * W, py: ((e.clientY - r.top) / r.height) * H };
  };

  const onPointerDown = (e: React.PointerEvent, kind: 'point' | 'pan') => {
    const { px, py } = toSvg(e);
    drag.current = { kind, startX: px, startY: py, view };
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    e.stopPropagation();
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const { px, py } = toSvg(e);
    if (d.kind === 'point') {
      const a = Math.round(ux(px) * 10) / 10;
      set({ a: Math.max(view.xMin, Math.min(view.xMax, a)) });
    } else {
      const dx = ((px - d.startX) / W) * (d.view.xMax - d.view.xMin);
      const dy = ((py - d.startY) / H) * (d.view.yMax - d.view.yMin);
      set({ view: { xMin: d.view.xMin - dx, xMax: d.view.xMax - dx, yMin: d.view.yMin + dy, yMax: d.view.yMax + dy } });
    }
  };
  const onPointerUp = () => { drag.current = null; };
  const onWheel = (e: React.WheelEvent) => {
    const k = e.deltaY > 0 ? 1.15 : 1 / 1.15;
    const cx = (view.xMin + view.xMax) / 2;
    const cy = (view.yMin + view.yMax) / 2;
    const hw = ((view.xMax - view.xMin) / 2) * k;
    const hh = ((view.yMax - view.yMin) / 2) * k;
    set({ view: { xMin: cx - hw, xMax: cx + hw, yMin: cy - hh, yMax: cy + hh } });
  };

  const xStep = niceStep(view.xMax - view.xMin);
  const yStep = niceStep(view.yMax - view.yMin);
  const xTicks: number[] = [];
  for (let x = Math.ceil(view.xMin / xStep) * xStep; x <= view.xMax; x += xStep) xTicks.push(Number(x.toFixed(10)));
  const yTicks: number[] = [];
  for (let y = Math.ceil(view.yMin / yStep) * yStep; y <= view.yMax; y += yStep) yTicks.push(Number(y.toFixed(10)));

  const showPoint = s.mode !== 'riemann';
  const fa = fn.f(s.a);
  const tangentSlope = fn.derivative ? fn.derivative.f(s.a) : numericalDerivative(fn.f, s.a);
  const secant = s.mode === 'secant' || s.mode === 'graph' ? lineAcross(s.a, fa, secantSlope(fn.f, s.a, s.h)) : null;
  const tangent = (s.mode === 'secant' && s.showTangent) ? lineAcross(s.a, fa, tangentSlope) : null;
  const rects = s.mode === 'riemann' ? riemannSum(fn.f, s.interval[0], s.interval[1], s.n, s.method).rectangles : [];

  return (
    <svg
      ref={svgRef}
      className="graph"
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-hidden="true"
      onPointerDown={(e) => onPointerDown(e, 'pan')}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onWheel={onWheel}
    >
      <rect width={W} height={H} fill="#070a14" />
      <g className="grid">
        {xTicks.map((x) => <line key={`gx${x}`} x1={sx(x)} x2={sx(x)} y1={0} y2={H} stroke="#182039" strokeWidth={1} />)}
        {yTicks.map((y) => <line key={`gy${y}`} x1={0} x2={W} y1={sy(y)} y2={sy(y)} stroke="#182039" strokeWidth={1} />)}
      </g>
      <g className="axes" stroke="#6f7897" strokeWidth={1.5}>
        <line x1={0} x2={W} y1={sy(0)} y2={sy(0)} />
        <line x1={sx(0)} x2={sx(0)} y1={0} y2={H} />
      </g>
      <g className="ticks" fill="#a4adc8" fontSize={12} fontFamily="ui-monospace, monospace">
        {xTicks.filter((x) => x !== 0).map((x) => <text key={`tx${x}`} x={sx(x)} y={Math.min(H - 4, Math.max(14, sy(0) + 16))} textAnchor="middle">{Number(x.toPrecision(3))}</text>)}
        {yTicks.filter((y) => y !== 0).map((y) => <text key={`ty${y}`} x={Math.min(W - 4, Math.max(28, sx(0) - 8))} y={sy(y) + 4} textAnchor="end">{Number(y.toPrecision(3))}</text>)}
      </g>
      {rects.map((r, i) => (
        <rect key={i} x={sx(r.x0)} y={Math.min(sy(r.height), sy(0))} width={sx(r.x1) - sx(r.x0)} height={Math.abs(sy(r.height) - sy(0))} fill="rgba(143,211,255,0.25)" stroke="#8fd3ff" strokeWidth={1} />
      ))}
      <path d={path} fill="none" stroke="#ffd27a" strokeWidth={2.5} />
      {secant && <line {...secant} stroke="#6fe3a5" strokeWidth={1.5} strokeDasharray={s.mode === 'graph' ? undefined : '6 4'} />}
      {tangent && <line {...tangent} stroke="#ff9f6b" strokeWidth={2} />}
      {showPoint && (
        <g>
          {(s.mode === 'secant' || s.mode === 'graph') && <circle cx={sx(s.a + s.h)} cy={sy(fn.f(s.a + s.h))} r={5} fill="#6fe3a5" />}
          <circle
            cx={sx(s.a)}
            cy={sy(fa)}
            r={9}
            fill="#8fd3ff"
            stroke="#fff"
            strokeWidth={2}
            style={{ cursor: 'ew-resize' }}
            onPointerDown={(e) => onPointerDown(e, 'point')}
          />
        </g>
      )}
    </svg>
  );
}
