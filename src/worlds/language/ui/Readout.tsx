import { useLanguageUi } from './store';

/** Measurements-style readout of the conversation state, plus the model's stated limits. */
export function Readout() {
  const engine = useLanguageUi((s) => s.engine);
  // Subscribing to the snapshot re-renders the readout after every action.
  useLanguageUi((s) => s.snapshot);
  const measurements = engine.measurements();
  return (
    <div className="measurements">
      <div className="measure-head">
        <h3>Conversation readout</h3>
      </div>
      <dl>
        {measurements.map((m) => (
          <div key={m.id} className={`measure measure-${m.source}`}>
            <dt>{m.label}</dt>
            <dd>{m.value}{m.unit ? ` ${m.unit}` : ''}</dd>
          </div>
        ))}
      </dl>
      <p className="measure-legend">Counts are read from the conversation state. "Answered on your own" means accepted without a model reply.</p>
      <details className="assumptions">
        <summary>What the coach can and cannot check</summary>
        <ul>{engine.assumptions().map((a) => <li key={a}>{a}</li>)}</ul>
      </details>
    </div>
  );
}
