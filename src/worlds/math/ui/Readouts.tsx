import { Tex } from '@/ui/Markdown';
import { assumptions, computeReadouts, currentFunction, fmt } from './readouts';
import { useMathUi } from './store';

export function Readouts() {
  const s = useMathUi();
  const fn = currentFunction(s);
  const items = computeReadouts(s);
  return (
    <div className="measurements">
      <div className="measure-head">
        <h3>Readouts</h3>
        <span className="orbit-kind"><Tex latex={`f(x) = ${fn.latex}`} /></span>
      </div>
      <dl>
        {items.map((m) => (
          <div key={m.id} className={`measure measure-${m.source}`}>
            <dt>
              {m.label}
              {m.formula && <span className="measure-formula"><Tex latex={m.formula} /></span>}
            </dt>
            <dd>{Number.isNaN(m.value) ? 'none' : fmt(m.value)}</dd>
          </div>
        ))}
      </dl>
      <p className="measure-legend"><span className="dot numerical" /> estimate from sampling &nbsp; <span className="dot analytic" /> exact from the formula shown</p>
      <details className="assumptions">
        <summary>What the graph does and does not do</summary>
        <ul>{assumptions().map((a) => <li key={a}>{a}</li>)}</ul>
      </details>
    </div>
  );
}
