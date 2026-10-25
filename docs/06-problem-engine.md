# 06 · Problem-Solving Engine

How OpenPath supports and validates different kinds of answers, what is deterministic today, and where the limits are.

## 1. Answer types: status

| # | Answer type | Status | Grader | Confidence reported |
|---|---|---|---|---|
| 1 | Numeric (with units, tolerance) | **Implemented** | `gradeNumeric` | deterministic |
| 2 | Algebraic expression | **Implemented** (numeric-sampling equivalence) | `gradeExpression` | deterministic within declared domain |
| 3 | Equations and inequalities | Designed: equation ⇒ compare solution sets via the symbolic service | — | — |
| 4 | Graphing | Designed: learner places points/curves; compare sampled residuals and key features (intercepts, extrema) | — | — |
| 5 | Geometry constructions | Designed: evaluate relations (perpendicularity, equal lengths, incidence) on the constructed objects, not pixels | — | — |
| 6 | Word problems | **Implemented** as numeric/expression with category `word-problem`/`transfer` | existing graders | deterministic |
| 7 | Multi-step calculations | **Implemented** (category `multi-step`, intermediate misconceptions) | numeric | deterministic |
| 8 | Symbolic manipulation | Partial: expression equivalence yes; "show the step" no | — | — |
| 9 | Units and dimensional analysis | **Implemented**: dimension check, unit conversion, factor-of-10 diagnostics | numeric | deterministic |
| 10 | Experimental interpretation | **Implemented** as sim-task checklists (ungraded) + numeric readings | — | none |
| 11 | Multiple representations | Partial: equation blocks + measurements with formulas; graph input not yet | — | — |
| 12 | Written reasoning | **Implemented as ungraded** with model answer + rubric self-check | `gradeWritten` | none |
| 13 | Proofs and counterexamples | Designed: structured proof steps with a checker for propositional/first-order fragments; otherwise rubric + human review | — | — |
| 14 | Open-ended challenges | Designed: portfolio items, never auto-"correct" | — | — |
| 15 | Real-world applications | **Implemented** as transfer problems | existing graders | deterministic |

`GradeResult.confidence` is part of the data model precisely so the UI and the learner model can treat *deterministic*, *heuristic* and *none* differently. Written work is stored with `status: 'ungraded'` and can never raise mastery above *developing*.

## 2. Numeric grading (implemented)

- Parses `7.67 km/s`, `7,672 m/s`, `3.986e14`, `3.986 × 10^14 m^3/s^2`, `−2.5 km/s`.
- Converts to SI via an explicit unit table (length, time, speed, mass, acceleration, force, energy, specific energy, gravitational parameter). Unknown unit ⇒ `invalid` with guidance, never `incorrect`.
- Dimension mismatch ⇒ `incorrect` with the two dimensions named.
- Tolerance: relative (default 2%) or absolute.
- Diagnostics in order: correct → authored misconceptions → factor of 10^k (unit slip) → factor 2 (radius/diameter) → sign → "close" vs "not yet".
- Bare numbers assume the problem's unit unless `assumeUnit` says otherwise (e.g. minutes for a period question).

## 3. Expression grading (implemented)

Tokenizer + shunting-yard parser (`+ − × ÷ ^`, unary minus, implicit multiplication such as `2GM`, `GM/r`, `√`), functions `sqrt cbrt abs sin cos tan exp ln log`, constants `pi e`. Equivalence by evaluating both expressions at 60 seeded points (log-uniform across orders of magnitude), relative tolerance 1e-6, requiring both to be defined on ≥80% of points. Unknown symbols ⇒ `invalid`. Named wrong forms give targeted feedback.

**Limits (documented, not hidden):** sampling cannot distinguish expressions that agree on the sampled domain but differ elsewhere (e.g. branch choices, removable singularities, `|x|` vs `x` on a positive domain). It also cannot *explain* a difference. Both are reasons for the symbolic service below.

## 4. Symbolic service (designed)

A small HTTP service wrapping **SymPy** (Python) with endpoints: `equivalent(a, b, assumptions)`, `simplify`, `solve_set(equation, var, domain)`, `check_step(from, to)`. Policies: declare variable domains and assumptions (positivity, integrality) per problem; fall back to numeric sampling when `simplify(a−b)` is inconclusive; always return a reason string. The client side already isolates grading behind `grade()` so swapping the expression grader is local.

## 5. Geometry and graphing (designed)

Inputs are *objects* (points, segments, circles, functions), not images. Checks are relational: `perpendicular(AB, CD)` within angular tolerance, `|PA| = |PB|` within relative tolerance, `on(P, circle)`. For graph sketches: sampled residual vs the target function plus feature checks (zeros, extrema, asymptotes), each reported separately so feedback is specific.

## 6. Proofs (designed)

Tiered: (a) a structured step editor over a small logic where each step is checked mechanically; (b) outside that fragment, a rubric with reference proof and *human review queue*; (c) no LLM verdict is ever shown as "correct". The UI must say "not automatically checked".

## 7. Independence and mastery credit

Every attempt stores `hintsUsed` and `usedSimulation`. The mastery rule (doc 04) requires independent solves including a transfer problem, so a learner who reaches the answer through repeated hints cannot earn the same credit as one who solves an equivalent problem alone.

## 8. Tests

`src/core/assessment/grade.test.ts` (parsing, tolerance, dimensions, misconceptions, factor-of-10, expression equivalence, invalid vs incorrect, written never correct) and `src/worlds/gravity/content/content.test.ts` (every authored reference answer grades correct; every misconception attributed; answers agree with the physics model within 1%).
