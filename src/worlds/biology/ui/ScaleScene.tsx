import { formatLength, MICROSCOPE_LABELS, microscopeFor, niceScaleBar, objectsInView, SCALE_OBJECTS_BY_ID, type ScaleObject } from '../model/scale';

/**
 * 2D SVG renderer for the scale explorer. Only maps metres to pixels: the field of view
 * `fov` is the HEIGHT of the drawing in metres (VIEW_H pixels). Purely decorative for
 * assistive tech (aria-hidden); the readout panel carries the same facts as text.
 */
const VIEW_W = 800;
const VIEW_H = 600;
const BASELINE = 400;

interface Props { fov: number; selectedId: string }

export function ScaleScene({ fov, selectedId }: Props) {
  const pxPerM = VIEW_H / fov;
  const visible = objectsInView(fov);
  const widths = visible.map((o) => footprint(o, o.size * pxPerM));
  const total = widths.reduce((a, b) => a + b, 0);
  const gap = Math.max(0, (VIEW_W - 40 - total) / (visible.length + 1));
  let x = 20 + gap;
  const placed = visible.map((o, i) => {
    const w = widths[i]!;
    const cx = x + w / 2;
    x += w + gap;
    return { o, cx, px: o.size * pxPerM };
  });
  const bar = niceScaleBar(fov * 0.35);
  const barPx = bar * pxPerM;
  const sel = SCALE_OBJECTS_BY_ID.get(selectedId);

  return (
    <svg className="bio-svg" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
      <rect x={0} y={0} width={VIEW_W} height={VIEW_H} className="bio-bg" />
      {placed.map(({ o, cx, px }, i) => (
        <g key={o.id} className={`bio-obj ${o.id === selectedId ? 'selected' : ''}`}>
          <Shape o={o} cx={cx} px={px} />
          <Label o={o} cx={cx} px={px} row={i % 2} />
        </g>
      ))}
      {placed.length === 0 && (
        <text x={VIEW_W / 2} y={VIEW_H / 2} textAnchor="middle" className="bio-empty">Nothing in the list is between {formatLength(fov / 400)} and {formatLength(fov)}. Keep zooming.</text>
      )}
      <g className="bio-scalebar" transform={`translate(24 ${VIEW_H - 40})`}>
        <line x1={0} y1={0} x2={barPx} y2={0} />
        <line x1={0} y1={-6} x2={0} y2={6} />
        <line x1={barPx} y1={-6} x2={barPx} y2={6} />
        <text x={barPx / 2} y={-10} textAnchor="middle">{formatLength(bar)}</text>
      </g>
      <text x={VIEW_W - 24} y={VIEW_H - 44} textAnchor="end" className="bio-fov">Field of view (height): {formatLength(fov)}</text>
      {sel && (
        <text x={VIEW_W - 24} y={VIEW_H - 22} textAnchor="end" className="bio-fov">
          {sel.name}: {MICROSCOPE_LABELS[microscopeFor(sel.size)].toLowerCase()} (rule of thumb)
        </text>
      )}
    </svg>
  );
}

/** Horizontal pixels an object occupies so items can be spaced without overlapping. */
function footprint(o: ScaleObject, px: number): number {
  switch (o.id) {
    case 'human': return Math.max(px * 0.35, 8);
    case 'hand': return Math.max(px * 0.55, 8);
    case 'dna': return Math.max(px, 8);
    default: return Math.max(px, 8);
  }
}

