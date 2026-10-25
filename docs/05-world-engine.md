# 05 · World Engine

How subject-specific simulations share reusable infrastructure without forcing every subject into one 3D game.

## 1. What is shared, what is per-world

| Shared (core) | Per-world |
|---|---|
| `WorldSpec`, `LessonSpec`, seven-stage `Stage`/`Block` schema | The **environment** (R3F 3D, 2D canvas, molecular viewer, dialogue) |
| `Simulation<State, Params>` interface: `step`, `reset`, `snapshot`, `measurements`, `assumptions` | The **model** implementing it (N-body today; function/derivative engine, atom builder next) |
| Problem types and graders | Named **presets** the lesson blocks can invoke (`revealPreset`, `sim-task.preset`) |
| Learner store, mastery, review scheduling | A small transient UI store (mode, settings, running, time scale) |
| `ProblemCard`, `StageNav`, `MasteryBadge`, `Markdown`/KaTeX, `LessonView` block renderer | `Scene` (renderer), `Controls`, `Measurements` layout |
| Instructor context assembly | Which measurements and assumptions it exposes |

A world is therefore: `content/` (curriculum slice + lessons), `model/` (pure TS + tests), `ui/` (renderer + controls + a default export page). `src/worlds/registry.ts` lists worlds and lessons; the router mounts the world's default export lazily.

## 2. Simulation contract

```ts
interface Simulation<State, Params> {
  step(dt: number): void;              // advance simulated seconds; implementation sub-steps as needed
  reset(params?: Partial<Params>): void;
  snapshot(): Readonly<State>;         // cloned, for React state
  measurements(): Measurement[];       // labelled SI values, each tagged analytic | numerical, optional formula
  assumptions(): string[];             // shown to learners
}
```

Rules: no DOM, no Three.js, deterministic for a given parameter set, and every measurement that has a closed form carries its LaTeX `formula` so the Understand stage and the instructor can point at the same equation the panel uses.

## 3. Rendering contract

The renderer receives the simulation instance and a *mapper* from SI to scene units. It may distort space for legibility (Gravity Lab compresses solar-system distances with d′ = 6·√(d/au)) **only if** the UI states it (the `scale-note` overlay) and the measurements panel keeps reporting true SI values. Rendering runs in `useFrame`, mutating meshes directly; React re-renders are limited to the measurements panel at 8 Hz.

## 4. Presets as the bridge between prose and model

Lesson blocks never set parameters directly; they name presets (`orbit-lab:cannon`, `solar-system`). The world maps preset ids to parameter sets and time scales. This keeps lesson text portable (a future 2D renderer of the same model needs no content changes) and lets the instructor say "load the setup called X".

## 5. How the next two worlds fit

**Mathematics (Functions & Calculus), environment `canvas-2d`.** Model: a function/expression object (reusing `core/assessment/expression.ts`), sampled curves, secant → tangent limit, Riemann sums with exact comparison. Measurements: f(a), secant slope over h, derivative estimate, exact derivative (from a symbolic rule set or the planned SymPy service), accumulated area. Presets: `secant:h=1`, `tangent`, `riemann:n=8`. Renderer: SVG/Canvas 2D with pan/zoom; no Three.js chunk loaded.

**Chemistry (Atoms & Molecules), environment `molecular`.** Model: element data table (needs a reusable-licensed dataset, doc 03), electron configuration rules (Aufbau/Hund/Pauli with documented exceptions), and *validated* molecular structures fetched from PubChem by CID. The "can these bond?" question is answered from a curated table of known compounds, never from invented rules. Renderer: R3F ball-and-stick, clearly labelled as idealised geometry (VSEPR) distinct from measured structures.

**Language (planned), environment `dialogue`.** The "simulation" is a scripted scenario state machine; the instructor layer plays characters; assessment compares utterances against CEFR-level can-do targets authored in-house.

## 6. AI-assisted world creation (future)

Because lessons are data (`LessonSpec`) validated by `validateLesson` and models expose `measurements()` with formulas, a generator can propose a lesson JSON for an existing model and have it checked structurally, numerically (reference answers vs model) and for problem variety before a human reviews it. Generating a *new validated model* from natural language is not assumed to be solved; the roadmap treats it as research.
