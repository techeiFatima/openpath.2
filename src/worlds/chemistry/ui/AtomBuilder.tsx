import { describeAtom } from '../model/atom';
import { electronConfiguration, ionConfiguration } from '../model/configuration';
import { CATEGORY_LABELS } from '../model/elements';
import { Tex } from '@/ui/Markdown';
import type { AtomCounts } from './presets';
import { useChemistryUi } from './store';

const PARTS: { key: keyof AtomCounts; label: string; color: string }[] = [
  { key: 'protons', label: 'Protons', color: 'var(--bad)' },
  { key: 'neutrons', label: 'Neutrons', color: 'var(--text-dim)' },
  { key: 'electrons', label: 'Electrons', color: 'var(--accent)' },
];

/** Counters with +/− buttons and native number inputs, an identity panel and an SVG Bohr diagram. */
export function AtomBuilder() {
  const atom = useChemistryUi((s) => s.atom);
  const changeAtom = useChemistryUi((s) => s.changeAtom);
  const setAtom = useChemistryUi((s) => s.setAtom);
  const d = describeAtom(atom.protons, atom.neutrons, atom.electrons);
  const cfg = configurationOrNull(atom.protons, d.charge, atom.electrons);

  return (
    <div className="atom-builder">
      <div className="atom-controls" role="group" aria-label="Particle counts">
        {PARTS.map(({ key, label, color }) => (
          <div className="atom-counter" key={key}>
            <label htmlFor={`atom-${key}`} style={{ color }}>{label}</label>
            <div className="atom-counter-row">
              <button type="button" className="button small" onClick={() => changeAtom(key, -1)} aria-label={`Remove one ${label.toLowerCase().slice(0, -1)}`} disabled={key === 'protons' ? atom.protons <= 1 : atom[key] <= 0}>−</button>
              <input id={`atom-${key}`} type="number" min={key === 'protons' ? 1 : 0} max={key === 'protons' ? 118 : key === 'neutrons' ? 180 : 120} value={atom[key]} onChange={(e) => setAtom({ [key]: Number(e.target.value) })} />
              <button type="button" className="button small" onClick={() => changeAtom(key, 1)} aria-label={`Add one ${label.toLowerCase().slice(0, -1)}`}>+</button>
            </div>
          </div>
        ))}
      </div>

      <div className="atom-identity" aria-live="polite">
        <div className="atom-name">
          {d.element ? (
            <>
              <strong>{d.element.name}</strong> <span className="chip-static">{CATEGORY_LABELS[d.element.category]}</span>
            </>
          ) : (
            <strong>No element has {atom.protons} protons</strong>
          )}
        </div>
        <dl className="atom-facts">
          <div><dt>Isotope notation</dt><dd><Tex latex={d.latexNotation} /> <span className="muted">({d.hyphenNotation})</span></dd></div>
          <div><dt>Mass number A</dt><dd>{d.protons} + {d.neutrons} = <strong>{d.massNumber}</strong></dd></div>
          <div><dt>Charge</dt><dd>{d.protons} − {d.electrons} = <strong>{d.charge > 0 ? '+' : ''}{d.charge}</strong> <span className="muted">({d.ionKind})</span></dd></div>
          {d.shells.length > 0 && <div><dt>Shells</dt><dd>{d.shells.join(', ')}</dd></div>}
          {cfg && <div><dt>Configuration</dt><dd><code>{cfg.nobleGasCore}</code>{cfg.isException && <span className="muted"> (Aufbau exception)</span>}</dd></div>}
        </dl>
      </div>

      <figure className="bohr">
        <BohrDiagram shells={d.shells} symbol={d.element?.symbol ?? '?'} protons={atom.protons} neutrons={atom.neutrons} charge={d.chargeLabel} />
        <figcaption>Bohr model: a teaching idealisation; electrons do not orbit in rings.</figcaption>
      </figure>
    </div>
  );
}

function configurationOrNull(z: number, charge: number, electrons: number) {
  if (z < 1 || z > 118 || electrons <= 0) return null;
  try {
    return charge === 0 ? electronConfiguration(z) : ionConfiguration(z, charge);
  } catch {
    return null;
  }
}

function BohrDiagram({ shells, symbol, protons, neutrons, charge }: { shells: number[]; symbol: string; protons: number; neutrons: number; charge: string }) {
  const size = 320;
  const c = size / 2;
  const nucleusR = 22;
  const gap = shells.length > 4 ? (c - nucleusR - 12) / shells.length : 30;
  const description = shells.length ? `Nucleus with ${protons} protons and ${neutrons} neutrons; electron shells holding ${shells.join(', ')} electrons.` : `Nucleus with ${protons} protons and ${neutrons} neutrons; no electrons.`;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="bohr-svg" role="img" aria-label={description}>
      <title>{description}</title>
      {shells.map((n, i) => {
        const r = nucleusR + gap * (i + 1);
        return (
          <g key={i}>
            <circle cx={c} cy={c} r={r} fill="none" stroke="var(--line)" strokeWidth={1} />
            {Array.from({ length: n }, (_, k) => {
              const a = (2 * Math.PI * k) / n - Math.PI / 2;
              return <circle key={k} cx={c + r * Math.cos(a)} cy={c + r * Math.sin(a)} r={n > 18 ? 2.2 : 3.5} fill="var(--accent)" />;
            })}
            <text x={c + r + 3} y={c - 3} fontSize={9} fill="var(--text-faint)">{n}</text>
          </g>
        );
      })}
      <circle cx={c} cy={c} r={nucleusR} fill="#5a2a2a" stroke="var(--bad)" strokeWidth={1.5} />
      <text x={c} y={c + 1} textAnchor="middle" dominantBaseline="middle" fontSize={16} fontWeight={700} fill="var(--text)">{symbol}{charge && <tspan fontSize={9} dy={-7}>{charge}</tspan>}</text>
      <text x={c} y={c + nucleusR + 12} textAnchor="middle" fontSize={8} fill="var(--text-faint)">{protons}p {neutrons}n</text>
    </svg>
  );
}
