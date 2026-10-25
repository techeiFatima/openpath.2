import { useMemo } from 'react';
import { WorldShell } from '@/ui/WorldShell';
import { AtomBuilder } from './AtomBuilder';
import { Controls } from './Controls';
import { assumptionsFor, measurementsFor, textFacts } from './facts';
import { Measurements } from './Measurements';
import { MoleculeViewer } from './MoleculeViewer';
import { PeriodicTable } from './PeriodicTable';
import { useChemistryUi } from './store';
import './chemistry.css';

interface Props {
  lessonId: string;
  stageIndex: number;
}

/**
 * Atoms & Molecules world page. Three environments share one viewport: the atom builder
 * (SVG), the periodic table (DOM grid) and the molecule viewer (React Three Fiber). All
 * facts come from the pure model modules; nothing is fetched at runtime.
 */
export default function ChemistryWorld({ lessonId, stageIndex }: Props) {
  const ui = useChemistryUi();
  const facts = useMemo(
    () => ({ mode: ui.mode, atom: ui.atom, selectedZ: ui.selectedZ, tableColor: ui.tableColor, molecule: ui.molecule }),
    [ui.mode, ui.atom, ui.selectedZ, ui.tableColor, ui.molecule],
  );
  const simulationContext = useMemo(
    () => ({ presetId: ui.presetId, measurements: measurementsFor(facts), assumptions: assumptionsFor(facts.mode) }),
    [ui.presetId, facts],
  );

  const stage = ui.mode === 'atom' ? <AtomBuilder /> : ui.mode === 'table' ? <PeriodicTable /> : <MoleculeViewer />;

  return (
    <WorldShell
      worldId="atoms-molecules"
      worldName="Atoms & Molecules"
      lessonId={lessonId}
      stageIndex={stageIndex}
      applyPreset={ui.applyPreset}
      simulationContext={simulationContext}
      renderViewport={() => (
        <>
          <div className={`chem-stage chem-stage-${ui.mode}`}>{stage}</div>
          <div className="viewport-panels">
            <Controls />
            <Measurements />
          </div>
        </>
      )}
      renderTextMode={() => (
        <div className="chem-text-mode">
          <Controls />
          <section aria-label="Environment facts as text">
            <h4>{ui.mode === 'atom' ? 'Atom builder' : ui.mode === 'table' ? 'Periodic table' : 'Molecule viewer'} (text)</h4>
            <ul className="chem-text-facts">
              {textFacts(facts).map((line, i) => <li key={i}>{line}</li>)}
            </ul>
            {ui.mode === 'atom' && <AtomTextControls />}
            {ui.mode === 'table' && <TableTextControls />}
          </section>
          <Measurements />
        </div>
      )}
    />
  );
}

/** Text-mode counters so the builder can be driven without the diagram. */
function AtomTextControls() {
  const atom = useChemistryUi((s) => s.atom);
  const setAtom = useChemistryUi((s) => s.setAtom);
  return (
    <div className="control-row">
      {(['protons', 'neutrons', 'electrons'] as const).map((k) => (
        <label key={k} className="control-inline">
          <span>{k}</span>
          <input type="number" min={k === 'protons' ? 1 : 0} max={k === 'protons' ? 118 : 150} value={atom[k]} onChange={(e) => setAtom({ [k]: Number(e.target.value) })} />
        </label>
      ))}
    </div>
  );
}

function TableTextControls() {
  const selectedZ = useChemistryUi((s) => s.selectedZ);
  const selectElement = useChemistryUi((s) => s.selectElement);
  return (
    <label className="control-inline">
      <span>Atomic number</span>
      <input type="number" min={1} max={118} value={selectedZ} onChange={(e) => selectElement(Math.max(1, Math.min(118, Number(e.target.value) || 1)))} />
    </label>
  );
}
