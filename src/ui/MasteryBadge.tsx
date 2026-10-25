import { summarizeMastery } from '@/core/learner/mastery';
import { useLearnerStore } from '@/core/learner/store';
import { OBJECTIVES_BY_ID } from '@/worlds/catalog';

export function MasteryBadge({ objectiveId, showNext = false }: { objectiveId: string; showNext?: boolean }) {
  const attempts = useLearnerStore((s) => s.attempts);
  const summary = summarizeMastery(objectiveId, attempts);
  const objective = OBJECTIVES_BY_ID.get(objectiveId);
  return (
    <div className={`mastery mastery-${summary.level}`}>
      <div className="mastery-head">
        <span className="mastery-level">{summary.level.replace('-', ' ')}</span>
        <span className="mastery-stats" title="correct / attempts (independent correct)">
          {summary.correct}/{summary.attempts} · {summary.independentCorrect} independent
        </span>
      </div>
      <p className="mastery-statement">{objective?.statement ?? objectiveId}</p>
      {showNext && <p className="mastery-next">{summary.nextSteps}</p>}
    </div>
  );
}
