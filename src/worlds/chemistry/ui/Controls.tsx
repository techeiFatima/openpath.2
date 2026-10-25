import { PRESET_MENU, type Mode, type TableColor } from './presets';
import { useChemistryUi } from './store';

const MODES: { id: Mode; label: string }[] = [
  { id: 'atom', label: 'Atom builder' },
  { id: 'table', label: 'Periodic table' },
  { id: 'molecule', label: 'Molecule viewer' },
];

const TABLE_COLORS: { id: TableColor; label: string }[] = [
  { id: 'blocks', label: 'Blocks (s, p, d, f)' },
  { id: 'electronegativity', label: 'Electronegativity (Pauling)' },
  { id: 'radius', label: 'Atomic radius trend (qualitative)' },
];

export function Controls() {
  const s = useChemistryUi();
  const current = PRESET_MENU.find((p) => p.id === s.presetId);
  return (
    <div className="controls">
      <div className="control-row" role="group" aria-label="Environment">
        {MODES.map((m) => (
          <button key={m.id} type="button" className={`button small ${s.mode === m.id ? 'primary' : ''}`} aria-pressed={s.mode === m.id} onClick={() => s.setMode(m.id)}>
            {m.label}
          </button>
        ))}
      </div>

      {s.mode === 'table' && (
        <label className="control">
          <span className="control-label">Colour by</span>
          <select value={s.tableColor} onChange={(e) => s.setTableColor(e.target.value as TableColor)}>
            {TABLE_COLORS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </label>
      )}

      <label className="control">
        <span className="control-label">Setup</span>
        <select value={current ? s.presetId : ''} onChange={(e) => s.applyPreset(e.target.value)} aria-label="Load a preset setup">
          {!current && <option value="">Custom</option>}
          <optgroup label="Atoms">{PRESET_MENU.filter((p) => p.mode === 'atom').map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}</optgroup>
          <optgroup label="Periodic table">{PRESET_MENU.filter((p) => p.mode === 'table').map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}</optgroup>
          <optgroup label="Molecules">{PRESET_MENU.filter((p) => p.mode === 'molecule').map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}</optgroup>
        </select>
        <span className="control-hint">{current?.description ?? 'Particle counts set by hand.'}</span>
      </label>
    </div>
  );
}
