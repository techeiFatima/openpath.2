import { cleanSequence, invalidDnaCharacters, type DnaBase, type MutationType } from '../model/dna';
import { formatLength, FOV_MAX_M, FOV_MIN_M, SCALE_OBJECTS } from '../model/scale';
import { PRESETS, type Panel } from './presets';
import { useBiologyUi } from './store';

const BASES: DnaBase[] = ['A', 'C', 'G', 'T'];
const LOG_MIN = Math.log10(FOV_MIN_M);
const LOG_MAX = Math.log10(FOV_MAX_M);

/** Native, labelled inputs for both panels. Also used unchanged in text mode. */
export function Controls() {
  const s = useBiologyUi();
  return (
    <div className="controls">
      <fieldset className="bio-panel-switch">
        <legend className="control-label">Environment</legend>
        {(['scale', 'dna'] as Panel[]).map((p) => (
          <label key={p} className="control-inline">
            <input type="radio" name="bio-panel" value={p} checked={s.panel === p} onChange={() => s.setPanel(p)} />
            <span>{p === 'scale' ? 'Scale explorer' : 'DNA workbench'}</span>
          </label>
        ))}
      </fieldset>

      {s.panel === 'scale' ? <ScaleControls /> : <DnaControls />}

      <label className="control">
        <span className="control-label">Setup</span>
        <select value={PRESETS[s.presetId]?.panel === s.panel ? s.presetId : ''} onChange={(e) => s.applyPreset(e.target.value)} aria-label="Load a preset setup">
          <option value="" disabled>Choose a setup…</option>
          {Object.values(PRESETS).filter((p) => p.panel === s.panel).map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
        </select>
        <span className="control-hint">{PRESETS[s.presetId]?.description}</span>
      </label>
    </div>
  );
}

function ScaleControls() {
  const s = useBiologyUi();
  const logFov = Math.log10(s.fov);
  return (
    <>
      <label className="control">
        <span className="control-label">
          Field of view (height) <output>{formatLength(s.fov)} · 10^{logFov.toFixed(2)} m</output>
        </span>
        <input
          type="range"
          min={LOG_MIN}
          max={LOG_MAX}
          step={0.01}
          value={logFov}
          onChange={(e) => s.setFov(10 ** Number(e.target.value))}
          aria-valuetext={`${formatLength(s.fov)} field of view`}
        />
        <span className="control-hint">Each step of 1 on the slider is one power of ten. Left = atoms, right = people.</span>
        <span className="quick-set">
          <button type="button" className="chip" onClick={() => s.setFov(s.fov * 10)} disabled={s.fov >= FOV_MAX_M}>zoom out ×10</button>
          <button type="button" className="chip" onClick={() => s.setFov(s.fov / 10)} disabled={s.fov <= FOV_MIN_M}>zoom in ×10</button>
        </span>
      </label>
      <label className="control">
        <span className="control-label">Selected object</span>
        <select value={s.selectedId} onChange={(e) => s.setSelected(e.target.value)}>
          {SCALE_OBJECTS.map((o) => <option key={o.id} value={o.id}>{o.name} · {formatLength(o.size)}</option>)}
        </select>
        <span className="quick-set">
          <button type="button" className="chip" onClick={() => s.zoomTo(s.selectedId)}>zoom to selected</button>
        </span>
      </label>
      <label className="control">
        <span className="control-label">Reference object (for the ratio)</span>
        <select value={s.referenceId} onChange={(e) => s.setReference(e.target.value)}>
          {SCALE_OBJECTS.map((o) => <option key={o.id} value={o.id}>{o.name} · {formatLength(o.size)}</option>)}
        </select>
      </label>
    </>
  );
}

function DnaControls() {
  const s = useBiologyUi();
  const cleaned = cleanSequence(s.codingInput);
  const bad = invalidDnaCharacters(cleaned);
  const n = s.coding.length;
  const m = s.mutation;
  const type: MutationType | 'none' = m?.type ?? 'none';

  const setType = (t: MutationType | 'none') => {
    if (t === 'none') return s.setMutation(null);
    const position = Math.min(Math.max(m?.position ?? 1, t === 'insert' ? 0 : 1), n);
    s.setMutation({ type: t, position, ...(t === 'delete' ? {} : { base: m?.base ?? 'A' }) });
  };
  const setPosition = (p: number) => {
    if (!m) return;
    const min = m.type === 'insert' ? 0 : 1;
    s.setMutation({ ...m, position: Math.min(Math.max(Math.round(p), min), n) });
  };
  const setBase = (b: DnaBase) => { if (m && m.type !== 'delete') s.setMutation({ ...m, base: b }); };

  return (
    <>
      <label className="control">
        <span className="control-label">Coding strand, 5′→3′ (A, C, G, T) <output>{n} bases</output></span>
        <input
          className="answer-input bio-seq-input"
          type="text"
          value={s.codingInput}
          onChange={(e) => s.setCodingInput(e.target.value)}
          spellCheck={false}
          autoCapitalize="characters"
          aria-describedby="bio-seq-help"
        />
        <span id="bio-seq-help" className={`control-hint ${bad.length ? 'bio-error' : ''}`}>
          {bad.length
            ? `Ignoring invalid characters: ${bad.join(' ')}. Use only A, C, G and T (DNA has no U). Showing the last valid sequence.`
            : cleaned.length === 0
              ? 'Type a sequence; the last valid one stays shown.'
              : `The sequence is read as the coding strand; translation starts at base 1. ${n % 3 === 0 ? '' : `${n % 3} trailing base${n % 3 === 1 ? '' : 's'} do not form a codon.`}`}
        </span>
      </label>

      <fieldset className="bio-mutation">
        <legend className="control-label">Mutation tool (one base)</legend>
        <label className="control-inline">
          <span>Type</span>
          <select value={type} onChange={(e) => setType(e.target.value as MutationType | 'none')} aria-label="Mutation type">
            <option value="none">None</option>
            <option value="substitute">Substitute</option>
            <option value="insert">Insert after</option>
            <option value="delete">Delete</option>
          </select>
        </label>
        {m && (
          <>
            <label className="control-inline">
              <span>Position</span>
              <input type="number" min={m.type === 'insert' ? 0 : 1} max={n} value={m.position} onChange={(e) => setPosition(Number(e.target.value))} aria-label="Position (1-based)" className="bio-num" />
            </label>
            {m.type !== 'delete' && (
              <label className="control-inline">
                <span>Base</span>
                <select value={m.base ?? 'A'} onChange={(e) => setBase(e.target.value as DnaBase)} aria-label="New base">
                  {BASES.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </label>
            )}
            <span className="control-hint">
              {m.type === 'substitute' && `Base ${m.position} (${s.coding[m.position - 1] ?? '?'}) → ${m.base}`}
              {m.type === 'insert' && (m.position === 0 ? `Insert ${m.base} before base 1` : `Insert ${m.base} after base ${m.position}`)}
              {m.type === 'delete' && `Delete base ${m.position} (${s.coding[m.position - 1] ?? '?'})`}
            </span>
          </>
        )}
      </fieldset>
    </>
  );
}
