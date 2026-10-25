import { CONFIGURATION_EXCEPTIONS, electronConfiguration, predictedIonCharge, valenceElectrons } from '../model/configuration';
import { CATEGORY_LABELS, ELEMENTS, elementByZ, type Element } from '../model/elements';
import type { TableColor } from './presets';
import { useChemistryUi } from './store';

/**
 * 18-column periodic table as a DOM grid of buttons. Rows 1–7 are the periods; the f-block
 * (La–Yb, Ac–No) sits in two rows below. Colouring: by block (default), by Pauling
 * electronegativity (a sequential scale with the value printed in each cell), or the
 * qualitative atomic-radius trend (arrows and a legend only: no numeric radii are stored).
 */
const EN_MIN = 0.7, EN_MAX = 4.0;

export function enColor(en: number | null): string | undefined {
  if (en === null) return undefined;
  const t = Math.max(0, Math.min(1, (en - EN_MIN) / (EN_MAX - EN_MIN)));
  // Light-on-dark sequential ramp: deep blue (low) → amber (high); value is also printed in the cell.
  const hue = 215 - 175 * t;
  return `hsl(${hue.toFixed(0)} ${(45 + 35 * t).toFixed(0)}% ${(28 + 22 * t).toFixed(0)}%)`;
}

function gridPosition(e: Element): { row: number; col: number } {
  if (e.group === null) {
    const lanthanide = e.z <= 70;
    return { row: lanthanide ? 9 : 10, col: 3 + (e.z - (lanthanide ? 57 : 89)) };
  }
  return { row: e.period, col: e.group };
}

export function PeriodicTable() {
  const selectedZ = useChemistryUi((s) => s.selectedZ);
  const colorBy = useChemistryUi((s) => s.tableColor);
  const selectElement = useChemistryUi((s) => s.selectElement);
  const selected = elementByZ(selectedZ);

  return (
    <div className={`ptable-wrap ptable-${colorBy}`}>
      <div className="ptable" role="group" aria-label={`Periodic table coloured by ${colorBy}`}>
        {ELEMENTS.map((e) => {
          const { row, col } = gridPosition(e);
          const bg = colorBy === 'electronegativity' ? enColor(e.electronegativity) : undefined;
          const isSel = e.z === selectedZ;
          return (
            <button
              key={e.z}
              type="button"
              className={`ptable-cell block-${e.block} ${isSel ? 'selected' : ''} ${e.z in CONFIGURATION_EXCEPTIONS ? 'exception' : ''}`}
              style={{ gridRow: row, gridColumn: col, ...(bg ? { background: bg } : {}) }}
              onClick={() => selectElement(e.z)}
              aria-pressed={isSel}
              aria-label={`${e.name}, atomic number ${e.z}${e.electronegativity !== null ? `, electronegativity ${e.electronegativity}` : ''}`}
              title={`${e.name} (${e.z})`}
            >
              <span className="ptable-z">{e.z}</span>
              <span className="ptable-sym">{e.symbol}</span>
              {colorBy === 'electronegativity' && <span className="ptable-en">{e.electronegativity ?? '–'}</span>}
            </button>
          );
        })}
        <span className="ptable-note" style={{ gridRow: 8, gridColumn: '3 / span 14' }}>La–Yb (57–70) and Ac–No (89–102) shown below; Lu and Lr in group 3 (one of two common conventions).</span>
        {colorBy === 'radius' && (
          <>
            <span className="ptable-arrow ptable-arrow-across" style={{ gridRow: 1, gridColumn: '4 / span 12' }} aria-hidden="true">atomic radius decreases →</span>
            <span className="ptable-arrow ptable-arrow-down" style={{ gridRow: '2 / span 5', gridColumn: 19 }} aria-hidden="true">radius increases ↓</span>
          </>
        )}
      </div>

      <div className="ptable-legend">
        {colorBy === 'blocks' && (
          <>
            <span className="legend-item"><i className="swatch block-s" /> s-block</span>
            <span className="legend-item"><i className="swatch block-p" /> p-block</span>
            <span className="legend-item"><i className="swatch block-d" /> d-block</span>
            <span className="legend-item"><i className="swatch block-f" /> f-block</span>
            <span className="legend-item"><i className="swatch exception" /> Aufbau exception</span>
          </>
        )}
        {colorBy === 'electronegativity' && (
          <>
            <span className="legend-item"><i className="swatch" style={{ background: enColor(0.8) }} /> low (Cs 0.79)</span>
            <span className="legend-item"><i className="swatch" style={{ background: enColor(2.2) }} /> middle (H 2.20)</span>
            <span className="legend-item"><i className="swatch" style={{ background: enColor(3.98) }} /> high (F 3.98)</span>
            <span className="legend-item"><i className="swatch" /> no value (noble gases, Z ≥ 104)</span>
          </>
        )}
        {colorBy === 'radius' && <span className="legend-item">Qualitative trend only: smaller to the right (more protons pulling the same shell), larger downward (more shells). No numeric radii are stored in this world.</span>}
      </div>

      {selected && <ElementCard e={selected} colorBy={colorBy} />}
    </div>
  );
}

export function ElementCard({ e, colorBy }: { e: Element; colorBy: TableColor }) {
  const cfg = electronConfiguration(e.z);
  const v = valenceElectrons(e);
  const q = predictedIonCharge(e);
  const exception = CONFIGURATION_EXCEPTIONS[e.z];
  return (
    <div className="element-card" aria-live="polite">
      <div className="element-card-head">
        <span className="element-card-sym">{e.symbol}</span>
        <div>
          <strong>{e.name}</strong> · Z = {e.z}
          <div className="muted">{CATEGORY_LABELS[e.category]} · period {e.period} · {e.group === null ? 'f-block' : `group ${e.group}`} · {e.block}-block · {e.stateAtSTP} at STP</div>
        </div>
      </div>
      <dl className="atom-facts">
        <div><dt>Atomic mass</dt><dd>{e.atomicMass} u{e.massKind === 'most-stable-isotope' && <span className="muted"> (mass number of best-known isotope)</span>}</dd></div>
        <div><dt>Configuration</dt><dd><code>{cfg.nobleGasCore}</code></dd></div>
        {exception && <div><dt>Exception</dt><dd className="muted">{exception.why}</dd></div>}
        <div><dt>Electronegativity</dt><dd>{e.electronegativity === null ? 'no accepted value' : `${e.electronegativity} (Pauling)`}</dd></div>
        <div><dt>Valence electrons</dt><dd>{v === null ? 'ambiguous (d/f block)' : v}</dd></div>
        {q !== null && <div><dt>Predicted ion</dt><dd>{q === 0 ? 'none (full shell)' : `${e.symbol}${Math.abs(q) === 1 ? '' : Math.abs(q)}${q > 0 ? '+' : '−'}`}</dd></div>}
        {colorBy === 'radius' && <div><dt>Radius trend</dt><dd className="muted">Compare with neighbours: left/below are larger, right/above are smaller.</dd></div>}
      </dl>
    </div>
  );
}
