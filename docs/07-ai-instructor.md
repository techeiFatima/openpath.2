# 07 · AI Instructor Architecture

## 1. Position in the product

The instructor lives *inside* the world: a help button on each problem, measurement explanations in the panel, and a redirect when prerequisites are missing. It is not the main interface and there is no free-floating chat window in milestone 1.

## 2. Grounding architecture

```
curriculum text ─┐
grader verdict ──┤
sim measurements ┼─► InstructorContext (assembled by code) ─► Instructor.help() ─► InstructorReply
attempt history ─┤                                                  │
prereq mastery ──┘                            ScriptedInstructor (today) / LLMInstructor (planned)
```

`InstructorContext` (in `src/core/instructor/instructor.ts`) carries: lesson title and stage, the learning objective, prerequisite mastery levels, the current problem, attempts on it, the last grader verdict, hints already given, the simulation preset with its measurements and assumptions, and the learner's utterance.

**Invariants**
1. The instructor never computes a physical or mathematical result; it quotes `measurements()` (which carry their formulas) and the grader.
2. It never declares an answer correct; only `GradeResult` does.
3. One step of help at a time, but after two unsuccessful attempts it gives substantive help; after the hint ladder it shows the worked solution. No endless Socratic loop.
4. Every reply records `grounding` (hint-ladder, misconception, simulation, solution, prerequisite) and `revealsSolution`, so hint usage can be charged to mastery credit.

## 3. ScriptedInstructor (implemented, tested)

Decision order: grader misconception feedback → prerequisite redirect (≥2 wrong and a weak prerequisite) → next authored hint → worked solution → simulation reading summary. It is deterministic and works offline, which matters for the target learners.

## 4. LLMInstructor (designed, not wired)

`buildGroundedPrompt(ctx)` is implemented and unit-tested: it serialises the context with explicit rules (use only the facts below; never compute; one step at a time; never say "correct" unless the verdict says so). The planned service:

- Runs server-side with the API key; the browser sends only the `InstructorContext` (no raw learner identity).
- Uses a model from the Claude 5 family (default `claude-sonnet-5-5` for latency, `claude-opus-5-5` for derivations) with tool access limited to `measurements()` snapshots the server already holds.
- Post-filters replies: if a reply contains a number that is not present in the context (allowing simple unit conversions), it is replaced by the scripted hint and logged for review.
- Supports Dari/Pashto explanation of the same grounded facts, which is where an LLM adds value the scripted layer cannot.
- Is evaluated offline against transcripts with a rubric (grounded? one step? no false correctness?) before being shown to learners.

## 5. Misconception detection

Authored per problem (numeric values or wrong expressions). The grader attributes them; the instructor voices the authored feedback. A planned analytics job aggregates misconception ids per objective to drive content revisions.

## 6. What the instructor knows about the learner

Only what the learner store holds: attempts, hints, predictions, mastery summaries. No inference about ability beyond `summarizeMastery`. This is intentional: explanations should adapt to *evidence*, and the evidence should be inspectable by the learner (Review stage).
