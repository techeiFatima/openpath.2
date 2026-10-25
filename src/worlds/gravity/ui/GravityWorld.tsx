import { useMemo } from 'react';
import { WorldShell } from '@/ui/WorldShell';
import { Controls } from './Controls';
import { Measurements } from './Measurements';
import { Scene } from './Scene';
import { useGravityUi } from './store';
import { useSimulation } from './useSimulation';

interface Props {
  lessonId: string;
  stageIndex: number;
}

export default function GravityWorld({ lessonId, stageIndex }: Props) {
  const ui = useGravityUi();
  const sim = useSimulation();

  const simulationContext = useMemo(
    () => ({ presetId: ui.presetId, measurements: sim.measurements(), assumptions: sim.assumptions() }),
    // Refresh the instructor's view of the sim only when the preset changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ui.presetId, stageIndex],
  );

  const panels = (
    <div className="viewport-panels">
      <Controls />
      <Measurements sim={sim} mode={ui.mode} />
    </div>
  );

  return (
    <WorldShell
      worldId="gravity"
      worldName="Gravity Lab"
      lessonId={lessonId}
      stageIndex={stageIndex}
      applyPreset={ui.applyPreset}
      onStageEnter={(stage) => { if (stage.kind === 'demonstrate') ui.setRunning(false); }}
      simulationContext={simulationContext}
      renderViewport={() => (
        <>
          <div className="canvas-wrap">
            <Scene sim={sim} mode={ui.mode} running={ui.running} timeScale={ui.timeScale} showOrbits={ui.showOrbits} focusId={ui.focusId} />
            <p className="scale-note">{ui.mode === 'solar-system' ? 'Distances and sizes compressed for display; motion computed from real data.' : 'True proportions: 1 unit = radius of the central body.'}</p>
          </div>
          {panels}
        </>
      )}
      renderTextMode={() => panels}
    />
  );
}
