import { useEffect, useState } from 'react';
import type { Measurement } from '@/core/simulation/types';
import { Tex } from '@/ui/Markdown';
import { BODIES, PLANET_IDS } from '../model/bodies';
import type { NBodySimulation } from '../model/nbody';
import { formatSI } from './format';
import type { Mode } from './presets';

interface Snapshot {
  measurements: Measurement[];
  crashed: boolean;
  kind: string;
}

function classify(m: Record<string, number>, crashed: boolean, centralRadius: number): string {
  if (crashed) return 'Crashed into the surface';
  const eps = m.eps ?? 0;
  const e = m.e ?? 0;
  const rp = m.rp;
  if (eps >= 0) return Math.abs(eps) < 1e-3 * Math.abs(m.vcirc ?? 1) ** 2 ? 'Parabolic: exactly at escape' : 'Hyperbolic: escaping';
  if (rp !== undefined && rp < centralRadius) return 'Elliptical path that reaches the surface: will crash';
  if (e < 0.01) return 'Circular orbit';
  return `Elliptical orbit (e = ${e.toFixed(2)})`;
}

export function Measurements({ sim, mode }: { sim: NBodySimulation; mode: Mode }) {
  const [snap, setSnap] = useState<Snapshot>({ measurements: [], crashed: false, kind: '' });
  const [announce, setAnnounce] = useState('');

  useEffect(() => {
    let tick = 0;
    const read = () => {
      const ms = sim.measurements();
      const byId = Object.fromEntries(ms.map((x) => [x.id, x.value]));
      const focus = sim.params.focusId ? sim.body(sim.params.focusId) : undefined;
      const primary = focus?.primary ? sim.body(focus.primary) : undefined;
      const kind = primary ? classify(byId, !!focus?.crashed, primary.radius) : '';
      setSnap({ measurements: ms, crashed: !!focus?.crashed, kind });
      if (++tick % 24 === 0 && primary && focus) {
        setAnnounce(`${focus.name}: distance ${formatSI(byId.r ?? 0, 'm')}, speed ${formatSI(byId.v ?? 0, 'm/s')}. ${kind}.`);
      }
    };
    read();
    const id = setInterval(read, 125);
    return () => clearInterval(id);
  }, [sim]);

  return (
    <div className="measurements">
      <div className="measure-head">
        <h3>Measurements</h3>
        <span className={`orbit-kind ${snap.crashed ? 'crashed' : ''}`}>{snap.kind}</span>
      </div>
      <dl>
        {snap.measurements.map((m) => (
          <div key={m.id} className={`measure measure-${m.source}`}>
            <dt>
              {m.label}
              {m.formula && <span className="measure-formula"><Tex latex={m.formula} /></span>}
            </dt>
            <dd>{formatSI(m.value, m.unit)}</dd>
          </div>
        ))}
      </dl>
      <p className="measure-legend"><span className="dot numerical" /> read from the simulation &nbsp; <span className="dot analytic" /> computed from the current state with the formula shown</p>
      <p className="sr-only" aria-live="polite">{announce}</p>
      {mode === 'solar-system' && <PlanetTable />}
      <details className="assumptions">
        <summary>Model assumptions</summary>
        <ul>{sim.assumptions().map((a) => <li key={a}>{a}</li>)}</ul>
      </details>
    </div>
  );
}

function PlanetTable() {
  const au = 1.495978707e11;
  const yr = 365.25 * 86400;
  return (
    <div className="planet-table">
      <h4>Orbit data (around the Sun)</h4>
      <table>
        <thead>
          <tr><th>Planet</th><th>a (au)</th><th>T (years)</th><th>a³</th><th>T²</th></tr>
        </thead>
        <tbody>
          {PLANET_IDS.map((id) => {
            const p = BODIES[id]!;
            const a = p.semiMajorAxis! / au;
            const T = p.period! / yr;
            return (
              <tr key={id}>
                <td>{p.name}</td>
                <td>{a.toFixed(3)}</td>
                <td>{T.toFixed(3)}</td>
                <td>{(a ** 3).toPrecision(4)}</td>
                <td>{(T ** 2).toPrecision(4)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="control-hint">a = semi-major axis (JPL J2000 elements); T = sidereal period. Compare the last two columns.</p>
    </div>
  );
}