function Shape({ o, cx, px }: { o: ScaleObject; cx: number; px: number }) {
  const y = BASELINE;
  switch (o.id) {
    case 'human': {
      const head = px * 0.13;
      const top = y - px;
      return (
        <g className="fill-organism">
          <circle cx={cx} cy={top + head / 2} r={head / 2} />
          <rect x={cx - px * 0.1} y={top + head} width={px * 0.2} height={px * 0.42} rx={px * 0.04} />
          <rect x={cx - px * 0.17} y={top + head * 1.1} width={px * 0.06} height={px * 0.4} rx={px * 0.03} />
          <rect x={cx + px * 0.11} y={top + head * 1.1} width={px * 0.06} height={px * 0.4} rx={px * 0.03} />
          <rect x={cx - px * 0.1} y={top + head + px * 0.42} width={px * 0.085} height={px * 0.45} rx={px * 0.03} />
          <rect x={cx + px * 0.015} y={top + head + px * 0.42} width={px * 0.085} height={px * 0.45} rx={px * 0.03} />
        </g>
      );
    }
    case 'hand': {
      const top = y - px;
      const palmH = px * 0.5;
      const fingerH = px * 0.5;
      return (
        <g className="fill-organism">
          <rect x={cx - px * 0.22} y={top + fingerH} width={px * 0.44} height={palmH} rx={px * 0.08} />
          {[-0.19, -0.08, 0.03, 0.14].map((dx, i) => (
            <rect key={i} x={cx + dx * px} y={top + fingerH * (i === 0 || i === 3 ? 0.18 : 0)} width={px * 0.08} height={fingerH * (i === 0 || i === 3 ? 0.9 : 1.08)} rx={px * 0.04} />
          ))}
          <rect x={cx + px * 0.24} y={top + fingerH * 0.75} width={px * 0.09} height={px * 0.33} rx={px * 0.045} transform={`rotate(-25 ${cx + px * 0.28} ${top + fingerH})`} />
        </g>
      );
    }
    case 'ant': {
      const h = px * 0.3;
      const cy = y - h / 2;
      return (
        <g className="fill-organism">
          <ellipse cx={cx - px * 0.33} cy={cy} rx={px * 0.17} ry={h * 0.42} />
          <ellipse cx={cx - px * 0.05} cy={cy} rx={px * 0.12} ry={h * 0.34} />
          <ellipse cx={cx + px * 0.28} cy={cy} rx={px * 0.22} ry={h * 0.5} />
          {[-0.2, -0.05, 0.1].map((dx, i) => (
            <line key={i} x1={cx + dx * px} y1={cy} x2={cx + (dx + 0.08) * px} y2={cy + h * 0.9} className="stroke-organism" />
          ))}
        </g>
      );
    }
    case 'egg-cell':
    case 'cheek-cell': {
      const r = px / 2;
      const cy = y - r;
      return (
        <g className="fill-cell">
          <ellipse cx={cx} cy={cy} rx={r} ry={o.id === 'cheek-cell' ? r * 0.85 : r} />
          <circle cx={cx + r * 0.1} cy={cy - r * 0.05} r={r * (o.id === 'cheek-cell' ? 0.22 : 0.3)} className="fill-nucleus" />
        </g>
      );
    }
    case 'red-blood-cell': {
      const r = px / 2;
      const cy = y - r;
      return (
        <g className="fill-rbc">
          <circle cx={cx} cy={cy} r={r} />
          <circle cx={cx} cy={cy} r={r * 0.45} className="fill-rbc-dimple" />
        </g>
      );
    }
    case 'e-coli':
    case 'mitochondrion': {
      const h = o.id === 'e-coli' ? px * 0.25 : px * 0.45;
      const top = y - h;
      return (
        <g className={o.id === 'e-coli' ? 'fill-cell' : 'fill-organelle'}>
          <rect x={cx - px / 2} y={top} width={px} height={h} rx={h / 2} />
          {o.id === 'mitochondrion' && [0.25, 0.42, 0.58, 0.75].map((f, i) => (
            <path key={i} d={`M ${cx - px / 2 + f * px} ${top + h * 0.15} q ${h * 0.25} ${h * 0.35} 0 ${h * 0.7}`} className="stroke-cristae" />
          ))}
          {o.id === 'e-coli' && <line x1={cx + px / 2} y1={top + h / 2} x2={cx + px * 0.75} y2={top - h * 0.6} className="stroke-flagellum" />}
        </g>
      );
    }
    case 'influenza': {
      const r = px / 2;
      const cy = y - r;
      const spikes = 18;
      return (
        <g className="fill-virus">
          {Array.from({ length: spikes }, (_, i) => {
            const a = (i / spikes) * 2 * Math.PI;
            return <line key={i} x1={cx + Math.cos(a) * r * 0.82} y1={cy + Math.sin(a) * r * 0.82} x2={cx + Math.cos(a) * r} y2={cy + Math.sin(a) * r} className="stroke-virus" />;
          })}
          <circle cx={cx} cy={cy} r={r * 0.82} />
        </g>
      );
    }
    case 'ribosome': {
      const r = px / 2;
      const cy = y - r;
      return (
        <g className="fill-organelle">
          <ellipse cx={cx} cy={cy + r * 0.25} rx={r} ry={r * 0.7} />
          <ellipse cx={cx} cy={cy - r * 0.45} rx={r * 0.75} ry={r * 0.5} />
        </g>
      );
    }
    case 'dna': {
      // One helical turn (≈ 3.4 nm) is 1.7 × the 2 nm width.
      const w = px;
      const h = px * 1.7;
      const top = y - h;
      const wave = (phase: number) => {
        let d = '';
        for (let i = 0; i <= 24; i++) {
          const t = i / 24;
          const xx = cx + (w / 2) * Math.sin(2 * Math.PI * t + phase);
          const yy = top + t * h;
          d += `${i === 0 ? 'M' : 'L'} ${xx} ${yy} `;
        }
        return d;
      };
      return (
        <g>
          {Array.from({ length: 10 }, (_, i) => {
            const t = (i + 0.5) / 10;
            const x1 = cx + (w / 2) * Math.sin(2 * Math.PI * t);
            const x2 = cx + (w / 2) * Math.sin(2 * Math.PI * t + Math.PI);
            return <line key={i} x1={x1} y1={top + t * h} x2={x2} y2={top + t * h} className="stroke-basepair" />;
          })}
          <path d={wave(0)} className="stroke-helix" />
          <path d={wave(Math.PI)} className="stroke-helix" />
        </g>
      );
    }
    case 'glucose': {
      const r = px / 2;
      const cy = y - r;
      const pts = Array.from({ length: 6 }, (_, i) => {
        const a = (i / 6) * 2 * Math.PI + Math.PI / 6;
        return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
      }).join(' ');
      return <polygon points={pts} className="stroke-molecule" />;
    }
    case 'water': {
      const rO = px * 0.3;
      const rH = px * 0.2;
      const cy = y - px * 0.5;
      return (
        <g>
          <circle cx={cx - px * 0.5 + rH} cy={cy + px * 0.12} r={rH} className="fill-hydrogen" />
          <circle cx={cx + px * 0.5 - rH} cy={cy + px * 0.12} r={rH} className="fill-hydrogen" />
          <circle cx={cx} cy={cy - px * 0.05} r={rO} className="fill-oxygen" />
        </g>
      );
    }
    case 'hydrogen': {
      const r = px / 2;
      return (
        <g>
          <circle cx={cx} cy={y - r} r={r} className="fill-electron-cloud" />
          <circle cx={cx} cy={y - r} r={Math.max(1.5, r * 0.04)} className="fill-nucleus" />
        </g>
      );
    }
    default:
      return <circle cx={cx} cy={y - px / 2} r={px / 2} className="fill-cell" />;
  }
}

function Label({ o, cx, px, row }: { o: ScaleObject; cx: number; px: number; row: number }) {
  const y = BASELINE + 28 + row * 40;
  return (
    <g className="bio-label">
      {px < 24 && <line x1={cx} y1={BASELINE - px / 2} x2={cx} y2={y - 14} className="stroke-leader" />}
      <text x={cx} y={y} textAnchor="middle">{o.name}</text>
      <text x={cx} y={y + 15} textAnchor="middle" className="bio-label-size">typical size {formatLength(o.size)}</text>
    </g>
  );
}
