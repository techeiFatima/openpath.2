import { useEffect, type ReactNode } from 'react';
import type { InstructorContext } from '@/core/instructor/instructor';
import { useLearnerStore } from '@/core/learner/store';
import type { LessonSpec, Stage } from '@/core/world/spec';
import { lessonHref, navigate } from '@/app/router';
import { LESSONS_BY_ID } from '@/worlds/registry';
import { LessonView } from './LessonView';
import { StageNav } from './StageNav';

const NO_STAGES: number[] = [];

export interface ViewportState {
  lesson: LessonSpec;
  stage: Stage;
  stageIndex: number;
  /** False in the Demonstrate stage and in text mode. */
  simulationVisible: boolean;
  textMode: boolean;
}

interface Props {
  worldId: string;
  worldName: string;
  lessonId: string;
  stageIndex: number;
  /** Load a named preset into the world's environment (called on stage entry and by lesson blocks). */
  applyPreset(presetId: string): void;
  /** Called when the stage changes, e.g. to pause a simulation in Demonstrate. */
  onStageEnter?(stage: Stage): void;
  simulationContext?: InstructorContext['simulation'];
  /** Renders the world's environment (canvas, controls, measurements) for the current state. */
  renderViewport(state: ViewportState): ReactNode;
  /** Optional alternative to the environment in text mode; defaults to the lesson's accessibility summary. */
  renderTextMode?(state: ViewportState): ReactNode;
}

/**
 * Shared chrome for every world: header bar, stage navigation, lesson panel, viewport,
 * resume-location tracking and the Demonstrate-stage rule (environment hidden).
 */
export function WorldShell({ worldId, worldName, lessonId, stageIndex, applyPreset, onStageEnter, simulationContext, renderViewport, renderTextMode }: Props) {
  const lesson = LESSONS_BY_ID.get(lessonId);
  const setLocation = useLearnerStore((s) => s.setLocation);
  const completed = useLearnerStore((s) => s.completedStages[lessonId] ?? NO_STAGES);
  const textMode = useLearnerStore((s) => s.textMode);
  const setTextMode = useLearnerStore((s) => s.setTextMode);

  const safeIndex = lesson ? Math.min(stageIndex, lesson.stages.length - 1) : 0;
  const stage = lesson?.stages[safeIndex];

  useEffect(() => {
    if (!lesson || !stage) return;
    setLocation({ worldId, lessonId, stageIndex: safeIndex });
    const preset = stage.presets?.[0];
    if (preset) applyPreset(preset);
    onStageEnter?.(stage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [worldId, lessonId, safeIndex]);

  if (!lesson || !stage) {
    return (
      <main className="home">
        <p>Unknown lesson. <a href="#/">Back to OpenPath</a></p>
      </main>
    );
  }

  const simulationVisible = stage.kind !== 'demonstrate' && !textMode;
  const state: ViewportState = { lesson, stage, stageIndex: safeIndex, simulationVisible, textMode };

  return (
    <div className={`world ${simulationVisible ? '' : 'sim-hidden'}`}>
      <header className="world-bar">
        <a className="brand" href="#/">OpenPath</a>
        <div className="world-title">
          <span className="world-name">{worldName}</span>
          <span className="lesson-name">{lesson.title}</span>
        </div>
        <label className="toggle">
          <input type="checkbox" checked={textMode} onChange={(e) => setTextMode(e.target.checked)} />
          <span>Text mode</span>
        </label>
      </header>

      <aside className="panel" aria-label="Lesson">
        <StageNav stages={lesson.stages} current={safeIndex} completed={completed} onSelect={(i) => navigate(lessonHref(worldId, lessonId, i))} />
        <LessonView
          key={`${lessonId}-${safeIndex}`}
          lesson={lesson}
          stage={stage}
          stageIndex={safeIndex}
          simulationVisible={simulationVisible}
          {...(simulationContext && simulationVisible ? { simulationContext } : {})}
          applyPreset={applyPreset}
          onNavigate={(i) => {
            navigate(lessonHref(worldId, lessonId, i));
            document.querySelector('.panel')?.scrollTo({ top: 0 });
          }}
        />
      </aside>

      <main className="viewport" aria-label="Environment">
        {stage.kind === 'demonstrate' ? (
          <div className="sim-placeholder">
            <h3>Environment hidden</h3>
            <p>Solve these on your own. Independent solutions are what count as mastery.</p>
          </div>
        ) : textMode ? (
          <div className="text-mode">
            <h3>Text view</h3>
            <p>{lesson.accessibilitySummary}</p>
            {renderTextMode?.(state)}
          </div>
        ) : (
          renderViewport(state)
        )}
      </main>
    </div>
  );
}
