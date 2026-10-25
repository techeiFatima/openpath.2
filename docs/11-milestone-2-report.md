# 11 · Milestone 2 Report — Five Worlds and the Full Curriculum Skeleton

Date: 2026-10-25

## What was implemented

**Engine changes (shared by every world)**
- `WorldShell` and `LessonView` extracted from Gravity Lab into `src/ui`: header, stage navigation, lesson panel, viewport, resume tracking and the hidden-environment rule for the Demonstrate stage are now world-agnostic. A world supplies `applyPreset`, `renderViewport`, `renderTextMode` and an optional `simulationContext`.
- New `short-text` answer type with normalisation (case, whitespace, unicode super/subscripts, punctuation), multiple accepted forms, named misconceptions and a formatting near-miss hint.
- Router maps world ids to code-split components; the catalog merges per-world curriculum slices and the planned maps.

**Four new worlds** (all with the seven-stage lesson structure, validated models, named misconceptions and content-integrity tests):

| World | Environment | Model | Lessons · problems |
|---|---|---|---|
| Functions & Calculus (mathematics) | 2D SVG graph with pan/zoom and a draggable point | exact polynomial calculus (derivatives, antiderivatives, roots, vertex, transformations); secant → tangent; Riemann sums vs exact integral | 4 · 41 |
| Atoms & Molecules (chemistry) | atom builder (Bohr-style, labelled idealisation), periodic table grid, R3F ball-and-stick viewer | 118-element dataset; Aufbau configurations with a 20-entry exception table; 18 curated molecules with idealised VSEPR coordinates and ideal vs measured angles; ΔEN bond rule and ionic formulas with stated limits | 4 · 44 |
| Inside the Cell (biology) | log-scale explorer (1 m → 0.1 nm) and a DNA workbench (SVG) | typical sizes and microscope rule of thumb; complement, transcription, 64-codon genetic code, translation, GC%, Chargaff, mutation classification | 3 · 32 |
| Conversation Street (language, English A1) | scripted dialogue with a coach, phrasebook, speech synthesis when available | deterministic scenario engine with accepted alternatives, rule-based feedback, two re-prompts then a model reply; 60-item vocabulary with an L1 gloss hook | 3 · 41 |

**Curriculum maps**: unit → topic skeleton for all 58 planned courses (now 188 units and 531 topics after merging the worlds' implemented units), and `npm run coverage`.

## How to run

```sh
npm install
npm run dev                      # http://localhost:5173
npm run check                    # typecheck + unit tests + production build
npm run coverage                 # curriculum coverage table
npm run build && npm run preview -- --port 4173 && npm run test:e2e
```

## What was tested

| Suite | Count |
|---|---|
| Core (curriculum graph, graders incl. short-text, mastery, instructor, router, registry, catalog) | 60 |
| Gravity Lab (model + content) | 18 |
| Functions & Calculus (model + content) | 12 |
| Atoms & Molecules (model, facts, content, SSR render) | 45 |
| Inside the Cell (model, measurements, content, SSR render) | 51 |
| Conversation Street (engine, grammar, vocabulary, content) | 49 |
| **Total unit tests (vitest)** | **216, all passing** |

Browser smoke test (headless Chromium on the production build, `tests/e2e/smoke.cjs`): every world is opened and exercised: Gravity (prediction, crash, misconception, correct answer, hint, hidden sim, mastery, solar system, phone layout, resume), Mathematics (secant 7 → 6.01 as h shrinks, expression `6x - 2` graded correct, six Riemann rectangles), Biology (scale readouts, DNA readouts with codons and protein), Language (a typed turn gets coach feedback), Chemistry (atom readouts, molecule canvas and VSEPR readouts). **Zero page errors.** Screenshots of each world were inspected.

Coverage report (objectives): mathematics 11 (6 implemented), physics 8 (6), chemistry 11 (11), biology 8 (7), language 6 (6). Reviewed and learner-tested: 0 everywhere.

## What works

A learner can open any of five worlds and complete 17 lessons (185 problems) end to end: predict, experiment with a model whose numbers are computed rather than drawn, read the formal explanation, practise with hints and targeted misconception feedback, apply to a new situation, demonstrate with the environment hidden, and review mastery with prerequisite gaps named. Progress persists per device and every lesson stage is a deep link.

## What remains incomplete (be precise)

1. **No second-expert review and no learner testing of any content.** Every objective's coverage row says so. Content was written by one author (or one builder) per world and checked only by automated consistency tests.
2. **Reference data marked for re-verification**: atomic masses, electronegativities, element categories, measured bond angles, PubChem CIDs (chemistry); typical biological sizes and microscope thresholds (biology); planetary data (physics); standards paraphrases everywhere (official pages unreachable from the build environment).
3. **Dari glosses (35) are unreviewed** and labelled so in the UI; character lines have no glosses; no Pashto.
4. **Grammar feedback in the language world is deliberately narrow** (fixed noun list, be-forms, question inversion, plurals after numbers, politeness); anything outside the accepted patterns is judged by those rules only.
5. **Molecule viewer coordinates are idealised VSEPR geometry**, labelled as such; no measured structures are fetched (no runtime network).
6. **Three worlds share one scale-aware design but not one visual language**; a design pass across worlds (consistent panel widths, label overlap in the biology scale explorer and the inner solar system) is owed.
7. **Depth per course is thin**: 3–4 lessons per world against 58 planned courses. The maps are a skeleton, not content.
8. Items carried from milestone 1: no LLM instructor, no symbolic grading service, no accounts or sync, written answers ungraded, Three.js chunk size.

## What should be implemented next (ordered)

1. Expert review per world (one physicist, one mathematician, one chemist, one biologist, one English teacher with Dari) and a native-speaker pass on the glosses; flip `scientificallyReviewed` only after.
2. A learner test of one lesson per world; record stalls and recalibrate hint ladders and mastery thresholds.
3. Fill the referenced-but-unauthored prerequisites (rearranging formulas, powers and roots, plotting points, solving linear equations, factoring, Newton's second law, centripetal acceleration) as focused mini-lessons: this is where the Mathematics world grows downward toward the middle-school courses.
4. A cross-world design pass and a 2D fallback renderer for Gravity Lab for low-bandwidth devices.
5. Symbolic grading service, then the LLM instructor behind `buildGroundedPrompt` with Dari/Pashto explanation.
