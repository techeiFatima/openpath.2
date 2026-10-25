import { useEffect, useMemo } from 'react';
import { useLearnerStore } from '@/core/learner/store';
import { lessonHref, navigate } from '@/app/router';
import { StageNav } from '@/ui/StageNav';
import { LESSONS_BY_ID } from '@/worlds/registry';
import { Controls } from './Controls';
import { LessonView } from './LessonView';
import { Measurements } from './Measurements';
import { Scene } from './Scene';
import { useGravityUi } from './store';
import { useSimulation } from './useSimulation';

const NO_STAGES: number[] = [];

interface Props {
  lessonId: string;
  stageIndex: number;
}

export default function GravityWorld({ lessonId, stageIndex }: Props) {
  const lesson = LESSONS_BY_ID.get(lessonId);
  const setLocation = useLearnerStore((s) => s.setLocation);
  const completed = useLearnerStore((s) => s.completedStages[lessonId] ?? NO_STAGES);
  const textMode = useLearnerStore((s) => s.textMode);
  const setTextMode = useLearnerStore((s) => s.setTextMode);
  const ui = useGravityUi();
  const sim = useSimulation();

  const safeIndex = lesson ? Math.min(stageIndex, lesson.stages.length - 1) : 0;
  const stage = lesson?.stages[safeIndex];

  useEffect(() => {
    if (!lesson) return;
    setLocation({ worldId: 'gravity', lessonId, stageIndex: safeIndex });
    const preset = lesson.stages[safeIndex]?.presets?.[0];
    if (preset) ui.applyPreset(preset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId, safeIndex]);

  // The Demonstrate stage hides the simulation so that solutions are independent.
  const simulationVisible = stage?.kind !== 'demonstrate' && !textMode;
  useEffect(() => {
    if (stage?.kind === 'demonstrate') ui.setRunning(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage?.kind]);

  const simulationContext = useMemo(
    () => (simulationVisible ? { presetId: ui.presetId, measurements: sim.measurements(), assumptions: sim.assumptions() } : undefined),
    // Only refresh the instructor's view of the sim when the preset or stage changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [simulationVisible, ui.presetId, safeIndex],
  );

  if (!lesson || !stage) {
    return (
      <main className="home">
        <p>Unknown lesson. <a href="#/">Back to OpenPath</a></p>
      </main>
    );
  }

  return (
    <div className={`world ${simulationVisible ? '' : 'sim-hidden'}`}>
      <header className="world-bar">
        <a className="brand" href="#/">OpenPath</a>
        <div className="world-title">
          <span className="world-name">Gravity Lab</span>
          <span className="lesson-name">{lesson.title}</span>
        </div>
        <label className="toggle">
          <input type="checkbox" checked={textMode} onChange={(e) => setTextMode(e.target.checked)} />
          <span>Text mode</span>
        </label>
      </header>

      <aside className="panel" aria-label="Lesson">
        <StageNav stages={lesson.stages} current={safeIndex} completed={completed} onSelect={(i) => navigate(lessonHref('gravity', lessonId, i))} />
        <LessonView
          key={`${lessonId}-${safeIndex}`}
          lesson={lesson}
          stage={stage}
          stageIndex={safeIndex}
          simulationVisible={simulationVisible}
          {...(simulationContext ? { simulationContext } : {})}
          onNavigate={(i) => {
            navigate(lessonHref('gravity', lessonId, i));
            document.querySelector('.panel')?.scrollTo({ top: 0 });
          }}
        />
      </aside>

      <main className="viewport" aria-label="Simulation">
        {simulationVisible ? (
          <>
            <div className="canvas-wrap">
              <Scene sim={sim} mode={ui.mode} running={ui.running} timeScale={ui.timeScale} showOrbits={ui.showOrbits} focusId={ui.focusId} />
              <p className="scale-note">{ui.mode === 'solar-system' ? 'Distances and sizes compressed for display; motion computed from real data.' : 'True proportions: 1 unit = radius of the central body.'}</p>
            </div>
            <div className="viewport-panels">
              <Controls />
              <Measurements sim={sim} mode={ui.mode} />
            </div>
          </>
        ) : stage.kind === 'demonstrate' ? (
          <div className="sim-placeholder">
            <h3>Simulation hidden</h3>
            <p>Solve these on your own. Independent solutions are what count as mastery.</p>
          </div>
        ) : (
          <div className="text-mode">
            <h3>Text view</h3>
            <p>{lesson.accessibilitySummary}</p>
            <div className="viewport-panels">
              <Controls />
              <Measurements sim={sim} mode={ui.mode} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
