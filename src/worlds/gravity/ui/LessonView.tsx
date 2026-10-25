import { useState } from 'react';
import type { InstructorContext } from '@/core/instructor/instructor';
import { useLearnerStore } from '@/core/learner/store';
import type { Block, LessonSpec, Stage } from '@/core/world/spec';
import { Markdown, Tex } from '@/ui/Markdown';
import { MasteryBadge } from '@/ui/MasteryBadge';
import { ProblemCard } from '@/ui/ProblemCard';
import { OBJECTIVES_BY_ID } from '@/worlds/catalog';
import { summarizeMastery } from '@/core/learner/mastery';
import { useGravityUi } from './store';

interface Props {
  lesson: LessonSpec;
  stage: Stage;
  stageIndex: number;
  simulationVisible: boolean;
  simulationContext?: InstructorContext['simulation'];
  onNavigate(index: number): void;
}

export function LessonView({ lesson, stage, stageIndex, simulationVisible, simulationContext, onNavigate }: Props) {
  const completeStage = useLearnerStore((s) => s.completeStage);
  const isLast = stageIndex === lesson.stages.length - 1;
  const problems = new Map(lesson.problems.map((p) => [p.id, p]));

  return (
    <article className="lesson-stage" aria-labelledby="stage-title">
      <header className="stage-header">
        <p className="stage-kicker">Stage {stageIndex + 1} of {lesson.stages.length} · {stage.kind}</p>
        <h2 id="stage-title">{stage.title}</h2>
      </header>

      {stage.blocks.map((b, i) => (
        <BlockView key={i} block={b} lesson={lesson} stage={stage} simulationVisible={simulationVisible} {...(simulationContext ? { simulationContext } : {})} problems={problems} />
      ))}

      {stage.kind === 'review' && (
        <section className="review-mastery">
          <h3>Your mastery in this lesson</h3>
          {lesson.objectiveIds.map((o) => <MasteryBadge key={o} objectiveId={o} showNext />)}
          <PrerequisiteCheck lesson={lesson} />
        </section>
      )}

      <footer className="stage-footer">
        {stageIndex > 0 && <button type="button" className="button" onClick={() => onNavigate(stageIndex - 1)}>← Back</button>}
        <button
          type="button"
          className="button primary"
          onClick={() => {
            completeStage(lesson.id, stageIndex);
            if (!isLast) onNavigate(stageIndex + 1);
            else location.hash = '#/';
          }}
        >
          {isLast ? 'Finish lesson' : `Continue to ${lesson.stages[stageIndex + 1]?.title ?? 'next'} →`}
        </button>
      </footer>
    </article>
  );
}

function PrerequisiteCheck({ lesson }: { lesson: LessonSpec }) {
  const attempts = useLearnerStore((s) => s.attempts);
  const weak = lesson.prerequisiteObjectiveIds.filter((id) => summarizeMastery(id, attempts).level === 'not-started' || summarizeMastery(id, attempts).level === 'developing');
  if (weak.length === 0) return null;
  return (
    <div className="callout callout-note">
      <strong>Prerequisites without evidence yet:</strong>
      <ul>{weak.map((id) => <li key={id}>{OBJECTIVES_BY_ID.get(id)?.statement ?? id}</li>)}</ul>
      <p>Lessons for these are not built yet; if any felt shaky, that is the place to look next.</p>
    </div>
  );
}

interface BlockProps {
  block: Block;
  lesson: LessonSpec;
  stage: Stage;
  simulationVisible: boolean;
  simulationContext?: InstructorContext['simulation'];
  problems: Map<string, LessonSpec['problems'][number]>;
}

function BlockView({ block, lesson, stage, simulationVisible, simulationContext, problems }: BlockProps) {
  switch (block.type) {
    case 'text':
      return <Markdown md={block.md} />;
    case 'equation':
      return (
        <figure className="equation">
          <Tex latex={block.latex} display />
          {block.caption && <figcaption>{block.caption}</figcaption>}
        </figure>
      );
    case 'callout':
      return (
        <div className={`callout callout-${block.tone}`}>
          <span className="callout-tag">{block.tone === 'assumption' ? 'Simplification' : block.tone === 'warning' ? 'Careful' : 'Note'}</span>
          <Markdown md={block.md} />
        </div>
      );
    case 'summary':
      return (
        <ul className="summary">
          {block.points.map((p) => <li key={p}><Markdown md={p} /></li>)}
        </ul>
      );
    case 'prediction':
      return <PredictionView block={block} lessonId={lesson.id} />;
    case 'sim-task':
      return <SimTaskView block={block} />;
    case 'problem': {
      const p = problems.get(block.problemId);
      if (!p) return <p className="error">Missing problem {block.problemId}</p>;
      return <ProblemCard problem={p} lessonTitle={lesson.title} stage={stage.kind} simulationVisible={simulationVisible} {...(simulationContext ? { simulationContext } : {})} />;
    }
  }
}

function PredictionView({ block, lessonId }: { block: Extract<Block, { type: 'prediction' }>; lessonId: string }) {
  const predictions = useLearnerStore((s) => s.predictions);
  const recordPrediction = useLearnerStore((s) => s.recordPrediction);
  const applyPreset = useGravityUi((s) => s.applyPreset);
  const existing = predictions.find((p) => p.lessonId === lessonId && p.id.endsWith(block.id));
  const [choice, setChoice] = useState<string | null>(existing?.choiceId ?? null);
  const revealed = choice !== null;
  return (
    <section className="prediction">
      <p className="prediction-kicker">Predict first</p>
      <p className="prediction-q">{block.question}</p>
      <div className="options" role="radiogroup" aria-label="Your prediction">
        {block.options.map((o) => (
          <label key={o.id} className={`option ${choice === o.id ? 'selected' : ''} ${revealed && o.id === block.correctId ? 'correct' : ''}`}>
            <input
              type="radio"
              name={block.id}
              checked={choice === o.id}
              disabled={revealed}
              onChange={() => {
                setChoice(o.id);
                recordPrediction({ lessonId, choiceId: o.id, wasCorrect: o.id === block.correctId });
                applyPreset(block.revealPreset);
              }}
            />
            <span>{o.text}</span>
          </label>
        ))}
      </div>
      {revealed && (
        <div className={`feedback ${choice === block.correctId ? 'feedback-correct' : 'feedback-incorrect'}`}>
          <strong>{choice === block.correctId ? 'Your prediction holds up.' : 'Watch the simulation: it disagrees with your prediction.'}</strong>
          <Markdown md={block.explanation} />
        </div>
      )}
    </section>
  );
}

function SimTaskView({ block }: { block: Extract<Block, { type: 'sim-task' }> }) {
  const applyPreset = useGravityUi((s) => s.applyPreset);
  const [checks, setChecks] = useState<boolean[]>([]);
  return (
    <section className="sim-task">
      <div className="sim-task-head">
        <p className="prediction-kicker">Experiment</p>
        <button type="button" className="button small" onClick={() => applyPreset(block.preset)}>Load this setup</button>
      </div>
      <Markdown md={block.instructions} />
      <p className="control-label">Record what you observe:</p>
      <ul className="checklist">
        {block.observe.map((o, i) => (
          <li key={i}>
            <label>
              <input type="checkbox" checked={checks[i] ?? false} onChange={(e) => setChecks((c) => { const n = [...c]; n[i] = e.target.checked; return n; })} /> {o}
            </label>
          </li>
        ))}
      </ul>
    </section>
  );
}
