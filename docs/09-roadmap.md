# 09 · Technical Roadmap

Each phase ends in a usable, testable milestone. Estimates are deliberately omitted: they depend on team size and on learner-testing results that do not exist yet.

## Phase 1 — Foundation ✅ (this milestone)
- [x] Architecture and layer boundaries (doc 01)
- [x] Curriculum data model + prerequisite graph with validation
- [x] Reusable lesson/world spec with structural validation
- [x] Assessment engine: numeric+units, expression equivalence, MC, ungraded written
- [x] Learner model: attempts, computed mastery, resume, review scheduling function
- [x] Scripted instructor + grounded-prompt builder
- [x] Gravity Lab: validated N-body model, 3D world, 3 lessons × 7 stages, 27 problems
- [x] Automated tests; headless browser smoke test
- [ ] Gravity Lab prototype review: **the HTML prototype referenced in the brief was not available** in the repository, the attached Drive, or the environment; Gravity Lab was built from scratch.

## Phase 2 — Learning (next)
1. **Surface due reviews** on the home screen using `nextReviewAt`; add "focused intervention" mini-lessons for the four referenced prerequisites.
2. **Second physicist review** of Gravity Lab content; set `scientificallyReviewed: true` only after sign-off; fix the data-source verification items in `bodies.ts`.
3. **Learner testing** with 5–8 learners (think-aloud): can they state what to do in each stage without help; can they solve the Demonstrate problems; where do they stall. Record outcomes in milestone reports.
4. **Symbolic grading service** (SymPy) behind the existing `grade()` seam; add equation and inequality answer types.
5. **LLM instructor service** behind `buildGroundedPrompt`, with the post-filter for ungrounded numbers and offline evaluation; Dari and Pashto explanations.
6. **Diagnostic placement** probe over the prerequisite graph.

## Phase 3 — Multiple subjects
1. **Mathematics: Functions & Calculus** (2D canvas world): coordinate systems, linear/quadratic functions, transformations, secant → tangent, derivative rules, Riemann sums → integrals. Reuses `expression.ts`; adds graph-object answer type.
2. **Chemistry: Atoms & Molecules**: element dataset with a reusable license; electron configuration engine with tests against known exceptions; validated molecules from PubChem by CID; VSEPR geometry labelled as idealised; no invented reaction rules.
3. **Architecture test:** three environments (3D, 2D, molecular) running on the same lesson schema, graders and learner model with no changes to core.

## Phase 4 — Comprehensive curriculum
- Detailed curriculum maps per course (units → topics → concepts → objectives with standard refs), authored as data under review.
- Authoring workflow: lesson JSON + `validateLesson` + model-agreement tests + reviewer sign-off recorded in `CoverageStatus`.
- `npm run coverage` report; public coverage page distinguishing planned / authored / implemented / reviewed / learner-tested.
- Permission requests for *Permission required* sources we want; otherwise original content.

## Phase 5 — Platform
- Accounts with opaque learner ids; progress sync mirroring the persisted store fields; conflict rule: append-only attempts.
- Personalised path = topological order over unmastered objectives filtered by diagnostic results.
- World discovery, sharing of lesson deep links, educator dashboard over mastery summaries.
- Public beta; low-bandwidth audit (target: first lesson usable at 3G speeds; the Three.js chunk is the pacing item, so a 2D fallback renderer for Gravity Lab is on the list).

## Phase 6 — AI-assisted world creation (research)
- Generate `LessonSpec` JSON for an *existing* validated model; accept only if structural, numerical and variety checks pass and a human reviews.
- Assemble new experiences from validated components (models, presets, problem templates).
- Treat generation of new validated simulation models from natural language as an open research question with explicit evaluation, not a feature promise.

## Cross-cutting
- Accessibility audit each phase (keyboard, screen reader, text mode parity).
- Performance budget: home < 100 kB gzip JS; world lazy-loaded; 60 fps on a 2018 mid-range laptop and usable at 30 fps on a low-end Android phone (to be measured).
- Localisation: UI strings extracted; RTL layout for Dari/Pashto.
