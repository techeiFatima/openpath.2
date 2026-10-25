# 10 · Milestone 1 Report — Foundation + Gravity Lab

Date: 2026-10-25

## What was implemented

**Platform core (`src/core`)**
- Curriculum types and a prerequisite graph with cycle detection, topological order, transitive and missing prerequisites; referential validation of the whole catalog.
- Reusable `WorldSpec`/`LessonSpec` with the seven instructional stages and seven block types; `validateLesson` enforces structure and problem variety.
- Assessment engine: numeric answers with unit parsing/conversion, dimension checks, tolerance, authored misconceptions and factor-of-10/2/sign diagnostics; algebraic expressions graded by seeded numeric sampling with implicit multiplication and named wrong forms; multiple choice; written answers explicitly *ungraded* with model answer and rubric self-check.
- Learner model: append-only attempts recording hints used and whether the simulation was open; mastery computed from evidence (independent transfer required for "mastered"); spaced-review scheduling function; local persistence; resume location.
- Instructor: scripted hint ladder, misconception voicing, prerequisite redirect after repeated failure, worked solution after the ladder; a tested `buildGroundedPrompt` that defines the future LLM boundary. No LLM is called.

**Gravity Lab (`src/worlds/gravity`)**
- Physics: leapfrog N-body integrator in SI units, collision detection, closed-form two-body results (circular/escape speed, period, Kepler ratio, orbit classification from launch conditions and from state vectors).
- Data: masses and radii from the NASA fact sheet values; semi-major axes and eccentricities from JPL J2000 elements; sidereal periods.
- Presets: Space Station orbit, zero-sideways-speed fall, Newton's cannon, faster-than-circular, escape, free experiment, solar system.
- 3D world: React Three Fiber scene (true proportions in orbit lab; labelled compressed distances for the solar system), controls (central body, launch distance/speed/angle, time scale, presets), live measurements tagged *numerical* vs *analytic* with their formulas, model assumptions, text mode, mobile layout.
- Content: 3 lessons × 7 stages, 27 problems across conceptual, computation, procedural, multi-step, error-identification, application, transfer and explanation categories; 5 predictions; 4 sim-tasks.

**Documents** `docs/01`–`09`, `README.md`, registry data `data/curriculum-sources.json`.

## How to run

```sh
npm install
npm run dev            # http://localhost:5173
npm run check          # typecheck + unit tests + production build
npm run build && npm run preview -- --port 4173 && npm run test:e2e   # browser smoke test
```

## What was tested

| Suite | Count | What it proves |
|---|---|---|
| `core/curriculum/graph.test.ts` | 5 | ordering, cycles, transitive/missing prerequisites, integrity validation |
| `core/assessment/grade.test.ts` | 13 | parsing of number/unit notations, tolerance, dimension mismatch, misconception attribution, factor-of-10 slips, expression equivalence incl. √, implicit multiplication, unary minus, right-assoc powers; invalid vs incorrect; written never "correct" |
| `core/learner/mastery.test.ts` | 7 | hint-driven solves do not earn mastery; independence; distinct-problem rule; streak reset; low-stakes ignored |
| `core/instructor/instructor.test.ts` | 4 | hint ladder → solution; misconception priority; prerequisite redirect; prompt contains grounding rules and measurements |
| `worlds/gravity/model/gravity.test.ts` | 12 | ISS speed/period, escape speed, geostationary radius, Kepler's third law across all 8 planets (<0.5%), Moon period; orbit classification cases; circular orbit radius drift <1e-4 and energy drift <1e-4 over 10 orbits; numerical period within 0.1% of analytic; crash detection; Earth's year reproduced in a 9-body run within 0.5%; measurements agree with closed forms |
| `worlds/gravity/content/content.test.ts` | 5 | every lesson passes `validateLesson`; catalog graph valid; every reference answer grades correct; every misconception attributed; numeric answers agree with the physics model within 1% |
| `worlds/gravity/ui/format.test.ts`, `app/router.test.ts` | 4 | display units; deep links |
| `tests/unit/sources.test.ts` | 3 | registry completeness; no "Verified" without repo evidence; no NC licence marked verified |
| **Total unit tests** | **53** | all passing (`vitest`) |
| Browser smoke test (headless Chromium, production build) | 1 script | home → lesson → prediction reveal → cannon crash → misconception feedback → correct answer → hint → hidden sim in Demonstrate → mastery badges → solar system table/labels → phone layout → resume link; **zero page errors** |

Screenshots from the smoke run were inspected manually for the Discover stage (orbit lab), the solar system, and the phone layout.

## What works

The full learner loop for three gravity lessons: predict, experiment with a trustworthy model, read the derivation, practise with targeted feedback and hints, apply to unfamiliar bodies, demonstrate without the simulation, review mastery with prerequisite gaps named, and resume from a URL. It runs offline after first load, on a phone layout, with a text alternative.

## What remains incomplete (be precise)

1. **The Gravity Lab HTML prototype named in the brief was not provided** (not in the repository, the attached Drive, or the environment). Gravity Lab was built from scratch; if the prototype exists, its ideas should be compared against this build.
2. **No scientific review by a second physicist and no learner testing.** `CoverageStatus` says so for all six objectives.
3. **Reference data verification.** NASA and JPL pages were unreachable from the build environment (network policy). Values are standard and pass an internal Kepler's-law consistency test to 0.5%, but must be re-read from the official pages before sign-off.
4. **Licensing registry is mostly *Unverified*.** All official license pages were blocked; only repository-hosted license files were read verbatim. Nothing third-party is reused yet, so this blocks nothing today, but it must be redone from an open network.
5. **No LLM instructor**; the scripted instructor is the only one. Dari/Pashto explanations are not available.
6. **Written answers are ungraded** by design; proofs, equations, graphing and geometry answer types are designed, not built.
7. **Three.js chunk is ~1.16 MB (317 kB gzip)**. Acceptable for a first world but heavy for 2G/3G; a 2D fallback renderer for Gravity Lab is on the roadmap. KaTeX fonts add ~0.5 MB across weights (loaded on demand by the browser).
8. **Only 3 lessons**; the four prerequisite objectives referenced by the Review stage have no lessons yet.
9. **No accounts, sync, or educator views.** Progress is per device.
10. **Known UI limits:** label overlap near the inner planets in the solar-system view; the orbit-lab trail is cleared when settings change (intended) and there is no "ghost" of the previous orbit for comparison.

## What should be implemented next (ordered)

1. Second-physicist review of lessons and data; re-verify NASA/JPL values and the NGSS wording from an open network; flip `scientificallyReviewed` only after that.
2. Learner test with 5–8 learners on Lesson 1; record where they stall; recalibrate mastery thresholds and hint wording.
3. Due-review surfacing on the home page and the four prerequisite mini-lessons (two mathematics, two mechanics), which also starts the Mathematics world's content.
4. Symbolic grading service (SymPy) behind `grade()`; add equation answers.
5. LLM instructor behind `buildGroundedPrompt` with the ungrounded-number filter and offline evaluation; Dari/Pashto.
6. Functions & Calculus world on a 2D canvas, reusing the expression engine, as the architecture test for a non-3D environment.
