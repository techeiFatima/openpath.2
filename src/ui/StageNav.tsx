import { STAGE_LABELS, type Stage } from '@/core/world/spec';

interface Props {
  stages: Stage[];
  current: number;
  completed: number[];
  onSelect(index: number): void;
}

export function StageNav({ stages, current, completed, onSelect }: Props) {
  return (
    <nav className="stage-nav" aria-label="Lesson stages">
      <ol>
        {stages.map((s, i) => {
          const state = i === current ? 'current' : completed.includes(i) ? 'done' : 'todo';
          return (
            <li key={s.kind} className={`stage-pill ${state}`}>
              <button type="button" onClick={() => onSelect(i)} aria-current={i === current ? 'step' : undefined} title={s.title}>
                <span className="stage-num">{i + 1}</span>
                <span className="stage-label">{STAGE_LABELS[s.kind]}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
