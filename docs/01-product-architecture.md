# 01 · Product Architecture

**Status:** Milestone 1 design, implemented for the Gravity Lab slice. Everything marked *planned* is not built.

## 1. One sentence

OpenPath is a set of **learning worlds** (interactive, model-driven environments) wrapped in a shared **learning engine** (curriculum graph, seven-stage lessons, rigorous assessment, learner model, grounded instructor), delivered as a browser app that runs on modest hardware and works offline-first.

## 2. The six layers and the rule that keeps them apart

| Layer | Answers | Code (today) | Must never |
|---|---|---|---|
| **Curriculum** | What should the learner understand? | `src/core/curriculum/*`, `src/worlds/catalog.ts` | know how anything is rendered or graded |
| **Simulation** | How does the environment behave? | `src/core/simulation/types.ts`, `src/worlds/gravity/model/*` | import React or Three.js |
| **Rendering** | How does it look and respond? | `src/worlds/gravity/ui/Scene.tsx` | compute physics (it only maps SI state to pixels) |
| **Assessment** | Was understanding demonstrated? | `src/core/assessment/*` | ask an LLM whether an answer is right |
| **AI Instruction** | How is help personalised? | `src/core/instructor/*` | compute results or override a grader verdict |
| **Learner model** | What does this learner know; what next? | `src/core/learner/*` | be edited by the instructor layer |

The rule: **computational truth flows one way.** Simulation → measurements; grader → verdicts; curriculum → text. The instructor reads all three and may only *explain and connect*. This is enforced structurally: `InstructorContext` is assembled by code, and the only instructor implementation today (`ScriptedInstructor`) has no way to produce numbers that are not already in the context. `buildGroundedPrompt` is the future LLM boundary and is unit-tested for containing the grounding rules.

## 3. System diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│ Browser (React 19 + TypeScript, Vite)                                │
│                                                                      │
│  App shell ── hash router ── Home / World route                      │
│      │                                                               │
│  ┌───▼──────────────── World (e.g. Gravity Lab) ─────────────────┐   │
│  │  LessonView (7 stages)   │  Scene (R3F)   │ Controls/Measures │   │
│  │        │                 │     ▲ reads    │        ▲ reads    │   │
│  │  ProblemCard ──grade()──►│  Simulation instance (pure TS)     │   │
│  │        │                 └────────────────────────────────────┘   │
│  │  ScriptedInstructor ◄── InstructorContext (objective, verdict,     │
│  │                          hints, sim measurements, prereq mastery) │
│  └───────────────┬──────────────────────────────────────────────────┘ │
│                  ▼                                                    │
│  Learner store (zustand + localStorage): attempts, predictions,      │
│  hints revealed, last location, completed stages                     │
└──────────────────────────────────────────────────────────────────────┘
          planned ▼ sync                       planned ▼ LLM calls
   Backend: accounts, progress sync,     Instructor service: receives the
   content CMS, review workflow          grounded prompt, never raw state
```

## 4. Key decisions and trade-offs

1. **Local-first, no backend in milestone 1.** Everything (progress, hints, resume point) lives in `localStorage`. *Why:* the mission includes learners with intermittent connectivity and no accounts; a learner can use the whole Gravity Lab offline after first load. *Cost:* no cross-device sync, no educator view yet. The store is `partialize`d so a sync layer can mirror exactly the persisted fields later.
2. **Pure-TypeScript simulations with analytic cross-checks.** The N-body integrator (leapfrog) is validated against closed-form two-body results in tests (circular orbit radius drift < 1e-4, energy drift < 1e-4, period error < 0.1%, Earth's year reproduced in a full 9-body run to 0.5%). *Why:* learners' measurements must be trustworthy, and the renderer must be allowed to be approximate (compressed solar-system distances) without ever touching the numbers.
3. **Mastery is computed, never stored.** `summarizeMastery` derives a level from the attempt log each time. *Why:* rules will be recalibrated after learner testing; a computed level means no data migrations and a complete audit trail of *why* a learner is "proficient".
4. **Hint-driven and simulation-assisted solves are recorded as such.** Each attempt stores `hintsUsed` and `usedSimulation`. Mastery requires independent solves including a transfer problem. The Demonstrate stage hides the simulation.
5. **Deterministic grading first; no LLM grading.** Numeric with units and tolerance, expression equivalence by seeded numeric sampling, multiple choice, and *ungraded* written answers with a self-assessed rubric that can never produce "correct". *Why:* false "correct" is the worst failure for a learning product. The symbolic (SymPy) service is designed, not built (doc 06).
6. **React Three Fiber for 3D, plain React for the lesson.** The lesson panel is ordinary accessible HTML; the 3D canvas is `aria-hidden` and has a text-mode alternative that exposes the same measurements. *Why:* keyboard and screen-reader users get the full learning path; the canvas is an enhancement.
7. **Vite 8 + manual chunking.** Three.js (~700 kB) and KaTeX ship in their own chunks and the world is lazy-loaded, so the home page and lesson text arrive before the 3D runtime. Fonts are system fonts (no network font requests).
8. **Hash routing.** Works on any static host or mirror without server configuration; deep links encode lesson and stage so "return exactly where you left off" is a URL.

## 5. What is deliberately not built yet

Accounts and sync; educator tooling; the LLM instructor call; the symbolic grading service; geometry/graphing input types; content authoring UI; the other four worlds. See `docs/09-roadmap.md`.
