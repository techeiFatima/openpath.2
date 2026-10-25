# 02 · Curriculum Framework

**Honesty first.** The tables below are the *planned* structure. The only implemented content is the Gravity Lab slice (6 objectives, 3 lessons, 27 problems) in high-school physics. Coverage status is tracked per objective in `src/worlds/catalog.ts` (`CoverageStatus`) with five independent flags: planned, authored, implemented, scientifically reviewed, learner tested.

## 1. Hierarchy

```
Subject → Level → Course → Unit → Topic → Concept → Learning Objective
                                                      ├─ Interactive experience (lesson stages)
                                                      ├─ Practice (problems by category)
                                                      └─ Assessment (Demonstrate stage + mastery rule)
```

Objectives form a **prerequisite graph** across subjects (e.g. `phys.orbit.circular-speed` requires `math.alg.rearrange-formula`). Levels are labels for navigation, not gates: diagnostic placement, remediation and acceleration all operate on the graph (`src/core/curriculum/graph.ts`: cycle detection, topological order, transitive and missing prerequisites). The graph is validated in the test suite.

## 2. Levels and courses (planned)

### Mathematics
| Level | Courses |
|---|---|
| Pre-K & K | Counting, Quantity and Comparison · Shapes, Space and Patterns · Early Addition, Subtraction and Measurement |
| Grades 1–5 | Place Value and the Four Operations · Fractions and Decimals · Geometry, Measurement, Area and Volume · Data, Statistics and Word Problems |
| Grades 6–8 | Ratios, Rates and Proportions · Integers and Rational Numbers · Expressions, Equations, Inequalities and Functions · Coordinate Geometry and Transformations · Probability and Statistics |
| Grades 9–12 | Algebra I · Geometry: Constructions and Proof · Algebra II · Trigonometry, Complex Numbers and Precalculus · Probability, Statistics and Modeling · Introductory Calculus |
| University | Single-Variable Calculus · Multivariable Calculus · Linear Algebra · Differential Equations · Discrete Mathematics, Logic and Proofs · Probability Theory and Mathematical Statistics · Optimization and Numerical Analysis · Real Analysis · Abstract Algebra and Number Theory · Complex Analysis, Topology and Combinatorics |

Standards anchors: CCSS-M for K–12 objective statements and grade expectations (cite codes; reuse terms unverified, see doc 03); MAA CUPM guide for the undergraduate sequence (reference only).

### Physics
| Level | Courses |
|---|---|
| Grades 6–8 | Forces, Motion, Energy and Waves |
| Grades 9–12 | Mechanics (motion, forces, **gravity**, energy, momentum) · Waves, Sound, Light and Optics · Electricity and Magnetism · Thermodynamics and Fluids |
| University | Classical Mechanics and Oscillations · Electromagnetism · Relativity and Quantum Mechanics · Thermodynamics and Statistical Physics |

Standards anchors: NGSS performance expectations (HS-PS2-4, HS-ESS1-4 cited by Gravity Lab).

### Chemistry
| Level | Courses |
|---|---|
| Grades 6–8 | Matter, Its Properties and Changes |
| Grades 9–12 | Atomic Structure, Periodic Table and Electron Configurations · Bonding, Molecular Geometry, Formulas and Naming · Reactions, Stoichiometry, Gases and Solutions · Acids and Bases, Equilibrium, Kinetics, Thermochemistry |
| University | General Chemistry and Electrochemistry · Organic Chemistry · Biochemistry and Advanced Topics |

Data anchors: PubChem (structures/properties, per-source licensing), RCSB PDB (CC0 structures). Element data must be sourced from a reusable dataset; the RSC table is reference-only.

### Biology
| Level | Courses |
|---|---|
| Grades 6–8 | Cells, Organisms, Heredity and Ecosystems |
| Grades 9–12 | Cells, Biomolecules, DNA and Gene Expression · Genetics, Inheritance and Evolution · Anatomy, Physiology and Ecology |
| University | Molecular Biology, Microbiology and Immunology · Advanced Life Sciences |

### Language (proficiency-based; English first, Dari and Pashto support designed in)
| Level | Course |
|---|---|
| Pre-A1 | English: First Words and Sounds |
| A1 … C2 | English A1 Everyday Survival → A2 Routine Exchanges → B1 Independent Communication → B2 Academic and Professional → C1 Nuanced Expression → C2 Mastery |

Each level spans vocabulary, grammar, pronunciation, listening, reading, speaking, writing and real-world tasks. CEFR level *names* are used for navigation; descriptor scales are not reproduced (permission required, doc 03). VOA Learning English (public domain, VOA-original items only) is the first candidate for graded reading/listening content.

## 3. Implemented slice (Gravity Lab)

| Objective | Statement (short) | Lessons | Problems | Reviewed | Learner-tested |
|---|---|---|---|---|---|
| phys.grav.law | Use F = Gm₁m₂/r² | L2 | 1 | no | no |
| phys.grav.field | g = GM/r²; weightlessness is free fall | L1 | 3 | no | no |
| phys.orbit.falling | Orbit as free fall + sideways speed | L1 | 1 (+2 predictions) | no | no |
| phys.orbit.circular-speed | Derive/apply v = √(GM/r), T = 2π√(r³/GM) | L1 | 8 | no | no |
| phys.orbit.kepler3 | T² ∝ a³; infer central mass | L2 | 8 | no | no |
| phys.orbit.energy | ε = v²/2 − GM/r; escape speed | L3 | 8 | no | no |

Prerequisites referenced but not yet taught: `math.alg.rearrange-formula`, `math.alg.powers-roots`, `phys.mech.newton2`, `phys.mech.centripetal`. These are the first objectives the Mathematics and Physics worlds should fill so the prerequisite redirect in the Review stage has somewhere to send learners.

## 4. Diagnostic placement and remediation (designed, not built)

- **Placement:** a short adaptive probe over the prerequisite graph (ask at the frontier of a level; descend on failure, ascend on success) rather than a grade-level menu.
- **Remediation:** `missingPrerequisites()` already drives the instructor's redirect after two failures; a "focused intervention" lesson type (Understand + Practice only, ~10 min) is the planned vehicle.
- **Acceleration:** when a learner masters the Demonstrate stage with zero hints on the first attempt, later lessons in the same unit open their Demonstrate stage early.
- **Review:** `nextReviewAt` expanding intervals; due reviews surface on the home screen.

## 5. Planned unit and topic maps (milestone 2)

`src/worlds/curriculum-maps.ts` holds unit → topic maps for **all 58 planned courses** (182 units, 519 topics). These are structural scaffolding only: no objectives, lessons or assessments are attached unless a world provides them. When a world implements a unit with the same course and name, the planned entry is replaced so counts are not inflated.

## 6. Coverage reporting

`CATALOG.coverage` is the single source of truth. `npm run coverage` prints per-subject counts of courses, units, topics and objectives, and how many objectives are authored / implemented / reviewed / learner-tested, so nobody can claim a subject is "covered" on the strength of a demo. The "reviewed" and "tested" columns are 0 until a second subject expert signs off and learners are observed.
