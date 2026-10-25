import { useMemo, useState } from 'react';
import { grade } from '@/core/assessment/grade';
import type { GradeResult, Problem } from '@/core/assessment/types';
import { ScriptedInstructor, type InstructorContext } from '@/core/instructor/instructor';
import { summarizeMastery } from '@/core/learner/mastery';
import { useLearnerStore } from '@/core/learner/store';
import type { StageKind } from '@/core/world/spec';
import { OBJECTIVES_BY_ID } from '@/worlds/catalog';
import { Markdown } from './Markdown';

interface Props {
  problem: Problem;
  lessonTitle: string;
  stage: StageKind;
  /** Whether the simulation is visible while this problem is open. */
  simulationVisible: boolean;
  simulationContext?: InstructorContext['simulation'];
}

const instructor = new ScriptedInstructor();
const MAX_WRONG_BEFORE_SOLUTION = 3;

export function ProblemCard({ problem, lessonTitle, stage, simulationVisible, simulationContext }: Props) {
  const attempts = useLearnerStore((s) => s.attempts);
  const hintsRevealed = useLearnerStore((s) => s.hintsRevealed[problem.id] ?? 0);
  const recordAttempt = useLearnerStore((s) => s.recordAttempt);
  const revealHint = useLearnerStore((s) => s.revealHint);

  const [input, setInput] = useState('');
  const [result, setResult] = useState<GradeResult | null>(null);
  const [helpText, setHelpText] = useState<string | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [rubricChecks, setRubricChecks] = useState<boolean[]>([]);

  const mine = useMemo(() => attempts.filter((a) => a.problemId === problem.id), [attempts, problem.id]);
  const solved = mine.some((a) => a.status === 'correct');
  const wrong = mine.filter((a) => a.status === 'incorrect').length;
  const objective = OBJECTIVES_BY_ID.get(problem.objectiveIds[0] ?? '');

  const ctx = (lastGrade?: GradeResult): InstructorContext => ({
    lessonTitle,
    stage,
    objective: objective ?? { id: problem.objectiveIds[0] ?? '?', conceptId: '', statement: '', cognitiveLevel: 'apply', prerequisiteIds: [], standardRefs: [] },
    prerequisiteMastery: (objective?.prerequisiteIds ?? []).map((id) => ({ objectiveId: id, level: summarizeMastery(id, attempts).level })),
    problem,
    attemptsOnProblem: mine,
    ...(lastGrade ? { lastGrade } : {}),
    hintsGiven: hintsRevealed,
    ...(simulationContext ? { simulation: simulationContext } : {}),
  });

  const submit = () => {
    if (problem.kind === 'written') {
      const r = grade(problem, input);
      setResult(r);
      return;
    }
    const r = grade(problem, input);
    setResult(r);
    setHelpText(null);
    if (r.status !== 'invalid') {
      recordAttempt({
        problemId: problem.id,
        objectiveIds: problem.objectiveIds,
        category: problem.category,
        status: r.status,
        hintsUsed: hintsRevealed,
        usedSimulation: simulationVisible,
        ...(problem.lowStakes ? { lowStakes: true } : {}),
      });
    }
  };

  const askForHelp = () => {
    const reply = instructor.help(ctx(result ?? undefined));
    if (reply.grounding === 'hint-ladder' || reply.grounding === 'solution') revealHint(problem.id);
    if (reply.grounding === 'solution') setShowSolution(true);
    setHelpText(reply.text);
  };

  const submitWrittenSelfAssessment = (met: boolean) => {
    recordAttempt({
      problemId: problem.id,
      objectiveIds: problem.objectiveIds,
      category: problem.category,
      status: 'ungraded',
      hintsUsed: hintsRevealed,
      usedSimulation: simulationVisible,
      selfAssessedMet: met,
    });
    setResult({ status: 'ungraded', confidence: 'none', feedback: met ? 'Recorded. Written work counts as developing evidence; graded problems are needed for mastery.' : 'Recorded. Re-read the model answer and try explaining it again later.' });
  };

  const independent = hintsRevealed === 0 && !simulationVisible;

  return (
    <section className={`problem ${solved ? 'solved' : ''}`} aria-labelledby={`${problem.id}-prompt`}>
      <header className="problem-head">
        <span className="problem-category">{problem.category.replace('-', ' ')}</span>
        <span className="problem-difficulty" aria-label={`difficulty ${problem.difficulty} of 5`}>{'●'.repeat(problem.difficulty)}{'○'.repeat(5 - problem.difficulty)}</span>
        {solved && <span className="problem-solved">✓ solved</span>}
      </header>
      <div id={`${problem.id}-prompt`}>
        <Markdown md={problem.prompt} className="problem-prompt" />
      </div>

      {problem.kind === 'multiple-choice' ? (
        <div className="options" role="radiogroup" aria-label="Answer options">
          {problem.options.map((o) => (
            <label key={o.id} className={`option ${input === o.id ? 'selected' : ''}`}>
              <input type="radio" name={problem.id} value={o.id} checked={input === o.id} onChange={() => setInput(o.id)} disabled={solved} />
              <Markdown md={o.text} />
            </label>
          ))}
        </div>
      ) : problem.kind === 'written' ? (
        <textarea className="answer-text" rows={4} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Write your explanation in a few sentences…" aria-label="Your explanation" />
      ) : (
        <input
          className="answer-input"
          type="text"
          inputMode={problem.kind === 'numeric' ? 'decimal' : 'text'}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder={problem.kind === 'numeric' ? 'e.g. 7.67 km/s' : `Expression in ${problem.variables.map((v) => v.name).join(', ')}`}
          aria-label="Your answer"
          disabled={solved}
        />
      )}

      <div className="problem-actions">
        {!solved && <button type="button" className="button primary" onClick={submit} disabled={!input.trim()}>{problem.kind === 'written' ? 'Compare with model answer' : 'Check'}</button>}
        {!solved && problem.kind !== 'written' && <button type="button" className="button" onClick={askForHelp}>{hintsRevealed < problem.hints.length ? `Hint (${hintsRevealed}/${problem.hints.length} used)` : 'Show solution'}</button>}
        {(solved || showSolution || wrong >= MAX_WRONG_BEFORE_SOLUTION) && <button type="button" className="button ghost" onClick={() => setShowSolution((s) => !s)}>{showSolution ? 'Hide solution' : 'Show solution'}</button>}
        <span className={`independence ${independent ? 'yes' : 'no'}`} title="Full mastery credit needs: no hints and simulation hidden">
          {independent ? 'independent attempt' : simulationVisible ? 'simulation open' : 'hints used'}
        </span>
      </div>

      {result && (
        <div className={`feedback feedback-${result.status}`} role="status">
          <Markdown md={result.feedback} />
          {result.status === 'ungraded' && result.detail && typeof result.detail === 'object' && 'modelAnswer' in result.detail && (
            <div className="rubric">
              <h4>Model answer</h4>
              <Markdown md={String(result.detail.modelAnswer)} />
              <h4>Did your answer…</h4>
              <ul>
                {(result.detail.rubric as string[]).map((r, i) => (
                  <li key={i}>
                    <label>
                      <input type="checkbox" checked={rubricChecks[i] ?? false} onChange={(e) => setRubricChecks((c) => { const n = [...c]; n[i] = e.target.checked; return n; })} /> {r}
                    </label>
                  </li>
                ))}
              </ul>
              <div className="problem-actions">
                <button type="button" className="button primary" onClick={() => submitWrittenSelfAssessment((result.detail!.rubric as string[]).every((_, i) => rubricChecks[i]))}>Record my self-assessment</button>
              </div>
            </div>
          )}
        </div>
      )}

      {helpText && (
        <div className="instructor" role="note">
          <span className="instructor-label">Instructor</span>
          <Markdown md={helpText} />
        </div>
      )}

      {showSolution && (
        <details className="solution" open>
          <summary>Worked solution</summary>
          <Markdown md={problem.solution} />
        </details>
      )}
    </section>
  );
}
