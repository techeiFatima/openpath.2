import { Tex } from '@/ui/Markdown';
import { assumptionsFor, measurementsFor, textFacts, type FactsInput } from './facts';
import { useChemistryUi } from './store';

const MODE_TITLES = { atom: 'Atom readout', table: 'Element readout', molecule: 'Molecule readout' } as const;

function fmt(v: number, unit: string): string {
  const text = Number.isInteger(v) ? String(v) : Number(v.toPrecision(4)).toString();
  return unit ? `${text} ${unit}` : text;
}

/** Measurements-style panel: analytic facts about the current element/atom/molecule plus the idealisations in force. */
export function Measurements({ showText = false }: { showText?: boolean }) {
  const s = useChemistryUi();
  const input: FactsInput = { mode: s.mode, atom: s.atom, selectedZ: s.selectedZ, tableColor: s.tableColor, molecule: s.molecule };
  const ms = measurementsFor(input);
  return (
    <div className="measurements">
      <div className="measure-head">
        <h3>{MODE_TITLES[s.mode]}</h3>
        <span className="orbit-kind">{s.presetId}</span>
      </div>
      <dl>
        {ms.map((m) => (
          <div key={m.id} className={`measure measure-${m.source}`}>
            <dt>
              {m.label}
              {m.formula && <span className="measure-formula"><Tex latex={m.formula} /></span>}
            </dt>
            <dd>{fmt(m.value, m.unit)}</dd>
          </div>
        ))}
      </dl>
      <p className="measure-legend"><span className="dot analytic" /> looked up or computed in closed form; nothing here is simulated</p>
      {showText && (
        <ul className="chem-text-facts">
          {textFacts(input).map((line, i) => <li key={i}>{line}</li>)}
        </ul>
      )}
      <details className="assumptions">
        <summary>Idealisations and data status</summary>
        <ul>{assumptionsFor(s.mode).map((a) => <li key={a}>{a}</li>)}</ul>
      </details>
    </div>
  );
}
