import { useLearnerStore } from '@/core/learner/store';
import { summarizeMastery } from '@/core/learner/mastery';
import { MasteryBadge } from '@/ui/MasteryBadge';
import { LESSONS_BY_ID, WORLDS } from '@/worlds/registry';
import { lessonHref } from './router';

export function Home() {
  const lastLocation = useLearnerStore((s) => s.lastLocation);
  const attempts = useLearnerStore((s) => s.attempts);
  const completed = useLearnerStore((s) => s.completedStages);
  const resumeLesson = lastLocation ? LESSONS_BY_ID.get(lastLocation.lessonId) : undefined;

  return (
    <main className="home">
      <header className="home-hero">
        <p className="brand">OpenPath</p>
        <h1>A universe of knowledge anyone can explore.</h1>
        <p className="lede">Enter a world. Push on it. Predict, measure, derive, and then prove to yourself that you can solve what you have never seen.</p>
        {resumeLesson && lastLocation && (
          <a className="button primary" href={lessonHref(lastLocation.worldId, lastLocation.lessonId, lastLocation.stageIndex)}>
            Continue: {resumeLesson.title} · stage {lastLocation.stageIndex + 1}
          </a>
        )}
      </header>

      <section aria-labelledby="worlds-heading">
        <h2 id="worlds-heading">Worlds</h2>
        <div className="world-grid">
          {WORLDS.map((w) => (
            <article key={w.id} className={`world-card ${w.status}`} aria-disabled={w.status !== 'available'}>
              <div className="world-card-head">
                <span className="subject">{w.subjectId}</span>
                <span className={`status status-${w.status}`}>{w.status === 'available' ? 'Open' : w.status === 'in-design' ? 'In design' : 'Planned'}</span>
              </div>
              <h3>{w.name}</h3>
              <p>{w.tagline}</p>
              {w.status === 'available' && (
                <ol className="lesson-list">
                  {w.lessonIds.map((id, i) => {
                    const l = LESSONS_BY_ID.get(id)!;
                    const done = (completed[id] ?? []).length;
                    const mastered = l.objectiveIds.filter((o) => summarizeMastery(o, attempts).level === 'mastered').length;
                    return (
                      <li key={id}>
                        <a href={lessonHref(w.id, id, 0)}>
                          <span className="lesson-index">{i + 1}</span>
                          <span className="lesson-title">
                            {l.title}
                            <small>{l.subtitle} · {l.minutes} min</small>
                          </span>
                          <span className="lesson-progress" aria-label={`${done} of ${l.stages.length} stages, ${mastered} of ${l.objectiveIds.length} objectives mastered`}>
                            {done}/{l.stages.length} stages · {mastered}/{l.objectiveIds.length} mastered
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ol>
              )}
            </article>
          ))}
        </div>
      </section>

      {attempts.length > 0 && (
        <section aria-labelledby="progress-heading" className="progress-section">
          <h2 id="progress-heading">Your mastery</h2>
          <div className="badge-row">
            {[...new Set(attempts.flatMap((a) => a.objectiveIds))].map((o) => <MasteryBadge key={o} objectiveId={o} />)}
          </div>
        </section>
      )}

      <footer className="home-footer">
        <p>Everything runs in your browser and your progress is saved on this device. No account needed.</p>
      </footer>
    </main>
  );
}
