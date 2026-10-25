# 04 · Learning Experience Specification

How a concept becomes an interactive experience. This is the contract every lesson in every world follows; the schema is `LessonSpec` in `src/core/world/spec.ts` and is validated by `validateLesson`, which runs in the test suite for every authored lesson.

## 1. The seven stages, with what each must contain

| Stage | Purpose | Required block(s) | Learner's independence |
|---|---|---|---|
| **Discover** | A phenomenon or puzzle; commit to a prediction before any explanation | ≥1 `prediction` (low-stakes, never counts toward mastery) tied to a `revealPreset` the simulation runs | n/a |
| **Explore** | Manipulate the model; record observations | ≥1 `sim-task` with an `observe` checklist; an `assumption` callout naming simplifications | guided |
| **Understand** | Connect observations to formal explanation: definitions, equations, derivations, terminology | `equation` blocks with captions; a `summary` | reading |
| **Practice** | Varied problem types at increasing difficulty with hints available; simulation stays open | ≥4 problems spanning categories (conceptual, computation, procedural, multi-step, error-identification…) | hints allowed |
| **Apply** | New situations; learner chooses which relationships apply | ≥1 `transfer`/`application` problem; ≥1 `explanation` (written) | hints allowed |
| **Demonstrate** | Evidence of mastery: unfamiliar problems, simulation hidden | ≥2 problems; the world hides the viewport and pauses the sim | no sim; hints penalise credit |
| **Review** | Mastery summary, spaced-review schedule, prerequisite redirect | `MasteryBadge` per objective, `PrerequisiteCheck` | n/a |

`validateLesson` fails a lesson that lacks any stage, references an unknown problem, has an unused problem, has no transfer/application problem, has no conceptual/explanation problem, or has a non-written problem without hints.

## 2. Problem design rules

1. **Every numeric problem names its misconceptions.** Each `NumericProblem` may carry `misconceptions: {value, feedback}`. The grader checks these *after* the correct answer and *before* generic diagnostics, so a learner who forgot a square root hears exactly that. The content test suite asserts every misconception value is graded incorrect and attributed to its id.
2. **Expression problems declare a domain.** Equivalence is judged by sampling inside `variables[].min..max` (log-uniform across orders of magnitude). Named wrong forms give targeted feedback.
3. **Reference answers are validated against the model.** The content test recomputes each physics answer from `model/analytic.ts` and fails if the authored value drifts by more than 1%.
4. **Written answers are never auto-graded.** The learner compares against a model answer and a rubric, then records a self-assessment that counts as *developing* evidence only.
5. **Difficulty 1–5 and a category** are mandatory so a lesson's variety can be audited.
6. **Hints are a ladder** (least → most specific). The last rung reveals the method; after the ladder is exhausted the instructor shows the worked solution rather than looping.

## 3. Mastery evidence (see `src/core/learner/mastery.ts`)

| Level | Rule |
|---|---|
| not-started | no attempts |
| developing | any attempt |
| proficient | ≥2 distinct problems correct, each with ≤1 hint, and the last two graded attempts correct |
| mastered | ≥3 distinct problems correct, ≥2 of them independent (0 hints, sim hidden), ≥1 independent *transfer/application* problem, last two attempts correct |

Low-stakes predictions and invalid submissions are ignored. Repeating the same problem does not add distinct evidence. These thresholds are a documented starting point for calibration, not a validated instrument.

## 4. Review scheduling

`nextReviewAt` uses expanding intervals (1, 3, 7, 14, 30 days) after an objective reaches proficient. Surfacing due reviews in the home screen is planned (doc 09); the function exists and is tested.

## 5. Accessibility requirements per lesson

- `accessibilitySummary`: a plain-language description of what the simulation shows (rendered in Text mode).
- All interactions are native inputs with labels; no canvas-only controls.
- Measurements are available as a live text table; an `aria-live` region announces the state every ~3 s.
- Equations are rendered by KaTeX with MathML output for assistive tech.

## 6. Authoring checklist for a new lesson

1. Pick objectives from the catalog (or add them with prerequisites and standard refs).
2. Compute reference values from the model module and put them in the lesson header comment.
3. Write the seven stages following §1.
4. Add problems with hints, misconceptions, solution.
5. Run `npm test`: `validateLesson`, misconception attribution and model-agreement tests must pass.
6. Add a line to the coverage table (`CoverageStatus`) and leave `scientificallyReviewed: false` until a second reviewer signs off.
