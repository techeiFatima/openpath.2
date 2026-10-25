import { FUNCTIONS, PRESETS } from './presets';
import { useMathUi } from './store';
import { fmt } from './readouts';

export function Controls() {
  const s = useMathUi();
  const set = s.set;
  const base = FUNCTIONS[s.functionId];
  return (
    <div className="controls">
      <label className="control">
        <span className="control-label">Setup</span>
        <select value={s.presetId} onChange={(e) => s.applyPreset(e.target.value)} aria-label="Load a preset">
          {Object.values(PRESETS).map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
        </select>
        <span className="control-hint">{PRESETS[s.presetId]?.description}</span>
      </label>
      <label className="control">
        <span className="control-label">Function</span>
        <select value={s.functionId} onChange={(e) => set({ functionId: e.target.value })}>
          {Object.values(FUNCTIONS).filter((f) => s.mode !== 'transform' || f.polynomial).map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
        </select>
      </label>
      <label className="control">
        <span className="control-label">Tool</span>
        <select value={s.mode} onChange={(e) => set({ mode: e.target.value as typeof s.mode })}>
          <option value="graph">Graph and point</option>
          <option value="secant">Secant and tangent</option>
          <option value="riemann">Area (Riemann sums)</option>
          <option value="transform" disabled={!base?.polynomial}>Transform a(x−h)+k</option>
        </select>
      </label>

      {(s.mode === 'graph' || s.mode === 'secant' || s.mode === 'transform') && (
        <label className="control">
          <span className="control-label">Point a <output>{fmt(s.a)}</output></span>
          <input type="range" min={s.view.xMin} max={s.view.xMax} step={0.1} value={s.a} onChange={(e) => set({ a: Number(e.target.value) })} />
        </label>
      )}
      {(s.mode === 'graph' || s.mode === 'secant') && (
        <label className="control">
          <span className="control-label">Step h <output>{fmt(s.h)}</output></span>
          <input type="range" min={0.01} max={2} step={0.01} value={s.h} onChange={(e) => set({ h: Number(e.target.value) })} />
          <span className="quick-set">
            {[1, 0.5, 0.1, 0.01].map((h) => <button key={h} type="button" className="chip" onClick={() => set({ h })}>h = {h}</button>)}
          </span>
        </label>
      )}
      {s.mode === 'secant' && (
        <label className="control-inline">
          <input type="checkbox" checked={s.showTangent} onChange={(e) => set({ showTangent: e.target.checked })} /> <span>Show the tangent line</span>
        </label>
      )}
      {s.mode === 'riemann' && (
        <>
          <label className="control">
            <span className="control-label">Rectangles n <output>{s.n}</output></span>
            <input type="range" min={1} max={200} step={1} value={s.n} onChange={(e) => set({ n: Number(e.target.value) })} />
          </label>
          <label className="control">
            <span className="control-label">Method</span>
            <select value={s.method} onChange={(e) => set({ method: e.target.value as typeof s.method })}>
              <option value="left">Left endpoints</option>
              <option value="right">Right endpoints</option>
              <option value="midpoint">Midpoints</option>
              <option value="trapezoid">Trapezoids</option>
            </select>
          </label>
          <div className="control-row">
            <label className="control-inline"><span>from</span><input type="number" step={0.5} value={s.interval[0]} onChange={(e) => set({ interval: [Number(e.target.value), s.interval[1]] })} /></label>
            <label className="control-inline"><span>to</span><input type="number" step={0.5} value={s.interval[1]} onChange={(e) => set({ interval: [s.interval[0], Number(e.target.value)] })} /></label>
          </div>
        </>
      )}
      {s.mode === 'transform' && (
        <>
          {(['a', 'b', 'h', 'k'] as const).map((key) => (
            <label key={key} className="control">
              <span className="control-label">{key === 'a' ? 'a (vertical stretch)' : key === 'b' ? 'b (horizontal squeeze)' : key === 'h' ? 'h (shift right)' : 'k (shift up)'} <output>{fmt(s.transform[key])}</output></span>
              <input type="range" min={key === 'b' ? 0.25 : -5} max={5} step={key === 'b' ? 0.25 : 0.5} value={s.transform[key]} onChange={(e) => set({ transform: { ...s.transform, [key]: Number(e.target.value) } })} />
            </label>
          ))}
        </>
      )}
      <span className="control-hint">Drag the empty graph to pan, scroll to zoom, drag the blue point to move a.</span>
    </div>
  );
}
