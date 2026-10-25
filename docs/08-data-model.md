# 08 · Data Model

All types are TypeScript interfaces in `src/core/**` and are the schema of record. A relational mapping is sketched for the planned backend.

## 1. Curriculum (`core/curriculum/types.ts`)

| Entity | Key fields | Notes |
|---|---|---|
| Subject | id, name, tagline | 5 subjects |
| Level | id, subjectId, name, kind (early-childhood / grade-band / university / proficiency), order | Navigation label, not a gate |
| Course → Unit → Topic → Concept | id, parent id, name (+ description/summary) | Strict tree |
| LearningObjective | id, conceptId, statement, cognitiveLevel, prerequisiteIds[], standardRefs[] | Graph edges = prerequisites; validated acyclic |
| StandardRef | framework (NGSS, CCSS-M, CEFR, ACTFL, MAA-CUPM), code, summary, url, verified, verificationNote | `verified` only after reading the official source |
| CoverageStatus | objectiveId, planned, authored, implemented, scientificallyReviewed, learnerTested, notes | Five independent booleans |

## 2. Worlds and lessons (`core/world/spec.ts`)

| Entity | Key fields |
|---|---|
| WorldSpec | id, subjectId, name, tagline, environment, lessonIds[], status (available / in-design / planned) |
| LessonSpec | id, worldId, title, subtitle, minutes, objectiveIds[], prerequisiteObjectiveIds[], standardRefs[], stages[7], problems[], mastery[], accessibilitySummary, validationTests[] |
| Stage | kind (discover…review), title, presets[], blocks[] |
| Block | text · equation · callout · prediction · sim-task · problem · summary |

## 3. Assessment (`core/assessment/types.ts`)

| Entity | Key fields |
|---|---|
| Problem (union) | id, objectiveIds[], category, difficulty 1–5, prompt, hints[], solution, allowSimulation, lowStakes |
| NumericProblem | answer {value SI, unit, relTol/absTol, assumeUnit}, misconceptions[] |
| ExpressionProblem | answer, variables[{name,min,max}], misconceptions[] |
| MultipleChoiceProblem | options[{id,text,feedback}], correctId |
| WrittenProblem | modelAnswer, rubric[] |
| GradeResult | status (correct / incorrect / ungraded / invalid), confidence (deterministic / heuristic / none), feedback, misconceptionId, detail |

## 4. Simulation (`core/simulation/types.ts`)

`Measurement {id, label, value, unit, formula?, source: analytic | numerical}` and the `Simulation<State, Params>` interface. World models own their own `State`/`Params` (e.g. `Body[]` with SI position/velocity).

## 5. Learner (`core/learner/*`)

| Entity | Key fields | Persistence |
|---|---|---|
| Attempt | id, problemId, objectiveIds[], category, status, hintsUsed, usedSimulation, selfAssessedMet, lowStakes, timestamp | localStorage `openpath.learner.v1` |
| Prediction | id, lessonId, choiceId, wasCorrect, timestamp | same |
| hintsRevealed | problemId → count | same |
| Location | worldId, lessonId, stageIndex | same (resume) |
| completedStages | lessonId → stage indices | same |
| MasterySummary (derived) | level, attempts, correct, independentCorrect, independentTransferCorrect, distinctCorrectProblems, recentStreak, nextSteps | computed, never stored |

## 6. Relational sketch (planned backend)

```
learners(id, created_at, locale, consent_flags)
attempts(id, learner_id, problem_id, objective_ids[], category, status, hints_used, used_simulation,
         self_assessed_met, low_stakes, created_at)              -- append-only
predictions(id, learner_id, lesson_id, prediction_id, choice_id, was_correct, created_at)
locations(learner_id PK, world_id, lesson_id, stage_index, updated_at)
stage_completions(learner_id, lesson_id, stage_index, completed_at)
content_versions(id, kind, content_id, version, json, reviewed_by, reviewed_at)   -- lessons/problems as JSON
coverage(objective_id PK, planned, authored, implemented, reviewed, learner_tested, notes)
```
Mastery remains a query over `attempts`. Content stays JSON validated by the same TypeScript schema and `validateLesson` on import.

## 7. Privacy stance

No account or personal data is collected in milestone 1. The planned backend stores attempts under an opaque learner id; names/emails live in a separate table with explicit consent flags so learning data can be analysed without identities.
