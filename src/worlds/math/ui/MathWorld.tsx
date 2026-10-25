import { useMemo } from 'react';
import { WorldShell } from '@/ui/WorldShell';
import { Controls } from './Controls';
import { Graph } from './Graph';
import { Readouts } from './Readouts';
import { assumptions, computeReadouts } from './readouts';
import { useMathUi } from './store';
import './math.css';

interface Props {
  lessonId: string;
  stageIndex: number;
}

export default function MathWorld({ lessonId, stageIndex }: Props) {
  const ui = useMathUi();
  const simulationContext = useMemo(
    () => ({ presetId: ui.presetId, measurements: computeReadouts(ui), assumptions: assumptions() }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ui.presetId, ui.functionId, ui.mode, stageIndex],
  );
  const panels = (
    <div className="viewport-panels">
      <Controls />
      <Readouts />
    </div>
  );
  return (
    <WorldShell
      worldId="functions-calculus"
      worldName="Functions & Calculus"
      lessonId={lessonId}
      stageIndex={stageIndex}
      applyPreset={ui.applyPreset}
      simulationContext={simulationContext}
      renderViewport={() => (
        <>
          <div className="canvas-wrap graph-wrap">
            <Graph />
          </div>
          {panels}
        </>
      )}
      renderTextMode={() => panels}
    />
  );
}
