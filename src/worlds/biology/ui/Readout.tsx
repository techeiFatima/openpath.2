import { useEffect, useState } from 'react';
import type { Measurement } from '@/core/simulation/types';
import { Tex } from '@/ui/Markdown';
import { AMINO_ACIDS, GENETIC_CODE, MUTATION_EFFECT_LABELS } from '../model/dna';
import { formatLength, MICROSCOPE_LABELS, MICROSCOPE_RULE_OF_THUMB, microscopeFor, objectsInView, SCALE_OBJECTS_BY_ID } from '../model/scale';
import { assumptionsFor, dnaMeasurements, dnaReadout, dnaSentence, microscopeSentence, scaleMeasurements } from './measurements';
import { useBiologyUi } from './store';

/**
 * Measurements-style readout. Everything the SVG shows is restated here as text, so this
 * panel doubles as the text-mode alternative to the (aria-hidden) drawing.
 */
export function Readout() {
  const s = useBiologyUi();
  return (
    <div className="measurements bio-readout">
      {s.panel === 'scale' ? <ScaleReadout /> : <DnaReadout />}
      <details className="assumptions">
        <summary>Model assumptions</summary>
        <ul>{assumptionsFor(s.panel).map((a) => <li key={a}>{a}</li>)}</ul>
      </details>
    </div>
  );
}

function formatValue(m: Measurement): string {
  switch (m.unit) {
    case 'm': return formatLength(m.value);
    case '%': return `${m.value.toFixed(1)} %`;
    case '': {
      const abs = Math.abs(m.value);
      if (abs !== 0 && (abs >= 1e5 || abs < 1e-3)) return m.value.toExponential(2).replace('e+', ' × 10^').replace('e-', ' × 10^-');
      return Number(m.value.toPrecision(3)).toLocaleString();
    }
    default: return `${Number.isInteger(m.value) ? m.value : m.value.toPrecision(3)} ${m.unit}`;
  }
}

function MeasureList({ items }: { items: Measurement[] }) {
  return (
    <dl>
      {items.map((m) => (
        <div key={m.id} className={`measure measure-${m.source}`}>
          <dt>
            {m.label}
            {m.formula && <span className="measure-formula"><Tex latex={m.formula} /></span>}
          </dt>
          <dd>{formatValue(m)}</dd>
        </div>
      ))}
    </dl>
  );
}

function LiveRegion({ text }: { text: string }) {
  const [announce, setAnnounce] = useState(text);
  useEffect(() => {
    const id = setTimeout(() => setAnnounce(text), 1500);
    return () => clearTimeout(id);
  }, [text]);
  return <p className="sr-only" aria-live="polite">{announce}</p>;
}

