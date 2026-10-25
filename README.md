# OpenPath

**A universe of knowledge anyone can explore.** OpenPath turns concepts into interactive worlds where learners predict, experiment, derive, and then prove to themselves they can solve problems they have never seen, without losing the rigour of a good textbook.

This repository holds the platform foundation and five worlds: **Gravity Lab** (physics), **Functions & Calculus** (mathematics), **Atoms & Molecules** (chemistry), **Inside the Cell** (biology) and **Conversation Street** (English A1).

## Run it

```sh
npm install
npm run dev        # http://localhost:5173
npm run check      # typecheck + unit tests + production build
npm run coverage   # curriculum coverage table
npm run build && npm run preview
```
Requires Node 20+. Everything runs in the browser; progress is stored locally (no account).

## What is here

| Area | Path | Status |
|---|---|---|
| Design documents (architecture, curriculum, licensing registry, learning-experience spec, world engine, problem engine, AI instructor, data model, roadmap, milestone report) | `docs/` | written |
| Curriculum model + prerequisite graph | `src/core/curriculum` | implemented, tested |
| Lesson/world specification + validation | `src/core/world` | implemented, tested |
| Assessment engine (numeric with units, expression equivalence, multiple choice, ungraded written) | `src/core/assessment` | implemented, tested |
| Learner model (attempts, computed mastery, resume, spaced review) | `src/core/learner` | implemented, tested |
| Instructor (scripted hint ladder, misconception feedback, grounded prompt builder) | `src/core/instructor` | implemented, tested; no LLM wired |
| Gravity Lab physics (leapfrog N-body, analytic two-body checks, solar-system data) | `src/worlds/gravity/model` | implemented, validated by tests |
| Gravity Lab lessons (3 lessons × 7 stages, 27 problems) | `src/worlds/gravity/content` | authored; not yet reviewed by a second physicist or tested with learners |
| Gravity Lab 3D world (React Three Fiber) | `src/worlds/gravity/ui` | implemented |
| Functions & Calculus: exact polynomial calculus, SVG graph, 4 lessons | `src/worlds/math` | implemented; not reviewed or learner-tested |
| Atoms & Molecules: element data, configurations, curated molecules, atom builder, periodic table, molecule viewer, 4 lessons | `src/worlds/chemistry` | implemented; data marked for re-verification |
| Inside the Cell: scale explorer, DNA workbench, 3 lessons | `src/worlds/biology` | implemented; sizes labelled typical |
| Conversation Street: scripted A1 dialogues, rule-based coach, phrasebook with unreviewed Dari glosses, 3 lessons | `src/worlds/language` | implemented |
| Planned unit/topic maps for all 58 courses + coverage report | `src/worlds/curriculum-maps.ts`, `scripts/coverage.ts` | skeleton only |
| Curriculum source registry | `data/curriculum-sources.json`, `docs/03-resource-registry.md` | written; most entries *Unverified* pending reads of official pages |

Each world has 3–4 lessons; the remaining 50+ planned courses are mapped to units and topics but have no content yet (see `docs/11-milestone-2-report.md`).

## Principles baked into the code

- Simulation, rendering, assessment, instruction and the learner model are separate layers; the renderer never computes physics and the instructor never decides correctness.
- Grading is deterministic; written answers are explicitly *ungraded*; mastery requires independent solves including a transfer problem.
- Simplifications are shown to learners; data sources and their verification status are recorded in code comments and docs.

## License of this repository

Not yet decided; see `docs/03-resource-registry.md` for third-party terms that constrain the choice (copyleft sources).
