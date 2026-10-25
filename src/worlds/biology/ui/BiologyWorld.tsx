import { useMemo } from 'react';
import { WorldShell } from '@/ui/WorldShell';
import { Controls } from './Controls';
import { DnaScene } from './DnaScene';
import { assumptionsFor, dnaMeasurements, dnaReadout, scaleMeasurements } from './measurements';
import { Readout } from './Readout';
import { ScaleScene } from './ScaleScene';
import { useBiologyUi } from './store';
import './biology.css';

interface Props {
  lessonId: string;
  stageIndex: number;
}

export default function BiologyWorld({ lessonId, stageIndex }: Props) {
  const ui = useBiologyUi();

  const readout = useMemo(() => (ui.panel === 'dna' ? dnaReadout({ coding: ui.coding, mutation: ui.mutation }) : null), [ui.panel, ui.coding, ui.mutation]);

  const simulationContext = useMemo(
    () => ({
      presetId: ui.presetId,
      measurements: ui.panel === 'scale' ? scaleMeasurements({ fov: ui.fov, selectedId: ui.selectedId, referenceId: ui.referenceId }) : dnaMeasurements(readout!),
      assumptions: assumptionsFor(ui.panel),
    }),
    [ui.presetId, ui.panel, ui.fov, ui.selectedId, ui.referenceId, readout],
  );

  const panels = (
    <div className="viewport-panels bio-panels">
      <Controls />
      <Readout />
    </div>
  );

  return (
    <WorldShell
      worldId="cell"
      worldName="Inside the Cell"
      lessonId={lessonId}
      stageIndex={stageIndex}
      applyPreset={ui.applyPreset}
      simulationContext={simulationContext}
      renderViewport={() => (
        <>
          <div className="canvas-wrap bio-canvas">
            {ui.panel === 'scale' ? <ScaleScene fov={ui.fov} selectedId={ui.selectedId} /> : readout && <DnaScene summary={readout.summary} mutation={readout.mutation} />}
            <p className="scale-note">{ui.panel === 'scale' ? 'Objects drawn at their typical size relative to the field of view; shapes are schematic.' : 'Strands shown straight; sequence read as the coding strand, 5′→3′.'}</p>
          </div>
          {panels}
        </>
      )}
      renderTextMode={() => panels}
    />
  );
}
