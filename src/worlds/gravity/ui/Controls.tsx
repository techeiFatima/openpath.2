import { circularSpeed, escapeSpeed } from '../model/analytic';
import { BODIES, mu } from '../model/bodies';
import type { OrbitLabSettings } from '../model/presets';
import { formatSI } from './format';
import { PRESETS } from './presets';
import { useGravityUi } from './store';

const CENTRAL_OPTIONS: OrbitLabSettings['centralId'][] = ['earth', 'moon', 'mars', 'jupiter', 'sun'];
const ORBIT_TIME_SCALES = [1, 30, 120, 600, 3600];
const SOLAR_TIME_SCALES = [1, 5, 20, 60, 365].map((d) => d * 86400);

export function Controls() {
  const s = useGravityUi();
  const central = BODIES[s.settings.centralId]!;
  const m = mu(central);
  const vc = circularSpeed(m, s.settings.distance);
  const vesc = escapeSpeed(m, s.settings.distance);
  const ratio = s.settings.distance / central.radius;

  const setCentral = (id: OrbitLabSettings['centralId']) => {
    const c = BODIES[id]!;
    const distance = c.radius * ratio;
    const speedRatio = s.settings.speed / vc;
    s.setSettings({ centralId: id, distance, speed: Math.round(circularSpeed(mu(c), distance) * speedRatio) });
  };

  return (
    <div className="controls">
      <div className="control-row">
        <button type="button" className="button primary" onClick={() => s.setRunning(!s.running)} aria-pressed={s.running}>
          {s.running ? 'Pause' : 'Play'}
        </button>
        <button type="button" className="button" onClick={() => s.restart()}>Reset</button>
        <label className="control-inline">
          <span>Time</span>
          <select value={s.timeScale} onChange={(e) => s.setTimeScale(Number(e.target.value))} aria-label="Time scale">
            {(s.mode === 'orbit-lab' ? ORBIT_TIME_SCALES : SOLAR_TIME_SCALES).map((t) => (
              <option key={t} value={t}>{s.mode === 'orbit-lab' ? `${t}× real time` : `${t / 86400} day${t === 86400 ? '' : 's'} per second`}</option>
            ))}
          </select>
        </label>
      </div>

      {s.mode === 'orbit-lab' ? (
        <>
          <label className="control">
            <span className="control-label">Central body</span>
            <select value={s.settings.centralId} onChange={(e) => setCentral(e.target.value as OrbitLabSettings['centralId'])}>
              {CENTRAL_OPTIONS.map((id) => <option key={id} value={id}>{BODIES[id]!.name}</option>)}
            </select>
          </label>
          <label className="control">
            <span className="control-label">
              Launch distance <output>{ratio.toFixed(2)} radii · altitude {formatSI(s.settings.distance - central.radius, 'm')}</output>
            </span>
            <input type="range" min={1.005} max={12} step={0.005} value={ratio} onChange={(e) => s.setSettings({ distance: central.radius * Number(e.target.value) })} />
          </label>
          <label className="control">
            <span className="control-label">
              Launch speed <output>{formatSI(s.settings.speed, 'm/s')}</output>
            </span>
            <input type="range" min={0} max={Math.round(vesc * 1.6)} step={10} value={s.settings.speed} onChange={(e) => s.setSettings({ speed: Number(e.target.value) })} list="speed-marks" />
            <datalist id="speed-marks">
              <option value={Math.round(vc)} label="circular" />
              <option value={Math.round(vesc)} label="escape" />
            </datalist>
            <span className="control-hint">circular here: {formatSI(vc, 'm/s')} · escape here: {formatSI(vesc, 'm/s')}</span>
            <span className="quick-set">
              <button type="button" className="chip" onClick={() => s.setSettings({ speed: Math.round(vc) })}>set circular</button>
              <button type="button" className="chip" onClick={() => s.setSettings({ speed: Math.round(vesc) })}>set escape</button>
            </span>
          </label>
          <label className="control">
            <span className="control-label">
              Launch angle <output>{s.settings.angleDeg}° {s.settings.angleDeg === 0 ? '(horizontal)' : s.settings.angleDeg > 0 ? '(upward)' : '(downward)'}</output>
            </span>
            <input type="range" min={-60} max={60} step={1} value={s.settings.angleDeg} onChange={(e) => s.setSettings({ angleDeg: Number(e.target.value) })} />
          </label>
        </>
      ) : (
        <>
          <label className="control">
            <span className="control-label">Focus body (for measurements)</span>
            <select value={s.focusId} onChange={(e) => s.setFocus(e.target.value)}>
              {['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'].map((id) => <option key={id} value={id}>{BODIES[id]!.name}</option>)}
            </select>
          </label>
          <label className="control-inline">
            <input type="checkbox" checked={s.showOrbits} onChange={(e) => s.setShowOrbits(e.target.checked)} /> <span>Show orbit paths</span>
          </label>
        </>
      )}

      <label className="control">
        <span className="control-label">Setup</span>
        <select value={s.presetId} onChange={(e) => s.applyPreset(e.target.value)} aria-label="Load a preset setup">
          {Object.values(PRESETS).map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
        </select>
        <span className="control-hint">{PRESETS[s.presetId]?.description}</span>
      </label>
    </div>
  );
}