function ScaleReadout() {
  const { fov, selectedId, referenceId } = useBiologyUi();
  const items = scaleMeasurements({ fov, selectedId, referenceId });
  const sel = SCALE_OBJECTS_BY_ID.get(selectedId);
  const visible = objectsInView(fov);
  const sentence = `Field of view ${formatLength(fov)}. ${visible.length} object${visible.length === 1 ? '' : 's'} in view: ${visible.map((o) => `${o.name} (${formatLength(o.size)})`).join(', ') || 'none'}. ${microscopeSentence(selectedId)}.`;
  return (
    <>
      <div className="measure-head">
        <h3>Readout</h3>
        <span className="orbit-kind">{sel ? MICROSCOPE_LABELS[microscopeFor(sel.size)] : ''}</span>
      </div>
      <MeasureList items={items} />
      {sel && (
        <p className="control-hint">
          {sel.name}: {sel.description} Typical size {formatLength(sel.size)} (commonly quoted {formatLength(sel.range[0])}–{formatLength(sel.range[1])}).
        </p>
      )}
      <p className="control-hint">{MICROSCOPE_RULE_OF_THUMB}</p>
      <h4 className="bio-subhead">In view now ({visible.length})</h4>
      {visible.length === 0 ? (
        <p className="control-hint">Nothing from the list fits between {formatLength(fov / 400)} and {formatLength(fov)}.</p>
      ) : (
        <table className="bio-table">
          <thead><tr><th>Object</th><th>Typical size</th><th>Tool (rule of thumb)</th></tr></thead>
          <tbody>
            {visible.map((o) => (
              <tr key={o.id} className={o.id === selectedId ? 'selected' : ''}>
                <td>{o.name}</td>
                <td>{formatLength(o.size)}</td>
                <td>{MICROSCOPE_LABELS[microscopeFor(o.size)]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <p className="measure-legend"><span className="dot numerical" /> typical value from the table &nbsp; <span className="dot analytic" /> computed from the two selected sizes</p>
      <LiveRegion text={sentence} />
    </>
  );
}

function DnaReadout() {
  const { coding, mutation } = useBiologyUi();
  const r = dnaReadout({ coding, mutation });
  const s = r.summary;
  const items = dnaMeasurements(r);
  const c = s.chargaff;
  return (
    <>
      <div className="measure-head">
        <h3>Readout</h3>
        <span className={`orbit-kind ${r.mutation && r.mutation.effect !== 'none' && r.mutation.effect !== 'silent' ? 'crashed' : ''}`}>{r.mutation ? MUTATION_EFFECT_LABELS[r.mutation.effect] : s.translation.terminated ? 'Open reading frame' : 'No stop codon'}</span>
      </div>
      <dl className="bio-strands">
        <div><dt>Coding 5′→3′</dt><dd><code>{s.coding}</code></dd></div>
        <div><dt>Template 3′→5′</dt><dd><code>{s.template3to5}</code></dd></div>
        <div><dt>mRNA 5′→3′</dt><dd><code>{s.mrna}</code></dd></div>
        <div><dt>Codons</dt><dd><code>{s.codons.join(' ')}{s.remainder ? ` (+${s.remainder})` : ''}</code></dd></div>
        <div><dt>Protein (3-letter)</dt><dd><code>{s.translation.threeLetter || '—'}</code></dd></div>
        <div><dt>Protein (1-letter)</dt><dd><code>{s.translation.oneLetter || '—'}</code></dd></div>
      </dl>
      <MeasureList items={items} />
      <h4 className="bio-subhead">Base counts (Chargaff)</h4>
      <table className="bio-table">
        <thead><tr><th></th><th>A</th><th>T</th><th>G</th><th>C</th><th>A = T?</th><th>G = C?</th></tr></thead>
        <tbody>
          <tr><td>This strand</td><td>{c.strand.A}</td><td>{c.strand.T}</td><td>{c.strand.G}</td><td>{c.strand.C}</td><td>{c.strandAEqualsT ? 'yes' : 'no'}</td><td>{c.strandGEqualsC ? 'yes' : 'no'}</td></tr>
          <tr><td>Double helix</td><td>{c.duplex.A}</td><td>{c.duplex.T}</td><td>{c.duplex.G}</td><td>{c.duplex.C}</td><td>{c.duplexAEqualsT ? 'yes' : 'no'}</td><td>{c.duplexGEqualsC ? 'yes' : 'no'}</td></tr>
        </tbody>
      </table>
      {r.mutationError && <p className="control-hint bio-error">{r.mutationError}</p>}
      {r.mutation && (
        <div className="bio-mutation-result">
          <h4 className="bio-subhead">Mutation: {MUTATION_EFFECT_LABELS[r.mutation.effect]}</h4>
          <dl className="bio-strands">
            <div><dt>Mutated 5′→3′</dt><dd><code>{r.mutation.mutated}</code></dd></div>
            <div><dt>Protein</dt><dd><code>{r.mutation.mutatedProtein.threeLetter || '—'}</code></dd></div>
          </dl>
          <p className="control-hint">{r.mutation.description}</p>
        </div>
      )}
      <details className="assumptions">
        <summary>Genetic code table (standard)</summary>
        <CodonTable />
      </details>
      <LiveRegion text={dnaSentence(r)} />
    </>
  );
}

function CodonTable() {
  const bases = ['U', 'C', 'A', 'G'];
  return (
    <table className="bio-table bio-codon-table">
      <thead><tr><th>1st ↓ / 2nd →</th>{bases.map((b) => <th key={b}>{b}</th>)}<th>3rd</th></tr></thead>
      <tbody>
        {bases.flatMap((b1) => bases.map((b3, k) => (
          <tr key={b1 + b3}>
            {k === 0 ? <th rowSpan={4}>{b1}</th> : null}
            {bases.map((b2) => {
              const aa = GENETIC_CODE[b1 + b2 + b3]!;
              return <td key={b2} className={aa.code1 === '*' ? 'aa-stop' : ''}>{b1}{b2}{b3} {aa.code3}</td>;
            })}
            <td>{b3}</td>
          </tr>
        )))}
      </tbody>
      <caption>Three-letter codes: {Object.values(AMINO_ACIDS).filter((a) => a.code1 !== '*').map((a) => `${a.code3} = ${a.name}`).join('; ')}.</caption>
    </table>
  );
}
